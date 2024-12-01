import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = "579b464db66ec23bdd000001280ce119245c4f885b149545206ec774";
const FORMAT = "json";

interface MandiPrice {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrival_date: string;
  min_price: number;
  max_price: number;
  modal_price: number;
}

const MandiPrices: React.FC = () => {
  const [prices, setPrices] = useState<MandiPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMandiPrices();
  }, []);

  const fetchMandiPrices = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${API_KEY}&format=${FORMAT}`);
      setPrices(response.data.records);
    } catch (error) {
      console.error('Error fetching mandi prices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Mandi Prices</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prices.map((price, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold text-lg mb-2">{price.commodity}</h3>
              <p><strong>Market:</strong> {price.market}</p>
              <p><strong>Min Price:</strong> ₹{price.min_price}</p>
              <p><strong>Max Price:</strong> ₹{price.max_price}</p>
              <p><strong>Modal Price:</strong> ₹{price.modal_price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MandiPrices;
