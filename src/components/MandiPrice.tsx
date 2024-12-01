import React, { useState, useEffect } from 'react';

const BASE_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";
const API_KEY = "579b464db66ec23bdd000001280ce119245c4f885b149545206ec774";
const FORMAT = "json";

interface MandiPriceData {
  commodity: string;
  state: string;
  district: string;
  market: string;
  min_price: string;
  max_price: string;
  modal_price: string;
}

const MandiPrice: React.FC = () => {
  const [prices, setPrices] = useState<MandiPriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(`${BASE_URL}?api-key=${API_KEY}&format=${FORMAT}&limit=10`);
        if (!response.ok) {
          throw new Error('Failed to fetch Mandi prices');
        }
        const data = await response.json();
        setPrices(data.records);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch Mandi prices');
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  if (loading) return <div>Loading Mandi prices...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Latest Mandi Prices</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Commodity</th>
            <th className="text-left">State</th>
            <th className="text-left">District</th>
            <th className="text-left">Market</th>
            <th className="text-right">Min Price (₹)</th>
            <th className="text-right">Max Price (₹)</th>
            <th className="text-right">Modal Price (₹)</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((price, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
              <td>{price.commodity}</td>
              <td>{price.state}</td>
              <td>{price.district}</td>
              <td>{price.market}</td>
              <td className="text-right">{price.min_price}</td>
              <td className="text-right">{price.max_price}</td>
              <td className="text-right">{price.modal_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MandiPrice;
