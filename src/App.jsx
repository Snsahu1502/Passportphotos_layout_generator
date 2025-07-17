import React, { useState, useRef, useEffect } from "react";

const App = () => {
  // State for uploaded image (DataURL)
  const [uploadedImage, setUploadedImage] = useState(null);
  // State for selected print layout option (e.g., '4x6-8')
  const [selectedOption, setSelectedOption] = useState(null);
  // State for the generated printable sheet (DataURL)
  const [generatedSheetUrl, setGeneratedSheetUrl] = useState(null);
  // State to indicate if photo processing is ongoing
  const [isProcessing, setIsProcessing] = useState(false);
  // State for error messages
  const [error, setError] = useState(null);

  // Refs for canvases
  const hiddenCanvasRef = useRef(null); // For individual passport photo processing
  const sheetCanvasRef = useRef(null); // For assembling the final sheet

  // --- Constants for Passport Photo and Sheet Sizes (at 300 DPI for print quality) ---
  const PASSPORT_WIDTH_MM = 35;
  const PASSPORT_HEIGHT_MM = 45;
  const DPI = 600;
  const MM_PER_INCH = 25.4;

  const PASSPORT_WIDTH_PX = Math.round((PASSPORT_WIDTH_MM / MM_PER_INCH) * DPI);
  const PASSPORT_HEIGHT_PX = Math.round(
    (PASSPORT_HEIGHT_MM / MM_PER_INCH) * DPI
  );
  // Aspect ratio for the passport photo
  const PASSPORT_ASPECT_RATIO = PASSPORT_WIDTH_PX / PASSPORT_HEIGHT_PX;

  // Define the maximum desired gap between photos in pixels
  const MAX_GAP_PX_FOR_PRINT = 15; // Reduced from 30px to 15px for tighter packing

  const SHEET_DIMENSIONS = {
    "4x6": { width: 6 * DPI, height: 4 * DPI, label: "4x6 inches (Landscape)" },
    A4: {
      width: Math.round((210 / MM_PER_INCH) * DPI),
      height: Math.round((297 / MM_PER_INCH) * DPI),
      label: "A4 (210x297 mm)",
    },
  };

  const LAYOUTS = {
    "4x6-8": { sheet: "4x6", count: 8, rows: 2, cols: 4 },
    "4x6-10": { sheet: "4x6", count: 10, rows: 2, cols: 5 },
    "A4-36": { sheet: "A4", count: 36, rows: 6, cols: 6 },
    // Updated A4-32 layout: 6 rows (5 full, 1 partial), 6 columns
    "A4-32": { sheet: "A4", count: 32, rows: 6, cols: 6 }, // Changed to 6 columns, 6 rows (ceil(32/6))
  };

  /**
   * Handles the file upload event.
   * Reads the selected image file and sets it as the uploaded image.
   * Performs basic validation for image file types.
   * @param {Event} event The file input change event.
   */
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file (JPEG, PNG, GIF, etc.).");
        setUploadedImage(null);
        setGeneratedSheetUrl(null);
        setSelectedOption(null); // Reset selected option
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setGeneratedSheetUrl(null);
        setSelectedOption(null); // Reset selected option to prompt re-selection
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Generates the printable sheet with passport photos using the full uploaded image.
   */
  const generatePrintableSheet = async () => {
    if (!uploadedImage || !selectedOption) {
      setError("Please upload an image and select a print option first.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setGeneratedSheetUrl(null);

    try {
      const img = new Image();
      img.src = uploadedImage;

      img.onload = async () => {
        const layout = LAYOUTS[selectedOption];
        const sheetInfo = SHEET_DIMENSIONS[layout.sheet];

        const sheetCanvas = sheetCanvasRef.current;
        const sheetCtx = sheetCanvas.getContext("2d");

        sheetCanvas.width = sheetInfo.width;
        sheetCanvas.height = sheetInfo.height;
        sheetCtx.fillStyle = "white";
        sheetCtx.fillRect(0, 0, sheetCanvas.width, sheetCanvas.height);

        // --- Dynamic scaling logic for passport photos to ensure fit and fixed gap ---
        // Calculate max available width and height for the photos assuming MAX_GAP_PX_FOR_PRINT
        // for initial padding and between each photo.
        const maxAvailableWidthForPhotos =
          sheetCanvas.width - (layout.cols + 1) * MAX_GAP_PX_FOR_PRINT;
        const maxAvailableHeightForPhotos =
          sheetCanvas.height - (layout.rows + 1) * MAX_GAP_PX_FOR_PRINT;

        // Calculate potential photo dimensions if scaled to fit horizontally or vertically
        const potentialPhotoWidthBasedOnCols =
          maxAvailableWidthForPhotos / layout.cols;
        const potentialPhotoHeightBasedOnRows =
          maxAvailableHeightForPhotos / layout.rows;

        // Determine the overall scaling factor, ensuring we don't upscale beyond original passport size
        const scaleFactorBasedOnWidth =
          potentialPhotoWidthBasedOnCols / PASSPORT_WIDTH_PX;
        const scaleFactorBasedOnHeight =
          potentialPhotoHeightBasedOnRows / PASSPORT_HEIGHT_PX;

        const limitingScaleFactor = Math.min(
          scaleFactorBasedOnWidth,
          scaleFactorBasedOnHeight,
          1
        );

        // Calculate final photo dimensions
        const photoWidth = Math.floor(PASSPORT_WIDTH_PX * limitingScaleFactor);
        const photoHeight = Math.floor(
          PASSPORT_HEIGHT_PX * limitingScaleFactor
        );

        // The actual gaps will be MAX_GAP_PX_FOR_PRINT for left/top/between photos
        const horizontalGap = MAX_GAP_PX_FOR_PRINT;
        const verticalGap = MAX_GAP_PX_FOR_PRINT;

        let currentPhotoIndex = 0;

        for (let row = 0; row < layout.rows; row++) {
          for (let col = 0; col < layout.cols; col++) {
            if (currentPhotoIndex >= layout.count) break; // Stop if we've placed all required photos

            // Calculate x and y based on fixed horizontalGap/verticalGap for left/top alignment
            const x = horizontalGap + col * (photoWidth + horizontalGap);
            const y = verticalGap + row * (photoHeight + verticalGap);

            const tempCanvas = hiddenCanvasRef.current;
            const tempCtx = tempCanvas.getContext("2d");
            tempCanvas.width = photoWidth;
            tempCanvas.height = photoHeight;
            tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

            // --- Logic to fit the full image into the passport photo dimensions ---
            const imgAspectRatio = img.width / img.height;
            const targetAspectRatio = photoWidth / photoHeight;

            let sx, sy, sWidth, sHeight; // Source X, Y, Width, Height from the original image

            if (imgAspectRatio > targetAspectRatio) {
              // Original image is wider, fit by height and crop width
              sHeight = img.height;
              sWidth = img.height * targetAspectRatio;
              sx = (img.width - sWidth) / 2; // Center horizontally
              sy = 0;
            } else {
              // Original image is taller, fit by width and crop height
              sWidth = img.width;
              sHeight = img.width / targetAspectRatio;
              sx = 0;
              sy = (img.height - sHeight) / 2; // Center vertically
            }

            tempCtx.drawImage(
              img,
              sx,
              sy,
              sWidth,
              sHeight, // Source rectangle from original image
              0,
              0,
              photoWidth,
              photoHeight // Destination rectangle on temp canvas
            );

            tempCtx.strokeStyle = "black";
            tempCtx.lineWidth = 2;
            tempCtx.strokeRect(0, 0, photoWidth, photoHeight);

            sheetCtx.drawImage(tempCanvas, x, y, photoWidth, photoHeight);

            currentPhotoIndex++;
          }
          if (currentPhotoIndex >= layout.count) break; // Break outer loop if count reached
        }

        setGeneratedSheetUrl(sheetCanvas.toDataURL("image/png"));
      };

      img.onerror = () => {
        setError("Failed to load image for sheet generation.");
        setIsProcessing(false);
      };
    } catch (err) {
      console.error("Error generating sheet:", err);
      setError("An error occurred during sheet generation. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Effect to trigger sheet generation whenever a new image is uploaded
   * or a different print option is selected.
   */
  useEffect(() => {
    if (uploadedImage && selectedOption) {
      generatePrintableSheet();
    }
  }, [uploadedImage, selectedOption]); // Dependencies: re-run when these states change

  /**
   * Handles the print action.
   */
  const handlePrint = () => {
    if (generatedSheetUrl && selectedOption) {
      const printWindow = window.open("", "_blank");
      let pageSize = "auto"; // Default to auto
      const layoutType = LAYOUTS[selectedOption].sheet;

      // Set page size based on selected layout type
      if (layoutType === "4x6") {
        pageSize = "6in 4in"; // Landscape 4x6
      } else if (layoutType === "A4") {
        pageSize = "A4";
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>Print Passport Photos</title>
            <style>
              @page {
                size: ${pageSize}; /* Dynamically set page size */
                margin: 0;
              }
              body {
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background-color: #f0f0f0;
              }
              img {
                max-width: 100%;
                max-height: 100%;
                display: block;
              }
            </style>
          </head>
          <body>
            <img src="${generatedSheetUrl}" alt="Printable Sheet" />
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      setError("No sheet generated to print.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-1">
          Passport Photo Printer
        </h1>
        <p className="text-center mb-6 italic ">
          ~ Let's just do it, in a single click.
        </p>
        <p className="font-semibold text-center mb-2">Designed by Shiva Sahu</p>
        {/* Image Upload Section */}
        <div className="mb-8 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <label htmlFor="file-upload" className="cursor-pointer">
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-400 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="text-gray-600 text-lg font-medium">
                {uploadedImage
                  ? "Image uploaded! Click to change."
                  : "Click to upload your photo"}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                JPEG, PNG, GIF up to 10MB recommended
              </p>
            </div>
          </label>
          {uploadedImage && ( // Show preview if image is uploaded
            <div className="mt-4 flex justify-center">
              <img
                src={uploadedImage}
                alt="Uploaded Preview"
                className="max-h-48 rounded-md shadow-md"
              />
            </div>
          )}
        </div>

        {/* Error Message Display */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Print Options Section (always visible after image upload) */}
        {uploadedImage ? (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
              Select Print Layout
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(LAYOUTS).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setSelectedOption(key)}
                  disabled={isProcessing} // Only disable if processing is ongoing
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-200 ease-in-out
                    ${
                      selectedOption === key
                        ? "bg-blue-600 text-white border-blue-700 shadow-md transform scale-105"
                        : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                    }
                    ${
                      isProcessing
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                  `}
                >
                  <span className="font-semibold text-lg">
                    {value.sheet} sheet - {value.count} photos
                  </span>
                  <span className="block text-sm opacity-80">
                    {SHEET_DIMENSIONS[value.sheet].label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-md relative mb-6"
            role="alert"
          >
            <span className="block sm:inline">
              Please upload a photo to enable print options.
            </span>
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="text-center text-blue-600 font-medium mb-6">
            <svg
              className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Generating printable sheet...
          </div>
        )}

        {/* Generated Sheet Preview and Print Button */}
        {generatedSheetUrl && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-inner">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
              Printable Sheet Preview
            </h2>
            <div className="flex justify-center mb-6">
              <img
                src={generatedSheetUrl}
                alt="Generated Printable Sheet"
                className="max-w-full h-auto border border-gray-300 rounded-md shadow-md"
                style={{ maxWidth: "400px", maxHeight: "500px" }}
              />
            </div>
            <div className="text-center">
              <button
                onClick={handlePrint}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
              >
                <svg
                  className="inline-block w-6 h-6 mr-2 -mt-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 4V2a2 2 0 012-2h6a2 2 0 012 2v2h2a2 2 0 012 2v6a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2h2zm0 10v4a2 2 0 002 2h6a2 2 0 002-2v-4H5z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Print Sheet
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hidden canvases for image processing. These are not displayed to the user. */}
      <canvas ref={hiddenCanvasRef} className="hidden"></canvas>
      <canvas ref={sheetCanvasRef} className="hidden"></canvas>
    </div>
  );
};

export default App;
