import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logoSvg from '../app/logo.svg';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow-md mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-12">
          <Link href="/">
            <Image src={logoSvg} alt="Swastik Logo" width={150} height={150} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">About Us</h3>
            <p className="text-gray-600">Connecting farmers and consumers for a sustainable future.</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Quick Links</h3>
            <ul className="text-gray-600">
              <li><Link href="/marketplace">Marketplace</Link></li>
              <li><Link href="/farmer-dashboard">Farmer Dashboard</Link></li>
              <li><Link href="/mandi-prices">Mandi Prices</Link></li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Legal</h3>
            <ul className="text-gray-600">
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Connect With Us</h3>
            {/* Add social media icons here */}
          </div>
        </div>
        <div className="mt-12 text-center text-gray-600">
          <p>&copy; 2023 Swastik. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
