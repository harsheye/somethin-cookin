'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  FaStar, FaShoppingCart, FaHeart, FaLeaf, 
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaCheck 
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface Review {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  date: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  category: string;
  images: string[];
  rating: number;
  reviewCount: number;
  reviews: Review[];
  farmer: {
    id: string;
    name: string;
    location: string;
    rating: number;
    joinedDate: string;
    phone: string;
    email: string;
    verifiedSeller: boolean;
  };
}

const ProductDetails = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [params.id]);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5009/api/products/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch product details');

      const data = await response.json();
      setProduct(data);
    } catch (error) {
      toast.error('Failed to load product details');
      router.push('/marketplace');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to add items to cart');
        router.push('/auth/login');
        return;
      }

      const response = await fetch('http://localhost:5009/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: params.id,
          quantity
        })
      });

      if (!response.ok) throw new Error('Failed to add to cart');

      toast.success('Added to cart successfully');
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      await handleAddToCart();
      router.push('/cart');
    } catch (error) {
      toast.error('Failed to process. Please try again.');
    }
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 h-96 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden"
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-green-500' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`${
                        i < product.rating ? 'text-yellow-400' : 'text-gray-300'
                      } text-lg`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-b py-4">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-green-600">₹{product.price}</span>
                <span className="text-gray-500 ml-2">/{product.unit}</span>
              </div>
              <p className="text-gray-500 mt-2">
                Available Quantity: {product.quantity} {product.unit}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                >
                  <FaHeart />
                </motion.button>
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex-1 bg-green-100 text-green-600 py-3 rounded-lg hover:bg-green-200 font-medium"
                >
                  {addingToCart ? 'Adding...' : (
                    <>
                      <FaShoppingCart className="inline mr-2" />
                      Add to Cart
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-medium"
                >
                  Buy Now
                </motion.button>
              </div>
            </div>

            {/* Farmer Info */}
            <div className="border-t pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    {product.farmer.name}
                    {product.farmer.verifiedSeller && (
                      <FaCheck className="text-green-500" />
                    )}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <FaMapMarkerAlt />
                    {product.farmer.location}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Member since {new Date(product.farmer.joinedDate).getFullYear()}
                  </p>
                </div>
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600"
                  >
                    <FaPhone /> Call Seller
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600"
                  >
                    <FaEnvelope /> Message
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-2">Product Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {review.user.avatar ? (
                      <img
                        src={review.user.avatar}
                        alt={review.user.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <FaUser className="text-green-500" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{review.user.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 