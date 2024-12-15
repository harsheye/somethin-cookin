'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaImage, FaTrash, FaLeaf, FaPlus } from 'react-icons/fa';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import AutumnSelect from '@/components/ui/AutumnSelect';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProductForm {
  name: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  category: string;
  images: File[];
}

const AddProductModal = ({ isOpen, onClose }: AddProductModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    unit: 'kg',
    category: '',
    images: []
  });

  const categories = [
    { label: 'Vegetables', value: 'vegetables' },
    { label: 'Fruits', value: 'fruits' },
    { label: 'Grains', value: 'grains' },
    { label: 'Spices', value: 'spices' }
  ];

  const units = [
    { label: 'Kilograms (kg)', value: 'kg' },
    { label: 'Grams (g)', value: 'g' },
    { label: 'Quintal', value: 'quintal' },
    { label: 'Ton', value: 'ton' }
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        images: [...Array.from(e.target.files!)]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'images') {
          formDataToSend.append(key, value.toString());
        }
      });
      formData.images.forEach(image => {
        formDataToSend.append('images', image);
      });

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch('http://localhost:5009/api/farmer/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) throw new Error('Failed to add product');

      toast.success('Product added successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-amber-800 mb-4 font-serif">
          Add New Product
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-orange-200 rounded-xl bg-white/50 backdrop-blur-sm"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Side - Images */}
            <div className="bg-white rounded-lg p-4">
              <div className="relative aspect-square w-full max-w-md mx-auto rounded-lg overflow-hidden">
                {/* Main Image Display */}
                <AnimatePresence>
                  {formData.images.length > 0 ? (
                    <motion.img
                      key={activeImage}
                      src={URL.createObjectURL(formData.images[activeImage])}
                      alt="Product preview"
                      className="w-full h-full object-contain"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full bg-orange-50/50">
                      <FaImage className="text-4xl text-orange-300 mb-2" />
                      <p className="text-sm text-amber-600 font-medium">Upload Product Images</p>
                    </div>
                  )}
                </AnimatePresence>

                {/* Image Preview Strip */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                  <div className="flex gap-2 justify-center">
                    {formData.images.map((_, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="relative"
                      >
                        <div 
                          className={`w-12 h-12 rounded-md overflow-hidden cursor-pointer
                            ${activeImage === index ? 'ring-2 ring-white' : 'ring-1 ring-white/50'}`}
                          onClick={() => setActiveImage(index)}
                        >
                          <img
                            src={URL.createObjectURL(formData.images[index])}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </motion.div>
                    ))}

                    {formData.images.length < 5 && (
                      <label className="w-12 h-12 rounded-md border-2 border-dashed border-white/50 
                                    flex items-center justify-center cursor-pointer hover:border-white">
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleImageChange}
                          accept="image/*"
                          multiple
                        />
                        <FaPlus className="text-white" />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="bg-white rounded-lg p-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-serif font-bold text-amber-800 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 text-sm font-medium text-amber-900 border-2 border-orange-100 
                             rounded-lg focus:border-orange-300 focus:ring-2 focus:ring-orange-200
                             bg-orange-50/50 placeholder-amber-400"
                    placeholder="Enter product name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-serif font-bold text-amber-800 mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full p-2.5 text-sm font-medium text-amber-900 border-2 border-orange-100 
                               rounded-lg focus:border-orange-300 focus:ring-2 focus:ring-orange-200
                               bg-orange-50/50 placeholder-amber-400"
                      placeholder="Enter price"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-serif font-bold text-amber-800 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                      className="w-full p-2.5 text-sm font-medium text-amber-900 border-2 border-orange-100 
                               rounded-lg focus:border-orange-300 focus:ring-2 focus:ring-orange-200
                               bg-orange-50/50 placeholder-amber-400"
                      placeholder="Enter quantity"
                    />
                  </div>
                </div>

                <AutumnSelect
                  label="Category"
                  value={formData.category}
                  onChange={(value) => setFormData({ ...formData, category: value })}
                  options={categories}
                  placeholder="Select a category"
                />

                <AutumnSelect
                  label="Unit"
                  value={formData.unit}
                  onChange={(value) => setFormData({ ...formData, unit: value })}
                  options={units}
                  placeholder="Select unit"
                />

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm font-serif font-bold text-amber-800">Available for Sale</span>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFormData(prev => ({ ...prev, isForSale: !prev.isForSale }))}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      formData.isForSale ? 'bg-orange-400' : 'bg-gray-300'
                    }`}
                  >
                    <motion.div
                      layout
                      className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                      animate={{ x: formData.isForSale ? 24 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-2.5 bg-gradient-to-r from-orange-400 to-amber-500 text-white 
                           font-serif font-bold rounded-lg shadow-md hover:shadow-lg
                           transition-all flex items-center justify-center gap-2"
                >
                  <FaLeaf className="text-white/80" />
                  Add Product
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Modal>
  );
};

export default AddProductModal; 