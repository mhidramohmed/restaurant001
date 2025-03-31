'use client'

import useSWR from 'swr'
import axios from '@/lib/axios'
import MainButton from '@/components/MainButton'
import { useAuth } from '@/hooks/auth'
import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'
import OrdersFilterBar from '@/components/OrdersFilterBar'
import OrderDetailsModal from '@/components/OrderDetailsModal'
import ResponsiveOrdersTable from '@/components/ResponsiveOrdersTable'

const fetcher = async (url) => {
    const response = await axios.get(url)
    return response.data.data || response.data
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
    paymentStatuses: [],
    dateRange: null
  })

  const [selectedOrder, setSelectedOrder] = useState(null)
  const [sortNewestFirst, setSortNewestFirst] = useState(true)

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
        
      // Date filter
      let matchesDate = true
      if (filters.dateRange) {
        const orderDate = new Date(order.created_at);
        const now = new Date();
        
        switch(filters.dateRange) {
          case 'last24h':
            matchesDate = (now - orderDate) <= 24 * 60 * 60 * 1000;
            break;
          case 'last3d':
            matchesDate = (now - orderDate) <= 3 * 24 * 60 * 60 * 1000;
            break;
          case 'last7d':
            matchesDate = (now - orderDate) <= 7 * 24 * 60 * 60 * 1000;
            break;
          case 'last30d':
            matchesDate = (now - orderDate) <= 30 * 24 * 60 * 60 * 1000;
            break;
          default:
            matchesDate = true;
        }
      }

      return matchesSearch && matchesStatus && matchesPaymentStatus && matchesDate
    })
  }, [
    orders, 
    filters.searchTerm, 
    filters.statuses.join(','), 
    filters.paymentStatuses.join(','),
    filters.dateRange
  ])

  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => 
      sortNewestFirst ? b.id - a.id : a.id - b.id
    )
  }, [filteredOrders, sortNewestFirst])

  const handleRowClick = useCallback((order) => {
    setSelectedOrder(order)
  }, [])

  const closeModal = useCallback(() => {
    setSelectedOrder(null)
  }, [])

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
        <OrdersFilterBar 
          filters={filters}
          setFilters={setFilters}
          sortNewestFirst={sortNewestFirst}
          setSortNewestFirst={setSortNewestFirst}
        />

        {/* Enhanced Responsive Orders Table */}
        <ResponsiveOrdersTable 
          orders={sortedOrders}
          onRowClick={handleRowClick}
          emptyMessage="No orders found matching your filters."
        />

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