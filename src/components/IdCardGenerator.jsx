import React, { useState, useRef } from "react";
import ErrorMessage from "./ErrorMessage";

const IdCardGenerator = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [userName, setUserName] = useState("");
  const [userDate, setUserDate] = useState("");
  const [generatedIdCard, setGeneratedIdCard] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const cropCanvasRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file (JPEG, PNG, GIF, etc.).");
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setGeneratedIdCard(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file (JPEG, PNG, GIF, etc.).");
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setGeneratedIdCard(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateIdCard = async () => {
    if (!uploadedImage) {
      setError("Please upload an image first.");
      return;
    }
    if (!userName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!userDate.trim()) {
      setError("Please enter a date.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = uploadedImage;

      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const cropCanvas = cropCanvasRef.current;
        const cropCtx = cropCanvas.getContext("2d");

        // **Large canvas for processing**
        const canvasWidth = 1200;
        const canvasHeight = 1600;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // **White background**
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // **Photo dimensions and positioning**
        const photoMaxWidth = canvasWidth * 0.85;
        const photoMaxHeight = canvasHeight * 0.6;

        // **Calculate photo dimensions (NO CROPPING)**
        const imgRatio = img.width / img.height;
        let photoWidth, photoHeight;

        if (imgRatio > photoMaxWidth / photoMaxHeight) {
          photoWidth = photoMaxWidth;
          photoHeight = photoMaxWidth / imgRatio;
        } else {
          photoHeight = photoMaxHeight;
          photoWidth = photoMaxHeight * imgRatio;
        }

        // **Position photo**
        const photoX = (canvasWidth - photoWidth) / 2;
        const photoY = canvasHeight * 0.08;

        // **Draw the photo**
        ctx.drawImage(img, photoX, photoY, photoWidth, photoHeight);

        // **Text setup**
        const nameFontSize = Math.min(60, canvasWidth * 0.06);
        const dateFontSize = Math.min(60, canvasWidth * 0.06);

        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";

        // **Position text below photo**
        const textStartY = photoY + photoHeight + 15;

        // **Draw name**
        ctx.font = `bold ${nameFontSize}px Arial, sans-serif`;
        ctx.fillText(userName.toUpperCase(), canvasWidth / 2, textStartY);

        // **Draw date**
        ctx.font = `bold ${dateFontSize}px Arial, sans-serif`;
        const dateY = textStartY + nameFontSize + 15;
        ctx.fillText(userDate, canvasWidth / 2, dateY);

        // **Calculate stroke dimensions to enclose BOTH photo and text**
        const strokePadding = 30;
        const strokeX = photoX - strokePadding;
        const strokeY = photoY - strokePadding;
        const strokeWidth = photoWidth + strokePadding * 2;
        const strokeHeight = dateY + dateFontSize - photoY + strokePadding * 2;

        // **Draw stroke around photo + text together**
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 6;
        ctx.strokeRect(strokeX, strokeY, strokeWidth, strokeHeight);

        // **CROP TO BORDER ONLY - Create smaller canvas with exact content size**
        const cropX = strokeX - 3; // Include stroke width
        const cropY = strokeY - 3;
        const cropWidth = strokeWidth + 6;
        const cropHeight = strokeHeight + 6;

        cropCanvas.width = cropWidth;
        cropCanvas.height = cropHeight;

        // **Copy only the bordered content to crop canvas**
        cropCtx.drawImage(
          canvas,
          cropX,
          cropY,
          cropWidth,
          cropHeight, // Source area
          0,
          0,
          cropWidth,
          cropHeight // Destination area
        );

        // **Export the cropped canvas (border area only)**
        const jpegDataUrl = cropCanvas.toDataURL("image/jpeg", 0.95);
        setGeneratedIdCard(jpegDataUrl);
        setIsGenerating(false);
      };

      img.onerror = () => {
        setError("Failed to load image. Please try again.");
        setIsGenerating(false);
      };
    } catch (err) {
      console.error("Error generating card:", err);
      setError("An error occurred while generating the card.");
      setIsGenerating(false);
    }
  };

  const downloadIdCard = () => {
    if (generatedIdCard) {
      const link = document.createElement("a");
      link.href = generatedIdCard;
      link.download = `${userName.replace(/\s+/g, "_")}_ID_Card_Cropped.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const clearAll = () => {
    setUploadedImage(null);
    setUserName("");
    setUserDate("");
    setGeneratedIdCard(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center justify-center space-x-2">
            <span>🆔</span>
            <span>ID Card Generator</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Creates perfectly passport photo with Name and Date
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Upload & Form */}
          <div className="space-y-4">
            {/* Image Upload */}
            <div
              className={`relative p-4 border-2 border-dashed rounded-xl text-center transition-all duration-300 cursor-pointer ${
                isDragOver
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : uploadedImage
                  ? "border-green-300 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-blue-400"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200">
                    {uploadedImage ? "✅ Photo Ready" : "Upload Photo"}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Cropped to border only • No extra space
                  </p>
                </div>

                {uploadedImage && (
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-20 h-24 object-cover rounded-lg shadow-md border"
                  />
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. SHIVA SAHU"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date *
                </label>
                <input
                  type="text"
                  value={userDate}
                  onChange={(e) => setUserDate(e.target.value)}
                  placeholder="e.g., 15/07/1999"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={generateIdCard}
                disabled={
                  isGenerating ||
                  !uploadedImage ||
                  !userName.trim() ||
                  !userDate.trim()
                }
                className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  isGenerating ||
                  !uploadedImage ||
                  !userName.trim() ||
                  !userDate.trim()
                    ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                }`}
              >
                {isGenerating ? "Generating..." : "Generate Cropped Card"}
              </button>

              <button
                onClick={clearAll}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold text-sm rounded-lg"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Right Column - Preview & Download */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-3">
                Cropped Preview
              </h3>

              {generatedIdCard ? (
                <div className="space-y-3">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl flex justify-center">
                    <div className="bg-white p-3 rounded-lg shadow-xl border inline-block">
                      <img
                        src={generatedIdCard}
                        alt="Cropped ID Card"
                        className="max-w-full h-auto"
                        style={{ maxHeight: "254px", width: "200px" }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={downloadIdCard}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Download Cropped Card</span>
                  </button>
                </div>
              ) : (
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-3">✂️</div>
                  <h4 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Image Preview
                  </h4>

                  <div className="inline-block border-4 border-gray-800 bg-white p-3 rounded">
                    <div className="w-32 h-24 bg-gray-200 rounded mb-2 flex items-center justify-center">
                      <span className="text-gray-500 text-xs text-center">
                        Photo
                        <br />
                        Area
                      </span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded mb-1"></div>
                    <div className="h-1 bg-gray-600 rounded"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <ErrorMessage error={error} />

        {/* Hidden canvases for processing */}
        <canvas ref={canvasRef} className="hidden"></canvas>
        <canvas ref={cropCanvasRef} className="hidden"></canvas>
      </div>
    </div>
  );
};

export default IdCardGenerator;
