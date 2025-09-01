import React from "react";

const BackgroundRemovalTool = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20">
        <div className="text-center space-y-6">
          <div className="text-8xl">🚧</div>
          
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Background Removal Coming Soon
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            We're working on implementing AI-powered background removal using advanced deep learning technology. This feature will be available in a future update.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
              Meanwhile, use our Passport Photo Creator! 📸
            </h3>
            <p className="text-blue-700 dark:text-blue-300">
              Create professional passport photos with multiple layouts, smart distribution, and print-ready quality.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="text-2xl mb-2">🤖</div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">AI Technology</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Deep learning models for precise background removal</p>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="text-2xl mb-2">⚡</div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">Lightning Fast</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Process multiple images in seconds</p>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">Precise Results</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Handle complex edges like hair and fine details</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundRemovalTool;
