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

const AddCategoryModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const newValue = files ? files[0] : value;
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    
    const data = new FormData();
    data.append('name', formData.name);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const response = await axios.post('/api/categories', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="text-lg font-semibold text-text mb-4">Add Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Category Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />

          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
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
            {isSubmitting ? 'Adding...' : 'Add Category'}
          </MainButton>
        </div>
      </form>
    </Modal>
  );
};

export default AddCategoryModal;