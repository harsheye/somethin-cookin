import React, { useState, useEffect } from 'react';
import { placeOrder, getCartItems } from '@/lib/api';
import { useRouter } from 'next/navigation';

const Checkout: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    setIsLoading(true);
    try {
      const items = await getCartItems();
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setError('Failed to load cart items');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select an address');
      return;
    }

    try {
      const order = await placeOrder(selectedAddress, paymentMethod);
      if (paymentMethod === 'online') {
        // Implement Razorpay integration here
        console.log('Implement Razorpay payment');
      } else {
        alert('Order placed successfully!');
        router.push(`/order/${order.id}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    }
  };

  if (isLoading) return <div>Loading checkout...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Select Address</h2>
        {/* Implement address selection here */}
        <select
          value={selectedAddress}
          onChange={(e) => setSelectedAddress(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select an address</option>
          {/* Add address options here */}
        </select>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
        <div>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={() => setPaymentMethod('cod')}
              className="form-radio"
            />
            <span className="ml-2">Cash on Delivery</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="online"
              checked={paymentMethod === 'online'}
              onChange={() => setPaymentMethod('online')}
              className="form-radio"
            />
            <span className="ml-2">Online Payment</span>
          </label>
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
        {cartItems.map((item) => (
          <div key={item.product.id} className="flex justify-between items-center border-b py-2">
            <span>{item.product.name} x {item.quantity}</span>
            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="font-bold mt-2">
          Total: ${cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2)}
        </div>
      </div>
      <button
        onClick={handlePlaceOrder}
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;
