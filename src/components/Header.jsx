import React from "react";

const Header = () => {
  return (
    <div className="text-center mb-12 relative">
      <div className="absolute inset-0 -z-10">
        <div className="w-full h-32 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl blur-3xl"></div>
      </div>
      
      <div className="space-y-4 animate-fade-in-up">
        <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 leading-tight">
          PhotoPrint Studio
        </h1>
        
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
          <span className="text-2xl">🎨</span>
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
        </div>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-2 font-light">
          Professional photos & AI background removal
        </p>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          Two powerful tools • One amazing platform
        </p>
        
        <div className="flex items-center justify-center space-x-6 mt-6 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <span>📸</span>
            <span>Passport Photos</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>✂️</span>
            <span>Background Removal</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>🚀</span>
            <span>AI Powered</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
