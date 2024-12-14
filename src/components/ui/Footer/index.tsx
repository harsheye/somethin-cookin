'use client';

import React from 'react';
import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white shadow-md mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/about" className="text-gray-600 hover:text-green-600">
              About Us
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-green-600">
              Contact
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-green-600">
              Privacy Policy
            </Link>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <span className="text-gray-600">Made with</span>
            <FaHeart className="text-red-500 mx-1" />
            <span className="text-gray-600">by Swastik Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 