import React from 'react';

const LoadingPage = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingPage;
