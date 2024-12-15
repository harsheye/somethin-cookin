'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaTractor, FaShoppingCart, FaCheck } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface AccountTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccountTypeModal = ({ isOpen, onClose }: AccountTypeModalProps) => {
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

export default AccountTypeModal; 