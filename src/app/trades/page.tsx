'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  FaLeaf, FaMapMarkerAlt, FaClock, 
  FaFilter, FaSearch, FaPlus, FaUser
} from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

interface Trade {
  id: string;
  cropName: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  location: string;
  status: 'open' | 'pending' | 'closed';
  createdAt: string;
  description: string;
  currentBid?: number;
  totalBids: number;
  farmer: {
    id: string;
    name: string;
    rating: number;
  };
}

const notificationQueue = new Set();

const TradesPage = () => {
  const router = useRouter();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'all' | 'my-trades'>('all');
  const [userRole, setUserRole] = useState<'farmer' | 'buyer' | null>(null);

  useEffect(() => {
    checkUserRole();
    fetchTrades();
  }, [viewMode]);

  const checkUserRole = () => {
    // Get user role from token or localStorage
    const role = localStorage.getItem('userRole');
    setUserRole(role as 'farmer' | 'buyer' | null);
  };

  const fetchTrades = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const endpoint = viewMode === 'my-trades' 
        ? 'http://localhost:5009/api/farmer/trades'
        : 'http://localhost:5009/api/trades';

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch trades');

      const data = await response.json();
      setTrades(data);
    } catch (error) {
      showNotification('Failed to load trades');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string) => {
    if (notificationQueue.has(message)) return;
    
    notificationQueue.add(message);
    toast(message, {
      duration: 3000,
      onClose: () => {
        notificationQueue.delete(message);
      }
    });
  };

  const filteredTrades = trades.filter(trade => {
    const matchesSearch = trade.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trade.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || trade.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || trade.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {viewMode === 'my-trades' ? 'My Trades' : 'All Trades'}
              </h1>
              {userRole === 'farmer' && (
                <div className="mt-2 space-x-4">
                  <button
                    onClick={() => setViewMode('all')}
                    className={`text-sm ${viewMode === 'all' ? 'text-green-600 font-medium' : 'text-gray-500'}`}
                  >
                    All Trades
                  </button>
                  <button
                    onClick={() => setViewMode('my-trades')}
                    className={`text-sm ${viewMode === 'my-trades' ? 'text-green-600 font-medium' : 'text-gray-500'}`}
                  >
                    My Trades
                  </button>
                </div>
              )}
            </div>
            {userRole === 'farmer' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/trades/create')}
                className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600"
              >
                <FaPlus />
                Create Trade
              </motion.button>
            )}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search trades..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <FaLeaf className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Categories</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="grains">Grains</option>
                  {/* Add more categories as needed */}
                </select>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Trades Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-lg p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTrades.length === 0 ? (
            <div className="text-center py-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-xl shadow-sm inline-block"
              >
                <FaLeaf className="text-4xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Trades Found</h3>
                <p className="text-gray-500">
                  {searchTerm || selectedStatus !== 'all' || selectedCategory !== 'all'
                    ? "Try adjusting your search or filters"
                    : viewMode === 'my-trades'
                    ? "Create your first trade to get started"
                    : "No active trades at the moment"}
                </p>
              </motion.div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrades.map(trade => (
                <motion.div
                  key={trade.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  onClick={() => router.push(`/trades/${trade.id}`)}
                  className="bg-white rounded-lg shadow-sm p-6 cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {trade.cropName}
                      </h3>
                      <p className="text-sm text-gray-500">{trade.category}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      trade.status === 'open' 
                        ? 'bg-green-100 text-green-800'
                        : trade.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {trade.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-green-500" />
                      <span>{trade.farmer.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-green-500" />
                      <span>{trade.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-green-500" />
                      <span>{new Date(trade.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-500">Current Bid</p>
                      <p className="text-xl font-bold text-green-600">
                        ₹{trade.currentBid || trade.price}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Bids</p>
                      <p className="font-semibold">{trade.totalBids}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TradesPage; 