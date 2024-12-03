'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  FaStore, FaChartLine, FaTachometerAlt,
  FaExchangeAlt, FaShoppingCart 
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useCart } from '@/contexts/CartContext';
import AuthButtons from '@/components/auth/AuthButtons';
import ProfileMenu from '@/components/profile/ProfileMenu';

export const Header = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { cartItems } = useCart();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const role = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
      setIsAuthenticated(!!token);
      setUserRole(role);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userRole');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    setIsAuthenticated(false);
    setUserRole(null);
    toast.success('Logged out successfully');
    router.push('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <img
              src="/swastik-logo.png"
              alt="Swastik"
              className="h-8 w-auto"
            />
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/marketplace')}
              className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
            >
              <FaStore /> Marketplace
            </motion.button>

            {isAuthenticated && (userRole === 'farmer' || userRole === 'company') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/trades')}
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
              >
                <FaExchangeAlt /> Trades
              </motion.button>
            )}
          </nav>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && (userRole === 'user' || userRole === 'company') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/cart')}
                className="relative text-gray-700 hover:text-green-600 p-2"
              >
                <FaShoppingCart className="text-xl" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </motion.button>
            )}

            {/* Profile Menu */}
            {isAuthenticated ? (
              <ProfileMenu userRole={userRole} onLogout={handleLogout} />
            ) : (
              <AuthButtons />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
