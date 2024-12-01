'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBox, FaShoppingCart, FaUser, FaPlus } from 'react-icons/fa';
import { getFarmerProfile, getFarmerProducts, getFarmerOrders } from '@/lib/api';
import MandiPrice from '@/components/MandiPrice';
import AIAssistant from '@/components/AIAssistant';
import logoSvg from '../logo.svg';

const FarmerDashboard: React.FC = () => {
  const [farmer, setFarmer] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const farmerData = await getFarmerProfile();
        setFarmer(farmerData);

        const productsData = await getFarmerProducts();
        setProducts(productsData.products);

        const ordersData = await getFarmerOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching farmer data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image src={logoSvg} alt="Swstik Logo" width={40} height={40} />
            <span className="ml-2 text-xl font-semibold text-gray-900">Swstik</span>
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <li><Link href="/marketplace" className="text-gray-600 hover:text-gray-900">Market</Link></li>
              <li><Link href="/farmer-dashboard/profile" className="text-gray-600 hover:text-gray-900">Profile</Link></li>
              <li><Link href="/logout" className="text-gray-600 hover:text-gray-900">Logout</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Welcome to Swstik, {farmer?.name || 'New Farmer'}!</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <Link href="/farmer-dashboard/add-product" className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow">
            <FaPlus className="text-4xl text-green-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Add Product</h2>
            <button className="bg-green-500 text-white px-4 py-2 rounded">Add New Product</button>
          </Link>
          <Link href="/farmer-dashboard/products" className="bg-white rounded-lg shadow-md p-6">
            <FaBox className="text-4xl text-blue-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your Products</h2>
            <p className="text-3xl font-bold">{products.length}</p>
            <p className="text-gray-600">Total Products</p>
            <button className="mt-4 text-blue-500 hover:underline">View All Products</button>
          </Link>
          <Link href="/farmer-dashboard/orders" className="bg-white rounded-lg shadow-md p-6">
            <FaShoppingCart className="text-4xl text-yellow-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your Orders</h2>
            <p className="text-3xl font-bold">{orders.filter(order => order.status === 'completed').length} / {orders.length}</p>
            <p className="text-gray-600">Completed / Total Orders</p>
            <button className="mt-4 text-yellow-500 hover:underline">View All Orders</button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Mandi Real-Time Prices</h2>
            <MandiPrice />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">AI Assistant</h2>
            <AIAssistant />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FarmerDashboard;
