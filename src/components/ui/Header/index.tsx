'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FaUser, FaSignOutAlt, FaShoppingCart, FaExchangeAlt, FaBars } from 'react-icons/fa';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import Sidebar from '@/components/ui/Sidebar';

const notificationQueue = new Set();

const showNotification = (message: string) => {
  if (notificationQueue.has(message)) return;
  
  notificationQueue.add(message);
  toast(message, {
    duration: 3000,
    onClose: () => {
      notificationQueue.delete(message);
    }
  });
};

function Header() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      showNotification('Logged out successfully');
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
      showNotification('Logout failed. Please try again.');
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: 0 }}
        className={`
          w-full transition-all duration-300
          ${isScrolled ? 'px-4 py-4' : 'py-4'}
          ${isScrolled ? 'md:py-4 py-2' : 'md:py-4 py-2'}
        `}
        style={{ backgroundColor: isScrolled ? 'transparent' : 'rgb(30,57,50)' }}
      >
        <div 
          className={`
            max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
            ${isScrolled 
              ? 'bg-[rgb(30,57,50)] backdrop-blur-lg shadow-lg rounded-2xl border border-white/10 py-2' 
              : ''
            }
          `}
        >
          <div className={`flex items-center justify-between ${isScrolled ? 'md:h-16 h-12' : 'md:h-16 h-12'}`}>
            {/* Logo Section - Made smaller on mobile */}
            <Link href="/" className="flex items-center gap-2 md:gap-3">
              <img
                src="/swastik-logo.png"
                alt="Swastik"
                className={`transition-all duration-300 ${isScrolled ? 'md:h-10 h-8' : 'md:h-10 h-8'}`}
              />
              <span className={`font-bold text-white transition-all duration-300 
                ${isScrolled ? 'md:text-lg text-base' : 'md:text-xl text-base'}`}
              >
                Swastik
              </span>
            </Link>

            {/* Center Navigation - Hidden on mobile */}
            <nav className="hidden md:flex items-center space-x-12">
              <Link
                href="/marketplace"
                className="text-lg font-semibold text-white/80 hover:text-white relative group transition-colors duration-300"
              >
                Marketplace
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300" />
              </Link>

              {isAuthenticated && userRole === 'farmer' && (
                <>
                  <Link
                    href="/farmer/dashboard"
                    className="text-lg font-semibold text-white/80 hover:text-white relative group transition-colors duration-300"
                  >
                    Dashboard
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300" />
                  </Link>
                  <Link
                    href="/trades"
                    className="text-lg font-semibold text-white/80 hover:text-white relative group transition-colors duration-300"
                  >
                    Trades
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300" />
                  </Link>
                </>
              )}

              {isAuthenticated && userRole === 'customer' && (
                <Link
                  href="/cart"
                  className="text-lg font-semibold text-white/80 hover:text-white relative group transition-colors duration-300"
                >
                  Cart
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300" />
                </Link>
              )}
            </nav>

            {/* Profile/Menu Section */}
            {isAuthenticated ? (
              <>
                {/* Desktop Profile Dropdown */}
                <div className="relative group hidden md:block" onMouseLeave={() => setIsDropdownOpen(false)}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isScrolled 
                        ? 'bg-white/10 hover:bg-white/20' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <FaUser className="text-lg text-white" />
                  </motion.div>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 backdrop-blur-md rounded-xl shadow-lg py-1 z-50 bg-gradient-to-b from-green-600/95 to-green-700/95"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                      >
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <FaBars className="text-white text-lg" />
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="text-base md:text-lg font-semibold text-white hover:text-green-100 transition-colors duration-300"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </motion.header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-lg z-40"
              onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar with gradient reveal */}
            <motion.div
              initial={{ 
                clipPath: 'circle(0% at calc(100% - 32px) 32px)',
                opacity: 0 
              }}
              animate={{ 
                clipPath: 'circle(150% at calc(100% - 32px) 32px)',
                opacity: 1 
              }}
              exit={{ 
                clipPath: 'circle(0% at calc(100% - 32px) 32px)',
                opacity: 0 
              }}
              transition={{ 
                type: "spring",
                duration: 1.2,
                bounce: 0.2
              }}
              className="fixed inset-0 bg-gradient-to-b from-[rgb(15,28,25)] via-[rgb(20,35,30)] to-[rgb(15,28,25)] z-50 overflow-hidden"
            >
              {/* Fixed Blobs */}
              <div className="absolute top-0 right-0 w-96 h-96 opacity-20">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="absolute inset-0 bg-gradient-to-r from-green-700/30 to-emerald-600/30 rounded-full blur-3xl"
                  whileHover={{ scale: 1.1, opacity: 0.3 }}
                />
              </div>

              <div className="absolute bottom-0 left-0 w-96 h-96 opacity-20">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.7 }}
                  className="absolute inset-0 bg-gradient-to-r from-emerald-600/30 to-green-700/30 rounded-full blur-3xl"
                  whileHover={{ scale: 1.1, opacity: 0.3 }}
                />
              </div>

              {/* Floating Blobs */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  x: [0, 10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute bottom-32 right-32 w-24 h-24 opacity-20 bg-green-500/20 rounded-full blur-2xl"
              />

              <motion.div
                animate={{
                  y: [0, 20, 0],
                  x: [0, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute bottom-48 left-32 w-16 h-16 opacity-20 bg-emerald-500/20 rounded-full blur-2xl"
              />

              <div className="relative flex flex-col h-full z-10">
                {/* Close Button */}
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="absolute top-6 right-6 w-12 h-12 rounded-full border border-white/10 
                    flex items-center justify-center text-white/80 hover:text-white 
                    transition-all duration-500"
                >
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 180 }}
                    exit={{ rotate: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-2xl"
                  >
                    ✕
                  </motion.div>
                </button>

                {/* Profile Section */}
                <div className="p-8 mt-8">
                  <div className="flex items-center gap-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="w-16 h-16 rounded-full border border-white/10 
                        flex items-center justify-center"
                    >
                      <FaUser className="text-2xl text-white/80" />
                    </motion.div>
                    <div>
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="text-xl font-semibold text-white/90"
                      >
                        Profile
                      </motion.div>
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                        className="text-white/50"
                      >
                        {userRole}
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-8">
                  <div className="space-y-6">
                    {[
                      { href: '/marketplace', label: 'Marketplace' },
                      ...(userRole === 'farmer' ? [
                        { href: '/farmer/dashboard', label: 'Dashboard' },
                        { href: '/trades', label: 'Trades' }
                      ] : []),
                      ...(userRole === 'customer' ? [
                        { href: '/cart', label: 'Cart' }
                      ] : [])
                    ].map((link, index) => (
                      <motion.div
                        key={link.href}
                        initial={{ x: -40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.8 + (index * 0.15), duration: 0.8 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsSidebarOpen(false)}
                          className="block text-xl text-white/70 hover:text-white 
                            pl-4 py-2 transition-all duration-500"
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </nav>

                {/* Logout Button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="p-8 border-t border-white/5"
                >
                  <button
                    onClick={() => {
                      setIsSidebarOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 text-lg text-red-300/80 
                      hover:text-red-300 transition-all duration-500 w-full"
                  >
                    <FaSignOutAlt className="text-xl" />
                    <span>Logout</span>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Header;
