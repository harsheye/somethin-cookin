'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaSeedling, FaTractor } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AccountTypeModal from '@/components/modals/AccountTypeModal';
export default function FarmerLoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      toast.loading('Logging in...', { id: 'login' });

      const response = await fetch('http://localhost:5009/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          role: 'farmer'
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('userRole', 'farmer');

      toast.success('Login successful!');
      router.push('/farmer/dashboard');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const userRole = sessionStorage.getItem('userRole');
    const token = sessionStorage.getItem('token');

    if (token && userRole === 'farmer') {
      router.push('/farmer/dashboard');
    } else if (token && userRole === 'customer') {
      router.push('/marketplace');
    }
  }, [router]);
  const [showAccountTypeModal, setShowAccountTypeModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Welcome Message */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:flex flex-col justify-center space-y-6 p-8"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
            >
              <FaTractor className="text-4xl text-green-600" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-800">
              Welcome Back, User!
            </h1>
            <p className="text-lg text-gray-600">
              Access your farming dashboard or Customer dashboard and manage your agricultural business with ease.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/50 backdrop-blur-sm rounded-xl p-6 space-y-4"
          >
            <h3 className="text-xl font-semibold text-gray-800">Why Choose Us?</h3>
            <ul className="space-y-3">
              {[
                'Direct market access for your produce',
                'Real-time price updates',
                'Connect with buyers directly',
                'Secure payment system',
                'Expert agricultural support'
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center space-x-2 text-gray-600"
                >
                  <FaSeedling className="text-green-500" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          <div className="flex justify-center mb-8">
            <img 
              src="/swastik-logo.png" 
              alt="Swastik Logo" 
              className="h-16 w-auto"
            />
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            User Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between"
            >
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-green-600 hover:text-green-700">
                Forgot password?
              </Link>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-sm text-gray-600 mt-4"
            >
              Don't have an account?{' '}
              <motion.button
            onClick={() => setShowAccountTypeModal(true)}
            className="text-green-600 hover:text-green-700 font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign up
          </motion.button>
            </motion.p>
          </form>
        </motion.div>
      </div>
      <AccountTypeModal 
        isOpen={showAccountTypeModal} 
        onClose={() => setShowAccountTypeModal(false)} 
      />
    </div>
  );
}
