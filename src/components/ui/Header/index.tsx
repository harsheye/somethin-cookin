import React from "react";
import Link from 'next/link';
import { FaUser, FaSignInAlt, FaUserPlus, FaTractor, FaSignOutAlt, FaChartBar, FaShoppingBasket } from 'react-icons/fa';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  userRole?: string;
}

export const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogout, userRole }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md py-4 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold text-green-600 hover:text-green-700 transition-colors duration-300">
          Swstik
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/marketplace" className="text-gray-600 hover:text-green-600 transition-colors duration-300 text-lg flex items-center">
                <FaShoppingBasket className="mr-2" />
                Market
              </Link>
            </li>
            {isLoggedIn ? (
              <>
                {userRole === 'farmer' && (
                  <li>
                    <Link href="/farmer-dashboard" className="text-gray-600 hover:text-green-600 transition-colors duration-300 text-lg flex items-center">
                      <FaChartBar className="mr-2" /> Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <Link href="/profile" className="text-gray-600 hover:text-green-600 transition-colors duration-300 text-lg flex items-center">
                    <FaUser className="mr-2" /> Profile
                  </Link>
                </li>
                <li>
                  <button onClick={onLogout} className="text-gray-600 hover:text-red-600 transition-colors duration-300 text-lg flex items-center">
                    <FaSignOutAlt className="mr-2" /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/auth/customer/login" className="text-gray-600 hover:text-green-600 transition-colors duration-300 text-lg flex items-center">
                    <FaSignInAlt className="mr-2" /> Login
                  </Link>
                </li>
                <li>
                  <Link href="/auth/farmer/login" className="text-gray-600 hover:text-green-600 transition-colors duration-300 text-lg flex items-center">
                    <FaTractor className="mr-2" /> Farmer
                  </Link>
                </li>
                <li>
                  <Link href="/auth/farmer/signup" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 text-lg flex items-center">
                    <FaUserPlus className="mr-2" /> Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};
