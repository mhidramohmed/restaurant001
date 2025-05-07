'use client'

import useSWR from 'swr'
import axios from '@/lib/axios'
import { useAuth } from '@/hooks/auth'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import ReservationsFilterBar from '@/components/ReservationsFilterBar'
import ReservationDetailsModal from '@/components/ReservationDetailsModal'
import ResponsiveReservationsTable from '@/components/ResponsiveReservationsTable'

const fetcher = async (url) => {
    const response = await axios.get(url)
    return response.data.data || response.data
}

const Page = () => {
  const router = useRouter()
  const { user } = useAuth({ middleware: 'auth' })
  const { data: reservations, error, mutate } = useSWR(
    user ? '/api/reservations' : null,
    fetcher, { refreshInterval: 5000 }
  )

  const [filters, setFilters] = useState({
    searchTerm: '',
    statuses: ['pending'],
    dateRange: null
  })

  const [selectedReservation, setSelectedReservation] = useState(null)
  const [sortNewestFirst, setSortNewestFirst] = useState(true)
  const [sortByReservationDate, setSortByReservationDate] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else if (user?.role !== 'admin') {
      router.push('/orders')
    }
  }, [user, router])

  const filteredReservations = useMemo(() => {
    if (!reservations) return []

    return reservations.filter(reservation => {
      // Search filter
      const matchesSearch = !filters.searchTerm || 
        reservation.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        reservation.phone.includes(filters.searchTerm) ||
        reservation.id.toString().includes(filters.searchTerm)

      // Status filter
      const matchesStatus = filters.statuses.length === 0 || 
        filters.statuses.includes(reservation.status)
        
      // Date filter
      let matchesDate = true
      if (filters.dateRange) {
        const reservationDate = new Date(reservation.date)
        const now = new Date()
        
        switch(filters.dateRange) {
          case 'today': {
            matchesDate = reservationDate.toDateString() === now.toDateString()
            break }
          case 'tomorrow': {
            const tomorrow = new Date()
            tomorrow.setDate(now.getDate() + 1)
            matchesDate = reservationDate.toDateString() === tomorrow.toDateString()
            break }
          case 'thisWeek': {
            const weekEnd = new Date()
            weekEnd.setDate(now.getDate() + 7)
            matchesDate = reservationDate >= now && reservationDate <= weekEnd
            break }
          case 'nextWeek': {
            const nextWeekStart = new Date()
            nextWeekStart.setDate(now.getDate() + 7)
            const nextWeekEnd = new Date()
            nextWeekEnd.setDate(now.getDate() + 14)
            matchesDate = reservationDate >= nextWeekStart && reservationDate <= nextWeekEnd
            break }
          default:
            matchesDate = true
        }
      }

      return matchesSearch && matchesStatus && matchesDate
    })
  }, [
    reservations, 
    filters.searchTerm, 
    filters.statuses.join(','),
    filters.dateRange
  ])

  const sortedReservations = useMemo(() => {
    if (!filteredReservations.length) return []
    
    return [...filteredReservations].sort((a, b) => {
      // Determine which date field to sort by
      const getDateA = sortByReservationDate 
          ? new Date(a.date + ' ' + (a.time || '00:00'))
          : new Date(a.created_at || a.date); // Fallback to reservation date if entry date missing
              
      const getDateB = sortByReservationDate
          ? new Date(b.date + ' ' + (b.time || '00:00'))
          : new Date(b.created_at || b.date); // Fallback to reservation date if entry date missing
      
      // Sort by selected date type and direction
      if (sortNewestFirst) {
          return getDateB - getDateA; // Newest first
      } else {
          return getDateA - getDateB; // Oldest first
      }
    })
  }, [filteredReservations, sortNewestFirst, sortByReservationDate])

  const handleRowClick = useCallback((reservation) => {
    setSelectedReservation(reservation)
  }, [])

  const closeModal = useCallback(() => {
    setSelectedReservation(null)
  }, [])

  if (error) {
    return <div className="p-6 text-red-600">Failed to load reservations: {error.message}</div>
  }

  if (!reservations) return <div className="p-6">Loading...</div>

  return (
    <>
      <header className="bg-background pb-2 px-6">
        <div className="flex justify-between items-center mb-4 gap-4">
          <h1 className="text-2xl font-bold">Reservations</h1>
        </div>
      </header>

      <div className="p-6 pt-0">
        {/* Filtering Section */}
        <ReservationsFilterBar 
          filters={filters}
          setFilters={setFilters}
          sortNewestFirst={sortNewestFirst}
          setSortNewestFirst={setSortNewestFirst}
          sortByReservationDate={sortByReservationDate}
          setSortByReservationDate={setSortByReservationDate}
        />

        {/* Enhanced Responsive Reservations Table */}
        <ResponsiveReservationsTable 
          reservations={sortedReservations}
          onRowClick={handleRowClick}
          emptyMessage="No reservations found matching your filters."
        />

        {/* Reservation Details Modal */}
        {selectedReservation && (
          <ReservationDetailsModal 
            reservation={selectedReservation} 
            onClose={closeModal} 
            mutate={mutate}
          />
        )}
      </div>
    </>
  )
}

export default Page