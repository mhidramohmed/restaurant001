// components/OrderDetailsModal.js
import React from 'react';
import useSWR from 'swr';
import axios from '@/lib/axios';

const fetcher = async (url) => {
  await axios.get('/sanctum/csrf-cookie');
  const response = await axios.get(url, { withCredentials: true });
  return response.data.data || response.data;
};

const OrderDetailsModal = ({ order, onClose, mutate }) => {
  const { data: orderItems, error } = useSWR('/api/order-elements', fetcher);
  const filteredItems = orderItems?.filter(item => item.order_id === order.id) || [];

  if (error) return <div>Failed to load order items.</div>;
  if (!orderItems) return <div>Loading order items...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background p-8 rounded-lg shadow-lg w-full max-w-3xl relative flex">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-primary">
          ✕
        </button>

        {/* Order Details on Left */}
        <div className="w-1/2 pr-6 border-r border-gray-300">
          <h2 className="text-xl font-semibold text-primary mb-4 text-center">Order Details</h2>
          <div className="text-text space-y-2">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Client Name:</strong> {order.client_name}</p>
            <p><strong>Email:</strong> {order.client_email}</p>
            <p><strong>Phone:</strong> {order.client_phone}</p>
            <p><strong>Address:</strong> {order.client_address}</p>
            <p><strong>Total Price:</strong> {order.total_price} Dhs</p>
            <p><strong>Payment Method:</strong> {order.payment_method}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Ordered At:</strong> {new Date(order.created_at).toLocaleString()}</p>
          </div>
        </div>

        {/* Order Items on Right */}
        <div className="w-1/2 pl-6">
          <h3 className="text-xl font-semibold text-primary mb-4 text-center">Order Items</h3>
          <ul className="space-y-4">
            {filteredItems.map((item) => (
              <li key={item.id} className="flex items-center space-x-4">
                {item.menu_item?.image && (
                  <img
                    src={item.menu_item.image}
                    alt={item.menu_item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div>
                  <p className="text-lg font-medium text-primary">{item.menu_item?.name || "N/A"}</p>
                  <p><strong>Qty:</strong> {item.quantity}</p>
                  <p><strong>Price:</strong> {item.price} Dhs</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
