'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaLock, FaUserPlus } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Unauthorized = () => {
  const router = useRouter();

  useEffect(() => {
    toast.error(
      <div className="flex flex-col">
        <span className="font-medium">Access Denied</span>
        <span className="text-sm">Please sign up or login to continue</span>
      </div>
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <motion.div
          animate={{ 
            rotateY: [0, 180, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-6 text-red-500 inline-block"
        >
          <FaLock />
        </motion.div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Access Denied</h1>
        <p className="text-xl text-gray-600 mb-8">
          You need to be logged in as a farmer to access this page
        </p>
        <div className="flex gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/auth/farmer/signup')}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <FaUserPlus /> Sign Up
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/auth/farmer/login')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Login
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Unauthorized; 