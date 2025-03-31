import { useState } from 'react'
import MenuItemSelector from './MenuItemSelector'

const AddDiscountModal = ({ onClose, onSubmit, menuItems }) => {
  const [formData, setFormData] = useState({
    discount_percentage: '',
    expires_at: '',
    is_active: true,
    image: null,
    menuItems: [], // Array of menu item IDs
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }))
  }

  const handleMenuItemsChange = (selectedItems) => {
    setFormData(prev => ({ ...prev, menuItems: selectedItems }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = new FormData()
  
    // Append discount details to FormData
    data.append('discount_percentage', formData.discount_percentage)
    
    // Only append expires_at if it's not empty
    if (formData.expires_at) {
      data.append('expires_at', formData.expires_at)
    }
    
    data.append('is_active', formData.is_active ? '1' : '0') // Ensure boolean is sent as '1' or '0'
  
    // Append the image file only if it exists
    if (formData.image instanceof File) {
      data.append('image', formData.image)
    }
    
    // Append menu items as an array
    formData.menuItems.forEach((itemId, index) => {
      data.append(`menuItems[${index}]`, itemId)
    })
  
    onSubmit(data)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Add New Discount</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Menu Items</label>
            <MenuItemSelector 
              selectedItems={formData.menuItems}
              menuItems={menuItems}
              onChange={handleMenuItemsChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Discount Percentage</label>
            <input
              type="number"
              step="0.01"
              name="discount_percentage"
              value={formData.discount_percentage}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Expires At</label>
            <input
              type="date"
              name="expires_at"
              value={formData.expires_at}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Image</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Active</label>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, is_active: e.target.checked }))
                  }
                  className="sr-only"
                />
                <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                <div
                  className={`dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition-transform duration-200 ${
                    formData.is_active ? 'transform translate-x-6 bg-green-500' : 'bg-gray-500'
                  }`}
                ></div>
              </div>
              <span className="ml-3 text-sm">
                {formData.is_active ? 'Active' : 'Inactive'}
              </span>
            </label>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded"
            >
              Add Discount
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddDiscountModal