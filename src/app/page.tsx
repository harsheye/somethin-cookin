'use client';

import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FaTractor, FaLeaf, FaHandshake, FaChartLine, FaArrowRight, FaShoppingCart, FaCheck } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
// import FloatingHeader from '@/components/FloatingHeader';
import NumberTicker from '@/components/ui/NumberTicker';
import Footer from '@/components/ui/Footer';
import { AnimatePresence } from 'framer-motion';

const Blob1 = () => (
  <motion.svg viewBox="0 0 200 200" className="w-full h-full">
    <motion.path
      fill="#A7F0BA"
      d="M30.2,-27C44.9,-30.9,66.5,-29.8,66,-23.3C65.6,-16.8,43.1,-5.1,33.6,6.9C24.2,18.8,27.8,31,24.3,41.7C20.9,52.4,10.4,61.6,-2.9,65.6C-16.3,69.6,-32.5,68.4,-35.3,57.5C-38,46.5,-27.3,26,-21.3,14.1C-15.3,2.2,-14.2,-1,-16.7,-9.3C-19.3,-17.5,-25.7,-30.8,-23.5,-30.9C-21.4,-31,-10.7,-17.9,-1.5,-15.9C7.8,-13.9,15.6,-23,30.2,-27Z"
      animate={{
        d: [
          "M30.2,-27C44.9,-30.9,66.5,-29.8,66,-23.3C65.6,-16.8,43.1,-5.1,33.6,6.9C24.2,18.8,27.8,31,24.3,41.7C20.9,52.4,10.4,61.6,-2.9,65.6C-16.3,69.6,-32.5,68.4,-35.3,57.5C-38,46.5,-27.3,26,-21.3,14.1C-15.3,2.2,-14.2,-1,-16.7,-9.3C-19.3,-17.5,-25.7,-30.8,-23.5,-30.9C-21.4,-31,-10.7,-17.9,-1.5,-15.9C7.8,-13.9,15.6,-23,30.2,-27Z",
          "M51.9,-33.2C68.1,-21.1,82.6,0.6,76.5,13.5C70.4,26.4,43.6,30.6,21.5,39.1C-0.6,47.6,-17.9,60.4,-31.4,57C-45,53.7,-54.8,34.2,-58.9,14C-63.1,-6.1,-61.5,-27,-50.8,-37.9C-40,-48.7,-20,-49.6,-1.1,-48.8C17.8,-47.9,35.7,-45.3,51.9,-33.2Z"
        ],
        transform: ["translate(100 100)", "translate(120 120)"]
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    />
  </motion.svg>
);

const Blob2 = () => (
  <motion.svg viewBox="0 0 200 200" className="w-full h-full">
    <motion.path
      fill="#A7F0BA"
      d="M36,-40.6C40.6,-23,34,-8.4,31.1,8.1C28.1,24.5,28.7,42.7,19.2,51.9C9.7,61.1,-10,61.3,-19,52.1C-28.1,42.9,-26.5,24.3,-25,11.3C-23.5,-1.7,-22.2,-9.2,-18,-26.7C-13.9,-44.2,-6.9,-71.8,4.4,-75.3C15.7,-78.8,31.5,-58.2,36,-40.6Z"
      animate={{
        d: [
          "M36,-40.6C40.6,-23,34,-8.4,31.1,8.1C28.1,24.5,28.7,42.7,19.2,51.9C9.7,61.1,-10,61.3,-19,52.1C-28.1,42.9,-26.5,24.3,-25,11.3C-23.5,-1.7,-22.2,-9.2,-18,-26.7C-13.9,-44.2,-6.9,-71.8,4.4,-75.3C15.7,-78.8,31.5,-58.2,36,-40.6Z",
          "M63.3,-51.1C78.1,-31.8,83.7,-5.7,78.8,18.8C73.8,43.3,58.4,66.3,37.1,76.2C15.8,86.1,-11.4,83.1,-34.4,71.8C-57.3,60.6,-76.1,41.1,-81.4,18.4C-86.7,-4.2,-78.5,-30.2,-62.7,-49.7C-46.9,-69.2,-23.4,-82.3,0.4,-82.6C24.2,-82.9,48.4,-70.4,63.3,-51.1Z"
        ],
        transform: ["translate(100 100)", "translate(80 80)"]
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
    />
  </motion.svg>
);

const AccountTypeModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const router = useRouter();
  
  const accountTypes = [
    {
      type: 'Farmer',
      description: 'Sell your produce directly to customers',
      benefits: [
        'Direct market access',
        'Better profit margins',
        'Real-time market insights',
        'Secure payments',
        'Track your sales'
      ],
      icon: FaTractor,
      color: 'from-green-500 to-green-700',
      route: '/auth/farmer/signup'
    },
    {
      type: 'Customer',
      description: 'Buy fresh produce directly from farmers',
      benefits: [
        'Fresh farm products',
        'Competitive prices',
        'Quality assurance',
        'Direct farmer connect',
        'Convenient delivery'
      ],
      icon: FaShoppingCart,
      color: 'from-blue-500 to-blue-700',
      route: '/auth/customer/signup'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", bounce: 0.2 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-white/10"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>

          <div className="max-w-6xl mx-auto p-8">
            <div className="text-center mb-8">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-white mb-4"
              >
                Choose Your Account Type
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white/80 text-lg"
              >
                Select how you want to use Swastik platform
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {accountTypes.map((account, index) => (
                <motion.div
                  key={account.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 + 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-gradient-to-br ${account.color} p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all`}
                >
                  <account.icon className="text-4xl text-white mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">{account.type}</h3>
                  <p className="text-white/80 mb-6">{account.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {account.benefits.map((benefit, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 + i * 0.1 + 0.4 }}
                        className="flex items-center text-white/90"
                      >
                        <FaCheck className="text-green-300 mr-2" /> {benefit}
                      </motion.li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push(account.route)}
                    className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors"
                  >
                    Continue as {account.type}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const HomePage = () => {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const [showAccountTypeModal, setShowAccountTypeModal] = useState(false);

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
    <div className="flex flex-col min-h-screen">
      {/* Fixed Background with Blobs */}
      <div 
        className="fixed inset-0 w-full h-full overflow-hidden" 
        style={{ backgroundColor: 'rgb(0,98,65)' }}
      >
        {/* Larger Blob 1 */}
        <motion.div
          className="absolute -top-[25%] -left-[25%] w-[150vw] h-[150vh]"
          style={{
            y: useTransform(scrollYProgress, [0, 1], [0, -300]),
            rotate: useTransform(scrollYProgress, [0, 1], [0, 360]),
            scale: useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 0.8])
          }}
        >
          <Blob1 />
        </motion.div>

        {/* Larger Blob 2 */}
        <motion.div
          className="absolute -bottom-[25%] -right-[25%] w-[150vw] h-[150vh]"
          style={{
            y: useTransform(scrollYProgress, [0, 1], [0, 300]),
            rotate: useTransform(scrollYProgress, [0, 1], [0, -360]),
            scale: useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 1.2])
          }}
        >
          <Blob2 />
        </motion.div>

        {/* Optional: Add more blobs for better effect */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh]"
          style={{
            rotate: useTransform(scrollYProgress, [0, 1], [0, 180]),
            scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]),
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.5, 0.3])
          }}
        >
          <Blob1 />
        </motion.div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center px-4"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
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
                className="text-green-300"
              />
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Revolutionizing farming through technology and direct market access
            </p>
            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAccountTypeModal(true)}
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
        </section>

        {/* Features Section - Increased height and spacing */}
        <section className="min-h-screen py-32 px-4 bg-white/10 backdrop-blur-sm flex items-center">
          <div className="max-w-7xl mx-auto w-full">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-center mb-24"
            >
              <span className="bg-gradient-to-r from-white via-green-300 to-white text-transparent bg-clip-text animate-gradient">
                Why Choose Swastik?
              </span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className={`p-8 rounded-xl bg-gradient-to-br ${feature.color} text-white/90 backdrop-blur-md shadow-xl border border-white/20`}
                >
                  <feature.icon className="text-5xl mb-6" />
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-base opacity-90 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section - Increased height and spacing */}
        <section className="min-h-screen py-32 bg-[rgba(0,0,0,0.3)] backdrop-blur-md flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {[
                { number: 10000, label: "Farmers", prefix: "", suffix: "+" },
                { number: 50, label: "Trading Volume", prefix: "₹", suffix: "M+" },
                { number: 100, label: "Markets Connected", prefix: "", suffix: "+" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.8 }}
                  className="p-12 rounded-2xl bg-black/30 border border-white/10 text-center transform hover:scale-105 transition-transform shadow-xl"
                >
                  <h3 className="text-6xl font-bold text-white mb-4">
                    <NumberTicker 
                      value={stat.number} 
                      prefix={stat.prefix} 
                      suffix={stat.suffix}
                    />
                  </h3>
                  <p className="text-xl text-white/90 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Account Type Modal */}
      <AccountTypeModal 
        isOpen={showAccountTypeModal} 
        onClose={() => setShowAccountTypeModal(false)} 
      />
    </div>
  );
};

export default HomePage;
