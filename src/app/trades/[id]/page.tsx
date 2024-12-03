'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  FaLeaf, FaMapMarkerAlt, FaCalendar, FaUser, 
  FaStar, FaPhone, FaEnvelope, FaCheck, FaTimes,
  FaHistory, FaChartLine
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface Trade {
  id: string;
  cropName: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  location: string;
  description: string;
  harvestDate: string;
  expiryDate: string;
  status: 'open' | 'closed' | 'pending';
  createdAt: string;
  farmer: {
    id: string;
    name: string;
    rating: number;
    totalTrades: number;
    successfulTrades: number;
    phone: string;
    email: string;
    location: string;
    joinedDate: string;
  };
  priceHistory: Array<{
    date: string;
    price: number;
  }>;
}

const TradeDetailsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [trade, setTrade] = useState<Trade | null>(null);
  const [loading, setLoading] = useState(true);
  const [isResponding, setIsResponding] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    fetchTradeDetails();
  }, [params.id]);

  const fetchTradeDetails = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:5009/api/trades/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch trade details');

      const data = await response.json();
      setTrade(data);
    } catch (error) {
      toast.error('Failed to load trade details');
      router.push('/trades');
    } finally {
      setLoading(false);
    }
  };

  const handleRespondToTrade = async () => {
    try {
      setIsResponding(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:5009/api/trades/${params.id}/respond`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to respond to trade');

      toast.success('Response sent successfully');
      fetchTradeDetails(); // Refresh trade details
    } catch (error) {
      toast.error('Failed to respond to trade');
    } finally {
      setIsResponding(false);
    }
  };

  if (loading || !trade) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trade Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{trade.cropName}</h1>
              <div className="flex items-center text-gray-500 gap-4">
                <span className="flex items-center gap-1">
                  <FaLeaf className="text-green-500" />
                  {trade.category}
                </span>
                <span className="flex items-center gap-1">
                  <FaMapMarkerAlt className="text-green-500" />
                  {trade.location}
                </span>
                <span className="flex items-center gap-1">
                  <FaCalendar className="text-green-500" />
                  {new Date(trade.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              trade.status === 'open' 
                ? 'bg-green-100 text-green-800'
                : trade.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {trade.status}
            </span>
          </div>

          {/* Trade Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Trade Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium">{trade.quantity} {trade.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per {trade.unit}</span>
                  <span className="font-medium">₹{trade.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Value</span>
                  <span className="font-medium">₹{trade.price * trade.quantity}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Important Dates</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Harvest Date</span>
                  <span className="font-medium">{new Date(trade.harvestDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expiry Date</span>
                  <span className="font-medium">{new Date(trade.expiryDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600">{trade.description}</p>
          </div>
        </div>

        {/* Farmer Details */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Farmer Information</h2>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FaUser className="text-green-500" />
                <span className="font-medium">{trade.farmer.name}</span>
                {trade.farmer.rating >= 4.5 && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <FaCheck /> Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < Math.floor(trade.farmer.rating) ? 'text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  ({trade.farmer.rating} • {trade.farmer.totalTrades} trades)
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt />
                  {trade.farmer.location}
                </p>
                <p className="flex items-center gap-2">
                  <FaHistory />
                  Member since {new Date(trade.farmer.joinedDate).getFullYear()}
                </p>
                {showContact && (
                  <>
                    <p className="flex items-center gap-2">
                      <FaPhone />
                      {trade.farmer.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaEnvelope />
                      {trade.farmer.email}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {!showContact && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowContact(true)}
                  className="w-full bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200"
                >
                  Show Contact
                </motion.button>
              )}
              {trade.status === 'open' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRespondToTrade}
                  disabled={isResponding}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                >
                  {isResponding ? 'Sending...' : 'Respond to Trade'}
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Price History */}
        {trade.priceHistory.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Price History</h2>
              <div className="flex items-center text-sm text-gray-500">
                <FaChartLine className="mr-1" />
                Last {trade.priceHistory.length} updates
              </div>
            </div>
            <div className="space-y-3">
              {trade.priceHistory.map((record, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {new Date(record.date).toLocaleDateString()}
                  </span>
                  <span className={`font-medium ${
                    index > 0 && record.price > trade.priceHistory[index - 1].price
                      ? 'text-green-600'
                      : index > 0 && record.price < trade.priceHistory[index - 1].price
                      ? 'text-red-600'
                      : 'text-gray-900'
                  }`}>
                    ₹{record.price}/{trade.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeDetailsPage; 