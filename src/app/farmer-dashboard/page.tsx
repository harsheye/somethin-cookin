'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FaBox, FaChartLine, FaShoppingCart, FaUsers, 
  FaBell, FaSeedling, FaMoneyBillWave, FaClipboardList,
  FaPlus, FaExchangeAlt
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
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
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showCreateTrade, setShowCreateTrade] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/farmer/login');
      return;
    }

    // Connect to WebSocket for real-time updates
    ws.current = new WebSocket('ws://localhost:8080');
    
    ws.current.onopen = () => {
      console.log('WebSocket Connected');
      toast.success('Connected to real-time updates');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleRealtimeUpdate(data);
    };

    fetchDashboardData();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5009/api/farmer/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch dashboard data');

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRealtimeUpdate = (data: any) => {
    switch (data.type) {
      case 'new_order':
        toast.success('New order received!');
        fetchDashboardData();
        break;
      case 'price_update':
        toast.info(`Price update: ${data.message}`);
        break;
    }
  };

  const quickLinks = [
    {
      title: 'Products',
      description: 'View and manage all products',
      icon: FaBox,
      color: 'from-green-400 to-green-600',
      link: '/farmer/products',
      value: stats?.totalProducts || 0,
      trend: '+12%'
    },
    {
      title: 'Orders',
      description: 'Track and manage orders',
      icon: FaShoppingCart,
      color: 'from-blue-400 to-blue-600',
      link: '/farmer/orders',
      value: stats?.totalOrders || 0,
      trend: '+8%'
    },
    {
      title: 'Revenue',
      description: 'Financial overview',
      icon: FaMoneyBillWave,
      color: 'from-purple-400 to-purple-600',
      link: '/farmer/revenue',
      value: `₹${stats?.totalRevenue || 0}`,
      trend: '+15%'
    },
    {
      title: 'Customers',
      description: 'Customer management',
      icon: FaUsers,
      color: 'from-orange-400 to-orange-600',
      link: '/farmer/customers',
      value: stats?.totalCustomers || 0,
      trend: '+5%'
    }
  ];

  const chartOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false }
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
      categories: stats?.salesData?.dates || [],
      labels: {
        style: { colors: '#64748B' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#64748B' },
        formatter: (value: number) => `₹${value}`
      }
    }
  };

  const chartSeries = [{
    name: 'Sales',
    data: stats?.salesData?.values || []
  }];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-lg h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Links / Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickLinks.map((link, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => router.push(link.link)}
              className={`bg-gradient-to-br ${link.color} p-6 rounded-xl text-white cursor-pointer transform transition-all duration-300 shadow-sm hover:shadow-xl`}
            >
              <div className="flex justify-between items-center">
                <link.icon className="text-3xl" />
                <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                  {link.trend}
                </span>
              </div>
              <h3 className="text-2xl font-bold mt-4">{link.value}</h3>
              <p className="text-white/80">{link.title}</p>
              <p className="text-sm text-white/60 mt-1">{link.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddProduct(true)}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <FaPlus className="inline mr-2" /> Add Product
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateTrade(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <FaExchangeAlt className="inline mr-2" /> Create Trade
          </motion.button>
        </div>

        {/* Charts and Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Sales Overview</h2>
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="area"
              height={350}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
            <div className="space-y-4">
              {stats?.recentOrders?.length === 0 ? (
                <div className="text-center py-8">
                  <FaClipboardList className="text-3xl text-gray-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-700 mb-1">No Orders Yet</h3>
                  <p className="text-sm text-gray-500">Orders will appear here once received</p>
                </div>
              ) : (
                stats?.recentOrders?.map(order => (
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
