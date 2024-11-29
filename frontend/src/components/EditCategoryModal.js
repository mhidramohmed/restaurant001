'use client';
import { useState, useEffect } from 'react';
import MainButton from './MainButton';
import axios from '@/lib/axios';
import { toast } from 'react-toastify';

const EditCategoryModal = ({ categoryId, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    image: null
  });
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const fetchCategory = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/categories/${categoryId}`);
        const category = response.data.data;
        
        setFormData({
          name: category.name || '',
          image: null
        });
        
        if (category.image) {
          const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
          const imageUrl = category.image.startsWith('http')
            ? category.image
            : `${baseURL}/${category.image.replace(/^\/+/, '')}`;
          setPreview(imageUrl);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || 
          error.response?.data?.error || 
          'Failed to load category details'
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files) {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const data = new FormData();
    if (formData.name) data.append('name', formData.name);
    if (formData.image) data.append('image', formData.image);

    try {
      const response = await axios.post(`/api/categories/${categoryId}`, data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'X-HTTP-Method-Override': 'PATCH'
        }
      });

      if (response.data.message) {
        toast.success(response.data.message);
        onClose();
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update category');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg">
          Loading category details...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        
        <h2 className="text-lg font-semibold mb-4">Edit Category</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Image
            </label>
            <div className="flex items-center space-x-4">
            {preview && (
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-300">
                  <img
                    src={preview}
                    alt="Item preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/600x400/orange/white';
                    }}
                  />
                </div>
              )}
              <input
                type="file"
                name="image"
                onChange={handleChange}
                accept="image/*"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <MainButton
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700"
              disabled={isSaving}
            >
              Cancel
            </MainButton>
            <MainButton
              type="submit"
              className="bg-primary text-white"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </MainButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryModal;