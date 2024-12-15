'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLeaf, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';
import AutumnSelect from '@/components/ui/AutumnSelect';
import AutumnCalendar from '@/components/ui/AutumnCalendar';
import Blob from '@/components/ui/Blob';

const CreateTrade = () => {
  const [formData, setFormData] = useState({
    cropName: '',
    quantity: '',
    price: '',
    description: '',
    tradeDate: new Date(),
    location: '',
    category: '',
    isActive: true
  });

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: 'rgb(0,98,65)' }}>
      {/* Background Blobs */}
      <Blob className="w-[45rem] h-[45rem] -top-40 -right-20 opacity-5" delay={0} />
      <Blob className="w-[40rem] h-[40rem] bottom-0 -left-20 opacity-5" delay={0.3} />
      <Blob className="w-[35rem] h-[35rem] top-1/2 left-1/3 opacity-5" delay={0.6} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <h1 className="text-3xl font-serif font-bold text-white">Create New Trade</h1>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-serif font-bold text-white mb-2">
                    Crop Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.cropName}
                      onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                      className="w-full p-3 pl-10 bg-white/5 border border-white/20 rounded-lg text-white 
                               placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent backdrop-blur-sm"
                      placeholder="Enter crop name"
                    />
                    <FaLeaf className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-serif font-bold text-white mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full p-3 pl-10 bg-white/5 border border-white/20 rounded-lg text-white 
                               placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent backdrop-blur-sm"
                      placeholder="Enter trade location"
                    />
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                  </div>
                </div>

                <AutumnSelect
                  label="Category"
                  value={formData.category}
                  onChange={(value) => setFormData({ ...formData, category: value })}
                  options={[
                    { label: 'Vegetables', value: 'vegetables' },
                    { label: 'Fruits', value: 'fruits' },
                    { label: 'Grains', value: 'grains' },
                    { label: 'Spices', value: 'spices' }
                  ]}
                  placeholder="Select category"
                />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-lg font-serif font-bold text-white mb-2">
                      Quantity (kg)
                    </label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white 
                               placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent backdrop-blur-sm"
                      placeholder="Enter quantity"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-serif font-bold text-white mb-2">
                      Price (₹/kg)
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white 
                               placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent backdrop-blur-sm"
                      placeholder="Enter price"
                    />
                  </div>
                </div>

                <AutumnCalendar
                  label="Trade Date"
                  selected={formData.tradeDate}
                  onChange={(date) => setFormData({ ...formData, tradeDate: date })}
                />

                <div>
                  <label className="block text-lg font-serif font-bold text-white mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white 
                             placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent backdrop-blur-sm"
                    placeholder="Describe your trade requirements"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3 bg-gradient-to-r from-orange-400 to-amber-500 text-white 
                         font-serif font-bold rounded-lg shadow-md hover:shadow-lg
                         transition-all flex items-center justify-center gap-2"
              >
                <FaLeaf className="text-white/80" />
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