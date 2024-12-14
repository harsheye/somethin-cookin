'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaChartLine, FaExchangeAlt, FaCheckCircle, 
  FaClock, FaRupeeSign, FaCalendarAlt 
} from 'react-icons/fa';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

interface TradeStats {
  totalTrades: number;
  completedTrades: number;
  pendingTrades: number;
  totalValue: number;
  averagePrice: number;
  priceHistory: Array<{
    date: string;
    price: number;
  }>;
  monthlyVolume: Array<{
    month: string;
    volume: number;
  }>;
}

interface TradeStatisticsProps {
  stats: TradeStats;
}

const TradeStatistics: React.FC<TradeStatisticsProps> = ({ stats }) => {
  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaExchangeAlt className="text-blue-600 text-xl" />
            </div>
            <span className="text-sm text-gray-500">Total Trades</span>
          </div>
          <h3 className="text-3xl font-bold">{stats.totalTrades}</h3>
          <div className="mt-2 text-sm text-gray-600">
            {stats.completedTrades} completed
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FaRupeeSign className="text-green-600 text-xl" />
            </div>
            <span className="text-sm text-gray-500">Total Value</span>
          </div>
          <h3 className="text-3xl font-bold">₹{stats.totalValue.toLocaleString()}</h3>
          <div className="mt-2 text-sm text-gray-600">
            Avg. ₹{stats.averagePrice} per trade
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FaClock className="text-yellow-600 text-xl" />
            </div>
            <span className="text-sm text-gray-500">Pending</span>
          </div>
          <h3 className="text-3xl font-bold">{stats.pendingTrades}</h3>
          <div className="mt-2 text-sm text-gray-600">
            Awaiting completion
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price History Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Price History</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.priceHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Monthly Volume Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Monthly Trading Volume</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyVolume}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TradeStatistics; 