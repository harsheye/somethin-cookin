'use client';

import React from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  isForSale: boolean;
  farmer: {
    id: string;
    name: string;
  };
}

interface ProductCardProps {
  product: Product;
  isLoggedIn: boolean;
  isFarmerView?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isLoggedIn, isFarmerView = false }) => {
  const addToCart = () => {
    if (isLoggedIn) {
      // Add to server-side cart
      fetch('https://onlinesbii.live/api/cart/additem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ productId: product.id }),
      })
      .then(response => {
        if (response.ok) {
          alert('Product added to cart');
        } else {
          alert('Failed to add product to cart');
        }
      })
      .catch(error => console.error('Error adding product to cart:', error));
    } else {
      // Add to local storage cart
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Product added to cart');
    }
  };

  const editProduct = () => {
    // Implement edit product functionality
    alert('Edit product functionality to be implemented');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
      <p className="text-gray-600 mb-2">{product.description}</p>
      <p className="text-lg font-bold mb-2">${product.price.toFixed(2)}</p>
      {!isFarmerView && <p className="text-sm mb-4">Farmer: {product.farmer.name}</p>}
      {isFarmerView ? (
        <button
          onClick={editProduct}
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Edit Product
        </button>
      ) : (
        <button
          onClick={addToCart}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default ProductCard;
