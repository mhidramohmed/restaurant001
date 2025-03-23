'use client'

import useSWR from 'swr'
import axios from '@/lib/axios'
import MainButton from '@/components/MainButton'
import { useAuth } from '@/hooks/auth'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import AddDiscountModal from '@/components/AddDiscountModal'
import EditDiscountModal from '@/components/EditDiscountModal'
import DeleteDiscountConfirmationModal from '@/components/DeleteDiscountConfirmationModal'

const fetcher = async (url) => {
  const response = await axios.get(url)
  return response.data.data || response.data
}

const DiscountStatusBadge = ({ isActive }) => {
  return (
    <span
      className={`px-2 py-1 rounded-full text-white ${
        isActive ? 'bg-green-500' : 'bg-red-500'
      }`}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  )
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.toLocaleString('default', { month: 'short' })
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

const Page = () => {
  const router = useRouter()
  const { user } = useAuth({ middleware: 'auth' })
  const { data: discounts, error, mutate } = useSWR(
    user ? '/api/discount' : null,
    fetcher,
  )
  const { data: menuItems } = useSWR('/api/menu-items', fetcher)

  const [filters, setFilters] = useState({
    searchTerm: '',
    statuses: ['active'],
  })

  const [selectedDiscount, setSelectedDiscount] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [discountToDelete, setDiscountToDelete] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const discountsPerPage = 10

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else if (user?.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [user, router])

  // Filter out discounts with null menu_item before applying other filters
  const validDiscounts = useMemo(() => {
    if (!discounts) return []
    
    return discounts.filter(discount => 
      discount.menu_item && discount.menu_item.id
    )
  }, [discounts])

  const filteredDiscounts = useMemo(() => {
    if (!validDiscounts) return []

    return validDiscounts.filter((discount) => {
      // Search filter
      const matchesSearch =
        !filters.searchTerm ||
        discount.menu_item.name.toLowerCase().includes(filters.searchTerm.toLowerCase())

      // Status filter
      const matchesStatus =
        filters.statuses.length === 0 ||
        filters.statuses.includes(discount.is_active ? 'active' : 'inactive')

      return matchesSearch && matchesStatus
    })
  }, [validDiscounts, filters.searchTerm, filters.statuses.join(',')])

  const [sortNewestFirst, setSortNewestFirst] = useState(true)

  const sortedDiscounts = useMemo(() => {
    return [...filteredDiscounts].sort((a, b) =>
      sortNewestFirst ? b.id - a.id : a.id - b.id,
    )
  }, [filteredDiscounts, sortNewestFirst])

  // Pagination
  const indexOfLastDiscount = currentPage * discountsPerPage
  const indexOfFirstDiscount = indexOfLastDiscount - discountsPerPage
  const currentDiscounts = sortedDiscounts.slice(
    indexOfFirstDiscount,
    indexOfLastDiscount,
  )

  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(sortedDiscounts.length / discountsPerPage); i++) {
    pageNumbers.push(i)
  }

  const handleRowClick = useCallback((discount) => {
    setSelectedDiscount(discount)
    setIsEditModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setSelectedDiscount(null)
    setIsEditModalOpen(false)
    setIsAddModalOpen(false)
    setIsDeleteModalOpen(false)
  }, [])

  const handleDeleteClick = (id) => {
    setDiscountToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const deleteDiscount = async () => {
    if (discountToDelete) {
      try {
        await axios.delete(`/api/discount/${discountToDelete}`)
        mutate() // Re-fetch discounts
        toast.success('Discount deleted successfully')
      } catch (error) {
        toast.error('Failed to delete discount')
      } finally {
        setIsDeleteModalOpen(false)
        setDiscountToDelete(null)
      }
    }
  }

  const handleAddDiscount = async (data) => {
    try {
      await axios.post('/api/discount', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      mutate() // Re-fetch discounts
      toast.success('Discount added successfully')
      setIsAddModalOpen(false)
    } catch (error) {
      toast.error('Failed to add discount')
    }
  }
  
  const handleEditDiscount = async (data) => {
    try {
      // For FormData PUT requests, we need to use the POST method with a _method field
      data.append('_method', 'PUT')
      
      // Use POST method instead of PUT when sending FormData
      await axios.post(`/api/discount/${selectedDiscount.id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-HTTP-Method-Override': 'PUT'
        },
      })
      
      mutate() // Re-fetch discounts
      toast.success('Discount updated successfully')
      setIsEditModalOpen(false)
    } catch (error) {
      toast.error('Failed to update discount')
    }
  }

  if (error) {
    return <div className="p-6 text-red-600">Failed to load discounts: {error.message}</div>
  }

  if (!discounts || !menuItems) return <div className="p-6">Loading...</div>

  return (
    <>
      <header className="bg-background  py-3 px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            
            <h1 className="text-xl font-bold">Discounts Management</h1>
          </div>
          <div className="flex items-center space-x-4">
            <MainButton
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary text-background border-2 border-primary hover:bg-opacity-90 transition"
            >
              Add New Discount
            </MainButton>
            
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Filtering Section */}
        <div className="mb-6 flex space-x-4">
          {/* Sorting Button */}
          <button
            onClick={() => setSortNewestFirst((prev) => !prev)}
            className={`px-3 py-1 rounded-full ${
              sortNewestFirst ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {sortNewestFirst ? 'Newest First' : 'Oldest First'}
          </button>

          {/* Status Filters */}
          <div className="flex space-x-2">
            {['active', 'inactive'].map((status) => (
              <button
                key={status}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    statuses: prev.statuses.includes(status)
                      ? prev.statuses.filter((s) => s !== status)
                      : [...prev.statuses, status],
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

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search discounts by menu item ID..."
            value={filters.searchTerm}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
            }
            className="w-full h-12 pl-10 pr-4 py-2 bg-secondary text-text rounded-lg focus:outline-none focus:ring-0"
          />
        </div>

        {/* Discounts Table */}
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full bg-background border border-gray-200">
            <thead>
              <tr className="bg-primary text-secondary">
                <th className="py-4 px-6 text-left font-semibold">ID</th>
                <th className="py-4 px-6 text-left font-semibold">Menu Item</th>
                <th className="py-4 px-6 text-left font-semibold">Discount Percentage</th>
                <th className="py-4 px-6 text-left font-semibold">Expires At</th>
                <th className="py-4 px-6 text-left font-semibold">Status</th>
                <th className="py-4 px-6 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentDiscounts.length > 0 ? (
                currentDiscounts.map((discount) => {
                  const menuItem = menuItems.find(
                    (item) => item.id === discount.menu_item.id,
                  )
                  return (
                    <tr
                      key={discount.id}
                      className="hover:bg-secondary cursor-pointer transition-colors duration-150"
                    >
                      <td className="py-4 px-6 text-text">{discount.id}</td>
                      <td className="py-4 px-6 text-text">
                        {menuItem ? menuItem.name : 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-text">
                        {discount.discount_percentage}%
                      </td>
                      <td className="py-4 px-6 text-text">
                      {formatDate(discount.expires_at)}
                      </td>
                      <td className="py-4 px-6">
                        <DiscountStatusBadge isActive={discount.is_active} />
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleRowClick(discount)}
                          className="text-blue-500 hover:text-blue-700 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(discount.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 px-6 text-center text-text">
                    No discounts found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {sortedDiscounts.length > discountsPerPage && (
          <div className="flex justify-center mt-4 space-x-2">
            {pageNumbers.map((number) => (
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
      </div>

      {/* Add Discount Modal */}
      {isAddModalOpen && (
        <AddDiscountModal
          onClose={closeModal}
          onSubmit={handleAddDiscount}
          menuItems={menuItems}
        />
      )}

      {/* Edit Discount Modal */}
      {isEditModalOpen && selectedDiscount && (
        <EditDiscountModal
          discount={selectedDiscount}
          onClose={closeModal}
          onSubmit={handleEditDiscount}
          menuItems={menuItems}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteDiscountConfirmationModal
          onClose={closeModal}
          onConfirm={deleteDiscount}
        />
      )}
    </>
  )
}

export default Page