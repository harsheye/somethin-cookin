'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  FaCheckCircle, FaCreditCard, FaMoneyBill, 
  FaShieldAlt, FaTruck, FaMapMarkerAlt 
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface OrderDetails {
  id: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
}

const paymentMethods = [
  { id: 'cod', name: 'Cash on Delivery', icon: FaMoneyBill },
  { id: 'card', name: 'Credit/Debit Card', icon: FaCreditCard },
  { id: 'upi', name: 'UPI', icon: FaCreditCard },
];

const CheckoutPage = ({ params }: { params: { orderId: string } }) => {
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState(1);

  useEffect(() => {
    fetchOrderDetails();
  }, [params.orderId]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:5009/api/orders/${params.orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch order details');

      const data = await response.json();
      setOrder(data);
    } catch (error) {
      toast.error('Failed to load order details');
      router.push('/cart');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      if (selectedPayment === 'cod') {
        // Process COD order
        const response = await fetch(`http://localhost:5009/api/orders/${params.orderId}/confirm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ paymentMethod: 'cod' })
        });

        if (!response.ok) throw new Error('Failed to confirm order');

        // Show success and redirect
        setPaymentStep(2);
        setTimeout(() => {
          router.push('/profile/orders');
        }, 3000);
      } else if (selectedPayment === 'card') {
        // Initialize card payment
        const response = await fetch(`http://localhost:5009/api/payment/initialize`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            orderId: params.orderId,
            amount: order?.total,
            paymentMethod: 'card'
          })
        });

        if (!response.ok) throw new Error('Failed to initialize payment');

        const { paymentUrl } = await response.json();
        window.location.href = paymentUrl; // Redirect to payment gateway
      } else if (selectedPayment === 'upi') {
        // Initialize UPI payment
        const response = await fetch(`http://localhost:5009/api/payment/upi/initialize`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            orderId: params.orderId,
            amount: order?.total
          })
        });

        if (!response.ok) throw new Error('Failed to initialize UPI payment');

        const { upiUrl } = await response.json();
        window.location.href = upiUrl;
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4">
        <div className="max-w-3xl mx-auto animate-pulse">
          <div className="bg-white rounded-lg h-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode='wait'>
          {paymentStep === 1 ? (
            <motion.div
              key="payment"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-4">
                  {order?.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{order?.subtotal}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span>₹{order?.deliveryFee}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>₹{order?.total}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Address</h2>
                <div className="flex items-start gap-2">
                  <FaMapMarkerAlt className="mt-1 text-green-500" />
                  <div>
                    <p>{order?.address.street}</p>
                    <p className="text-gray-500">
                      {order?.address.city}, {order?.address.state} {order?.address.zipCode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`block p-4 rounded-lg border cursor-pointer ${
                        selectedPayment === method.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="hidden"
                      />
                      <div className="flex items-center gap-3">
                        <method.icon className={`text-xl ${
                          selectedPayment === method.id ? 'text-green-500' : 'text-gray-400'
                        }`} />
                        <span className="font-medium">{method.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Place Order Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? (
                  'Processing...'
                ) : (
                  <>
                    <FaShieldAlt />
                    Place Order Securely
                  </>
                )}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <FaCheckCircle className="text-4xl text-green-500" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
              <p className="text-gray-600 mb-8">
                Your order has been placed and will be delivered soon.
              </p>
              <div className="flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/profile/orders')}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                >
                  View Orders
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/marketplace')}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200"
                >
                  Continue Shopping
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CheckoutPage; 