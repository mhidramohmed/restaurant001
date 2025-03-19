import { useState, useEffect } from 'react'

const EditDiscountModal = ({ discount, onClose, onSubmit, menuItems }) => {
  const [formData, setFormData] = useState({
    menu_item_id: discount.menu_item.id.toString(), // Ensure it's a string
    discount_percentage: discount.discount_percentage,
    expires_at: discount.expires_at,
    is_active: discount.is_active,
    image: null,
  })

  useEffect(() => {
    setFormData({
      menu_item_id: discount.menu_item.id.toString(), // Ensure it's a string
      discount_percentage: discount.discount_percentage,
      expires_at: discount.expires_at,
      is_active: discount.is_active,
      image: null,
    })
  }, [discount])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = new FormData()
  
    // Convert menu_item_id to number if it's a string
    data.append('menu_item_id', parseInt(formData.menu_item_id, 10))
    data.append('discount_percentage', formData.discount_percentage)
    
    // Only append expires_at if it's not empty
    if (formData.expires_at) {
      data.append('expires_at', formData.expires_at)
    }
    
    data.append('is_active', formData.is_active ? '1' : '0')
  
    // Append the image file only if it exists
    if (formData.image instanceof File) {
      data.append('image', formData.image)
    }
  
    // Add method spoofing for Laravel to recognize this as a PUT request
    data.append('_method', 'PUT')
    
    onSubmit(data)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Edit Discount</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Menu Item</label>
            <select
              name="menu_item_id"
              value={formData.menu_item_id}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select a Menu Item</option>
              {menuItems.map((item) => (
                <option key={item.id} value={item.id.toString()}>
                  {item.name}
                </option>
              ))}
            </select>
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
              value={formData.expires_at || ''}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Image</label>
            {discount.image && (
              <div className="mb-2">
                <span className="text-sm text-gray-500">Current image: {discount.image.split('/').pop()}</span>
              </div>
            )}
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
              Update Discount
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditDiscountModal