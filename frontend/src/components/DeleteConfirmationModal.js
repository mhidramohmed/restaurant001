// components/DeleteConfirmationModal.js
import React from 'react';
import MainButton from './MainButton';

const DeleteConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold text-primary mb-4">Are you sure?</h2>
        <p className="text-text mb-6">Do you really want to delete this order? This action cannot be undone.</p>
        <div className="flex justify-end space-x-4">
          <MainButton 
            onClick={onCancel} 
            className="bg-gray-300 text-text py-2 px-4"
          >
            Cancel
          </MainButton>
          <MainButton 
            onClick={onConfirm} 
            className="bg-red-500 text-background py-2 px-4"
          >
            Confirm
          </MainButton>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
