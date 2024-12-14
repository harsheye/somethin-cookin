'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FaUser, FaSignOutAlt, FaShoppingCart, FaExchangeAlt } from 'react-icons/fa';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

function Header() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = sessionStorage.getItem('token');
        const role = sessionStorage.getItem('userRole');
        
        if (!token) {
          handleLogout();
          return;
        }

        // Verify token expiration if you have that info
        setIsAuthenticated(true);
        setUserRole(role);
      } catch (error) {
        console.error('Auth check failed:', error);
        handleLogout();
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userRole');
      setIsAuthenticated(false);
      setUserRole(null);
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out 
      ${isScrolled ? 'px-6 pt-8' : ''}`}
    >
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: 0 }}
        className={`
          transition-all duration-700 ease-in-out
          ${isScrolled 
            ? 'max-w-7xl mx-auto bg-gradient-to-r from-green-600/90 via-green-500/80 to-green-600/90 backdrop-blur-lg shadow-lg rounded-2xl transform scale-95' 
            : 'bg-gradient-to-r from-green-600 via-green-500 to-green-600 transform scale-100'
          }
        `}
      >
        <div className={`${isScrolled ? 'px-6' : 'px-8'} transition-all duration-700 ease-in-out`}>
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => router.push('/')}
            >
              <img
                src="/swastik-logo.png"
                alt="Swastik"
                className="h-10 w-auto"
              />
              <span className="ml-3 text-xl font-bold text-white">
                Swastik
              </span>
            </div>

            {/* Center Navigation */}
            <nav className="hidden md:flex items-center space-x-12">
              <Link
                href="/marketplace"
                className="text-lg font-semibold text-white hover:text-green-100 transition-colors duration-300"
              >
                Marketplace
              </Link>

              {isAuthenticated && userRole === 'farmer' && (
                <>
                  <Link
                    href="/farmer/dashboard"
                    className="text-lg font-semibold text-white hover:text-green-100 transition-colors duration-300"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/farmer/trades"
                    className="text-lg font-semibold text-white hover:text-green-100 transition-colors duration-300"
                  >
                    Trades
                  </Link>
                </>
              )}

              {isAuthenticated && userRole === 'customer' && (
                <Link
                  href="/cart"
                  className="text-lg font-semibold text-white hover:text-green-100 transition-colors duration-300"
                >
                  Cart
                </Link>
              )}
            </nav>

            {/* Profile Section */}
            {isAuthenticated ? (
              <div className="relative group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isScrolled 
                      ? 'bg-white/10 hover:bg-white/20' 
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <FaUser className="text-lg text-white" />
                </motion.div>

                <div className="hidden group-hover:block absolute right-0 mt-2 w-48 backdrop-blur-md rounded-xl shadow-lg py-1 z-50 bg-gradient-to-b from-green-600/95 to-green-700/95">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-white hover:bg-white/10 flex items-center gap-2 transition-colors"
                  >
                    <FaUser className="text-green-200" /> Profile
                  </Link>
                  
                  {userRole === 'farmer' && (
                    <Link
                      href="/farmer/trades"
                      className="block px-4 py-2 text-sm text-white hover:bg-white/10 flex items-center gap-2 transition-colors"
                    >
                      <FaExchangeAlt className="text-green-200" /> Trades
                    </Link>
                  )}
                  
                  {userRole === 'customer' && (
                    <Link
                      href="/cart"
                      className="block px-4 py-2 text-sm text-white hover:bg-white/10 flex items-center gap-2 transition-colors"
                    >
                      <FaShoppingCart className="text-green-200" /> Cart
                    </Link>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-white/10 flex items-center gap-2 transition-colors"
                  >
                    <FaSignOutAlt className="text-red-300" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="text-lg font-semibold text-white hover:text-green-100 transition-colors duration-300"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </motion.header>
    </div>
  );
}

export default Header;
