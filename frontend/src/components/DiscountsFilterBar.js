'use client'

import { useEffect, useState, useRef } from 'react'
import { ChevronDown, X, Search, Calendar, SortAsc, SortDesc } from 'lucide-react'

// Enhanced Filtering for Discounts Page
const DiscountsFilterBar = ({ filters, setFilters, sortNewestFirst, setSortNewestFirst }) => {
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [isExpiryOpen, setIsExpiryOpen] = useState(false)
  const [isPercentageOpen, setIsPercentageOpen] = useState(false)
  const statusRef = useRef(null)
  const expiryRef = useRef(null)
  const percentageRef = useRef(null)

  // Handle click outside dropdown to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setIsStatusOpen(false)
      }
      if (expiryRef.current && !expiryRef.current.contains(event.target)) {
        setIsExpiryOpen(false)
      }
      if (percentageRef.current && !percentageRef.current.contains(event.target)) {
        setIsPercentageOpen(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Expiry filters
  const expiryFilters = [
    { label: 'Expiring today', value: 'today' },
    { label: 'Expiring this week', value: 'thisWeek' },
    { label: 'Expiring this month', value: 'thisMonth' },
    { label: 'Already expired', value: 'expired' },
    { label: 'Custom date', value: 'custom' }
  ]

  // Discount percentage ranges
  const percentageRanges = [
    { label: 'Less than 10%', value: 'lt10' },
    { label: '10% - 25%', value: '10to25' },
    { label: '25% - 50%', value: '25to50' },
    { label: '50% - 75%', value: '50to75' },
    { label: 'More than 75%', value: 'gt75' }
  ]

  const handleExpirySelect = (expiry) => {
    setFilters(prev => ({...prev, expiryFilter: expiry}))
    setIsExpiryOpen(false)
  }

  const handlePercentageSelect = (range) => {
    setFilters(prev => {
      const newRanges = prev.percentageRanges.includes(range)
        ? prev.percentageRanges.filter(r => r !== range)
        : [...prev.percentageRanges, range]
      return {...prev, percentageRanges: newRanges}
    })
  }

  // Function to clear all filters
  const clearAllFilters = () => {
    setFilters({
      searchTerm: '',
      statuses: [],
      expiryFilter: null,
      percentageRanges: []
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
            placeholder="Search by menu item name..."
            value={filters.searchTerm}
            onChange={(e) => setFilters(prev => ({...prev, searchTerm: e.target.value}))}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Discount Status Dropdown */}
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
            <div className="absolute z-10 mt-1 w-48 rounded-md shadow-lg bg-white">
              <div className="p-2">
                {['active', 'inactive'].map(status => (
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

        {/* Expiry Filter Dropdown */}
        <div ref={expiryRef} className="relative">
          <button 
            className="flex items-center justify-between w-full md:w-auto px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50"
            onClick={() => setIsExpiryOpen(!isExpiryOpen)}
          >
            <span className="flex items-center">
              <Calendar size={16} className="mr-2" />
              {filters.expiryFilter ? 
                expiryFilters.find(filter => filter.value === filters.expiryFilter)?.label : 
                'Expiry Date'}
            </span>
            <ChevronDown size={16} />
          </button>
          
          {isExpiryOpen && (
            <div className="absolute z-10 mt-1 w-48 rounded-md shadow-lg bg-white">
              <div className="p-2">
                {expiryFilters.map(filter => (
                  <div 
                    key={filter.value} 
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                    onClick={() => handleExpirySelect(filter.value)}
                  >
                    {filter.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Percentage Range Dropdown */}
        <div ref={percentageRef} className="relative">
          <button 
            className="flex items-center justify-between w-full md:w-auto px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50"
            onClick={() => setIsPercentageOpen(!isPercentageOpen)}
          >
            <span className="mr-2">Discount %</span>
            <span className="flex items-center">
              {filters.percentageRanges.length > 0 && (
                <span className="bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-1">
                  {filters.percentageRanges.length}
                </span>
              )}
              <ChevronDown size={16} />
            </span>
          </button>
          
          {isPercentageOpen && (
            <div className="absolute z-10 mt-1 w-48 rounded-md shadow-lg bg-white">
              <div className="p-2">
                {percentageRanges.map(range => (
                  <div key={range.value} className="flex items-center px-2 py-1 hover:bg-gray-100 rounded-md">
                    <input
                      type="checkbox"
                      id={`range-${range.value}`}
                      checked={filters.percentageRanges.includes(range.value)}
                      onChange={() => handlePercentageSelect(range.value)}
                      className="h-4 w-4 text-indigo-500 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`range-${range.value}`} className="ml-2 text-sm text-gray-700">
                      {range.label}
                    </label>
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
      {(filters.statuses.length > 0 || filters.expiryFilter || filters.percentageRanges.length > 0 || filters.searchTerm) && (
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
          
          {filters.expiryFilter && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
              {expiryFilters.find(filter => filter.value === filters.expiryFilter)?.label}
              <X 
                size={14} 
                className="ml-1 cursor-pointer" 
                onClick={() => setFilters(prev => ({...prev, expiryFilter: null}))}
              />
            </span>
          )}
          
          {filters.percentageRanges.map(range => (
            <span key={range} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-500 text-white">
              {percentageRanges.find(r => r.value === range)?.label}
              <X 
                size={14} 
                className="ml-1 cursor-pointer" 
                onClick={() => setFilters(prev => ({
                  ...prev,
                  percentageRanges: prev.percentageRanges.filter(r => r !== range)
                }))}
              />
            </span>
          ))}
          
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

export default DiscountsFilterBar