import React from "react";

const PrintOptions = ({ 
  hasImages, 
  imageCount,
  selectedOption, 
  setSelectedOption, 
  isProcessing, 
  layouts, 
  sheetDimensions 
}) => {
  const calculateDistribution = (totalPhotos, layoutCount) => {
    const photosPerImage = Math.floor(layoutCount / totalPhotos);
    const remainder = layoutCount % totalPhotos;
    
    const distribution = [];
    for (let i = 0; i < totalPhotos; i++) {
      distribution.push(photosPerImage + (i < remainder ? 1 : 0));
    }
    return distribution;
  };

  if (!hasImages) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 px-6 py-4 rounded-xl relative mb-6 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold">Upload Required</span>
        </div>
        <p className="text-sm">
          Please upload your photos above to unlock print layout options! ⬆️
        </p>
      </div>
    );
  }

  return (
    <div className="mb-8 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center justify-center space-x-2">
          <span>🎨</span>
          <span>Choose Your Layout</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Select the perfect print format for your needs</p>
      </div>
      
      {imageCount > 1 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-2xl">🎯</span>
            <span className="font-bold text-green-700 dark:text-green-300">Smart Distribution Active</span>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400 text-center">
            <strong>{imageCount} photos</strong> will be distributed equally across your selected layout
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(layouts).map(([key, value]) => {
          const distribution = calculateDistribution(imageCount, value.count);
          const distributionText = imageCount > 1 
            ? distribution.join(" • ") + " photos per person"
            : `${value.count} photos total`;

          const isSelected = selectedOption === key;

          return (
            <button
              key={key}
              onClick={() => setSelectedOption(key)}
              disabled={isProcessing}
              className={`
                relative p-6 rounded-2xl border-2 transition-all duration-300 ease-in-out text-left transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group
                ${
                  isSelected
                    ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white border-blue-700 shadow-2xl scale-105"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:shadow-xl"
                }
                ${
                  isProcessing
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }
              `}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Layout Icon */}
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                isSelected ? 'bg-white/20' : 'bg-gradient-to-br from-blue-500 to-purple-500 text-white group-hover:from-blue-600 group-hover:to-purple-600'
              }`}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4z" clipRule="evenodd" />
                </svg>
              </div>

              {/* Layout Details */}
              <div className="space-y-2">
                <h3 className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                  {value.sheet.toUpperCase()} Format
                </h3>
                
                <p className={`text-sm font-medium ${isSelected ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'}`}>
                  {sheetDimensions[value.sheet].label}
                </p>
                
                <div className={`flex items-center space-x-4 text-sm ${isSelected ? 'text-blue-50' : 'text-gray-500 dark:text-gray-500'}`}>
                  <span>📐 {value.rows}×{value.cols} grid</span>
                  <span>📄 {value.count} photos</span>
                </div>
                
                <div className={`text-sm font-medium ${isSelected ? 'text-yellow-200' : 'text-blue-600 dark:text-blue-400'}`}>
                  📊 {distributionText}
                </div>
              </div>

              {/* Hover Effect Overlay */}
              {!isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PrintOptions;
