'use client';

import useSWR from 'swr';
import axios from '@/lib/axios';
import MainButton from '@/components/MainButton';
import { useAuth } from '@/hooks/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';

import OrderDetailsModal from '@/components/OrderDetailsModal';

const fetcher = async (url) => {
  try {
    const response = await axios.get(url);
    console.log('API Response:', response);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
};

const Page = () => {
  const router = useRouter();
  const { user, logout } = useAuth({ middleware: 'auth' });
  const { data: orders, error, mutate } = useSWR(
    user ? '/api/orders' : null,
    fetcher
  );
  const [showPendingOnly, setShowPendingOnly] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleDone = async (orderId) => {
    try {
      await axios.patch(`/api/orders/${orderId}`, { status: 'delivered' });
      console.log(`Order ${orderId} marked as delivered.`);
      mutate();
    } catch (error) {
      console.error(`Failed to update order ${orderId}:`, error);
    }
  };

  const handleUpdate = async (orderId, status) => {
    try {
      await axios.patch(`/api/orders/${orderId}`, { status: status });
      console.log(`Order ${orderId} status updated to ${status}.`);
      mutate();
    } catch (error) {
      console.error(`Failed to update order ${orderId} status to ${status}:`, error);
    }
  };

  const handleRowClick = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (user.role !== 'user') {
    router.push('/dashboard')
    console.log('Redirecting to dashboard page')
    return null // Return null to prevent rendering
  }

  if (error) {
    console.error('Error details:', error);
    return <div className="p-6 text-red-600">Failed to load orders: {error.message}</div>;
  }

  if (!orders) return <div className="p-6">Loading...</div>;

  const filteredOrders = showPendingOnly
    ? orders?.filter(order => order.status === 'pending') || []
    : orders?.filter(order => order.status !== 'pending') || [];

  return (
    <>
      <header className="bg-background border-b border-primary py-3 px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Logo />
            </Link>
            <h1 className="text-xl font-bold">{showPendingOnly ? 'Pending Orders' : 'Delivered Orders'}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <MainButton
              onClick={() => setShowPendingOnly(prev => !prev)}
              className="border-2 border-primary text-text"
            >
              {showPendingOnly ? 'Show Delivered Orders' : 'Show Pending Orders'}
            </MainButton>
            <MainButton
              onClick={logout}
              className="bg-primary text-background border-2 border-primary hover:bg-opacity-90 transition"
            >
              Logout
            </MainButton>
          </div>
        </div>
      </header>
      <div className="p-6">
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full bg-background border border-gray-200">
            <thead>
              <tr className="bg-primary text-secondary">
                <th className="py-4 px-6 text-left font-semibold">Order ID</th>
                <th className="py-4 px-6 text-left font-semibold">Client</th>
                <th className="py-4 px-6 text-left font-semibold">Email</th>
                <th className="py-4 px-6 text-left font-semibold">Phone</th>
                <th className="py-4 px-6 text-left font-semibold">Address</th>
                <th className="py-4 px-6 text-left font-semibold">Total</th>
                <th className="py-4 px-6 text-left font-semibold">Payment</th>
                {!showPendingOnly && (
                  <th className="py-4 px-6 text-left font-semibold">Status</th>
                )}
                <th className="py-4 px-6 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-secondary cursor-pointer transition-colors duration-150"
                    onClick={() => handleRowClick(order)}
                  >
                    <td className="py-4 px-6 text-text">{order.id}</td>
                    <td className="py-4 px-6 text-text">{order.client_name}</td>
                    <td className="py-4 px-6 text-text">{order.client_email}</td>
                    <td className="py-4 px-6 text-text">{order.client_phone}</td>
                    <td className="py-4 px-6 text-text">{order.client_address}</td>
                    <td className="py-4 px-6 text-primary font-semibold">{order.total_price} Dhs</td>
                    <td className="py-4 px-6 text-text">{order.payment_method}</td>
                    {!showPendingOnly && (
                      <td className="py-4 px-6 text-text">{order.status}</td>
                    )}
                    <td className="py-4 px-6 text-center">
                      <div>
                      {showPendingOnly ? (
                        <MainButton
                          onClick={(e) => { e.stopPropagation(); console.log('Done button clicked for order:', order.id); handleDone(order.id); }}
                          className="bg-primary text-white text-sm py-1 px-2 ml-2"
                        >
                          Done
                        </MainButton>
                      ) : (
                        <div><MainButton
                        onClick={(e) => { e.stopPropagation(); handleUpdate(order.id, 'declined'); }}
                        className="bg-red-500 text-white text-sm py-1 px-2 ml-2"
                      >
                        Decline
                      </MainButton>
                      <MainButton
                          onClick={(e) => { e.stopPropagation(); handleUpdate(order.id, 'pending'); }}
                          className="bg-primary text-white text-sm py-1 px-2 ml-2"
                        >
                          Cancel
                        </MainButton></div>
                      )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-4 px-6 text-center text-text">
                    There are no orders.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {selectedOrder && (
          <OrderDetailsModal order={selectedOrder} onClose={closeModal} />
        )}
      </div>
    </>
  );
};

export default Page;
