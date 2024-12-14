'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, FaEnvelope, FaLock, FaPhone, 
  FaMapMarkerAlt, FaArrowRight, FaArrowLeft,
  FaShoppingBasket, FaLeaf, FaHeart, FaSeedling,
  FaCheck, FaShieldAlt, FaInfoCircle
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import FloatingHeader from '@/components/FloatingHeader';

type TabType = 'account' | 'password' | 'personal' | 'address';

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  mobileNo: string;
  name: string;
  pincode: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}

const tabs: { id: TabType; label: string; icon: any }[] = [
  { id: 'account', label: 'Account Setup', icon: FaEnvelope },
  { id: 'password', label: 'Set Password', icon: FaLock },
  { id: 'personal', label: 'Personal Info', icon: FaUser },
  { id: 'address', label: 'Address', icon: FaMapMarkerAlt }
];

const floatingIcons = [FaShoppingBasket, FaLeaf, FaHeart, FaSeedling];

// Add a type for progress data
interface SignupProgress {
  currentTab: TabType;
  formData: FormData;
}

export default function CustomerSignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('account');
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    mobileNo: '',
    name: '',
    pincode: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    }
  });

  // Load saved progress on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('signupProgress');
    if (savedProgress) {
      const progress: SignupProgress = JSON.parse(savedProgress);
      setActiveTab(progress.currentTab);
      setFormData(progress.formData);
    }
  }, []);

  // Save progress whenever important states change
  useEffect(() => {
    const progress: SignupProgress = {
      currentTab: activeTab,
      formData,
    };
    localStorage.setItem('signupProgress', JSON.stringify(progress));
  }, [activeTab, formData]);

  const handleNextTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const handlePreviousTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'account') {
      if (!formData.email) {
        toast.error('Please enter your email address');
        return;
      }
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Please enter a valid email address');
        return;
      }
      handleNextTab();
      return;
    }

    // Validate current tab
    if (activeTab === 'password') {
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      if (formData.password.length < 8) {
        toast.error('Password must be at least 8 characters long');
        return;
      }
      handleNextTab();
      return;
    }

    if (activeTab === 'personal') {
      if (!formData.name || !formData.mobileNo) {
        toast.error('Please fill in all personal details');
        return;
      }
      handleNextTab();
      return;
    }

    // On address tab, submit the form
    if (activeTab === 'address') {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5009/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.email.split('@')[0],
            password: formData.password,
            email: formData.email,
            mobileNo: formData.mobileNo,
            name: formData.name,
            pincode: formData.pincode,
            userRole: 'customer',
            address: formData.address
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Registration failed');
        }

        toast.success(
          <div className="flex flex-col">
            <span className="font-medium">Welcome to Swastik!</span>
            <span className="text-sm">Your farming journey begins now</span>
            <span className="text-sm mt-1">Redirecting to login in <span className="font-bold">3</span> seconds...</span>
          </div>,
          {
            id: 'registration',
            duration: 3000,
            icon: <FaSeedling className="text-green-600 text-xl" />
          }
        );

        // Clear saved progress
        clearSavedProgress();

        // Create a visual countdown
        let count = 3;
        const countdownInterval = setInterval(() => {
          count--;
          const toastElement = document.querySelector('[data-id="registration"]');
          if (toastElement) {
            const countElement = toastElement.querySelector('.mt-1 .font-bold');
            if (countElement) {
              countElement.textContent = count.toString();
            }
          }
          if (count === 0) {
            clearInterval(countdownInterval);
          }
        }, 1000);

        // Wait for 3 seconds before redirecting
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Redirect to login
        router.push('/auth/farmer/login');
      } catch (error) {
        toast.error('Registration failed');
      } finally {
        setLoading(false);
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <motion.div
            key="account"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </motion.div>
        );

      case 'password':
        return (
          <motion.div
            key="password"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            className="space-y-4"
          >
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Password"
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                required
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm Password"
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                required
              />
            </div>
          </motion.div>
        );

      case 'personal':
        return (
          <motion.div
            key="personal"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            className="space-y-4"
          >
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full Name"
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                required
              />
            </div>

            <div className="relative">
              <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={formData.mobileNo}
                onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                placeholder="Mobile Number"
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                required
              />
            </div>
          </motion.div>
        );

      case 'address':
        return (
          <motion.div
            key="address"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            className="space-y-4"
          >
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                placeholder="Pincode"
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                required
              />
            </div>

            <div className="relative">
              <input
                type="text"
                value={formData.address.street}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  address: { ...formData.address, street: e.target.value }
                })}
                placeholder="Street Address"
                className="w-full pl-4 pr-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.address.city}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  address: { ...formData.address, city: e.target.value }
                })}
                placeholder="City"
                className="w-full pl-4 pr-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                required
              />
              <input
                type="text"
                value={formData.address.state}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  address: { ...formData.address, state: e.target.value }
                })}
                placeholder="State"
                className="w-full pl-4 pr-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.address.country}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  address: { ...formData.address, country: e.target.value }
                })}
                placeholder="Country"
                className="w-full pl-4 pr-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                required
              />
              <input
                type="text"
                value={formData.address.zipCode}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  address: { ...formData.address, zipCode: e.target.value }
                })}
                placeholder="ZIP Code"
                className="w-full pl-4 pr-4 py-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                required
              />
            </div>
          </motion.div>
        );
    }
  };

  const getButtonText = () => {
    if (loading) {
      return <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />;
    }

    if (activeTab === 'account') {
      return (
        <>
          Next Step <FaArrowRight />
        </>
      );
    }

    if (activeTab === 'address') {
      return (
        <>
          Complete Registration <FaArrowRight className="text-sm" />
        </>
      );
    }

    return (
      <>
        Continue <FaArrowRight className="text-sm" />
      </>
    );
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <FloatingHeader />
      </div>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4 relative overflow-hidden pt-16">
        {/* Animated Background Elements */}
        {floatingIcons.map((Icon, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1],
              x: ['0vw', `${(index % 2 ? 10 : -10)}vw`, '0vw'],
              y: ['0vh', `${(index % 2 ? 10 : -10)}vh`, '0vh']
            }}
            transition={{
              duration: 10 + index * 2,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut'
            }}
            className="absolute text-green-200 text-6xl"
            style={{
              left: `${20 + index * 20}%`,
              top: `${20 + index * 15}%`,
              zIndex: 0
            }}
          >
            <Icon />
          </motion.div>
        ))}

        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-6xl bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden relative z-10"
        >
          <div className="grid grid-cols-12">
            {/* Left Side - Tabs */}
            <div className="col-span-3 bg-gray-50 p-6 border-r border-gray-200">
              <div className="space-y-2">
                {tabs.map((tab, index) => (
                  <motion.div
                    key={tab.id}
                    className={`p-4 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
                      activeTab === tab.id 
                        ? 'bg-green-500 text-white shadow-lg'
                        : index < tabs.findIndex(t => t.id === activeTab)
                        ? 'bg-green-100 text-green-600'
                        : 'hover:bg-gray-100 text-gray-500'
                    }`}
                    onClick={() => {
                      // Only allow going back or to verified steps
                      const currentIndex = tabs.findIndex(t => t.id === activeTab);
                      const clickedIndex = tabs.findIndex(t => t.id === tab.id);
                      if (clickedIndex <= currentIndex) {
                        setActiveTab(tab.id);
                      }
                    }}
                  >
                    <div className="relative">
                      <tab.icon className="text-xl" />
                      {index < tabs.findIndex(t => t.id === activeTab) && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <FaCheck className="text-white text-xs" />
                        </div>
                      )}
                    </div>
                    <span className="font-medium">{tab.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Side - Form Content */}
            <div className="col-span-9 p-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <Image
                  src="/swastik-logo.png"
                  alt="Swastik"
                  width={150}
                  height={40}
                  className="mb-6"
                />
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                    {activeTab === 'account' && 'Enter Your Email'}
                    {activeTab === 'password' && 'Secure Your Account'}
                    {activeTab === 'personal' && 'Tell Us About Yourself'}
                    {activeTab === 'address' && 'Where Should We Deliver?'}
                  </h1>
                  <p className="text-gray-600">
                    {activeTab === 'account' && 'Please provide your email address'}
                    {activeTab === 'password' && 'Choose a strong password'}
                    {activeTab === 'personal' && 'Help us personalize your experience'}
                    {activeTab === 'address' && 'Enter your delivery address'}
                  </p>
                </motion.div>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  {renderTabContent()}
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-end gap-4">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    className={`px-8 py-3 rounded-lg flex items-center justify-center gap-2 ${
                      loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {getButtonText()}
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
