'use client';
import React from 'react';
import MainButton from './MainButton';
import axios from '@/lib/axios';
import { toast } from 'react-toastify';

const ConfirmDeleteMenuItemModal = ({ itemId, itemName, onClose }) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete(`/api/menu-items/${itemId}`);
      
      if (response.data.status) {
        toast.success('Menu item deleted successfully');
        // Force reload to refresh the menu items list
        window.location.reload();
      } else {
        throw new Error(response.data.message || 'Failed to delete menu item');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete menu item');
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold text-primary mb-4">Delete Menu Item</h2>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete "{itemName}"? This action cannot be undone.
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
            {isDeleting ? 'Deleting...' : 'Delete Item'}
          </MainButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteMenuItemModal;