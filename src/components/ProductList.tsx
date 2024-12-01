'use client';

import React from 'react';
import { Product } from '@/types/Product';
import { addToCart } from '@/lib/api';

interface ProductListProps {
  products: Product[];
  isLoggedIn: boolean;
  onProductClick: (productId: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, isLoggedIn, onProductClick }) => {
  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId);
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md p-6 cursor-pointer" onClick={() => onProductClick(product.id)}>
          <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-lg font-bold mb-4">₹{product.price.toFixed(2)}</p>
          {isLoggedIn && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product.id);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Add to Cart
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
