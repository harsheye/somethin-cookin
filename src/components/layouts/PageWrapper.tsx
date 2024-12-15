'use client';

import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <div style={{height: '50px'}} className="H-16" />
      <div className="px-6 md:px-8 max-w-[1400px] mx-auto mt-8">
        {children}
      </div>
    </div>
  );
};

export default PageWrapper; 