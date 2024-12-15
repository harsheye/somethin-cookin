'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaUser, FaShoppingCart, FaBell, FaLeaf } from 'react-icons/fa';
import Image from 'next/image';
import AccountTypeModal from '@/components/modals/AccountTypeModal';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAccountTypeModal, setShowAccountTypeModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? 'py-2 shadow-lg' : 'py-4'
        }`}
        style={{ backgroundColor: 'rgb(30,57,50)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center"
              >
                <FaLeaf className="text-white text-xl" />
              </motion.div>
              <span className="text-2xl font-serif font-bold text-white group-hover:text-green-300 transition-colors">
                Codebase
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              {['Marketplace', 'Trades', 'About'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-white/80 hover:text-white transition-colors relative group"
                >
                  <span>{item}</span>
                  <motion.span
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"
                    whileHover={{ width: '100%' }}
                  />
                </Link>
              ))}
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-6">
              {[
                { icon: FaShoppingCart, label: 'Cart' },
                { icon: FaBell, label: 'Notifications' },
                { icon: FaUser, label: 'Profile' }
              ].map((item, index) => (
                <motion.button
                  key={item.label}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-white/80 hover:text-white transition-colors relative group"
                >
                  <item.icon size={20} />
                  <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Update the signup button to open modal */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAccountTypeModal(true)}
              className="bg-white text-green-600 px-6 py-2 rounded-full hover:bg-green-50 transition-all"
            >
              Sign Up
            </motion.button>
          </div>
        </div>
      </header>

      <AccountTypeModal 
        isOpen={showAccountTypeModal} 
        onClose={() => setShowAccountTypeModal(false)} 
      />
    </>
  );
};

export default Header; 