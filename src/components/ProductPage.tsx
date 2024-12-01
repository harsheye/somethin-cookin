'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Product } from '@/types/Product';
import { Carousel } from '@/components/ui/Carousel';
import { FaUser, FaShoppingCart, FaStar } from 'react-icons/fa';
import Link from 'next/link';
import { getProductById, getRecommendedProducts, getProductReviews, searchProducts } from '@/lib/api';

interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const ProductPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState<Product | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  useEffect(() => {
    if (id) {
      fetchProductData();
    }
  }, [id]);

  const fetchProductData = async () => {
    try {
      const productData = await getProductById(id as string);
      setProduct(productData);
      const recommendedData = await getRecommendedProducts(id as string);
      setRecommendedProducts(recommendedData);
      const reviewsData = await getProductReviews(id as string);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      const results = await searchProducts(searchTerm, '');
      setSearchResults(results);
    }
  };

  const addToCart = () => {
    if (product) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Product added to cart!');
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 pr-4">
          <Carousel>
            {product.images.map((image, index) => (
              <img key={index} src={image} alt={`${product.name} - Image ${index + 1}`} className="w-full h-64 object-cover rounded-lg" />
            ))}
          </Carousel>
        </div>
        <div className="md:w-1/2 mt-4 md:mt-0">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar key={star} className={star <= product.rating ? "text-yellow-400" : "text-gray-300"} />
            ))}
            <span className="ml-2 text-gray-600">({reviews.length} reviews)</span>
          </div>
          <p className="text-green-600 text-xl font-bold mb-4">${product.price.toFixed(2)}</p>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <button 
            onClick={addToCart}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center"
          >
            <FaShoppingCart className="mr-2" />
            Add to Cart
          </button>
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2">Farmer</h3>
            <Link href={`/farmer/${product.farmer.id}`} className="flex items-center text-blue-500 hover:underline">
              <FaUser className="mr-2" />
              {product.farmer.name}
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Product Search</h2>
        <form onSubmit={handleSearch} className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for products..."
            className="w-full px-4 py-2 border rounded-lg"
          />
          <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg">Search</button>
        </form>
        {searchResults.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {searchResults.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
                  <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-2" />
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-green-600">${product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {recommendedProducts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Recommended Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recommendedProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
                  <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-2" />
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-green-600">${product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="text-yellow-400">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                  <span className="ml-2 text-gray-600">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
