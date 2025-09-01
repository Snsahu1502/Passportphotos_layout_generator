import React, { useRef, useState } from "react";

const MultiImageUpload = ({ 
  uploadedImages, 
  onImagesUpload, 
  setError, 
  setGeneratedSheetUrl, 
  setSelectedOption 
}) => {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleImageUpload = (files) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    if (fileArray.length > 6) {
      setError("Please upload maximum 6 images at once.");
      return;
    }

    onImagesUpload(fileArray);
  };

  const handleFileInputChange = (event) => {
    handleImageUpload(event.target.files);
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
    const files = event.dataTransfer.files;
    handleImageUpload(files);
  };

  const removeImage = (indexToRemove) => {
    const updatedImages = uploadedImages.filter((_, index) => index !== indexToRemove);
    onImagesUpload(updatedImages.map(imageUrl => ({ type: 'image/jpeg', dataUrl: imageUrl })));
    setGeneratedSheetUrl(null);
    setSelectedOption(null);
  };

  return (
    <div className="mb-8 space-y-6">
      {/* Upload Area */}
      <div 
        className={`relative p-8 border-3 border-dashed rounded-2xl text-center transition-all duration-300 cursor-pointer group ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105' 
            : uploadedImages.length > 0
              ? 'border-green-300 bg-green-50 dark:bg-green-900/20 hover:border-green-400'
              : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
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
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`relative ${isDragOver ? 'animate-bounce' : 'group-hover:animate-pulse'}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">
              {uploadedImages.length > 0 
                ? `${uploadedImages.length} Photos Uploaded! 🎉`
                : isDragOver 
                  ? "Drop your photos here! 🎯"
                  : "Upload Your Photos 📱"
              }
            </h3>
            
            <p className="text-gray-500 dark:text-gray-400">
              {isDragOver 
                ? "Release to upload your images"
                : "Drag & drop or click to select • Up to 6 photos • JPEG, PNG, GIF"
              }
            </p>
          </div>
        </div>
      </div>

      {/* Image Preview Grid */}
      {uploadedImages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center space-x-2">
              <span>📷</span>
              <span>Uploaded Photos ({uploadedImages.length})</span>
            </h3>
            <button
              onClick={() => {
                onImagesUpload([]);
                setGeneratedSheetUrl(null);
                setSelectedOption(null);
              }}
              className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {uploadedImages.map((imageUrl, index) => (
              <div 
                key={index} 
                className="relative group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <img
                    src={imageUrl}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-red-600 transition-all duration-200 transform hover:scale-110"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                    #{index + 1}
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                  Photo {index + 1}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiImageUpload;
