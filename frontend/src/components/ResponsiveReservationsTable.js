'use client'

import { useState } from 'react'
import { useMediaQuery } from "@/hooks/use-media-query"
import { ChevronLeft, ChevronRight, Settings, ChevronDown, Users } from 'lucide-react'

const ReservationStatusBadge = ({ status }) => {
  const statusColors = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-green-500',
    cancelled: 'bg-red-500'
  }

  return (
    <span
      className={`px-2 py-1 text-center rounded-full text-white ${statusColors[status] || 'bg-gray-500'}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

const formatDate = (dateString) => {
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const formatTime = (timeString) => {
  if (!timeString) return 'Not specified'
  
  try {
    // Parse time in HH:MM:SS format
    const [hours, minutes] = timeString.split(':')
    const date = new Date()
    date.setHours(parseInt(hours, 10))
    date.setMinutes(parseInt(minutes, 10))
    
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch (e) {
    return timeString // Fallback to original string if parsing fails
  }
}

const ResponsiveReservationsTable = ({ 
  reservations, 
  onRowClick, 
  emptyMessage = "No reservations found matching your filters." 
}) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  
  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    name: true,
    phone: true,
    date: true,
    time: true,
    guests: true,
    status: true,
    created_at: true 
  })
  
  // Column dropdown state
  const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  // Calculate paginated items
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = reservations.slice(indexOfFirstItem, indexOfLastItem)
  
  // Total pages calculation
  const totalPages = Math.ceil(reservations.length / itemsPerPage)
  
  // Toggle column visibility
  const toggleColumn = (columnName) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnName]: !prev[columnName]
    }))
  }
  
  // Handle page change
  const changePage = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // Column definitions with labels
  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'Name' },
    { id: 'phone', label: 'Phone' },
    { id: 'date', label: 'Reservation Date' },
    { id: 'time', label: 'Reservation Time' },
    { id: 'guests', label: 'Guests' },
    { id: 'status', label: 'Status' },
    { id: 'created_at', label: 'Booked On' }
  ]
  
  // Visible columns based on current state
  const activeColumns = columns.filter(column => visibleColumns[column.id])
  
  // Render table view for desktop
  const renderTableView = () => (
    <div className="overflow-x-auto rounded-lg shadow-lg">
      <table className="min-w-full bg-background border border-gray-200">
        <thead>
          <tr className="bg-primary text-secondary">
            {activeColumns.map(column => (
              <th key={column.id} className="py-4 px-6 text-left font-semibold">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((reservation) => (
              <tr
                key={reservation.id}
                className="hover:bg-secondary cursor-pointer transition-colors duration-150"
                onClick={() => onRowClick(reservation)}
              >
                {visibleColumns.id && <td className="py-4 px-6 text-text">{reservation.id}</td>}
                {visibleColumns.name && <td className="py-4 px-6 text-text">{reservation.name}</td>}
                {visibleColumns.phone && <td className="py-4 px-6 text-text">{reservation.phone}</td>}
                {visibleColumns.date && <td className="py-4 px-6 text-text">{formatDate(reservation.date)}</td>}
                {visibleColumns.time && <td className="py-4 px-6 text-text">{formatTime(reservation.time)}</td>}
                {visibleColumns.guests && (
                  <td className="py-4 px-6 text-text">
                    <div className="flex items-center">
                      <Users size={16} className="mr-1" />
                      {reservation.guests}
                    </div>
                  </td>
                )}
                {visibleColumns.status && (
                  <td className="py-4 px-6">
                    <ReservationStatusBadge status={reservation.status} />
                  </td>
                )}
                {visibleColumns.created_at && (
    <td className="py-4 px-6 text-text text-sm">
        {formatDateTime(reservation.created_at)}
    </td>
)}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={activeColumns.length} className="py-4 px-6 text-center text-text">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
  
  // Render card view for mobile/tablet
  const renderCardView = () => (
    <div className="grid grid-cols-1 gap-4">
      {currentItems.length > 0 ? (
        currentItems.map((reservation) => (
          <div 
            key={reservation.id} 
            className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onRowClick(reservation)}
          >
            <div className="flex justify-between items-start mb-3">
              {visibleColumns.name && (
                <div className="font-semibold">
                  {reservation.name}
                </div>
              )}
              {visibleColumns.status && (
                <ReservationStatusBadge status={reservation.status} />
              )}
            </div>
            
            <div className="space-y-2">
              {visibleColumns.phone && (
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Phone:</span>
                  <span className="font-medium">{reservation.phone}</span>
                </div>
              )}
              
              {visibleColumns.date && (
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Date:</span>
                  <span>{formatDate(reservation.date)}</span>
                </div>
              )}
              
              {visibleColumns.time && (
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Time:</span>
                  <span>{formatTime(reservation.time)}</span>
                </div>
              )}
              
              {visibleColumns.guests && (
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Guests:</span>
                  <div className="flex items-center">
                    <Users size={16} className="mr-1" />
                    {reservation.guests}
                  </div>
                </div>
              )}
              {visibleColumns.created_at && (
    <div className="grid grid-cols-2">
        <span className="text-gray-500">Booked On:</span>
        <span className="text-sm">{formatDateTime(reservation.created_at)}</span>
    </div>
)}
              {visibleColumns.id && (
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">ID:</span>
                  <span>#{reservation.id}</span>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="py-4 px-6 text-center text-text bg-white rounded-lg shadow">
          {emptyMessage}
        </div>
      )}
    </div>
  )
  
  return (
    <div className="space-y-4">
      <div className="flex flex-row justify-between items-center gap-3">
        {/* Column selector */}
        <div className="relative">
          <button
            onClick={() => setIsColumnSelectorOpen(!isColumnSelectorOpen)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
          >
            <Settings size={16} />
            <span>Display columns</span>
            <ChevronDown size={16} />
          </button>
          
          {isColumnSelectorOpen && (
            <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-56">
              <div className="space-y-2">
                {columns.map(column => (
                  <label key={column.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visibleColumns[column.id]}
                      onChange={() => toggleColumn(column.id)}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span>{column.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Items per page selector */}
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value))
              setCurrentPage(1) // Reset to first page when changing items per page
            }}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            {[5, 10, 20, 50].map(value => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Render appropriate view based on screen size */}
      {isDesktop ? renderTableView() : renderCardView()}
      
      {/* Pagination */}
      {reservations.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, reservations.length)} of {reservations.length} items
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            
            {/* Page number buttons */}
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // For showing correct pagination numbers with ellipsis
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => changePage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      currentPage === pageNum
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            
            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResponsiveReservationsTable