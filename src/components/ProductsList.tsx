import React, { useState } from 'react';
import { updateProduct } from '@/lib/api';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  unit: number;
  smallestSellingUnit: number;
  category: string;
  isForSale: boolean;
}

interface ProductsListProps {
  products: Product[];
  onProductUpdate: () => void;
}

const ProductsList: React.FC<ProductsListProps> = ({ products, onProductUpdate }) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleSave = async () => {
    if (editingProduct) {
      try {
        await updateProduct(editingProduct._id, editingProduct);
        onProductUpdate();
        setEditingProduct(null);
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editingProduct) {
      const { name, value, type } = e.target;
      setEditingProduct(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value
      }));
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Your Products</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product._id} className="border rounded-lg p-4">
            {editingProduct && editingProduct._id === product._id ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={editingProduct.name}
                  onChange={handleChange}
                  className="mb-2 w-full border rounded px-2 py-1"
                />
                <textarea
                  name="description"
                  value={editingProduct.description}
                  onChange={handleChange}
                  className="mb-2 w-full border rounded px-2 py-1"
                />
                <input
                  type="number"
                  name="price"
                  value={editingProduct.price}
                  onChange={handleChange}
                  className="mb-2 w-full border rounded px-2 py-1"
                />
                <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
              </>
            ) : (
              <>
                <h4 className="font-semibold">{product.name}</h4>
                <p>{product.description}</p>
                <p>Price: ${product.price}</p>
                <button onClick={() => handleEdit(product)} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Edit</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
