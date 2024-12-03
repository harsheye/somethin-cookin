'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, FaPhone, FaMapMarkerAlt, FaPlus, 
  FaEdit, FaTrash, FaStar, FaShoppingBag,
  FaHeart, FaHistory, FaEnvelope, FaIdCard,
  FaShieldAlt, FaUserCircle, FaCalendarAlt
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

const ProfilePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: ''
  });

  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: ''
  });

  useEffect(() => {
    fetchUserData();
    fetchAddresses();
    fetchOrders();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch('http://localhost:5009/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch user data');
      
      const data = await response.json();
      setUserProfile(data);
    } catch (error) {
      // Silent error
    }
  };

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch('http://localhost:5009/api/user/addresses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch addresses');
      
      const data = await response.json();
      setAddresses(data);
    } catch (error) {
      toast.error('Failed to load addresses');
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch('http://localhost:5009/api/user/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch orders');
      
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch('http://localhost:5009/api/user/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newAddress)
      });

      if (!response.ok) throw new Error('Failed to add address');

      toast.success('Address added successfully');
      setShowAddAddress(false);
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to add address');
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:5009/api/user/addresses/${addressId}/default`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to set default address');

      toast.success('Default address updated');
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to update default address');
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:5009/api/user/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete address');

      toast.success('Address deleted successfully');
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8 backdrop-blur-lg bg-opacity-90"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <FaUserCircle className="text-6xl text-white" />
              </div>
              <div className="absolute -bottom-2 right-0 bg-green-500 rounded-full p-2 shadow-lg">
                <FaEdit className="text-white text-sm" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {userProfile?.name || 'Loading...'}
                  </h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <span className="inline-flex items-center gap-2 text-gray-600">
                      <FaEnvelope className="text-green-500" />
                      {userProfile?.email}
                    </span>
                    <span className="inline-flex items-center gap-2 text-gray-600">
                      <FaPhone className="text-green-500" />
                      {userProfile?.phone}
                    </span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-medium shadow-md">
                    {/* Add user role logic here */}
                    {/* For example, you can use userProfile?.role to get the user role */}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <FaShoppingBag className="text-green-500 text-xl mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">
                    {orders?.length || 0}
                  </div>
                  <div className="text-sm text-gray-500">Orders</div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <FaMapMarkerAlt className="text-green-500 text-xl mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">
                    {addresses?.length || 0}
                  </div>
                  <div className="text-sm text-gray-500">Addresses</div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <FaHeart className="text-green-500 text-xl mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">0</div>
                  <div className="text-sm text-gray-500">Wishlist</div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <FaCalendarAlt className="text-green-500 text-xl mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">
                    {/* Calculate days since joined */}
                    {Math.floor((Date.now() - new Date(userProfile?.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24))}
                  </div>
                  <div className="text-sm text-gray-500">Days Active</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 backdrop-blur-lg bg-opacity-90">
          <div className="flex overflow-x-auto">
            {[
              { id: 'profile', icon: FaUser, label: 'Profile' },
              { id: 'addresses', icon: FaMapMarkerAlt, label: 'Addresses' },
              { id: 'orders', icon: FaShoppingBag, label: 'Orders' },
              { id: 'wishlist', icon: FaHeart, label: 'Wishlist' },
              { id: 'settings', icon: FaCog, label: 'Settings' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'text-green-600 border-b-2 border-green-500 bg-green-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className={activeTab === tab.id ? 'text-green-500' : 'text-gray-400'} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div 
          layout
          className="bg-white rounded-2xl shadow-lg p-8 backdrop-blur-lg bg-opacity-90"
        >
          {/* ... Rest of the tab content remains same ... */}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
