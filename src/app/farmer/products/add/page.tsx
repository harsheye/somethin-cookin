'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  FaImage, FaRupeeSign, FaBox, FaTag, 
  FaTrash, FaArrowLeft, FaUpload, FaWeight
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import PageWrapper from '@/components/layouts/PageWrapper';

interface FormData {
  name: string;
  description: string;
  price: number;
  unit: number;
  smallestSellingUnit: number;
  category: string;
  isForSale: boolean;
}

const AddProduct = () => {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: 0,
    unit: 0,
    smallestSellingUnit: 0,
    category: '',
    isForSale: true
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(prev => [...prev, ...files]);
      
      // Create previews
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Add your API call here
      const response = await fetch('http://localhost:5009/api/farmer/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to add product');

      toast.success('Product added successfully!');
      router.push('/farmer/products');
    } catch (error) {
      toast.error('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.back()}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaArrowLeft size={20} />
              </motion.button>
              <h1 className="text-3xl font-bold text-gray-800">Add New Product</h1>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-12 gap-8">
            {/* Left Column - Images */}
            <div className="col-span-5">
              <div className="sticky top-8">
                <label className="block text-lg font-semibold text-gray-700 mb-4">
                  Product Images <span className="text-red-500">*</span>
                </label>
                
                {/* Main Image Preview */}
                <div className="aspect-square mb-4 rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-300">
                  {previews[0] ? (
                    <img
                      src={previews[0]}
                      alt="Main preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <label
                      htmlFor="images"
                      className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <FaUpload className="text-4xl text-gray-400 mb-2" />
                      <span className="text-gray-500 font-medium">Add Main Image</span>
                      <span className="text-sm text-gray-400 mt-1">Click to upload</span>
                    </label>
                  )}
                </div>

                {/* Image Thumbnails */}
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className={`
                        aspect-square rounded-lg overflow-hidden
                        ${previews[index + 1] ? 'relative group' : 'border-2 border-dashed border-gray-300'}
                        bg-gray-50
                      `}
                    >
                      {previews[index + 1] ? (
                        <>
                          <img
                            src={previews[index + 1]}
                            alt={`Preview ${index + 2}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index + 1)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FaTrash size={12} />
                          </button>
                        </>
                      ) : (
                        <label
                          htmlFor="images"
                          className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <span className="text-sm text-gray-400">+</span>
                        </label>
                      )}
                    </div>
                  ))}
                </div>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="images"
                  required
                />
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div className="col-span-7 space-y-6">
              {/* Name and Description Section */}
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    minLength={3}
                    maxLength={100}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                    placeholder="Enter a descriptive name"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe your product in detail..."
                  />
                </div>
              </div>

              {/* Price and Category Section */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                      required
                      min={0}
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Select category</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="grains">Grains</option>
                  </select>
                </div>
              </div>

              {/* Units Section */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    Unit Size <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.unit}
                      onChange={(e) => setFormData(prev => ({ ...prev, unit: Number(e.target.value) }))}
                      required
                      min={0}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 100"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">g</span>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    Smallest Unit <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.smallestSellingUnit}
                      onChange={(e) => setFormData(prev => ({ ...prev, smallestSellingUnit: Number(e.target.value) }))}
                      required
                      min={0}
                      step={0.1}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 0.5"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">kg</span>
                  </div>
                </div>
              </div>

              {/* Save as Draft Toggle */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <label className="text-lg font-semibold text-gray-700">Save as Draft?</label>
                  <p className="text-sm text-gray-500">Product won't be visible to customers if saved as draft</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={!formData.isForSale}
                    onChange={(e) => setFormData(prev => ({ ...prev, isForSale: !e.target.checked }))}
                    className="sr-only"
                    id="draft-toggle"
                  />
                  <label
                    htmlFor="draft-toggle"
                    className={`
                      block w-14 h-8 rounded-full transition-colors duration-300 cursor-pointer
                      ${formData.isForSale ? 'bg-green-500' : 'bg-gray-300'}
                    `}
                  >
                    <span
                      className={`
                        block w-6 h-6 mt-1 ml-1 rounded-full bg-white transition-transform duration-300
                        ${formData.isForSale ? 'transform translate-x-6' : ''}
                      `}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="bg-green-500 text-white px-8 py-3 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors text-lg font-medium"
            >
              {loading ? 'Adding Product...' : 'Add Product'}
            </motion.button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
};

export default AddProduct; 