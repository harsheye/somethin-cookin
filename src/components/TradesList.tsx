'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaLeaf, FaMapMarkerAlt, FaClock, FaRupeeSign,
  FaSort, FaFilter, FaSearch, FaChartLine
} from 'react-icons/fa';
import Link from 'next/link';

interface Trade {
  id: string;
  cropName: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  location: string;
  status: 'in_progress' | 'premier' | 'closed';
  createdAt: string;
  farmer: {
    name: string;
    rating: number;
  };
  priceHistory: Array<{
    date: string;
    price: number;
  }>;
}

interface TradesListProps {
  trades: Trade[];
}

const TradesList: React.FC<TradesListProps> = ({ trades: initialTrades }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'price'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    return ['all', ...new Set(initialTrades.map(trade => trade.category))];
  }, [initialTrades]);

  const filteredAndSortedTrades = useMemo(() => {
    return initialTrades
      .filter(trade => {
        const matchesSearch = trade.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            trade.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || trade.status === statusFilter;
        const matchesCategory = selectedCategory === 'all' || trade.category === selectedCategory;
        return matchesSearch && matchesStatus && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          return sortOrder === 'asc' 
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else {
          return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
        }
      });
  }, [initialTrades, searchQuery, statusFilter, selectedCategory, sortBy, sortOrder]);

  return (
    <div className="space-y-6">
      {/* Filters and Search Bar */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trades..."
              className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="in_progress">In Progress</option>
              <option value="premier">Premier</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'price')}
              className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="price">Sort by Price</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <FaSort className={`transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Trades Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredAndSortedTrades.map((trade) => (
            <motion.div
              key={trade.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <Link href={`/trades/${trade.id}`}>
                <div className="p-6">
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      trade.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      trade.status === 'premier' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {trade.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FaChartLine />
                    </motion.button>
                  </div>

                  {/* Trade Info */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {trade.cropName}
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaLeaf className="text-green-500" />
                      <span>{trade.category}</span>
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

                  {/* Price and Quantity */}
                  <div className="mt-4 flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-500">Quantity</p>
                      <p className="font-semibold">
                        {trade.quantity} {trade.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Price per {trade.unit}</p>
                      <p className="text-xl font-bold text-green-600">
                        ₹{trade.price}
                      </p>
                    </div>
                  </div>

                  {/* Farmer Info */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        by {trade.farmer.name}
                      </span>
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400" />
                        <span>{trade.farmer.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredAndSortedTrades.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <FaLeaf className="text-4xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Trades Found</h3>
          <p className="text-gray-500">
            Try adjusting your filters or search criteria
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default TradesList; 