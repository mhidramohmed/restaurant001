'use client'

import useSWR from 'swr'
import axios from '@/lib/axios'
import MainButton from '@/components/MainButton'
import { useAuth } from '@/hooks/auth'
import { useEffect, useState, useMemo, useCallback, useRef  } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'

import OrderDetailsModal from '@/components/OrderDetailsModal'

const fetcher = async (url) => {
    const response = await axios.get(url)
    return response.data.data || response.data
}

const OrderStatusBadge = ({ status }) => {
  const statusColors = {
    pending: 'bg-yellow-500',
    inprocess: 'bg-blue-500',
    delivered: 'bg-green-500',
    declined: 'bg-red-500'
  }

  return (
    <span
      className={`px-2 py-1 rounded-full text-white ${statusColors[status] || 'bg-gray-500'}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}


const notificationSound = '/notification.mp3'

const Page = () => {
  const router = useRouter()
  const { user, logout } = useAuth({ middleware: 'auth' })
  const { data: orders, error, mutate } = useSWR(
    user ? '/api/orders' : null,
    fetcher, { refreshInterval: 5000 }
  )
  const prevOrdersCount = useRef(0)

  const [audio] = useState(new Audio(notificationSound))

  useEffect(() => {
    if (!orders) return

    // If new orders are added, play the notification sound
    if (orders.length > prevOrdersCount.current) {
      audio.play()
    }

    prevOrdersCount.current = orders.length
  }, [orders, audio])

  const [filters, setFilters] = useState({
    searchTerm: '',
    statuses: ['pending'],
    paymentStatuses: []
  })

  const [selectedOrder, setSelectedOrder] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 10

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else if (user?.role !== 'user') {
      router.push('/dashboard')
    }
  }, [user, router])


  const filteredOrders = useMemo(() => {
    if (!orders) return []

    return orders.filter(order => {
      // Search filter
      const matchesSearch = !filters.searchTerm || 
        order.client_name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        order.id.toString().includes(filters.searchTerm)

      // Status filter
      const matchesStatus = filters.statuses.length === 0 || 
        filters.statuses.includes(order.order_status)

      // Payment status filter
      const matchesPaymentStatus = filters.paymentStatuses.length === 0 || 
        filters.paymentStatuses.includes(order.payment_status)

      return matchesSearch && matchesStatus && matchesPaymentStatus
    })
  }, [
    orders, 
    filters.searchTerm, 
    filters.statuses.join(','), 
    filters.paymentStatuses.join(',')
  ])

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  // const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)

  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(filteredOrders.length / ordersPerPage); i++) {
    pageNumbers.push(i)
  }

  const handleRowClick = useCallback((order) => {
    setSelectedOrder(order)
  }, [])

  const closeModal = useCallback(() => {
    setSelectedOrder(null)
  }, [])

  const [sortNewestFirst, setSortNewestFirst] = useState(true);

  const sortedOrders = useMemo(() => {
  return [...filteredOrders].sort((a, b) => 
    sortNewestFirst ? b.id - a.id : a.id - b.id
  );
}, [filteredOrders, sortNewestFirst]);

  

const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);


  if (error) {
    return <div className="p-6 text-red-600">Failed to load orders: {error.message}</div>
  }

  if (!orders) return <div className="p-6">Loading...</div>

  return (
    <>
      <header className="bg-background border-b border-primary py-3 px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Logo />
            </Link>
            <h1 className="text-xl font-bold">Orders Management</h1>
          </div>
          <div className="flex items-center space-x-4">
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
        {/* Filtering Section */}
        <div className="mb-6 flex space-x-4">

          {/* Sorting Button */}
          <button
            onClick={() => setSortNewestFirst(prev => !prev)}
            className={`px-3 py-1 rounded-full ${
              sortNewestFirst ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {sortNewestFirst ? 'Newest First' : 'Oldest First'}
          </button>

          
          {/* Order Status Filters */}
          <div className="flex space-x-2">
            {['pending', 'inprocess', 'delivered', 'declined'].map(status => (
              <button
                key={status}
                onClick={() => 
                  setFilters(prev => ({
                    ...prev,
                    statuses: prev.statuses.includes(status)
                      ? prev.statuses.filter(s => s !== status)
                      : [...prev.statuses, status]
                  }))
                }
                className={`px-3 py-1 rounded-full ${
                  filters.statuses.includes(status) 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Payment Status Filters */}
          <div className="flex space-x-2">
            {['paid', 'unpaid'].map(paymentStatus => (
              <button
                key={paymentStatus}
                onClick={() => 
                  setFilters(prev => ({
                    ...prev,
                    paymentStatuses: prev.paymentStatuses.includes(paymentStatus)
                      ? prev.paymentStatuses.filter(s => s !== paymentStatus)
                      : [...prev.paymentStatuses, paymentStatus]
                  }))
                }
                className={`px-3 py-1 rounded-full ${
                  filters.paymentStatuses.includes(paymentStatus) 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search orders by name or ID..."
            value={filters.searchTerm}
            onChange={(e) => setFilters(prev => ({...prev, searchTerm: e.target.value}))}
            className="w-full h-12 pl-10 pr-4 py-2 bg-secondary text-text rounded-lg focus:outline-none focus:ring-0"
          />

        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full bg-background border border-gray-200">
            <thead>
              <tr className="bg-primary text-secondary">
                <th className="py-4 px-6 text-left font-semibold">Order ID</th>
                <th className="py-4 px-6 text-left font-semibold">Client Name</th>
                <th className="py-4 px-6 text-left font-semibold">Client Address</th>
                <th className="py-4 px-6 text-left font-semibold">Order Status</th>
                <th className="py-4 px-6 text-left font-semibold">Payment Method</th>
                <th className="py-4 px-6 text-left font-semibold">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-secondary cursor-pointer transition-colors duration-150"
                    onClick={() => handleRowClick(order)}
                  >
                    <td className="py-4 px-6 text-text">{order.id}</td>
                    <td className="py-4 px-6 text-text">{order.client_name}</td>
                    <td className="py-4 px-6 text-text">{order.client_address}</td>
                    <td className="py-4 px-6">
                      <OrderStatusBadge status={order.order_status} />
                    </td>
                    <td className="py-4 px-6">{order.payment_method}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 rounded-full text-white ${
                          order.payment_status === 'paid' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      >
                        {order.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 px-6 text-center text-text">
                    No orders found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredOrders.length > ordersPerPage && (
          <div className="flex justify-center mt-4 space-x-2">
            {pageNumbers.map(number => (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                className={`px-4 py-2 rounded ${
                  currentPage === number 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {number}
              </button>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <OrderDetailsModal 
            order={selectedOrder} 
            onClose={closeModal} 
            mutate={mutate}
          />
        )}
      </div>
    </>
  )
}

export default Page