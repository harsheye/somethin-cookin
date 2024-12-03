'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FaLeaf, FaRupeeSign, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface Trade {
  id: string;
  cropName: string;
  quantity: number;
  basePrice: number;
  currentPrice: number;
  unit: string;
  location: string;
  expiryDate: string;
  status: 'active' | 'completed' | 'expired';
  offers: Array<{
    price: number;
    timestamp: string;
  }>;
}

const TradesPage = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const ws = useRef<WebSocket | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Initial fetch of trades
    fetchTrades();

    // Setup WebSocket connection
    ws.current = new WebSocket('ws://localhost:8080');

    ws.current.onopen = () => {
      console.log('WebSocket Connected');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleTradeUpdate(data);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const fetchTrades = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5009/api/trades', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch trades');

      const data = await response.json();
      setTrades(data);
    } catch (error) {
      toast.error('Failed to load trades');
    } finally {
      setLoading(false);
    }
  };

  const handleTradeUpdate = (update: any) => {
    switch (update.type) {
      case 'new_trade':
        setTrades(prev => [update.trade, ...prev]);
        toast.success('New trade available!');
        break;
      case 'price_update':
        setTrades(prev => prev.map(trade => 
          trade.id === update.tradeId 
            ? { 
                ...trade, 
                currentPrice: update.newPrice,
                offers: [...trade.offers, { price: update.newPrice, timestamp: new Date().toISOString() }]
              }
            : trade
        ));
        break;
      case 'trade_completed':
        setTrades(prev => prev.map(trade =>
          trade.id === update.tradeId
            ? { ...trade, status: 'completed' }
            : trade
        ));
        toast.success(`Trade ${update.tradeId} completed!`);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Active Trades</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trades.map(trade => (
            <motion.div
              key={trade.id}
              whileHover={{ y: -5 }}
              onClick={() => router.push(`/trades/${trade.id}`)}
              className="bg-white rounded-lg shadow-sm p-6 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{trade.cropName}</h3>
                  <p className="text-sm text-gray-500">{trade.location}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  trade.status === 'active' ? 'bg-green-100 text-green-800' :
                  trade.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {trade.status}
                </span>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-gray-500">Current Price</p>
                  <div className="flex items-center">
                    <FaRupeeSign className="text-green-500" />
                    <span className="text-2xl font-bold">{trade.currentPrice}</span>
                    <span className="text-sm text-gray-500">/{trade.unit}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Quantity</p>
                  <p className="font-semibold">{trade.quantity} {trade.unit}</p>
                </div>
              </div>

              {trade.offers.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center">
                    {trade.offers[trade.offers.length - 1].price > trade.basePrice ? (
                      <FaArrowUp className="text-green-500 mr-2" />
                    ) : (
                      <FaArrowDown className="text-red-500 mr-2" />
                    )}
                    <span className="text-sm text-gray-500">
                      Last offer: ₹{trade.offers[trade.offers.length - 1].price}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TradesPage; 