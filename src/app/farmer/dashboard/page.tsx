'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  FaBoxOpen, FaChartLine, FaPlus, FaExchangeAlt,
  FaShoppingCart, FaRobot, FaStore, FaSeedling
} from 'react-icons/fa';
import { getFarmerProducts, getFarmerOrders, getMandiPrices } from '@/lib/api';
import SalesChart from '@/components/SalesChart';
import AIAssistant from '@/components/AIAssistant';
import MandiPrice from '@/components/MandiPrice';
import PageWrapper from '@/components/layouts/PageWrapper';
import MandiPrices from '@/components/MandiPrices';

interface User {
  city?: string;
  state?: string;
  // add other user properties as needed
}

const FarmerDashboard: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [trades, setTrades] = useState([]);
  const [mandiPrices, setMandiPrices] = useState([]);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get token from session storage
        const token = sessionStorage.getItem('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        // Fetch user data from your API
        const response = await fetch('http://localhost:5009/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error appropriately
      }
    };

    fetchUserData();
  }, [router]);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchTrades();
    fetchMandiPrices();
    fetchSalesData();
  }, []);

  const fetchProducts = async () => {
    const fetchedProducts = await getFarmerProducts();
    setProducts(fetchedProducts);
  };

  const fetchOrders = async () => {
    const fetchedOrders = await getFarmerOrders();
    setOrders(fetchedOrders);
  };

  const fetchTrades = async () => {
    try {
      const response = await fetch('http://localhost:5009/api/trades/farmer', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch trades');
      const data = await response.json();
      setTrades(data);
    } catch (error) {
      console.error('Failed to fetch trades:', error);
    }
  };

  const fetchMandiPrices = async () => {
    try {
      const prices = await getMandiPrices();
      setMandiPrices(prices);
    } catch (error) {
      console.error('Failed to fetch mandi prices:', error);
    }
  };

  const fetchSalesData = async () => {
    // Sample data for now
    const sampleData = [
      { date: '2024-01', sales: 4000 },
      { date: '2024-02', sales: 3000 },
      { date: '2024-03', sales: 2000 },
      { date: '2024-04', sales: 2780 },
      { date: '2024-05', sales: 1890 },
      { date: '2024-06', sales: 2390 },
    ];
    setSalesData(sampleData);
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-8">
       

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => router.push('/farmer/products')}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <FaBoxOpen className="text-3xl" />
              <span className="text-lg">Products</span>
            </div>
            <div className="text-3xl font-bold mt-4">{products.length}</div>
            <div className="text-sm mt-2">View All Products →</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => router.push('/farmer/orders')}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <FaShoppingCart className="text-3xl" />
              <span className="text-lg">Orders</span>
            </div>
            <div className="text-3xl font-bold mt-4">{orders.length}</div>
            <div className="text-sm mt-2">View All Orders →</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => router.push('/farmer/trades')}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <FaExchangeAlt className="text-3xl" />
              <span className="text-lg">Trades</span>
            </div>
            <div className="text-3xl font-bold mt-4">{trades.length}</div>
            <div className="text-sm mt-2">View All Trades →</div>
          </motion.div>
        </div>
         {/* Quick Action Buttons */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/farmer/products/add')}
            className="flex-1 bg-green-500 text-white p-4 rounded-lg shadow-md flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
          >
            <FaPlus className="text-xl" />
            <span className="text-lg font-medium">Add New Product</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/farmer/trades/create')}
            className="flex-1 bg-purple-500 text-white p-4 rounded-lg shadow-md flex items-center justify-center gap-2 hover:bg-purple-600 transition-colors"
          >
            <FaSeedling className="text-xl" />
            <span className="text-lg font-medium">Create New Trade</span>
          </motion.button>
        </div>
        {/* Mandi Prices */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FaStore className="mr-2" /> Latest Mandi Prices
          </h2>
          <MandiPrices 
            userDistrict={user?.city} 
            userState={user?.state} 
          />
        </div>

        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">Sales Overview</h2>
          <SalesChart data={salesData} />
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">AI Assistant</h2>
            <AIAssistant />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default FarmerDashboard;
