'use client';

import React, { useState, useEffect } from 'react';
import { getCart, removeFromCart, updateCartItem } from '@/lib/api';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const cart = await getCart();
      setCartItems(cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart(productId);
      fetchCart();
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    try {
      await updateCartItem(productId, newQuantity);
      fetchCart();
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
    }
  };

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.productId} className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p>₹{item.price.toFixed(2)} x {item.quantity}</p>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                  className="bg-gray-200 px-2 py-1 rounded-l"
                >
                  -
                </button>
                <span className="px-2">{item.quantity}</span>
                <button
                  onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                  className="bg-gray-200 px-2 py-1 rounded-r"
                >
                  +
                </button>
                <button
                  onClick={() => handleRemoveItem(item.productId)}
                  className="ml-4 text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="mt-4 text-xl font-bold">
            Total: ₹{totalAmount.toFixed(2)}
          </div>
          <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
