'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaFilter, FaSort, FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface Trade {
  id: string;
  cropName: string;
  quantity: number;
  price: number;
  status: 'in_progress' | 'premier' | 'closed';
  createdAt: string;
}

const TradeManagement = () => {
  const router = useRouter();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedTrades = useMemo(() => {
    return trades
      .filter(trade => 
        (statusFilter === 'all' || trade.status === statusFilter) &&
        trade.cropName.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        const aValue = a[sortField as keyof Trade];
        const bValue = b[sortField as keyof Trade];
        return sortDirection === 'asc' 
          ? (aValue > bValue ? 1 : -1)
          : (aValue < bValue ? 1 : -1);
      });
  }, [trades, searchQuery, statusFilter, sortField, sortDirection]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Trade Management</h1>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/farmer/trades/create')}
            className="bg-green-500 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <FaPlus /> Create Trade
          </motion.button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          {/* ... Filter and search components ... */}
        </div>

        {/* Trade Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ... Trade cards mapping ... */}
        </div>
      </div>
    </div>
  );
};

export default TradeManagement; 