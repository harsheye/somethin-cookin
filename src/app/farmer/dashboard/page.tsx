'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaBars, FaTimes, FaPlus } from 'react-icons/fa';
import AddProductModal from '@/components/AddProductModal';
import ProductsList from '@/components/ProductsList';
import OrdersList from '@/components/OrdersList';
import { getFarmerProducts, getFarmerOrders } from '@/lib/api';
import MandiPrice from '@/components/MandiPrice';
import AIAssistant from '@/components/AIAssistant';

const FarmerDashboard: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/farmer/login');
    } else {
      fetchProducts();
      fetchOrders();
    }
  }, [router]);

  const fetchProducts = async () => {
    const fetchedProducts = await getFarmerProducts();
    setProducts(fetchedProducts);
  };

  const fetchOrders = async () => {
    const fetchedOrders = await getFarmerOrders();
    setOrders(fetchedOrders);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-green-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Image src="/logo.png" alt="Logo" width={50} height={50} />
          <h1 className="ml-4 text-2xl font-bold">Meri Mandi Meraa Kisan</h1>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </header>

      <nav className={`bg-green-500 p-4 ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
        <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <li><a href="/farmer/profile" className="text-white hover:text-green-200">Profile</a></li>
          <li><a href="/farmer/cart" className="text-white hover:text-green-200">Cart</a></li>
          <li><button onClick={() => {
            localStorage.removeItem('token');
            router.push('/');
          }} className="text-white hover:text-green-200">Logout</button></li>
        </ul>
      </nav>

      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          <button
            onClick={() => setIsAddProductModalOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center"
          >
            <FaPlus className="mr-2" /> Add Product
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex mb-4">
            <button
              onClick={() => setActiveTab('products')}
              className={`mr-4 ${activeTab === 'products' ? 'text-green-500 font-semibold' : ''}`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`${activeTab === 'orders' ? 'text-green-500 font-semibold' : ''}`}
            >
              Orders
            </button>
          </div>

          {activeTab === 'products' ? (
            <ProductsList products={products} onProductUpdate={fetchProducts} />
          ) : (
            <OrdersList orders={orders} />
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6 w-full">
          <h2 className="text-2xl font-bold mb-4">Mandi Real-Time Prices</h2>
          <MandiPrice />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 w-full">
          <h2 className="text-2xl font-bold mb-4">AI Assistant</h2>
          <AIAssistant />
        </div>
      </main>
    </div>
  );
};

export default FarmerDashboard;
