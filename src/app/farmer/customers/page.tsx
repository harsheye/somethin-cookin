'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, FaSearch, FaSort, FaMapMarkerAlt, 
  FaPhone, FaEnvelope, FaShoppingBag, FaChartLine,
  FaRupeeSign, FaCalendar, FaStar 
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  averageOrderValue: number;
  rating: number;
  orderHistory: Array<{
    id: string;
    orderNumber: string;
    date: string;
    amount: number;
    status: string;
    items: Array<{
      name: string;
      quantity: number;
      unit: string;
    }>;
  }>;
}

const CustomersPage = () => {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, [searchTerm, sortBy]);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5009/api/farmer/customers?` +
        `search=${searchTerm}&` +
        `sort=${sortBy}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch customers');

      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="recent">Most Recent</option>
            <option value="orders_high">Most Orders</option>
            <option value="spent_high">Highest Spenders</option>
            <option value="rating_high">Top Rated</option>
          </select>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search customers by name, email, or phone..."
              className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Customers List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-lg p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-xl shadow-sm inline-block"
            >
              <FaUser className="text-4xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Customers Found</h3>
              <p className="text-gray-500">
                {searchTerm ? "Try adjusting your search" : "You haven't received any orders yet"}
              </p>
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customers.map(customer => (
              <motion.div
                key={customer.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCustomer(customer)}
                className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
              >
                {/* Customer Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <FaUser className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{customer.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < Math.floor(customer.rating) ? 'text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                      <span className="text-sm text-gray-500 ml-1">({customer.rating})</span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4 text-sm">
                  <p className="flex items-center gap-2 text-gray-600">
                    <FaEnvelope className="text-gray-400" />
                    {customer.email}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <FaPhone className="text-gray-400" />
                    {customer.phone}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <FaMapMarkerAlt className="text-gray-400" />
                    {customer.address}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="font-semibold flex items-center gap-1">
                      <FaShoppingBag className="text-blue-500" />
                      {customer.totalOrders}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Spent</p>
                    <p className="font-semibold flex items-center gap-1">
                      <FaRupeeSign className="text-green-500" />
                      {customer.totalSpent}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Avg. Order Value</p>
                    <p className="font-semibold flex items-center gap-1">
                      <FaChartLine className="text-purple-500" />
                      ₹{customer.averageOrderValue}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Order</p>
                    <p className="font-semibold flex items-center gap-1">
                      <FaCalendar className="text-orange-500" />
                      {new Date(customer.lastOrderDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Customer Detail Modal */}
        <AnimatePresence>
          {selectedCustomer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedCustomer(null)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              >
                {/* Customer Details */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4">Customer Details</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{selectedCustomer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedCustomer.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{selectedCustomer.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{selectedCustomer.address}</p>
                    </div>
                  </div>
                </div>

                {/* Order History */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Order History</h3>
                  <div className="space-y-4">
                    {selectedCustomer.orderHistory.map(order => (
                      <div
                        key={order.id}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">Order #{order.orderNumber}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.date).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="text-sm text-gray-600">
                              {item.name} × {item.quantity} {item.unit}
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 text-right font-semibold">
                          ₹{order.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CustomersPage; 