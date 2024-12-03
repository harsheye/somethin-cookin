'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export const AuthButtons = () => {
  const router = useRouter();

  return (
    <div className="flex space-x-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push('/auth/farmer/login')}
        className="text-green-600 hover:text-green-700 px-4 py-2 rounded-md text-sm font-medium"
      >
        Login
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push('/auth/farmer/signup')}
        className="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-600"
      >
        Sign Up
      </motion.button>
    </div>
  );
}; 