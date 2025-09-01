import React from "react";

const ImageUpload = ({ 
  uploadedImage, 
  onImageUpload, 
  setError, 
  setGeneratedSheetUrl, 
  setSelectedOption 
}) => {
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file (JPEG, PNG, GIF, etc.).");
        setGeneratedSheetUrl(null);
        setSelectedOption(null);
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result);
        setGeneratedSheetUrl(null);
        setSelectedOption(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-8 p-5 sm:p-6 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50 hover:border-blue-400 transition-all duration-300">
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
            className="w-14 h-14 sm:w-16 sm:h-16 text-gray-400 mb-3"
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
          <p className="text-gray-600 text-base sm:text-lg font-medium">
            {uploadedImage
              ? "Image uploaded! Click to change."
              : "Click to upload your photo"}
          </p>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            JPEG, PNG, GIF up to 10MB recommended
          </p>
        </div>
      </label>
      {uploadedImage && (
        <div className="mt-4 flex justify-center">
          <img
            src={uploadedImage}
            alt="Uploaded Preview"
            className="max-h-36 sm:max-h-48 rounded-md shadow-md border border-gray-200"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
