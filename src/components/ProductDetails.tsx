import React, { useEffect, useState } from 'react';

import { getProductDetails } from '@/lib/api';

import { Product } from '@/types/Product';



interface ProductDetailsProps {

  productId: string;

}



const ProductDetails: React.FC<ProductDetailsProps> = ({ productId }) => {

  const [product, setProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);



  useEffect(() => {

    const fetchProductDetails = async () => {

      try {

        const data = await getProductDetails(productId);

        setProduct(data);

      } catch (err) {

        setError('Failed to load product details');

      } finally {

        setLoading(false);

      }

    };



    fetchProductDetails();

  }, [productId]);



  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  if (!product) return <div>No product found</div>;



  return (

    <div className="bg-white shadow-lg rounded-lg p-6">

      <h2 className="text-2xl font-bold mb-4">{product.name}</h2>

      <div className="mb-4">
        {typeof product.image === 'string' ? (
          <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded" />
        ) : Array.isArray(product.images) && product.images.length > 0 ? (
          <div className="flex overflow-x-auto">
            {product.images.map((image, index) => (
              <img key={index} src={image} alt={`${product.name} - ${index + 1}`} className="w-64 h-64 object-cover mr-2 rounded" />
            ))}
          </div>
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded">No image available</div>
        )}
      </div>

      <p className="text-gray-600 mb-2">{product.description}</p>

      <p className="text-xl font-semibold mb-2">${product.price.toFixed(2)}</p>

      <p className="text-sm text-gray-500 mb-2">Farmer: {product.farmer.name}</p>

      <p className="text-sm text-gray-500 mb-2">Unit: {product.unit}</p>

      <p className="text-sm text-gray-500 mb-2">Smallest Selling Unit: {product.smallestSellingUnit}</p>

      <p className="text-sm text-gray-500 mb-2">For Sale: {product.isForSale ? 'Yes' : 'No'}</p>

    </div>

  );

};



export default ProductDetails;
