'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaStar, FaShoppingCart, FaHeart, FaShare,
  FaLeaf, FaMapMarkerAlt, FaShieldAlt, FaTruck,
  FaArrowLeft, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface ProductPageProps {
  product: {
    id: string;
    name: string;
    images: string[];
    price: number;
    description: string;
    category: string;
    quantity: number;
    unit: string;
    rating: number;
    reviews: number;
    farmer: {
      id: string;
      name: string;
      rating: number;
      location: string;
      verified: boolean;
    };
    specifications: Record<string, string>;
    features: string[];
  };
}

const ProductPageTemplate: React.FC<ProductPageProps> = ({ product }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <Link href="/marketplace" className="inline-block p-4">
        <motion.button
          whileHover={{ x: -5 }}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="mr-2" /> Back to Marketplace
        </motion.button>
      </Link>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative h-96 rounded-lg overflow-hidden">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={product.images[currentImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>
                {/* Navigation Arrows */}
                <div className="absolute inset-0 flex items-center justify-between p-4">
                  <button
                    onClick={() => setCurrentImage(prev => 
                      prev === 0 ? product.images.length - 1 : prev - 1
                    )}
                    className="p-2 rounded-full bg-white/80 hover:bg-white"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={() => setCurrentImage(prev => 
                      prev === product.images.length - 1 ? 0 : prev + 1
                    )}
                    className="p-2 rounded-full bg-white/80 hover:bg-white"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
              
              {/* Thumbnail Grid */}
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentImage(idx)}
                    className={`relative h-20 rounded-lg overflow-hidden ${
                      currentImage === idx ? 'ring-2 ring-green-500' : ''
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, idx) => (
                      <FaStar
                        key={idx}
                        className={`${
                          idx < product.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-gray-600">
                      ({product.reviews} reviews)
                    </span>
                  </div>
                  <span className="text-green-600">
                    <FaLeaf className="inline mr-1" />
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="border-t border-b py-4">
                <div className="text-3xl font-bold text-gray-900">
                  ₹{product.price}
                  <span className="text-sm text-gray-500 ml-2">
                    per {product.unit}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-2 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-16 text-center border-x p-2"
                    />
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="p-2 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-gray-500">
                    {product.quantity} {product.unit} available
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <FaShoppingCart /> Add to Cart
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-3 border rounded-lg hover:bg-gray-50"
                >
                  <FaHeart className="text-red-500" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-3 border rounded-lg hover:bg-gray-50"
                >
                  <FaShare className="text-gray-500" />
                </motion.button>
              </div>

              {/* Farmer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold">Sold by</h3>
                    <Link
                      href={`/farmer/${product.farmer.id}`}
                      className="text-green-600 hover:underline flex items-center gap-2"
                    >
                      {product.farmer.name}
                      {product.farmer.verified && (
                        <FaShieldAlt className="text-green-500" />
                      )}
                    </Link>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end">
                      <FaStar className="text-yellow-400 mr-1" />
                      {product.farmer.rating}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center justify-end">
                      <FaMapMarkerAlt className="mr-1" />
                      {product.farmer.location}
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-semibold mb-2">Key Features</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <FaLeaf className="text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="border-t">
            <div className="p-8">
              <h2 className="text-xl font-bold mb-4">Product Details</h2>
              <p className="text-gray-600 mb-6">{product.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4">Specifications</h3>
                  <dl className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex">
                        <dt className="w-1/3 text-gray-500">{key}</dt>
                        <dd className="w-2/3 font-medium">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Delivery Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <FaTruck className="text-green-500" />
                      <span>Free delivery on orders above ₹500</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaShieldAlt className="text-green-500" />
                      <span>100% Quality Assured</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPageTemplate; 