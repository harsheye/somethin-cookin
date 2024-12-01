import React from 'react';

interface OrderDetailsProps {
  order: any; // Replace 'any' with your Order type
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>
      <p><strong>Order ID:</strong> {order.id}</p>
      <p><strong>Customer:</strong> {order.customer.name}</p>
      <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <h3 className="text-xl font-bold mt-4 mb-2">Items</h3>
      <ul>
        {order.items.map((item: any, index: number) => (
          <li key={index} className="mb-2">
            {item.product.name} - Quantity: {item.quantity} - Price: ${item.price.toFixed(2)}
          </li>
        ))}
      </ul>
      <p className="mt-4"><strong>Total:</strong> ${order.total.toFixed(2)}</p>
    </div>
  );
};

export default OrderDetails;
