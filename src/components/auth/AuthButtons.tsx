'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import RoleSelectionModal from './RoleSelectionModal';

export const AuthButtons = () => {
  const router = useRouter();
  const [showRoleModal, setShowRoleModal] = useState(false);

  return (
    <>
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/auth/farmer/login')}
          className="px-4 py-2 text-green-600 hover:text-green-700"
        >
          Login
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowRoleModal(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Sign Up
        </motion.button>
      </div>

      <AnimatePresence>
        {showRoleModal && (
          <RoleSelectionModal 
            isOpen={showRoleModal} 
            onClose={() => setShowRoleModal(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AuthButtons; 