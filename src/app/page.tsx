'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaShoppingBasket, FaTractor, FaChartLine, FaUsers } from 'react-icons/fa';
import { Header } from '@/components/ui/Header';
import Image from 'next/image';
import logoSvg from './logo.svg';

const themes = [
  { primary: 'from-green-100 to-green-300', secondary: 'bg-green-500' },
  { primary: 'from-blue-100 to-blue-300', secondary: 'bg-blue-500' },
  { primary: 'from-purple-100 to-purple-300', secondary: 'bg-purple-500' },
];

const HomePage: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTheme((prev) => (prev + 1) % themes.length);
    }, 10000); // Change theme every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex flex-col min-h-screen bg-gradient-to-b ${themes[currentTheme].primary} transition-all duration-5000`}>
      <Header isLoggedIn={false} onLogout={() => {}} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Image
            src={logoSvg}
            alt="Swastik Logo"
            width={150}
            height={150}
            className="mx-auto"
          />
        </div>
        <h1 className="text-5xl font-bold text-center mb-12 text-gray-800 animate-fade-in-down">
          Welcome to Swastik
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Link href="/marketplace" className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 animate-fade-in">
            <FaShoppingBasket className={`text-4xl ${themes[currentTheme].secondary} mb-4`} />
            <h2 className="text-2xl font-semibold mb-2">Shop in Marketplace</h2>
            <p className="text-gray-600">Browse and buy fresh produce directly from farmers.</p>
          </Link>
          <Link href="/bulk-orders" className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 animate-fade-in">
            <FaUsers className={`text-4xl ${themes[currentTheme].secondary} mb-4`} />
            <h2 className="text-2xl font-semibold mb-2">Bulk Orders for Businesses</h2>
            <p className="text-gray-600">Place large orders for your business needs.</p>
          </Link>
          <Link href="/farmer-dashboard" className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 animate-fade-in">
            <FaTractor className={`text-4xl ${themes[currentTheme].secondary} mb-4`} />
            <h2 className="text-2xl font-semibold mb-2">Farmer Dashboard</h2>
            <p className="text-gray-600">Manage your products and orders as a farmer.</p>
          </Link>
          <Link href="/mandi-prices" className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 animate-fade-in">
            <FaChartLine className={`text-4xl ${themes[currentTheme].secondary} mb-4`} />
            <h2 className="text-2xl font-semibold mb-2">Mandi Prices</h2>
            <p className="text-gray-600">Check real-time prices from various mandis.</p>
          </Link>
        </div>

        <div className="text-center animate-fade-in">
          <h2 className="text-3xl font-bold mb-4">About Swastik</h2>
          <p className="text-gray-600 max-w-2xl mx-auto animate-typing">
            Swastik is a platform connecting farmers directly with consumers and businesses. 
            We aim to create a fair and transparent marketplace for agricultural produce, 
            benefiting both farmers and buyers.
          </p>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
