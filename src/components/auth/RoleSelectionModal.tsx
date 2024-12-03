'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaCheck, FaTimes, FaTractor, FaArrowRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const customerFeatures = [
  'Browse fresh products',
  'Direct farmer connect',
  'Secure payments',
  'Order tracking',
  'Multiple addresses'
];

const farmerFeatures = [
  'Sell your products',
  'Manage inventory',
  'Track earnings',
  'Customer insights',
  'Business analytics'
];

export default function RoleSelectionModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside both the modal and any parent components
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      // Use capture phase to handle clicks before they reach other handlers
      document.addEventListener('mousedown', handleClickOutside, true);
      document.addEventListener('keydown', handleEscape, true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('keydown', handleEscape, true);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Render modal in a portal to avoid nesting issues
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center z-[9999]"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ 
              scale: 0.9, 
              opacity: 0, 
              y: 100,
              transition: { duration: 0.2 }
            }}
            transition={{ 
              type: "spring",
              damping: 15,
              stiffness: 300,
              duration: 0.4
            }}
            className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl relative mt-[15vh]"
          >
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-6 right-6 z-50 p-2 rounded-full hover:bg-gray-100 transition-colors group"
            >
              <FaTimes className="text-gray-500 text-xl group-hover:text-gray-700 transition-colors" />
            </motion.button>

            <div className="px-8 py-10">
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8"
              >
                Choose Account Type
              </motion.h2>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/auth/customer/signup')}
                  className="group relative bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100 cursor-pointer hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-center h-20 w-20 bg-green-500 rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <FaUser className="text-3xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-center text-green-800 mb-4">
                    Customer
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    Buy fresh products directly from farmers
                  </p>
                  <ul className="space-y-3">
                    {customerFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-gray-600">
                        <FaCheck className="text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaArrowRight className="text-green-500" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/auth/farmer/signup')}
                  className="group relative bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl border border-emerald-100 cursor-pointer hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-center h-16 w-16 md:h-20 md:w-20 bg-emerald-500 rounded-2xl mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                    <FaTractor className="text-2xl md:text-3xl text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-center text-emerald-800 mb-3 md:mb-4">
                    Farmer
                  </h3>
                  <p className="text-gray-600 text-center text-sm md:text-base mb-4 md:mb-6">
                    Sell your products directly to customers
                  </p>
                  <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
                    {farmerFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 md:gap-3 text-gray-600">
                        <FaCheck className="text-emerald-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaArrowRight className="text-emerald-500" />
                  </div>
                </motion.div>
              </div>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center text-sm text-gray-500 mt-8"
              >
                By signing up, you agree to our Terms of Service and Privacy Policy
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}