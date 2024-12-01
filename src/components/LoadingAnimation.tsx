import React from 'react';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-pulse flex space-x-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-gray-300 h-32 w-32 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingAnimation;
