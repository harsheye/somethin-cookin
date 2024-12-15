// src/app/auth/login/page.tsx

'use client';

import FarmerLoginForm from '@/components/FarmerLoginForm';
import AccountTypeModal from '@/components/modals/AccountTypeModal';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [showAccountTypeModal, setShowAccountTypeModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <FarmerLoginForm />

      <div className="text-center mt-6">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <motion.button
            onClick={() => setShowAccountTypeModal(true)}
            className="text-green-600 hover:text-green-700 font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign up
          </motion.button>
        </p>
      </div>

      <AccountTypeModal 
        isOpen={showAccountTypeModal} 
        onClose={() => setShowAccountTypeModal(false)} 
      />
    </div>
  );
}