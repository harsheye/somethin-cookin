'use client';

// ... other imports ...
import AccountTypeModal from '@/components/modals/AccountTypeModal';

const LoginForm = () => {
  // ... other states ...
  const [showAccountTypeModal, setShowAccountTypeModal] = useState(false);

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 w-full max-w-md">
      {/* ... form content ... */}

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
};

export default LoginForm; 