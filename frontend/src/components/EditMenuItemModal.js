'use client'
import { useState, useEffect } from 'react'
import MainButton from './MainButton'
import axios from '@/lib/axios'
import { toast } from 'react-toastify'
// import Image from 'next/image'
import placeholder from '@/assets/svg/placeholder.svg'

const Modal = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  )
}

const EditMenuItemModal = ({ itemId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: null,
    category_id: ''
  })
  const [preview, setPreview] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchMenuItem = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(`/api/menu-items/${itemId}`)
        const item = response.data.data

        setFormData({
          name: item.name || '',
          price: item.price || '',
          description: item.description || '',
          category_id: item.category_id || '',
          image: null
        })

        if (item.image) {
        //   const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
        //   const imageUrl = item.image.startsWith('http')
        //     ? item.image
        //     : `${baseURL}/${item.image.replace(/^\/+/, '')}`
            setPreview(item.image)
        }

      } catch (error) {
        toast.error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Failed to load menu item details'
        )
        onClose()
      } finally {
        setIsLoading(false)
      }
    }

    if (itemId) {
      fetchMenuItem()
    }
  }, [itemId])

  const handleChange = (e) => {
    const { name, value, files, type } = e.target

    if (files) {
      const file = files[0]
      setFormData(prev => ({ ...prev, [name]: file }))

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      let newValue = value
      if (type === 'number') {
        newValue = value === '' ? '' : parseFloat(value)
      }
      setFormData(prev => ({ ...prev, [name]: newValue }))
    }
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Name is required')
      return false
    }
    if (!formData.price || formData.price <= 0) {
      toast.error('Price must be a positive number')
      return false
    }

    if (formData.image) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml']
      if (!allowedTypes.includes(formData.image.type)) {
        toast.error('Invalid image type. Allowed types: jpeg, png, jpg, gif, svg')
        return false
      }

      if (formData.image.size > 2048 * 1024) {
        toast.error('Image size must be less than 2MB')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm() || isSaving) return
    setIsSaving(true)

    const data = new FormData()
    data.append('name', formData.name.trim())
    data.append('price', formData.price)
    data.append('description', formData.description.trim())
    data.append('category_id', formData.category_id)
    if (formData.image) {
      data.append('image', formData.image)
    }

    try {
      const response = await axios.post(`/api/menu-items/${itemId}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-HTTP-Method-Override': 'PATCH'
        }
      })

      toast.success(response.data.message || 'Menu item updated successfully')
      onSuccess()
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to update menu item'
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Modal onClose={onClose}>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </Modal>
    )
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="text-lg font-semibold text-text mb-4">Edit Menu Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength={255}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (Dhs)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              step="0.01"
              min="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength={1000}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Image
            </label>
            <div className="flex items-center space-x-4">
              {preview && (
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-300">
                  <img
                    src={preview}
                    alt="Item preview"
                    // width={50}
                    // height={50}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = placeholder
                    }}
                  />
                </div>
              )}
              <input
                type="file"
                name="image"
                onChange={handleChange}
                accept=".jpeg,.jpg,.png,.gif,.svg"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {preview
                ? "Upload new image to replace current one (optional)"
                : "Accepted formats: JPEG, PNG, JPG, GIF, SVG. Max size: 2MB"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <MainButton
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-gray-700"
            disabled={isSaving}
          >
            Cancel
          </MainButton>

          <MainButton
            type="submit"
            disabled={isSaving}
            className={`bg-primary text-white ${isSaving ? 'opacity-50' : ''}`}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </MainButton>
        </div>
      </form>
    </Modal>
  )
}

export default EditMenuItemModal
