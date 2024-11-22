import { useState } from 'react';
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('image', formData.image);

    setIsSubmitting(true);
    try {
      await axios.post('/api/category', data);
      toast.success('Category added successfully!', { position: 'top-right' });
      onSuccess(); // Revalidate categories in the parent component
      onClose();
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category. Please try again.', { position: 'top-right' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="text-lg font-semibold text-text mb-4">Add Category</h2>
      <form onSubmit={handleSubmit}>
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
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCategoryModal;
