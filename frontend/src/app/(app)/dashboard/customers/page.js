'use client';

import useSWR from 'swr';
import axios from '@/lib/axios';

const fetcher = async (url) => {
  try {
    const response = await axios.get(url, { withCredentials: true });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
};

const CustomersPage = () => {
  const { data: orders, error, isLoading } = useSWR('/api/orders', fetcher);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-6">
        <p>Error loading customer data.</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex items-center justify-center p-6">
        <p>No orders available.</p>
      </div>
    );
  }

  // Group orders by customer phone number
  const groupedOrders = orders.reduce((acc, order) => {
    const phone = order.client_phone;
    if (!acc[phone]) {
      acc[phone] = {
        client_name: order.client_name,
        client_phone: phone,
        client_address: order.client_address,
        client_email: order.client_email,
        total_spent: 0,
        orders: [],
      };
    }
    acc[phone].total_spent += parseFloat(order.total_price);
    acc[phone].orders.push(order);
    return acc;
  }, {});

  const customers = Object.values(groupedOrders);

  return (
    <div className="p-6">
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-background border border-gray-200">
          <thead>
            <tr className="bg-primary text-secondary">
              <th className="py-4 px-6 text-left font-semibold">Customer Name</th>
              <th className="py-4 px-6 text-left font-semibold">Phone</th>
              <th className="py-4 px-6 text-left font-semibold">Address</th>
              <th className="py-4 px-6 text-left font-semibold">Email</th>
              <th className="py-4 px-6 text-left font-semibold">Total Spent</th>
              <th className="py-4 px-6 text-left font-semibold">Number of Orders</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr
                  key={customer.client_phone}
                  className="hover:bg-secondary cursor-pointer transition-colors duration-150"
                >
                  <td className="py-4 px-6 text-text">{customer.client_name}</td>
                  <td className="py-4 px-6 text-text">{customer.client_phone}</td>
                  <td className="py-4 px-6 text-text">{customer.client_address}</td>
                  <td className="py-4 px-6 text-text">{customer.client_email}</td>
                  <td className="py-4 px-6 text-primary font-semibold">
                    {customer.total_spent.toFixed(2)} Dhs
                  </td>
                  <td className="py-4 px-6 text-text">{customer.orders.length}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 px-6 text-center text-text">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersPage;
