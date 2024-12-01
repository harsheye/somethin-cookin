import React from 'react';
import { Order } from '@/types/Order';

interface OrdersListProps {
  orders: Order[];
}

const OrdersList: React.FC<OrdersListProps> = ({ orders }) => {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order._id} className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2">Order #{order.orderId}</h3>
          <p className="text-sm text-gray-600">Status: {order.status}</p>
          <p className="text-sm text-gray-600">Total: ${order.totalPrice.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Date: {new Date(order.timestamp).toLocaleDateString()}</p>
          <div className="mt-2">
            <h4 className="font-semibold text-sm">Products:</h4>
            <ul className="list-disc list-inside">
              {order.products.map((item, index) => (
                <li key={index} className="text-sm">
                  {item.product.name} - Qty: {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersList;
