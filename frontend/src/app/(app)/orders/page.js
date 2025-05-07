'use client'

import { useContext, useState, useMemo, useCallback, useEffect } from 'react'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/navigation'
import OrdersFilterBar from '@/components/OrdersFilterBar'
import OrderDetailsModal from '@/components/OrderDetailsModal'
import ResponsiveOrdersTable from '@/components/ResponsiveOrdersTable'
import { DataContext } from './layout' // Import the context

const Page = () => {
    const router = useRouter()
    const { user } = useAuth({ middleware: 'auth' })

    // Get shared data from context instead of re-fetching
    const { orders, mutateOrders, markOrderViewed, ordersError } =
        useContext(DataContext)

    const [filters, setFilters] = useState({
        searchTerm: '',
        statuses: ['pending'],
        paymentStatuses: [],
        dateRange: null,
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

    // Mark viewed orders when they appear in the modal
    useEffect(() => {
        if (selectedOrder && selectedOrder.order_status === 'pending') {
            markOrderViewed(selectedOrder.id)
        }
    }, [selectedOrder, markOrderViewed])

    const filteredOrders = useMemo(() => {
        if (!orders) return []

        return orders.filter(order => {
            // Search filter
            const matchesSearch =
                !filters.searchTerm ||
                order.client_name
                    ?.toLowerCase()
                    .includes(filters.searchTerm.toLowerCase()) ||
                order.id?.toString().includes(filters.searchTerm)

            // Status filter
            const matchesStatus =
                filters.statuses.length === 0 ||
                filters.statuses.includes(order.order_status)

            // Payment status filter
            const matchesPaymentStatus =
                filters.paymentStatuses.length === 0 ||
                filters.paymentStatuses.includes(order.payment_status)

            // Date filter
            let matchesDate = true
            if (filters.dateRange) {
                const orderDate = new Date(order.created_at)
                const now = new Date()

                switch (filters.dateRange) {
                    case 'last24h':
                        matchesDate = now - orderDate <= 24 * 60 * 60 * 1000
                        break
                    case 'last3d':
                        matchesDate = now - orderDate <= 3 * 24 * 60 * 60 * 1000
                        break
                    case 'last7d':
                        matchesDate = now - orderDate <= 7 * 24 * 60 * 60 * 1000
                        break
                    case 'last30d':
                        matchesDate =
                            now - orderDate <= 30 * 24 * 60 * 60 * 1000
                        break
                    default:
                        matchesDate = true
                }
            }

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPaymentStatus &&
                matchesDate
            )
        })
    }, [
        orders,
        filters.searchTerm,
        filters.statuses.join(','),
        filters.paymentStatuses.join(','),
        filters.dateRange,
    ])

    const sortedOrders = useMemo(() => {
        if (!filteredOrders.length) return []

        // Note: Using Number() to ensure proper numeric comparison
        return [...filteredOrders].sort((a, b) =>
            sortNewestFirst
                ? Number(b.id) - Number(a.id)
                : Number(a.id) - Number(b.id),
        )
    }, [filteredOrders, sortNewestFirst])

    const handleRowClick = useCallback(order => {
        setSelectedOrder(order)
    }, [])

    const closeModal = useCallback(() => {
        setSelectedOrder(null)
    }, [])

    if (ordersError) {
        return (
            <div className="p-6 text-red-600">
                Failed to load orders: {ordersError.message}
            </div>
        )
    }

    if (!orders) return <div className="p-6">Loading...</div>

    return (
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
                    mutate={mutateOrders}
                />
            )}
        </div>
    )
}

export default Page
