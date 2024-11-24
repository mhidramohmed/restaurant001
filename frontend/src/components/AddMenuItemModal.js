'use client';
import { useState } from 'react';
import MainButton from './MainButton';
import axios from '@/lib/axios';
import { toast } from 'react-toastify';

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
  );
};

const AddMenuItemModal = ({ categoryId, categoryName, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: null,
    category_id: categoryId, // Match backend parameter name
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    let newValue = files ? files[0] : value;
    
    // Convert price string to number for number input
    if (type === 'number') {
      newValue = value === '' ? '' : parseFloat(value);
    }
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (!formData.price || formData.price <= 0) {
      toast.error('Price must be a positive number');
      return false;
    }
    if (!formData.image) {
      toast.error('Image is required');
      return false;
    }
    
    // Validate image type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(formData.image.type)) {
      toast.error('Invalid image type. Allowed types: jpeg, png, jpg, gif, svg');
      return false;
    }
    
    // Validate image size (2MB = 2048KB)
    if (formData.image.size > 2048 * 1024) {
      toast.error('Image size must be less than 2MB');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) return;
    setIsSubmitting(true);
    
    const data = new FormData();
    data.append('name', formData.name.trim());
    data.append('price', formData.price);
    data.append('description', formData.description.trim());
    data.append('category_id', formData.category_id);
    data.append('image', formData.image);

    try {
      const response = await axios.post('/api/menu-items', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      
      toast.success(response.data.message || 'Menu item added successfully');
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to add menu item';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="text-lg font-semibold text-text mb-4">
        Add Menu Item to {categoryName}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={formData.name}
            onChange={handleChange}
            required
            maxLength={255}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
            step="0.01"
            min="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          
          <textarea
            name="description"
            placeholder="Description (Optional)"
            value={formData.description}
            onChange={handleChange}
            maxLength={1000}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />

          <div className="space-y-2">
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept=".jpeg,.jpg,.png,.gif,.svg"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            <p className="text-sm text-gray-500">
              Accepted formats: JPEG, PNG, JPG, GIF, SVG. Max size: 2MB
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end space-x-2">
          <MainButton
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-gray-700"
          >
            Cancel
          </MainButton>

          <MainButton
            type="submit"
            disabled={isSubmitting}
            className={`bg-primary text-white ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Adding...' : 'Add Item'}
          </MainButton>
        </div>
      </form>
    </Modal>
  );
};

export default AddMenuItemModal;