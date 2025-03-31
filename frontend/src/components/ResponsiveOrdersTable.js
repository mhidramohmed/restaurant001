'use client'

import { useState, useCallback } from 'react'
import { useMediaQuery } from "@/hooks/use-media-query"
import { ChevronLeft, ChevronRight, Check, Settings, ChevronDown } from 'lucide-react'

const OrderStatusBadge = ({ status }) => {
  const statusColors = {
    pending: 'bg-yellow-500',
    inprocess: 'bg-blue-500',
    delivered: 'bg-green-500',
    declined: 'bg-red-500'
  }

  return (
    <span
      className={`px-2 py-1 text-center rounded-full text-white ${statusColors[status] || 'bg-gray-500'}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

const ResponsiveOrdersTable = ({ 
  orders, 
  onRowClick, 
  emptyMessage = "No orders found matching your filters." 
}) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  
  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    client_name: true,
    client_address: true,
    order_status: true,
    payment_method: true,
    payment_status: true
  })
  
  // Column dropdown state
  const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  // Calculate paginated items
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem)
  
  // Total pages calculation
  const totalPages = Math.ceil(orders.length / itemsPerPage)
  
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
  
  // Column definitions with labels
  const columns = [
    { id: 'id', label: 'Order ID' },
    { id: 'client_name', label: 'Client Name' },
    { id: 'client_address', label: 'Client Address' },
    { id: 'order_status', label: 'Order Status' },
    { id: 'payment_method', label: 'Payment Method' },
    { id: 'payment_status', label: 'Payment Status' }
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
            currentItems.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-secondary cursor-pointer transition-colors duration-150"
                onClick={() => onRowClick(order)}
              >
                {visibleColumns.id && <td className="py-4 px-6 text-text">{order.id}</td>}
                {visibleColumns.client_name && <td className="py-4 px-6 text-text">{order.client_name}</td>}
                {visibleColumns.client_address && <td className="py-4 px-6 text-text">{order.client_address}</td>}
                {visibleColumns.order_status && (
                  <td className="py-4 px-6">
                    <OrderStatusBadge status={order.order_status} />
                  </td>
                )}
                {visibleColumns.payment_method && <td className="py-4 px-6">{order.payment_method}</td>}
                {visibleColumns.payment_status && (
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-white ${
                        order.payment_status === 'paid' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {order.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                    </span>
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
        currentItems.map((order) => (
          <div 
            key={order.id} 
            className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onRowClick(order)}
          >
            <div className="flex justify-between items-start mb-3">
              {visibleColumns.id && (
                <div className="font-semibold">
                  Order #{order.id}
                </div>
              )}
              {visibleColumns.payment_status && (
                <div className={`px-2 py-1 rounded-full text-center text-white text-xs ${
                    order.payment_status === 'paid' ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {order.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              {visibleColumns.client_name && (
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Client:</span>
                  <span className="font-medium">{order.client_name}</span>
                </div>
              )}
              
              {visibleColumns.client_address && (
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Address:</span>
                  <span>{order.client_address}</span>
                </div>
              )}
              
              {visibleColumns.payment_method && (
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Payment Method:</span>
                  <span>{order.payment_method}</span>
                </div>
              )}
              
              
             
              {visibleColumns.order_status && (
                <div className="grid grid-cols-2">
                  <span className="text-gray-500">Order Status:</span>
                    <OrderStatusBadge status={order.order_status} />
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
      <div className="flex flex-row justify-between items-start items-center gap-3">
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
      {orders.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, orders.length)} of {orders.length} items
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
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
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
                );
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

export default ResponsiveOrdersTable