import React, { useState } from 'react';

import { addProduct, uploadProductImages } from '@/lib/api';

import { FaTimes, FaUpload } from 'react-icons/fa';



interface AddProductModalProps {

  onClose: () => void;

  onProductAdded: (productId: string) => void;

}



const AddProductModal: React.FC<AddProductModalProps> = ({ onClose, onProductAdded }) => {

  const [product, setProduct] = useState({

    name: '',

    description: '',

    price: 0,

    category: '',

    unit: 0,

    smallestSellingUnit: 0,

    isForSale: true,

  });

  const [images, setImages] = useState<File[]>([]);

  const [error, setError] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {

    const { name, value, type } = e.target;

    setProduct(prev => ({

      ...prev,

      [name]: type === 'number' ? parseFloat(value) : value

    }));

  };



  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const { name, checked } = e.target;

    setProduct(prev => ({

      ...prev,

      [name]: checked

    }));

  };



  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (e.target.files) {

      const fileList = Array.from(e.target.files).slice(0, 5); // Limit to 5 images

      setImages(fileList);

    }

  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      // First, upload the images
      if (images.length === 0) {
        throw new Error('Please select at least one image');
      }
      const uploadedImages = await uploadProductImages(images);
      
      let imageUrls: string[] = [];

      if (Array.isArray(uploadedImages)) {
        imageUrls = uploadedImages.map(img => img.url);
      } else if (typeof uploadedImages === 'object' && uploadedImages !== null) {
        imageUrls = Object.values(uploadedImages);
      } else if (typeof uploadedImages === 'string') {
        imageUrls = [uploadedImages];
      }

      if (imageUrls.length === 0) {
        throw new Error('Failed to upload images');
      }

      // Now create the product with the uploaded image URLs
      const productData = {
        ...product,
        images: imageUrls,
      };

      const productId = await addProduct(productData);
      
      onProductAdded(productId);
      onClose();
    } catch (error) {
      console.error('Error adding product:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };



  return (

    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-90vh overflow-y-auto">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-3xl font-bold text-gray-800">Add New Product</h2>

          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">

            <FaTimes size={24} />

          </button>

        </div>

        {error && (

          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">

            <strong className="font-bold">Error: </strong>

            <span className="block sm:inline">{error}</span>

          </div>

        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name field */}

          <div>

            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>

            <input

              type="text"

              id="name"

              name="name"

              value={product.name}

              onChange={handleChange}

              required

              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-800"

            />

          </div>



          {/* Description field */}

          <div>

            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>

            <textarea

              id="description"

              name="description"

              value={product.description}

              onChange={handleChange}

              required

              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-800"

              rows={4}

            />

          </div>



          {/* Price field */}

          <div>

            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>

            <input

              type="number"

              id="price"

              name="price"

              value={product.price}

              onChange={handleChange}

              required

              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-800"

            />

          </div>



          {/* Category field */}

          <div>

            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>

            <select

              id="category"

              name="category"

              value={product.category}

              onChange={handleChange}

              required

              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-800"

            >

              <option value="">Select a category</option>

              <option value="fruit">Fruit</option>

              <option value="vegetable">Vegetable</option>

              <option value="grain">Grain</option>

            </select>

          </div>



          {/* Unit field */}

          <div>

            <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">Unit</label>

            <input

              type="number"

              id="unit"

              name="unit"

              value={product.unit}

              onChange={handleChange}

              required

              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-800"

            />

          </div>



          {/* Smallest Selling Unit field */}

          <div>

            <label htmlFor="smallestSellingUnit" className="block text-sm font-medium text-gray-700 mb-1">Smallest Selling Unit</label>

            <input

              type="number"

              id="smallestSellingUnit"

              name="smallestSellingUnit"

              value={product.smallestSellingUnit}

              onChange={handleChange}

              required

              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-800"

            />

          </div>



          {/* Is For Sale checkbox */}

          <div className="flex items-center">

            <input

              type="checkbox"

              id="isForSale"

              name="isForSale"

              checked={product.isForSale}

              onChange={handleCheckboxChange}

              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"

            />

            <label htmlFor="isForSale" className="ml-2 block text-sm text-gray-900">

              For Sale

            </label>

          </div>



          {/* Image upload field */}

          <div>

            <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">Images (max 5)</label>

            <input

              type="file"

              id="images"

              name="images"

              onChange={handleImageChange}

              multiple

              accept="image/*"

              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-800"

            />

          </div>



          {/* Form buttons */}

          <div className="flex justify-end space-x-4">

            <button type="button" onClick={onClose} className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-300">

              Cancel

            </button>

            <button 

              type="submit" 

              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300 disabled:opacity-50 flex items-center"

              disabled={isLoading}

            >

              {isLoading ? (

                <>

                  <FaUpload className="animate-spin mr-2" />

                  Uploading...

                </>

              ) : (

                'Add Product'

              )}

            </button>

          </div>

        </form>

      </div>

    </div>

  );

};



export default AddProductModal;



