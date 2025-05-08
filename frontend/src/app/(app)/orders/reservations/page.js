'use client'

import { useContext, useState, useMemo, useCallback, useEffect } from 'react'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/navigation'
import ReservationsFilterBar from '@/components/ReservationsFilterBar'
import ReservationDetailsModal from '@/components/ReservationDetailsModal'
import ResponsiveReservationsTable from '@/components/ResponsiveReservationsTable'
import { DataContext } from '../layout' 

const Page = () => {
    const router = useRouter()
    const { user } = useAuth({ middleware: 'auth' })

    // Get shared data from context instead of re-fetching
    const {
        reservations,
        mutateReservations,
        markReservationViewed,
        reservationsError,
    } = useContext(DataContext)

    const [filters, setFilters] = useState({
        searchTerm: '',
        statuses: ['pending'],
        dateRange: null,
    })

    const [selectedReservation, setSelectedReservation] = useState(null)
    const [sortNewestFirst, setSortNewestFirst] = useState(true)
    const [sortByReservationDate, setSortByReservationDate] = useState(false)

    useEffect(() => {
        if (!user) {
            router.push('/login')
        } else if (user?.role !== 'user') {
            router.push('/dashboard')
        }
    }, [user, router])

    // Mark viewed reservations when they appear in the modal
    useEffect(() => {
        if (selectedReservation && selectedReservation.status === 'pending') {
            markReservationViewed(selectedReservation.id)
        }
    }, [selectedReservation, markReservationViewed])

    const filteredReservations = useMemo(() => {
        if (!reservations) return []

        return reservations.filter(reservation => {
            // Search filter
            const matchesSearch =
                !filters.searchTerm ||
                reservation.name
                    ?.toLowerCase()
                    .includes(filters.searchTerm.toLowerCase()) ||
                reservation.phone?.includes(filters.searchTerm) ||
                reservation.id?.toString().includes(filters.searchTerm)

            // Status filter
            const matchesStatus =
                filters.statuses.length === 0 ||
                filters.statuses.includes(reservation.status)

            // Date filter
            let matchesDate = true
            if (filters.dateRange) {
                const reservationDate = new Date(reservation.date)
                const now = new Date()

                switch (filters.dateRange) {
                    case 'today': {
                        matchesDate =
                            reservationDate.toDateString() ===
                            now.toDateString()
                        break
                    }
                    case 'tomorrow': {
                        const tomorrow = new Date()
                        tomorrow.setDate(now.getDate() + 1)
                        matchesDate =
                            reservationDate.toDateString() ===
                            tomorrow.toDateString()
                        break
                    }
                    case 'thisWeek': {
                        const weekEnd = new Date()
                        weekEnd.setDate(now.getDate() + 7)
                        matchesDate =
                            reservationDate >= now && reservationDate <= weekEnd
                        break
                    }
                    case 'nextWeek': {
                        const nextWeekStart = new Date()
                        nextWeekStart.setDate(now.getDate() + 7)
                        const nextWeekEnd = new Date()
                        nextWeekEnd.setDate(now.getDate() + 14)
                        matchesDate =
                            reservationDate >= nextWeekStart &&
                            reservationDate <= nextWeekEnd
                        break
                    }
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
        filters.dateRange,
    ])

    const sortedReservations = useMemo(() => {
        if (!filteredReservations.length) return []
        
        return [...filteredReservations].sort((a, b) => {
            // Determine which date field to sort by
            const getDateA = sortByReservationDate 
                ? new Date(a.date + ' ' + (a.time || '00:00'))
                : new Date(a.created_at || a.date) // Fallback to reservation date if entry date missing
                
            const getDateB = sortByReservationDate
                ? new Date(b.date + ' ' + (b.time || '00:00'))
                : new Date(b.created_at || b.date) // Fallback to reservation date if entry date missing
            
            // Sort by selected date type and direction
            if (sortNewestFirst) {
                return getDateB - getDateA // Newest first
            } else {
                return getDateA - getDateB // Oldest first
            }
        })
    }, [filteredReservations, sortNewestFirst, sortByReservationDate])

    const handleRowClick = useCallback(reservation => {
        setSelectedReservation(reservation)
    }, [])

    const closeModal = useCallback(() => {
        setSelectedReservation(null)
    }, [])

    if (reservationsError) {
        return (
            <div className="p-6 text-red-600">
                Failed to load reservations: {reservationsError.message}
            </div>
        )
    }

    if (!reservations) return <div className="p-6">Loading...</div>

    return (
        <div className="p-6">
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
                    mutate={mutateReservations}
                />
            )}
        </div>
    )
}

export default Page