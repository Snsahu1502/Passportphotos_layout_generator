import React from "react";

const FeatureCards = () => {
  const features = [
    {
      icon: "✂️",
      title: "AI Background Removal",
      description: "Remove backgrounds automatically with AI",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Generate print-ready sheets in seconds",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: "🎯",
      title: "Smart Distribution",
      description: "Automatically distributes photos equally",
      color: "from-blue-400 to-purple-500"
    },
    {
      icon: "📐",
      title: "Perfect Sizing",
      description: "Standard passport photo dimensions",
      color: "from-green-400 to-blue-500"
    },
    {
      icon: "🖨️",
      title: "Print Ready",
      description: "600 DPI high-quality output",
      color: "from-indigo-400 to-purple-500"
    }
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center space-x-2">
        <span>✨</span>
        <span>Key Features</span>
      </h3>
      
      {features.map((feature, index) => (
        <div 
          key={index}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 dark:border-gray-700/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center text-lg shadow-lg`}>
              {feature.icon}
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                {feature.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureCards;
