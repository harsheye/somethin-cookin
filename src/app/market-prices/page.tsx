'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaChartLine, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface MarketPrice {
  id: string;
  commodity: string;
  market: string;
  location: string;
  price: number;
  unit: string;
  date: string;
  trend: 'up' | 'down' | 'stable';
  changePercentage: number;
}

const MarketPricesPage = () => {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const locations = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata'];
  const commodities = ['Wheat', 'Rice', 'Corn', 'Soybeans', 'Cotton'];

  useEffect(() => {
    fetchMarketPrices();
  }, [searchTerm, selectedLocation, selectedCommodity]);

  const fetchMarketPrices = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5009/api/market-prices?` +
        `search=${searchTerm}&` +
        `location=${selectedLocation}&` +
        `commodity=${selectedCommodity}`
      );

      if (!response.ok) throw new Error('Failed to fetch market prices');

      const data = await response.json();
      setPrices(data);
    } catch (error) {
      toast.error('Failed to load market prices');
    } finally {
      setLoading(false);
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-500';
      case 'down': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Live Market Prices
          </h1>
          <p className="text-gray-600">
            Real-time agricultural commodity prices across major markets
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search commodities..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>

              <select
                value={selectedCommodity}
                onChange={(e) => setSelectedCommodity(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Commodities</option>
                {commodities.map(commodity => (
                  <option key={commodity} value={commodity}>{commodity}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Prices Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-40 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prices.map(price => (
              <motion.div
                key={price.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {price.commodity}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaMapMarkerAlt className="mr-1" />
                      <span>{price.market}, {price.location}</span>
                    </div>
                  </div>
                  <div className={`flex items-center ${getTrendColor(price.trend)}`}>
                    <FaChartLine className="mr-1" />
                    <span>{price.changePercentage}%</span>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-3xl font-bold text-green-600">
                      ₹{price.price}
                    </span>
                    <span className="text-gray-500 text-sm">/{price.unit}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(price.date).toLocaleDateString()}
                  </div>
                </div>

                {/* Price History Chart would go here */}
                <div className="mt-4 h-20 bg-gray-50 rounded-lg">
                  {/* Add chart component here */}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketPricesPage; 