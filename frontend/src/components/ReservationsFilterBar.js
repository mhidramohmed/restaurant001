'use client'

import { useEffect, useState, useRef } from 'react'
import { ChevronDown, X, Search, Calendar, SortAsc, SortDesc } from 'lucide-react'

const ReservationsFilterBar = ({ filters, setFilters, sortNewestFirst, setSortNewestFirst }) => {
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [isDateOpen, setIsDateOpen] = useState(false)
  const statusRef = useRef(null)
  const dateRef = useRef(null)

  // Handle click outside dropdown to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setIsStatusOpen(false)
      }
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setIsDateOpen(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Preset date ranges
  const dateRanges = [
    { label: 'Today', value: 'today' },
    { label: 'Tomorrow', value: 'tomorrow' },
    { label: 'This Week', value: 'thisWeek' },
    { label: 'Next Week', value: 'nextWeek' },
  ]

  const handleDateRangeSelect = (range) => {
    setFilters(prev => ({...prev, dateRange: range}))
    setIsDateOpen(false)
  }

  // Function to clear all filters
  const clearAllFilters = () => {
    setFilters({
      searchTerm: '',
      statuses: [],
      dateRange: null
    })
    setSortNewestFirst(true)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4 lg:items-center">
        {/* Search Box */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={filters.searchTerm}
            onChange={(e) => setFilters(prev => ({...prev, searchTerm: e.target.value}))}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Reservation Status Dropdown */}
        <div ref={statusRef} className="relative">
          <button 
            className="flex items-center justify-between w-full md:w-auto px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50"
            onClick={() => setIsStatusOpen(!isStatusOpen)}
          >
            <span className="mr-2">Status</span>
            <span className="flex items-center">
              {filters.statuses.length > 0 && (
                <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-1">
                  {filters.statuses.length}
                </span>
              )}
              <ChevronDown size={16} />
            </span>
          </button>
          
          {isStatusOpen && (
            <div className="absolute z-10 mt-1 w-56 rounded-md shadow-lg bg-white">
              <div className="p-2">
                {['pending', 'confirmed', 'cancelled'].map(status => (
                  <div key={status} className="flex items-center px-2 py-1 hover:bg-gray-100 rounded-md">
                    <input
                      type="checkbox"
                      id={`status-${status}`}
                      checked={filters.statuses.includes(status)}
                      onChange={() => 
                        setFilters(prev => ({
                          ...prev,
                          statuses: prev.statuses.includes(status)
                            ? prev.statuses.filter(s => s !== status)
                            : [...prev.statuses, status]
                        }))
                      }
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor={`status-${status}`} className="ml-2 text-sm text-gray-700">
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Date Filter Dropdown */}
        <div ref={dateRef} className="relative">
          <button 
            className="flex items-center justify-between w-full md:w-auto px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50"
            onClick={() => setIsDateOpen(!isDateOpen)}
          >
            <span className="flex items-center">
              <Calendar size={16} className="mr-2" />
              {filters.dateRange ? 
                dateRanges.find(range => range.value === filters.dateRange)?.label : 
                'Time Period'}
            </span>
            <ChevronDown size={16} />
          </button>
          
          {isDateOpen && (
            <div className="absolute z-10 mt-1 w-48 rounded-md shadow-lg bg-white">
              <div className="p-2">
                {dateRanges.map(range => (
                  <div 
                    key={range.value} 
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                    onClick={() => handleDateRangeSelect(range.value)}
                  >
                    {range.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sort Order Toggle */}
        <button
          onClick={() => setSortNewestFirst(prev => !prev)}
          className="flex items-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          {sortNewestFirst ? (
            <>
              <SortDesc size={16} className="mr-2" />
              <span>Newest First</span>
            </>
          ) : (
            <>
              <SortAsc size={16} className="mr-2" />
              <span>Oldest First</span>
            </>
          )}
        </button>

        {/* Clear All Filters */}
        <button
          onClick={clearAllFilters}
          className="flex items-center px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
        >
          <X size={16} className="mr-2" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Active Filters Indicators */}
      {(filters.statuses.length > 0 || filters.dateRange || filters.searchTerm) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {filters.statuses.map(status => (
            <span key={status} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-white">
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <X 
                size={14} 
                className="ml-1 cursor-pointer" 
                onClick={() => setFilters(prev => ({
                  ...prev,
                  statuses: prev.statuses.filter(s => s !== status)
                }))}
              />
            </span>
          ))}
          
          {filters.dateRange && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
              {dateRanges.find(range => range.value === filters.dateRange)?.label}
              <X 
                size={14} 
                className="ml-1 cursor-pointer" 
                onClick={() => setFilters(prev => ({...prev, dateRange: null}))}
              />
            </span>
          )}
          
          {filters.searchTerm && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-500 text-white">
              Search: {filters.searchTerm}
              <X 
                size={14} 
                className="ml-1 cursor-pointer" 
                onClick={() => setFilters(prev => ({...prev, searchTerm: ''}))}
              />
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default ReservationsFilterBar