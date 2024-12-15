'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, FaPhone, FaMapMarkerAlt, 
  FaEdit, FaShoppingBag, FaHeart, 
  FaEnvelope, FaUserCircle, FaCalendarAlt,
  FaCog
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import PageWrapper from '@/components/layouts/PageWrapper';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  role: string;
  createdAt?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch('http://localhost:5009/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch profile');
        
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const tabs = [
    { id: 'profile', icon: FaUser, label: 'Profile' },
    { id: 'addresses', icon: FaMapMarkerAlt, label: 'Addresses' },
    { id: 'orders', icon: FaShoppingBag, label: 'Orders' },
    { id: 'wishlist', icon: FaHeart, label: 'Wishlist' },
    { id: 'settings', icon: FaCog, label: 'Settings' }
  ];

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-b from-[rgb(15,28,25)] via-[rgb(20,35,30)] to-[rgb(15,28,25)]">
        <div className="container mx-auto px-4 py-8">
          {/* Decorative Blobs */}
          <div className="fixed top-20 right-20 w-96 h-96 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-green-700/30 to-emerald-600/30 rounded-full blur-3xl" />
          </div>
          <div className="fixed bottom-20 left-20 w-96 h-96 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/30 to-green-700/30 rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-8">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-2 border-white/20 flex items-center justify-center bg-white/5">
                    <FaUserCircle className="text-6xl text-white/80" />
                  </div>
                  <button className="absolute -bottom-2 right-0 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
                    <FaEdit className="text-white/80" />
                  </button>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-white/90 mb-2">
                    {profile?.name || 'Loading...'}
                  </h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-white/60">
                    <span className="flex items-center gap-2">
                      <FaEnvelope /> {profile?.email}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaPhone /> {profile?.phone}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaMapMarkerAlt /> {profile?.city}, {profile?.state}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
              <div className="flex overflow-x-auto">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-all
                      ${activeTab === tab.id 
                        ? 'text-white bg-white/10 border-b-2 border-green-500' 
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <tab.icon />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'profile' && (
                  <div className="text-white/80">
                    {/* Add profile content here */}
                    Profile content coming soon...
                  </div>
                )}
                {/* Add other tab contents similarly */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
