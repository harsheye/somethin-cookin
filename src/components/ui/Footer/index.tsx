'use client';

import React from 'react';
import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden shadow-md mt-auto" style={{ backgroundColor: 'rgb(0,98,65)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-1/2 -right-1/4 w-[40rem] h-[40rem]">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-5">
            <path fill="#A7F0BA" d="M63.3,-51.1C78.1,-31.8,83.7,-5.7,78.8,18.8C73.8,43.3,58.4,66.3,37.1,76.2C15.8,86.1,-11.4,83.1,-34.4,71.8C-57.3,60.6,-76.1,41.1,-81.4,18.4C-86.7,-4.2,-78.5,-30.2,-62.7,-49.7C-46.9,-69.2,-23.4,-82.3,0.4,-82.6C24.2,-82.9,48.4,-70.4,63.3,-51.1Z" transform="translate(100 100)" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/about" className="text-white/80 hover:text-white transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-white/80 hover:text-white transition-colors">
              Contact
            </Link>
            <Link href="/privacy" className="text-white/80 hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <span className="text-white/80">Made with</span>
            <FaHeart className="text-red-400 mx-1" />
            <span className="text-white/80">by Swastik Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 