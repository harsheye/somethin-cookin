import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUser, FaTractor, FaExchangeAlt, FaSignOutAlt } from 'react-icons/fa';

const FarmerHeader = () => {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userRole');
    router.push('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img src="/swastik-logo.png" alt="Logo" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-bold text-green-600">Swastik</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/farmer/dashboard" 
              className="text-gray-600 hover:text-green-600 flex items-center"
            >
              <FaTractor className="mr-1" /> Dashboard
            </Link>
            <Link 
              href="/trades" 
              className="text-gray-600 hover:text-green-600 flex items-center"
            >
              <FaExchangeAlt className="mr-1" /> Trades
            </Link>
            <Link 
              href="/farmer/profile" 
              className="text-gray-600 hover:text-green-600 flex items-center"
            >
              <FaUser className="mr-1" /> Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 flex items-center"
            >
              <FaSignOutAlt className="mr-1" /> Logout
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default FarmerHeader; 