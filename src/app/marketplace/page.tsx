'use client';

import React from 'react';
import ProductList from '@/components/ProductList';
import { searchProducts, getAllProducts, getProductDetails } from '@/lib/api';
import type { Product } from '@/types/Product';
import { FaSearch } from 'react-icons/fa';
import AddProductModal from '@/components/AddProductModal';
import ProductDetails from '@/components/ProductDetails';
import Cart from '@/components/Cart';

function MarketplacePage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [showCart, setShowCart] = React.useState(false);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load products');
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="relative flex-1 max-w-xl">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-full px-4 py-2 border rounded-lg pr-10"
          />
          <FaSearch className="absolute right-3 top-3 text-gray-400" />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-8">
          {error}
        </div>
      )}

      <ProductList 
        products={products}
        isLoading={isLoading}
        onProductClick={setSelectedProduct}
      />

      {selectedProduct && (
        <ProductDetails 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
      
      {showCart && <Cart />}
    </div>
  );
}

export default MarketplacePage;