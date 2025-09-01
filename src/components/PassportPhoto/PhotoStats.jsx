import React from "react";

const PhotoStats = ({ uploadedImages, selectedOption, layouts }) => {
  const calculateStats = () => {
    if (!uploadedImages.length || !selectedOption) return null;
    
    const layout = layouts[selectedOption];
    const totalPhotos = layout.count;
    const photosPerPerson = Math.floor(totalPhotos / uploadedImages.length);
    const remainder = totalPhotos % uploadedImages.length;
    
    return {
      totalSlots: totalPhotos,
      photosPerPerson,
      remainder,
      sheetSize: layout.sheet
    };
  };

  const stats = calculateStats();

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center space-x-2">
        <span>📊</span>
        <span>Photo Statistics</span>
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <span className="text-sm text-gray-600 dark:text-gray-400">Uploaded Photos</span>
          <span className="font-bold text-blue-600 dark:text-blue-400">{uploadedImages.length}</span>
        </div>
        
        {stats && (
          <>
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Print Slots</span>
              <span className="font-bold text-green-600 dark:text-green-400">{stats.totalSlots}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Photos Per Person</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">
                {stats.photosPerPerson}{stats.remainder > 0 && '+'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sheet Format</span>
              <span className="font-bold text-orange-600 dark:text-orange-400">{stats.sheetSize}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PhotoStats;
