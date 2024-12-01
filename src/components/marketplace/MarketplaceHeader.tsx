'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logoSvg from '../../app/logo.svg';
import { FaUser, FaShoppingCart } from 'react-icons/fa';

export function MarketplaceHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <header className="bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image src={logoSvg} alt="Swastik Logo" width={80} height={80} />
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/cart" className="text-gray-600 hover:text-gray-900">
              <FaShoppingCart className="text-2xl" />
            </Link>
            
            {isLoggedIn ? (
              <Link 
                href="/profile" 
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <FaUser className="text-xl" />
                <span>Profile</span>
              </Link>
            ) : (
              <Link 
                href="/auth/customer/login"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
} 