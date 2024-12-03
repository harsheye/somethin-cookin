'use client';

import { motion } from 'framer-motion';
import { FaShield, FaUserShield, FaFileContract, FaBalanceScale } from 'react-icons/fa';

export default function TermsOfService() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-green-200/20 to-transparent rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-emerald-200/20 to-transparent rounded-full"
        />
      </div>

      <div className="relative pt-20 pb-12 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <motion.div 
            variants={itemVariants}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-600">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {[
              {
                icon: FaUserShield,
                title: "User Rights",
                description: "Understanding your rights and responsibilities as a user"
              },
              {
                icon: FaFileContract,
                title: "Agreement",
                description: "The terms you agree to by using our service"
              },
              {
                icon: FaBalanceScale,
                title: "Legal Compliance",
                description: "How we comply with laws and regulations"
              },
              {
                icon: FaShield,
                title: "Data Protection",
                description: "How we protect and handle your data"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-2xl p-6 shadow-lg backdrop-blur-lg bg-opacity-90"
              >
                <item.icon className="text-3xl text-green-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={itemVariants}
            className="prose prose-green max-w-none bg-white rounded-2xl p-8 shadow-lg backdrop-blur-lg bg-opacity-90"
          >
            {/* Terms content */}
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2>2. User Account</h2>
            <p>
              When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the security of your account.
            </p>

            {/* Add more sections as needed */}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 