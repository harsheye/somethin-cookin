'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBox, FaEdit, FaTrash, FaSearch, 
  FaFilter, FaSort, FaPlus 
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import AddProductModal from '@/components/modals/AddProductModal';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  category: string;
  images: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

const FarmerProducts = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const categories = [
    'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Poultry',
    'Organic', 'Seasonal', 'Other'
  ];

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5009/api/farmer/products?` +
        `search=${searchTerm}&` +
        `category=${selectedCategory}&` +
        `sort=${sortBy}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch products');

      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      setProducts([]);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (productId: string, newStatus: 'active' | 'inactive') => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:5009/api/farmer/products/${productId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');

      toast.success('Product status updated');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:5009/api/farmer/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete product');

      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const stats = [
    { title: 'Total Products', value: products.length, icon: FaBox, color: 'bg-green-500' },
    { title: 'Active Products', value: products.filter(p => p.status === 'active').length, icon: FaBox, color: 'bg-blue-500' },
    { title: 'Out of Stock', value: products.filter(p => p.quantity === 0).length, icon: FaBox, color: 'bg-red-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${stat.color} text-white rounded-lg p-6 shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <stat.icon className="text-3xl" />
                <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                  {stat.title}
                </span>
              </div>
              <h3 className="text-2xl font-bold mt-4">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
          <Link
            href="/farmer/products/add"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <FaPlus /> Add New Product
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_high">Price: High to Low</option>
              <option value="price_low">Price: Low to High</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-xl shadow-sm inline-block"
            >
              <FaBox className="text-4xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedCategory 
                  ? "Try adjusting your search or filters"
                  : "Start by adding your first product"}
              </p>
              {(searchTerm || selectedCategory) ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                  }}
                  className="text-green-500 hover:text-green-600"
                >
                  Clear Filters
                </motion.button>
              ) : (
                <Link
                  href="/farmer/products/add"
                  className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Add Product
                </Link>
              )}
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="relative h-48">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setEditingProduct(product)}
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all"
                    >
                      <FaEdit className="text-blue-500" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(product.id)}
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all"
                    >
                      <FaTrash className="text-red-500" />
                    </motion.button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                    <select
                      value={product.status}
                      onChange={(e) => handleStatusChange(product.id, e.target.value as 'active' | 'inactive')}
                      className={`text-sm px-2 py-1 rounded-full ${
                        product.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{product.description}</p>

                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-2xl font-bold text-green-600">
                        ₹{product.price}
                      </span>
                      <span className="text-gray-500 text-sm">/{product.unit}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      Stock: {product.quantity} {product.unit}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AddProductModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            fetchProducts();
          }}
        />
        {editingProduct && (
          <AddProductModal
            isOpen={!!editingProduct}
            onClose={() => {
              setEditingProduct(null);
              fetchProducts();
            }}
            editProduct={editingProduct}
          />
        )}
      </div>
    </div>
  );
};

export default FarmerProducts;
