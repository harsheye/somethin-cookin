'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FaHome, FaStore } from 'react-icons/fa';

const FloatingHeader = () => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-lg rounded-full shadow-lg px-6 py-3 flex items-center gap-4"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => router.push('/')}
        className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
      >
        <FaHome /> Home
      </motion.button>
      <div className="w-px h-6 bg-gray-300" />
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => router.push('/marketplace')}
        className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
      >
        <FaStore /> Marketplace
      </motion.button>
    </motion.div>
  );
};

export default FloatingHeader; 