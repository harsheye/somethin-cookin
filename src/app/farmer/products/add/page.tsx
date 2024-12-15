'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaImage, FaTrash, FaLeaf } from 'react-icons/fa';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import AutumnSelect from '@/components/ui/AutumnSelect';
import Blob from '@/components/ui/Blob';

const AddProduct = () => {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [activeImage, setActiveImage] = useState<number>(0);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    unit: '100',
    smallestSellingUnit: '0.5',
    category: '',
    isForSale: true
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (images.length + files.length > 5) {
        toast.error('Maximum 5 images allowed');
        return;
      }
      
      setImages(prev => [...prev, ...files]);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
    if (activeImage >= index) {
      setActiveImage(Math.max(0, activeImage - 1));
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: 'rgb(0,98,65)' }}>
      {/* Background Blobs */}
      <Blob className="w-[40rem] h-[40rem] -top-20 -left-20 opacity-5" delay={0} />
      <Blob className="w-[35rem] h-[35rem] top-1/2 -right-20 opacity-5" delay={0.2} />
      <Blob className="w-[30rem] h-[30rem] bottom-0 left-1/4 opacity-5" delay={0.4} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <h1 className="text-3xl font-serif font-bold text-white">Add New Product</h1>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Images */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  {/* Main Image Display */}
                  <AnimatePresence>
                    {previews.length > 0 ? (
                      <motion.div
                        key={hoveredImage ?? activeImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full"
                      >
                        <Image
                          src={previews[hoveredImage ?? activeImage]}
                          alt="Product preview"
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-50">
                        <FaImage className="text-6xl text-gray-300" />
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Image Preview Strip */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                    <div className="flex gap-4 justify-center">
                      {previews.map((preview, index) => (
                        <motion.div
                          key={preview}
                          whileHover={{ scale: 1.1 }}
                          className="relative"
                        >
                          <div 
                            className={`relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer
                              ${activeImage === index ? 'ring-2 ring-white' : 'ring-1 ring-white/50'}`}
                            onClick={() => setActiveImage(index)}
                            onMouseEnter={() => setHoveredImage(index)}
                            onMouseLeave={() => setHoveredImage(null)}
                          >
                            <Image
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(index);
                              }}
                              className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full"
                            >
                              <FaTrash size={10} />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}

                      {images.length < 5 && (
                        <motion.label
                          whileHover={{ scale: 1.1 }}
                          className="relative w-16 h-16 rounded-lg border-2 border-dashed border-white/50 
                                   flex items-center justify-center cursor-pointer hover:border-white"
                        >
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleImageChange}
                            accept="image/*"
                            multiple
                          />
                          <FaImage className="text-xl text-white" />
                        </motion.label>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Product Name */}
                  <div className="md:col-span-2">
                    <label className="block text-lg font-serif font-bold text-amber-800 mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent backdrop-blur-sm"
                      placeholder="Product Name"
                    />
                  </div>

                  {/* Price and Unit */}
                  <div>
                    <label className="block text-lg font-serif font-bold text-amber-800 mb-2">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent backdrop-blur-sm"
                      placeholder="Price"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-serif font-bold text-amber-800 mb-2">
                      Unit Size (g)
                    </label>
                    <input
                      type="number"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent backdrop-blur-sm"
                      placeholder="Unit Size"
                    />
                  </div>

                  {/* Category */}
                  <div className="md:col-span-2">
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
                      placeholder="Select a category"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-lg font-serif font-bold text-amber-800 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent backdrop-blur-sm"
                      placeholder="Description"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="md:col-span-2">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full py-3 bg-gradient-to-r from-orange-400 to-amber-500 text-white 
                               font-serif font-bold rounded-lg shadow-md hover:shadow-lg
                               transition-all flex items-center justify-center gap-2"
                    >
                      <FaLeaf className="text-white/80" />
                      Add Product
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProduct; 