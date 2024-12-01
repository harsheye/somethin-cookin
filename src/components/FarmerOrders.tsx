'use client';

import React, { useState, useEffect } from 'react';
import { getFarmerOrders } from '@/lib/api';
import { FaSort, FaChevronLeft } from 'react-icons/fa';
import Link from 'next/link';

const ITEMS_PER_PAGE = 9;

interface Order {
  _id: string;
  orderId: number;
  status: string;
  totalPrice: number;
  timestamp: string;
  user: {
    basicDetails: {
      profile: {
        name: string;
      }
    }
  };
  products: Array<{
    product: {
      name: string;
    };
    quantity: number;
  }>;
}

const FarmerOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'date' | 'total'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getFarmerOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field: 'date' | 'total') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-200 text-yellow-800';
      case 'processing': return 'bg-blue-200 text-blue-800';
      case 'packed': return 'bg-indigo-200 text-indigo-800';
      case 'shipped': return 'bg-purple-200 text-purple-800';
      case 'delivered': return 'bg-green-200 text-green-800';
      case 'completed': return 'bg-green-300 text-green-900';
      case 'cancelled': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.status.toLowerCase() === statusFilter
  );

  const sortedOrders = filteredOrders.sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc' 
        ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else {
      return sortOrder === 'asc' 
        ? a.totalPrice - b.totalPrice
        : b.totalPrice - a.totalPrice;
    }
  });

  const totalPages = Math.ceil(sortedOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <Link href="/farmer-dashboard" className="flex items-center text-blue-600 hover:text-blue-800">
          <FaChevronLeft className="mr-2" />
          Back to Dashboard
        </Link>
        <h2 className="text-2xl font-bold">Your Orders</h2>
      </div>
      <div className="mb-4 flex justify-between items-center">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="packed">Packed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <div>
          <button onClick={() => handleSort('date')} className="mr-2">
            <FaSort /> Date
          </button>
          <button onClick={() => handleSort('total')}>
            <FaSort /> Total
          </button>
        </div>
      </div>
      {paginatedOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-xl">
              <h3 className="font-semibold text-lg mb-2">Order #{order.orderId}</h3>
              <p className={`inline-block px-2 py-1 rounded-full text-sm font-semibold mb-2 ${getStatusColor(order.status)}`}>
                {order.status}
              </p>
              <p className="text-green-600 font-bold mb-2">Total: ${order.totalPrice.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mb-2">Date: {new Date(order.timestamp).toLocaleDateString()}</p>
              <p className="text-sm">Customer: {order.user.basicDetails.profile.name}</p>
              <div className="mt-2">
                <h4 className="font-semibold text-sm">Products:</h4>
                <ul className="list-disc list-inside">
                  {order.products.slice(0, 3).map((item, index) => (
                    <li key={index} className="text-sm">
                      {item.product.name} - Qty: {item.quantity}
                    </li>
                  ))}
                  {order.products.length > 3 && (
                    <li className="text-sm">
                      ... and {order.products.length - 3} more item(s)
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 flex justify-center">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`mx-1 px-3 py-1 rounded-lg ${
              currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FarmerOrders;
