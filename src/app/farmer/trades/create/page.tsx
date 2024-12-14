'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaLeaf, FaRupeeSign, FaWeight, FaMapMarkerAlt, 
  FaCalendarAlt, FaImage, FaInfoCircle 
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const CreateTrade = () => {
  const [formData, setFormData] = useState({
    cropName: '',
    category: '',
    quantity: '',
    unit: 'kg',
    price: '',
    location: '',
    description: '',
    harvestDate: '',
    images: [] as File[]
  });

  const categories = [
    'Grains', 'Vegetables', 'Fruits', 'Pulses', 
    'Spices', 'Organic', 'Others'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-green-600 text-white p-6">
            <h1 className="text-3xl font-bold">Create New Trade</h1>
            <p className="mt-2 opacity-90">List your produce for potential buyers</p>
          </div>

          <div className="p-8">
            {/* Image Upload */}
            <div className="mb-8">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition-colors">
                <FaImage className="mx-auto text-4xl text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload Product Images</h3>
                <p className="text-gray-500 mb-4">Drag and drop or click to select</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      setFormData(prev => ({
                        ...prev,
                        images: Array.from(e.target.files!)
                      }));
                    }
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg"
                >
                  Choose Files
                </motion.button>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Crop Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crop Name
                </label>
                <div className="relative">
                  <FaLeaf className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.cropName}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      cropName: e.target.value
                    }))}
                    className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter crop name"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    category: e.target.value
                  }))}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Quantity and Unit */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="relative">
                    <FaWeight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        quantity: e.target.value
                      }))}
                      className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Amount"
                    />
                  </div>
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      unit: e.target.value
                    }))}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="kg">Kg</option>
                    <option value="ton">Ton</option>
                    <option value="quintal">Quintal</option>
                  </select>
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (per unit)
                </label>
                <div className="relative">
                  <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      price: e.target.value
                    }))}
                    className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter price per unit"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: e.target.value
                    }))}
                    className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter location"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  rows={4}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe your produce..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Create Trade
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateTrade; 