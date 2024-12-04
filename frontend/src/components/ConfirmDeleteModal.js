'use client'
import React from 'react'
import MainButton from './MainButton'
import axios from '@/lib/axios'
import { toast } from 'react-toastify'

const ConfirmDeleteModal = ({ categoryId, categoryName, onClose }) => {
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await axios.delete(`/api/categories/${categoryId}`)
      
      if (response.data.status) {
        toast.success(response.data.message || 'Menu item updated successfully')
        window.location.reload()
      } else {
        throw new Error(response.data.message || 'Failed to delete category')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete category')
    } finally {
      setIsDeleting(false)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold text-primary mb-4">Delete Category</h2>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete the category "{categoryName}"? This action cannot be undone
          and will also delete all menu items associated with this category.
        </p>
        <div className="flex justify-end space-x-4">
          <MainButton 
            onClick={onClose} 
            className="bg-gray-300 text-gray-700"
            disabled={isDeleting}
          >
            Cancel
          </MainButton>
          <MainButton 
            onClick={handleDelete} 
            className="bg-red-500 text-white"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Category'}
          </MainButton>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeleteModal