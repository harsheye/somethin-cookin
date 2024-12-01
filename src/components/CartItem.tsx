import React from 'react';
import { Product } from '@/types/Product';

interface CartItemProps {
  item: Product;
  removeFromCart: (productId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, removeFromCart }) => {
  return (
    <div className="flex justify-between items-center border-b py-2">
      <div>
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <p className="text-sm text-gray-600">Farmer: {item.farmer.name}</p>
        <p className="text-md font-bold">${item.price.toFixed(2)}</p>
      </div>
      <button
        onClick={() => removeFromCart(item.id)}
        className="text-red-500 hover:text-red-700"
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;
