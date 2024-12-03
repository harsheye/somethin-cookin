'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  FaUser, FaTachometerAlt, FaBox, 
  FaHistory, FaSignOutAlt 
} from 'react-icons/fa';

interface ProfileMenuProps {
  userRole: string | null;
  onLogout: () => void;
}

export const ProfileMenu = ({ userRole, onLogout }: ProfileMenuProps) => {
  const router = useRouter();

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push('/profile')}
        className="flex items-center space-x-2 text-gray-700 hover:text-green-600"
      >
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <FaUser className="text-green-600" />
        </div>
      </motion.button>

      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
        <button
          onClick={() => router.push('/profile')}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <FaUser className="inline mr-2" /> Profile
        </button>

        {userRole === 'farmer' && (
          <>
            <button
              onClick={() => router.push('/farmer-dashboard')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FaTachometerAlt className="inline mr-2" /> Dashboard
            </button>
            <button
              onClick={() => router.push('/farmer/products')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FaBox className="inline mr-2" /> My Products
            </button>
            <button
              onClick={() => router.push('/farmer/orders')}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FaHistory className="inline mr-2" /> Orders
            </button>
          </>
        )}

        <button
          onClick={onLogout}
          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <FaSignOutAlt className="inline mr-2" /> Logout
        </button>
      </div>
    </div>
  );
}; 