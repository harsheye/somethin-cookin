'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaSadTear } from 'react-icons/fa';

const NotFound = () => {
  const router = useRouter();

  useEffect(() => {
    toast.loading(
      <div className="flex flex-col">
        <span className="font-medium">Page not found</span>
        <span className="text-sm">Redirecting to home in 5 seconds...</span>
      </div>,
      { duration: 5000 }
    );

    const timeout = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 10, 0],
            scale: [1, 1.1, 1, 1.1, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-6 text-green-500 inline-block"
        >
          <FaSadTear />
        </motion.div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Oops! Page not found</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/')}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          Go Home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound; 