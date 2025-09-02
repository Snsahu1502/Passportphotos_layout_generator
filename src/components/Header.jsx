import React from "react";

const Header = () => {
  return (
    <div className="text-center mb-8 sm:mb-12 lg:mb-16 relative px-4">
      <div className="absolute inset-0 -z-10">
        <div className="w-full h-24 sm:h-32 lg:h-40 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl"></div>
      </div>
      
      <div className="space-y-3 sm:space-y-4 lg:space-y-6 animate-fade-in-up max-w-4xl mx-auto">
        {/* Animated Dots */}
        <div className="inline-flex items-center justify-center p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-2 sm:mb-4">
          <div className="flex space-x-1.5 sm:space-x-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
        
        {/* Main Title - Fully Responsive */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight px-2">
          PhotoPrint Studio
        </h1>
        
        {/* Decorative Divider - Responsive */}
        <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
          <div className="h-px w-8 sm:w-12 lg:w-16 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
          <span className="text-xl sm:text-2xl">🎨</span>
          <div className="h-px w-8 sm:w-12 lg:w-16 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
        </div>
        
        {/* Main Description - Responsive Typography */}
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-2 font-light px-2 max-w-2xl mx-auto">
          Professional photos & AI background removal
        </p>
        
        {/* Sub Description */}
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 italic px-2">
          Three powerful tools • One amazing platform
        </p>
        
        {/* Feature Tags - Responsive Layout */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-6 mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1.5">
            <span className="text-sm sm:text-base">📸</span>
            <span className="whitespace-nowrap">Passport Photos</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-sm sm:text-base">✂️</span>
            <span className="whitespace-nowrap">Background Removal</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-sm sm:text-base">🆔</span>
            <span className="whitespace-nowrap">ID Card Generator</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-sm sm:text-base">🚀</span>
            <span className="whitespace-nowrap">AI Powered</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
