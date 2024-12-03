'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBox, FaChartLine, FaShoppingCart, FaUsers, 
  FaBell, FaSeedling, FaMoneyBillWave, FaClipboardList,
  FaPlus, FaFilter, FaSort, FaSearch, FaExchangeAlt
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import AddProductModal from '@/components/modals/AddProductModal';
import CreateTradeModal from '@/components/modals/CreateTradeModal';

// Dynamically import charts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  recentOrders: Array<{
    id: string;
    customerName: string;
    amount: number;
    status: string;
    date: string;
  }>;
  salesData: {
    dates: string[];
    values: number[];
  };
}

const FarmerDashboard = () => {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showCreateTrade, setShowCreateTrade] = useState(false);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token || userRole !== 'farmer') {
      toast.error('Access denied');
      router.push('/auth/farmer/login');
      return;
    }

    // Verify access with backend
    const verifyAccess = async () => {
      try {
        const response = await fetch('http://localhost:5009/api/farmer/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Access denied');
        }
      } catch (error) {
        toast.error('Access denied');
        router.push('/auth/farmer/login');
      }
    };

    verifyAccess();

    // Connect to WebSocket
    ws.current = new WebSocket('ws://localhost:8080');

    ws.current.onopen = () => {
      setWsConnected(true);
      toast.success('Connected to real-time updates');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleRealtimeUpdate(data);
    };

    ws.current.onerror = () => {
      toast.error('Real-time connection failed');
    };

    // Fetch initial dashboard data
    fetchDashboardData();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch('http://localhost:5009/api/farmer/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch dashboard data');

      const data = await response.json();
      setStats(data);
    } catch (error) {
      // Silent error - just keep existing stats
    } finally {
      setLoading(false);
    }
  };

  const handleRealtimeUpdate = (data: any) => {
    switch (data.type) {
      case 'new_order':
        toast.success('New order received!');
        fetchDashboardData(); // Refresh data silently
        break;
      case 'price_update':
        toast.success(`Price update: ${data.message}`); // Changed from info to success
        break;
    }
  };

  const chartOptions = {
    chart: {
      type: 'area',
      toolbar: {
        show: false
      }
    },
    colors: ['#10B981'],
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: stats?.salesData.dates || [],
      labels: {
        style: {
          colors: '#64748B'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748B'
        },
        formatter: (value: number) => `₹${value}`
      }
    }
  };

  const chartSeries = [
    {
      name: 'Sales',
      data: stats?.salesData.values || []
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Farmer Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your farm's overview</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddProduct(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            <FaPlus className="inline mr-2" /> Add Product
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateTrade(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            <FaExchangeAlt className="inline mr-2" /> Create Trade
          </motion.button>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            whileHover={{ y: -5 }}
            onClick={() => router.push('/farmer/products')}
            className="bg-white p-6 rounded-lg shadow-sm cursor-pointer"
          >
            <FaBox className="text-3xl text-green-500 mb-2" />
            <h3 className="font-semibold">My Products</h3>
            <p className="text-sm text-gray-500">Manage your product listings</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            onClick={() => router.push('/farmer/orders')}
            className="bg-white p-6 rounded-lg shadow-sm cursor-pointer"
          >
            <FaClipboardList className="text-3xl text-blue-500 mb-2" />
            <h3 className="font-semibold">Orders</h3>
            <p className="text-sm text-gray-500">View and manage orders</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            onClick={() => router.push('/farmer/customers')}
            className="bg-white p-6 rounded-lg shadow-sm cursor-pointer"
          >
            <FaUsers className="text-3xl text-purple-500 mb-2" />
            <h3 className="font-semibold">Customers</h3>
            <p className="text-sm text-gray-500">View customer details</p>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: FaBox, label: 'Products', value: stats?.totalProducts || 0, color: 'from-green-400 to-green-600' },
            { icon: FaShoppingCart, label: 'Orders', value: stats?.totalOrders || 0, color: 'from-blue-400 to-blue-600' },
            { icon: FaMoneyBillWave, label: 'Revenue', value: `₹${stats?.totalRevenue || 0}`, color: 'from-purple-400 to-purple-600' },
            { icon: FaUsers, label: 'Customers', value: stats?.totalCustomers || 0, color: 'from-orange-400 to-orange-600' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} p-6 rounded-xl text-white`}
            >
              <div className="flex justify-between items-center">
                <stat.icon className="text-3xl" />
                <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                  +12%
                </span>
              </div>
              <h3 className="text-2xl font-bold mt-4">{stat.value}</h3>
              <p className="text-white/80">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Sales Overview</h2>
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="area"
              height={350}
            />
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
            <div className="space-y-4">
              {stats?.recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 p-6 rounded-xl"
                  >
                    <FaClipboardList className="text-3xl text-gray-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-700 mb-1">No Orders Yet</h3>
                    <p className="text-sm text-gray-500">Orders will appear here once received</p>
                  </motion.div>
                </div>
              ) : (
                stats?.recentOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-gray-500">₹{order.amount}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        <AddProductModal 
          isOpen={showAddProduct} 
          onClose={() => setShowAddProduct(false)} 
        />
        <CreateTradeModal 
          isOpen={showCreateTrade} 
          onClose={() => setShowCreateTrade(false)} 
        />
      </div>
    </div>
  );
};

export default FarmerDashboard;
