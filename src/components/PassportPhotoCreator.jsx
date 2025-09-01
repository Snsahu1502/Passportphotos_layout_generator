import React, { useState, useRef, useEffect } from "react";
import MultiImageUpload from "./PassportPhoto/MultiImageUpload";
import ErrorMessage from "./ErrorMessage";
import PrintOptions from "./PassportPhoto/PrintOptions";
import ProcessingIndicator from "./ProcessingIndicator";
import GeneratedSheetPreview from "./PassportPhoto/GeneratedSheetPreview";
import HiddenCanvases from "./HiddenCanvases";
import PhotoStats from "./PassportPhoto/PhotoStats";
import FeatureCards from "./PassportPhoto/FeatureCards";
import { LAYOUTS, SHEET_DIMENSIONS } from "../constants/printLayouts";
import { generateMultiPhotoPrintableSheet } from "../utils/multiImageProcessing";

const PassportPhotoCreator = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [generatedSheetUrl, setGeneratedSheetUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const hiddenCanvasRef = useRef(null);
  const sheetCanvasRef = useRef(null);

  const handleImagesUpload = (imageFiles) => {
    const validImages = [];
    let hasError = false;

    imageFiles.forEach((file, index) => {
      if (!file.type?.startsWith("image/")) {
        setError(`File ${index + 1} is not a valid image file.`);
        hasError = true;
        return;
      }
      validImages.push(file);
    });

    if (hasError) {
      setUploadedImages([]);
      setGeneratedSheetUrl(null);
      setSelectedOption(null);
      return;
    }

    setError(null);
    const imagePromises = validImages.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(imageDataUrls => {
      setUploadedImages(imageDataUrls);
      setGeneratedSheetUrl(null);
      setSelectedOption(null);
    });
  };

  const handleDownload = () => {
    if (generatedSheetUrl) {
      const link = document.createElement("a");
      link.href = generatedSheetUrl;
      link.download = `passport-photos-${selectedOption || "sheet"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setError("No sheet generated to download.");
    }
  };

  const handlePrint = () => {
    if (generatedSheetUrl && selectedOption) {
      const printWindow = window.open("", "_blank");
      let pageSize = "auto";
      const layoutType = LAYOUTS[selectedOption].sheet;

      if (layoutType === "4x6") {
        pageSize = "6in 4in";
      } else if (layoutType === "A4") {
        pageSize = "A4";
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>Print Passport Photos</title>
            <style>
              @page { size: ${pageSize}; margin: 0; }
              body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f0f0f0; }
              img { max-width: 100%; max-height: 100%; display: block; }
            </style>
          </head>
          <body>
            <img src="${generatedSheetUrl}" alt="Printable Sheet" />
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() { window.close(); };
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

  useEffect(() => {
    if (uploadedImages.length > 0 && selectedOption) {
      generateMultiPhotoPrintableSheet({
        uploadedImages,
        selectedOption,
        setIsProcessing,
        setError,
        setGeneratedSheetUrl,
        hiddenCanvasRef,
        sheetCanvasRef,
        LAYOUTS,
        SHEET_DIMENSIONS
      });
    }
  }, [uploadedImages, selectedOption]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 hover:shadow-3xl transition-all duration-500">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 flex items-center justify-center space-x-2">
              <span>📸</span>
              <span>Passport Photo Creator</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Upload multiple photos, select layout, and print professional passport photos
            </p>
          </div>

          <MultiImageUpload 
            uploadedImages={uploadedImages}
            onImagesUpload={handleImagesUpload}
            setError={setError}
            setGeneratedSheetUrl={setGeneratedSheetUrl}
            setSelectedOption={setSelectedOption}
          />

          <ErrorMessage error={error} />

          <PrintOptions 
            hasImages={uploadedImages.length > 0}
            imageCount={uploadedImages.length}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            isProcessing={isProcessing}
            layouts={LAYOUTS}
            sheetDimensions={SHEET_DIMENSIONS}
          />

          <ProcessingIndicator isProcessing={isProcessing} imageCount={uploadedImages.length} />

          <GeneratedSheetPreview 
            generatedSheetUrl={generatedSheetUrl}
            onPrint={handlePrint}
            onDownload={handleDownload}
          />
        </div>
      </div>

      <div className="space-y-6">
        <PhotoStats uploadedImages={uploadedImages} selectedOption={selectedOption} layouts={LAYOUTS} />
        <FeatureCards />
      </div>

      <HiddenCanvases 
        hiddenCanvasRef={hiddenCanvasRef}
        sheetCanvasRef={sheetCanvasRef}
      />
    </div>
  );
};

export default PassportPhotoCreator;

