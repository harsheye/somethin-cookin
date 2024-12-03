'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FaTractor, FaLeaf, FaHandshake, FaChartLine, FaArrowRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
// import FloatingHeader from '@/components/FloatingHeader';

const HomePage = () => {
  const router = useRouter();

  const features = [
    {
      icon: FaTractor,
      title: "Modern Farming",
      description: "Access cutting-edge agricultural technology",
      color: "from-green-400 to-green-600"
    },
    {
      icon: FaLeaf,
      title: "Sustainable Growth",
      description: "Eco-friendly farming practices",
      color: "from-emerald-400 to-emerald-600"
    },
    {
      icon: FaHandshake,
      title: "Direct Trading",
      description: "Connect directly with buyers",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: FaChartLine,
      title: "Market Insights",
      description: "Real-time market analytics",
      color: "from-purple-400 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center z-10 px-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-green-800 mb-6">
            Welcome to{' '}
            <TypeAnimation
              sequence={[
                'Swastik',
                2000,
                'The Future',
                2000,
                'Innovation',
                2000,
                'Agriculture',
                2000,
              ]}
              wrapper="span"
              repeat={Infinity}
              className="text-green-600"
            />
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Revolutionizing farming through technology and direct market access
          </p>
          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/auth/farmer/signup')}
              className="bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-600 transition-all flex items-center gap-2"
            >
              Get Started <FaArrowRight />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/marketplace')}
              className="bg-white text-green-600 px-8 py-3 rounded-full hover:bg-green-50 transition-all border-2 border-green-500"
            >
              Explore Market
            </motion.button>
          </div>
        </motion.div>

        {/* Animated background elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-200 rounded-full opacity-20 blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-blue-200 rounded-full opacity-20 blur-3xl" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center text-green-800 mb-16"
          >
            Why Choose Swastik?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className={`p-6 rounded-xl bg-gradient-to-br ${feature.color} text-white transform transition-all duration-300 hover:shadow-xl`}
              >
                <feature.icon className="text-4xl mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-sm opacity-90">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "10K+", label: "Farmers" },
              { number: "₹50M+", label: "Trading Volume" },
              { number: "100+", label: "Markets Connected" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h3 className="text-5xl font-bold text-green-600 mb-2">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* <FloatingHeader /> */}
    </div>
  );
};

export default HomePage;
