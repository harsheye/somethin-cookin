'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaLeaf, FaRupeeSign, FaWeight, 
  FaMapMarkerAlt, FaCalendar 
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface CreateTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TradeForm {
  cropName: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  location: string;
  description: string;
  harvestDate: string;
  expiryDate: string;
}

const CreateTradeModal = ({ isOpen, onClose }: CreateTradeModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TradeForm>({
    cropName: '',
    category: '',
    quantity: 0,
    unit: 'kg',
    price: 0,
    location: '',
    description: '',
    harvestDate: '',
    expiryDate: ''
  });

  const categories = [
    'Grains', 'Pulses', 'Oilseeds', 'Fruits', 
    'Vegetables', 'Spices', 'Others'
  ];

  const units = ['kg', 'quintal', 'ton'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch('http://localhost:5009/api/trades/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create trade');

      toast.success('Trade created successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to create trade');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative z-10"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Trade</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Crop Name
                    </label>
                    <div className="relative">
                      <FaLeaf className="absolute top-3 left-3 text-green-500" />
                      <input
                        type="text"
                        value={formData.cropName}
                        onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                        className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quantity and Price */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <div className="relative">
                      <FaWeight className="absolute top-3 left-3 text-green-500" />
                      <input
                        type="number"
                        min="0"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                        className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    >
                      {units.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (per {formData.unit})
                    </label>
                    <div className="relative">
                      <FaRupeeSign className="absolute top-3 left-3 text-green-500" />
                      <input
                        type="number"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute top-3 left-3 text-green-500" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Harvest Date
                    </label>
                    <div className="relative">
                      <FaCalendar className="absolute top-3 left-3 text-green-500" />
                      <input
                        type="date"
                        value={formData.harvestDate}
                        onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                        className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <div className="relative">
                      <FaCalendar className="absolute top-3 left-3 text-green-500" />
                      <input
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Trade'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateTradeModal; 