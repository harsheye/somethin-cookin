'use client';

import React, { useState, useEffect } from 'react';
import { getFarmerProducts } from '@/lib/api';
import { Product } from '@/types/Product';
import { FaSort, FaFilter, FaChevronLeft } from 'react-icons/fa';
import Link from 'next/link';

const ITEMS_PER_PAGE = 9;

const FarmerProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, [currentPage, sortBy, sortOrder, categoryFilter]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getFarmerProducts(currentPage, ITEMS_PER_PAGE);
      setProducts(data.products || []);
      setTotalPages(Math.ceil((data.totalCount || 0) / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <Link href="/farmer-dashboard" className="flex items-center text-blue-600 hover:text-blue-800">
          <FaChevronLeft className="mr-2" />
          Back to Dashboard
        </Link>
        <h2 className="text-2xl font-bold">Your Products</h2>
      </div>
      <div className="mb-6 flex flex-wrap justify-between items-center">
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="fruit">Fruits</option>
            <option value="vegetable">Vegetables</option>
            <option value="grain">Grains</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleSort('timestamp')}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            <FaSort className="inline mr-2" /> Date
          </button>
          <button
            onClick={() => handleSort('name')}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            <FaSort className="inline mr-2" /> Name
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-xl">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4" />
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">{product.category}</p>
              <p className="text-green-600 font-bold">${product.price.toFixed(2)}</p>
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

export default FarmerProducts;
