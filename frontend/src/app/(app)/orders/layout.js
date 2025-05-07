'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/hooks/auth'
import Loading from '@/app/(app)/Loading'
import useSWR from 'swr'
import axios from '@/lib/axios'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { useRouter, usePathname } from 'next/navigation'

const fetcher = async (url) => {
    const response = await axios.get(url)
    const data = response.data.data || response.data
    
    // Ensure data is sorted by ID in ascending order right after fetching
    if (Array.isArray(data)) {
        return data.sort((a, b) => Number(a.id) - Number(b.id))
    }
    return data
}

const notificationSound = '/notification.mp3'

// Create a context to share the data with child components
export const DataContext = React.createContext({});

const AppLayout = ({ children }) => {
    const router = useRouter()
    const pathname = usePathname()
    const { user, logout } = useAuth({ middleware: 'auth' })
    
    // Track known item IDs to detect truly new items
    const initialDataLoadRef = useRef(true)
    const previousOrderIdsRef = useRef(new Set())
    const previousReservationIdsRef = useRef(new Set())
    
    // Track which pending items have been viewed by the user
    const [viewedOrderIds, setViewedOrderIds] = useState(() => {
        // Initialize from localStorage if available
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('viewedOrderIds')
                return saved ? new Set(JSON.parse(saved)) : new Set()
            } catch (e) {
                console.error("Error loading viewed order IDs from localStorage:", e)
                return new Set()
            }
        }
        return new Set()
    })
    
    const [viewedReservationIds, setViewedReservationIds] = useState(() => {
        // Initialize from localStorage if available
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('viewedReservationIds')
                return saved ? new Set(JSON.parse(saved)) : new Set()
            } catch (e) {
                console.error("Error loading viewed reservation IDs from localStorage:", e)
                return new Set()
            }
        }
        return new Set()
    })
    
    // Only create Audio object on client side
    const [audio, setAudio] = useState(null)
    
    useEffect(() => {
        // Initialize audio only on client side
        setAudio(new Audio(notificationSound))
    }, [])

    // Fetch data once at the layout level
    const { data: orders, error: ordersError, mutate: mutateOrders } = useSWR(
        user ? '/api/orders' : null,
        fetcher, { refreshInterval: 5000 }
    )
    
    const { data: reservations, error: reservationsError, mutate: mutateReservations } = useSWR(
        user ? '/api/reservations' : null,
        fetcher, { refreshInterval: 5000 }
    )

    // Save viewed IDs to localStorage whenever they change
    useEffect(() => {
        if (typeof window !== 'undefined' && viewedOrderIds.size > 0) {
            localStorage.setItem('viewedOrderIds', JSON.stringify([...viewedOrderIds]))
        }
    }, [viewedOrderIds])

    useEffect(() => {
        if (typeof window !== 'undefined' && viewedReservationIds.size > 0) {
            localStorage.setItem('viewedReservationIds', JSON.stringify([...viewedReservationIds]))
        }
    }, [viewedReservationIds])

    // Handle initial data load and subsequent updates separately
    useEffect(() => {
        if (!orders || !audio) return;
        
        // Convert orders to set of IDs
        const currentOrderIds = new Set(orders.map(order => order.id));
        
        if (initialDataLoadRef.current) {
            // Just update the previous IDs on first load, don't play sounds
            previousOrderIdsRef.current = currentOrderIds;
        } else {
            // Find truly new orders that weren't in the previous fetch
            const newOrders = orders.filter(order => !previousOrderIdsRef.current.has(order.id));
            
            if (newOrders.length > 0) {
                try {
                    audio.play().catch(e => console.error("Audio play error:", e));
                } catch (err) {
                    console.error("Error playing notification sound:", err);
                }
                
                // Auto-mark completed or cancelled orders as viewed
                newOrders.forEach(order => {
                    if (order.order_status !== 'pending') {
                        setViewedOrderIds(prev => new Set([...prev, order.id]));
                    }
                });
            }
            
            // Update the previous IDs reference for next comparison
            previousOrderIdsRef.current = currentOrderIds;
        }
    }, [orders, audio]);

    useEffect(() => {
        if (!reservations || !audio) return;
        
        // Convert reservations to set of IDs
        const currentReservationIds = new Set(reservations.map(reservation => reservation.id));
        
        if (initialDataLoadRef.current) {
            // Just update the previous IDs on first load, don't play sounds
            previousReservationIdsRef.current = currentReservationIds;
        } else {
            // Find truly new reservations that weren't in the previous fetch
            const newReservations = reservations.filter(reservation => 
                !previousReservationIdsRef.current.has(reservation.id)
            );
            
            if (newReservations.length > 0) {
                try {
                    audio.play().catch(e => console.error("Audio play error:", e));
                } catch (err) {
                    console.error("Error playing notification sound:", err);
                }
                
                // Auto-mark completed or cancelled reservations as viewed
                newReservations.forEach(reservation => {
                    if (reservation.status !== 'pending') {
                        setViewedReservationIds(prev => new Set([...prev, reservation.id]));
                    }
                });
            }
            
            // Update the previous IDs reference for next comparison
            previousReservationIdsRef.current = currentReservationIds;
        }
    }, [reservations, audio]);

    // After initial data is loaded for both orders and reservations, set initialization flag to false
    useEffect(() => {
        if (initialDataLoadRef.current && orders && reservations) {
            // Wait a bit to ensure everything is processed before enabling notifications
            const timer = setTimeout(() => {
                initialDataLoadRef.current = false;
            }, 1000);
            
            return () => clearTimeout(timer);
        }
    }, [orders, reservations]);

    // Function to mark order as viewed
    const markOrderViewed = (orderId) => {
        setViewedOrderIds(prev => new Set([...prev, orderId]));
    }

    // Function to mark reservation as viewed
    const markReservationViewed = (reservationId) => {
        setViewedReservationIds(prev => new Set([...prev, reservationId]));
    }

    if (!user) {
        return <Loading />
    }

    // Get unviewed pending counts for badges
    const pendingOrdersCount = orders?.filter(
        order => order.order_status === 'pending' && !viewedOrderIds.has(order.id)
    ).length || 0;
    
    // Fixed - use consistent variable name and property check
    const pendingReservationsCount = reservations?.filter(
        reservation => reservation.status === 'pending' && !viewedReservationIds.has(reservation.id)
    ).length || 0;

    // Context value to pass to children
    const contextValue = {
        orders,  // Already sorted in fetcher
        reservations,  // Already sorted in fetcher
        mutateOrders,
        mutateReservations,
        markOrderViewed,
        markReservationViewed,
        ordersError,
        reservationsError,
        viewedOrderIds,
        viewedReservationIds // Make sure to include this in the context
    }

    // Safely log data - only if it exists
    if (process.env.NODE_ENV === 'development' && reservations) {
        console.log('Reservations data:', reservations);
        console.log('Viewed reservation IDs:', [...viewedReservationIds]);
        console.log('Pending reservations count:', pendingReservationsCount);
    }
    
    return (
        <DataContext.Provider value={contextValue}>
            <div className="min-h-screen bg-gray-100">
            <header className="bg-background border-b border-primary py-3 px-4 md:px-6">
  {/* Main Container */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full space-y-4 md:space-y-0">
    
    {/* Top Row: Logo + Nav (on md+), Logo + Logout (on small) */}
    <div className="flex w-full items-center justify-between md:justify-start md:space-x-6">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Logo />
      </Link>

      {/* Logout button - visible only on small screens */}
      <button
        onClick={logout}
        className="md:hidden px-4 py-2 bg-primary text-background border border-primary rounded-md hover:bg-opacity-90 transition"
      >
        Logout
      </button>

      {/* Nav - visible on md+ only */}
      <nav className="hidden md:flex">
        <Link
          href="/orders"
          className={`px-4 py-2 rounded-l-md border border-primary flex items-center justify-center ${pathname === '/orders' ? 'bg-primary text-background' : 'bg-background text-primary'}`}
        >
          Orders
          {pendingOrdersCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {pendingOrdersCount}
            </span>
          )}
        </Link>
        <Link
          href="/orders/reservations"
          className={`px-4 py-2 rounded-r-md border-t border-b border-r border-primary flex items-center justify-center ${pathname === '/orders/reservations' ? 'bg-primary text-background' : 'bg-background text-primary'}`}
        >
          Reservations
          {pendingReservationsCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {pendingReservationsCount}
            </span>
          )}
        </Link>
      </nav>

      {/* Spacer to push logout button far right on md+ */}
      <div className="hidden md:block flex-grow"></div>

      {/* Logout button - visible only on md+ */}
      <div className="hidden md:block">
        <button
          onClick={logout}
          className="px-4 py-2 bg-primary text-background border border-primary rounded-md hover:bg-opacity-90 transition"
        >
          Logout
        </button>
      </div>
    </div>

    {/* Nav on small screens */}
    <div className="md:hidden w-full">
      <nav className="flex flex-col w-full">
        <Link
          href="/orders"
          className={`w-full px-4 py-2 border-b border-primary rounded-t-md ${pathname === '/orders' ? 'bg-primary text-background' : 'bg-background text-primary border border-primary'}`}
        >
          <div className="flex justify-between items-center">
            <span>Orders</span>
            {pendingOrdersCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {pendingOrdersCount}
              </span>
            )}
          </div>
        </Link>
        <Link
          href="/orders/reservations"
          className={`w-full px-4 py-2 rounded-b-md ${pathname === '/orders/reservations' ? 'bg-primary text-background' : 'bg-background text-primary border border-primary'}`}
        >
          <div className="flex justify-between items-center">
            <span>Reservations</span>
            {pendingReservationsCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {pendingReservationsCount}
              </span>
            )}
          </div>
        </Link>
      </nav>
    </div>
  </div>
</header>

                <main>{children}</main>
            </div>
        </DataContext.Provider>
    )
}

export default AppLayout