'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaRupeeSign, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const TradePage = () => {
  const { id } = useParams();
  const [trade, setTrade] = useState<Trade | null>(null);
  const [newOffer, setNewOffer] = useState('');
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    fetchTradeDetails();
    setupWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [id]);

  const fetchTradeDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5009/api/trades/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch trade details');

      const data = await response.json();
      setTrade(data);
    } catch (error) {
      toast.error('Failed to load trade details');
    }
  };

  const setupWebSocket = () => {
    ws.current = new WebSocket('ws://localhost:8080');

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.tradeId === id) {
        handleTradeUpdate(data);
      }
    };
  };

  const handleTradeUpdate = (update: any) => {
    if (update.type === 'price_update') {
      setTrade(prev => prev ? {
        ...prev,
        currentPrice: update.newPrice,
        offers: [...prev.offers, { price: update.newPrice, timestamp: new Date().toISOString() }]
      } : null);
    }
  };

  const submitOffer = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5009/api/trades/${id}/offer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ price: parseFloat(newOffer) })
      });

      if (!response.ok) throw new Error('Failed to submit offer');

      toast.success('Offer submitted successfully');
      setNewOffer('');
    } catch (error) {
      toast.error('Failed to submit offer');
    }
  };

  if (!trade) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trade Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-bold mb-4">{trade.cropName}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-500">Current Price</p>
              <div className="flex items-center text-3xl font-bold text-green-600">
                <FaRupeeSign />
                {trade.currentPrice}
                <span className="text-sm text-gray-500 ml-2">/{trade.unit}</span>
              </div>
            </div>
            {/* Add more trade details */}
          </div>
        </div>

        {/* Price History */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Price History</h2>
          <div className="space-y-4">
            {trade.offers.map((offer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  {index > 0 && (
                    offer.price > trade.offers[index - 1].price ? (
                      <FaArrowUp className="text-green-500 mr-2" />
                    ) : (
                      <FaArrowDown className="text-red-500 mr-2" />
                    )
                  )}
                  <span className="font-semibold">₹{offer.price}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(offer.timestamp).toLocaleString()}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Submit New Offer */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Submit Offer</h2>
          <div className="flex gap-4">
            <input
              type="number"
              value={newOffer}
              onChange={(e) => setNewOffer(e.target.value)}
              className="flex-1 p-2 border rounded-lg"
              placeholder="Enter your price"
            />
            <button
              onClick={submitOffer}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Submit Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradePage; 