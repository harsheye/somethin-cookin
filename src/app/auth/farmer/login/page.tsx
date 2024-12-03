'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, FaPhone, FaMapMarkerAlt, FaPlus, 
  FaEdit, FaTrash, FaStar, FaShoppingBag,
  FaHeart, FaHistory
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";

interface Address {
  _id: string;
  name: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
}

interface Order {
  id: string;
  orderId: string;
  items: Array<{
    product: {
      name: string;
      price: number;
    };
    quantity: number;
  }>;
  totalPrice: number;
  status: string;
  createdAt: string;
  address: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface UserProfile {
  _id: string;
  basicDetails: {
    profile: {
      mobileNo: string;
      name: string;
      pincode: string;
    };
    userRole: string;
  };
  addresses: Address[];
}

type TabType = 'profile' | 'addresses' | 'orders' | 'wishlist';

interface DecodedToken {
  userId: string;
  role: string;
  exp: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tokenData, setTokenData] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      router.push('/auth/login');
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setTokenData(decoded);
      fetchProfile(token, decoded.userId);
    } catch (error) {
      console.error('Token decode error:', error);
      toast.error('Invalid session');
      router.push('/auth/login');
    }
  }, [router]);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchProfile = async (token: string, userId: string) => {
    try {
      setLoading(true);
      
      if (!userId) {
        throw new Error('User ID not found');
      }

      const profileResponse = await fetch(`http://localhost:5009/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!profileResponse.ok) {
        const error = await profileResponse.json();
        throw new Error(error.message || 'Failed to fetch profile');
      }

      const profileData = await profileResponse.json();
      console.log('Profile Data:', profileData);
      setProfile(profileData);

      // Fetch addresses
      const addressResponse = await fetch('http://localhost:5009/api/useraddress/address', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (addressResponse.ok) {
        const addressData = await addressResponse.json();
        if (Array.isArray(addressData)) {
          setProfile(prev => prev ? { ...prev, addresses: addressData } : null);
        }
      }

    } catch (error) {
      console.error('Profile fetch error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5009/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch orders');

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    }
  };

  const handleAddAddress = async (addressData: Omit<Address, '_id'>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5009/api/useraddress/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(addressData)
      });

      if (!response.ok) throw new Error('Failed to add address');

      toast.success('Address added successfully');
      fetchProfile();
      setShowAddAddress(false);
    } catch (error) {
      toast.error('Failed to add address');
    }
  };

  const handleEditAddress = async (addressId: string, addressData: Partial<Address>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5009/api/useraddress/address/${addressId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(addressData)
      });

      if (!response.ok) throw new Error('Failed to update address');

      toast.success('Address updated successfully');
      fetchProfile();
      setEditingAddress(null);
    } catch (error) {
      toast.error('Failed to update address');
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5009/api/useraddress/address/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete address');

      toast.success('Address deleted successfully');
      fetchProfile();
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5009/api/useraddress/address/${addressId}/default`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isDefault: true })
      });

      if (!response.ok) throw new Error('Failed to set default address');

      toast.success('Default address updated');
      fetchProfile();
    } catch (error) {
      toast.error('Failed to set default address');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'addresses', label: 'Addresses', icon: FaMapMarkerAlt },
    { id: 'orders', label: 'Orders', icon: FaShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: FaHeart }
  ];

  const renderProfileInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">User ID</label>
            <p className="font-medium">{tokenData?.userId || 'Loading...'}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Full Name</label>
            <p className="font-medium">{profile?.basicDetails.profile.name || 'Loading...'}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Role</label>
            <p className="font-medium capitalize">{profile?.basicDetails.userRole || 'Loading...'}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">Phone Number</label>
            <p className="font-medium">{profile?.basicDetails.profile.mobileNo || 'Loading...'}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Pincode</label>
            <p className="font-medium">{profile?.basicDetails.profile.pincode || 'Loading...'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-32 bg-white rounded-xl mb-8" />
            <div className="h-64 bg-white rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <FaUser className="text-3xl text-green-600" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile?.basicDetails.profile.name || 'Loading...'}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {profile?.basicDetails.profile.mobileNo || 'Loading...'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    {profile?.basicDetails.userRole || 'Loading...'}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <span className="flex items-center gap-2 text-gray-600">
                  <FaPhone className="text-green-500" />
                  {profile?.basicDetails.profile.mobileNo || 'Loading...'}
                </span>
                <span className="flex items-center gap-2 text-gray-600">
                  <FaMapMarkerAlt className="text-green-500" />
                  {profile?.basicDetails.profile.pincode || 'Loading...'}
                </span>
                <span className="text-sm text-gray-500">
                  User ID: {tokenData?.userId || 'Loading...'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="flex border-b">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'text-green-600 border-b-2 border-green-500 bg-green-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Profile Information</h2>
                  </div>
                  {renderProfileInfo()}
                </motion.div>
              )}

              {activeTab === 'addresses' && (
                <motion.div
                  key="addresses"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Delivery Addresses</h2>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAddAddress(true)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                      <FaPlus className="inline mr-2" /> Add Address
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profile?.addresses?.map((address) => (
                      <motion.div
                        key={address._id}
                        layout
                        className="border rounded-lg p-4 relative"
                      >
                        {address.isDefault && (
                          <span className="absolute top-2 right-2 text-yellow-500">
                            <FaStar />
                          </span>
                        )}
                        <h3 className="font-semibold">{address.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{address.phoneNumber}</p>
                        <p className="text-sm text-gray-600 mt-2">
                          {address.street}, {address.city}, {address.state}, {address.country} - {address.zipCode}
                        </p>
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => setEditingAddress(address)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                          {!address.isDefault && (
                            <button
                              onClick={() => handleSetDefaultAddress(address._id)}
                              className="text-gray-600 hover:text-gray-700"
                            >
                              Set as Default
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Order History</h2>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <FaShoppingBag className="text-4xl text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700">No Orders Yet</h3>
                      <p className="text-gray-500">Your order history will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <motion.div
                          key={order.id}
                          layout
                          className="bg-white rounded-lg shadow-sm p-6"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold">Order #{order.orderId}</h3>
                              <p className="text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>

                          <div className="border-t border-b py-4 mb-4">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between items-center mb-2">
                                <div>
                                  <p className="font-medium">{item.product.name}</p>
                                  <p className="text-sm text-gray-500">
                                    Quantity: {item.quantity}
                                  </p>
                                </div>
                                <p className="font-medium">
                                  ₹{item.product.price * item.quantity}
                                </p>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-gray-500">Delivered to:</p>
                              <p className="text-sm">
                                {order.address.name}, {order.address.street},
                                {order.address.city}, {order.address.state} - {order.address.zipCode}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Total Amount</p>
                              <p className="text-xl font-bold text-green-600">
                                ₹{order.totalPrice}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'wishlist' && (
                <motion.div
                  key="wishlist"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-xl font-bold mb-6">My Wishlist</h2>
                  {/* Wishlist content */}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Address Modals */}
        <AnimatePresence>
          {showAddAddress && (
            <AddressModal
              onClose={() => setShowAddAddress(false)}
              onSubmit={handleAddAddress}
            />
          )}
          {editingAddress && (
            <AddressModal
              address={editingAddress}
              onClose={() => setEditingAddress(null)}
              onSubmit={(data) => handleEditAddress(editingAddress._id, data)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}