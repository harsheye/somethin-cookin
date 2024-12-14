'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, FaStar, FaMapMarkerAlt, FaCalendarAlt,
  FaPhone, FaEnvelope, FaCheckCircle, FaExchangeAlt,
  FaChartLine
} from 'react-icons/fa';
import Image from 'next/image';

interface FarmerProfileProps {
  farmer: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    totalTrades: number;
    successfulTrades: number;
    phone: string;
    email: string;
    location: string;
    joinedDate: string;
    verified: boolean;
    tradeHistory: {
      completed: number;
      ongoing: number;
      cancelled: number;
    };
    recentActivity: Array<{
      type: 'trade' | 'review' | 'price_update';
      description: string;
      date: string;
    }>;
  };
}

const FarmerProfile: React.FC<FarmerProfileProps> = ({ farmer }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24">
            <Image
              src={farmer.avatar || '/default-avatar.png'}
              alt={farmer.name}
              fill
              className="rounded-full object-cover border-4 border-white"
            />
            {farmer.verified && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                <FaCheckCircle className="text-green-500 text-xl" />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {farmer.name}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center">
                <FaStar className="text-yellow-400 mr-1" />
                <span>{farmer.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-1" />
                <span>{farmer.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 p-6 border-b">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {farmer.totalTrades}
          </div>
          <div className="text-sm text-gray-500">Total Trades</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {farmer.successfulTrades}
          </div>
          <div className="text-sm text-gray-500">Successful</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {((farmer.successfulTrades / farmer.totalTrades) * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-500">Success Rate</div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <FaPhone className="text-gray-400" />
            <span>{farmer.phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-gray-400" />
            <span>{farmer.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-gray-400" />
            <span>Joined {new Date(farmer.joinedDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {farmer.recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50"
            >
              {activity.type === 'trade' && <FaExchangeAlt className="text-blue-500 mt-1" />}
              {activity.type === 'review' && <FaStar className="text-yellow-500 mt-1" />}
              {activity.type === 'price_update' && <FaChartLine className="text-green-500 mt-1" />}
              <div className="flex-1">
                <p className="text-gray-600">{activity.description}</p>
                <p className="text-sm text-gray-400">
                  {new Date(activity.date).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile; 