'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaSeedling, FaArrowRight, FaTractor, FaHandHoldingUsd, FaUsers, FaChartLine } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { TypeAnimation } from 'react-type-animation';
import FloatingHeader from '@/components/FloatingHeader';

const FarmerLoginPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      toast.loading('Logging in...', { id: 'login' });

      const response = await fetch('http://localhost:5009/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      const { token, userRole } = data;

      // Store token and role in both localStorage and cookies
      if (formData.rememberMe) {
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', userRole);
      } else {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('userRole', userRole);
      }

      // Set cookies
      document.cookie = `token=${token}; path=/`;
      document.cookie = `userRole=${userRole}; path=/`;

      toast.success('Welcome back!', { id: 'login' });

      // Redirect based on user role
      if (userRole === 'farmer') {
        router.push('/farmer-dashboard');
      } else {
        router.push('/marketplace');
      }
    } catch (error) {
      toast.error('Invalid username or password', { id: 'login' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full flex gap-8">
        {/* Info Side - Now on the left */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block flex-1 bg-white p-8 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-green-700 mb-4">
              Join the{' '}
              <TypeAnimation
                sequence={[
                  'Farmers',
                  2000,
                  'Evolution',
                  2000,
                  'Future',
                  2000,
                  'Community',
                  2000,
                  'Indian Agriculture',
                  2000,
                ]}
                wrapper="span"
                repeat={Infinity}
                className="text-green-500"
              />
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: FaTractor,
                title: "Modern Farming",
                description: "Access to latest agricultural technologies",
                color: "from-green-400 to-green-600"
              },
              {
                icon: FaHandHoldingUsd,
                title: "Better Profits",
                description: "Direct market access for better returns",
                color: "from-blue-400 to-blue-600"
              },
              {
                icon: FaUsers,
                title: "Community",
                description: "Connect with fellow farmers",
                color: "from-purple-400 to-purple-600"
              },
              {
                icon: FaChartLine,
                title: "Growth",
                description: "Scale your farming business",
                color: "from-orange-400 to-orange-600"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-xl bg-gradient-to-br ${item.color} text-white transform transition-all duration-300 hover:shadow-xl cursor-pointer`}
              >
                <item.icon className="text-3xl mb-2" />
                <h3 className="font-bold mb-1">{item.title}</h3>
                <p className="text-sm opacity-90">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200"
          >
            <h3 className="font-bold text-green-700 mb-2">Why Choose Us?</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-green-600">
                <FaSeedling /> Advanced farming solutions
              </li>
              <li className="flex items-center gap-2 text-sm text-green-600">
                <FaSeedling /> 24/7 Expert support
              </li>
              <li className="flex items-center gap-2 text-sm text-green-600">
                <FaSeedling /> Secure transactions
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Login Form - Now on the right */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 bg-white p-8 rounded-xl shadow-lg"
        >
          <div className="flex justify-center mb-6">
            <img 
              src="/swastik-logo.png" 
              alt="Swastik Logo" 
              className="h-20 w-auto"
            />
          </div>
          
          <h2 className="text-3xl font-bold text-center text-green-700 mb-8">
            Welcome Back, Farmer!
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username or Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute top-3 left-3 text-green-500" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="pl-10 w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute top-3 left-3 text-green-500" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => router.push('/auth/forgot-password')}
                className="text-sm text-green-600 hover:text-green-500"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 disabled:opacity-50"
            >
              {isLoading ? (
                <FaSeedling className="animate-spin" />
              ) : (
                <>
                  Login <FaArrowRight />
                </>
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => router.push('/auth/farmer/signup')}
              className="text-green-600 hover:text-green-500"
            >
              Sign up now
            </button>
          </p>
        </motion.div>
      </div>
      <FloatingHeader />
    </div>
  );
};

export default FarmerLoginPage;
