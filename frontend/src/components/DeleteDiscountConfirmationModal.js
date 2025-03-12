const DeleteDiscountConfirmationModal = ({ onClose, onConfirm }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-1/3">
          <h2 className="text-xl font-bold mb-4">Delete Discount</h2>
          <p className="mb-4">Are you sure you want to delete this discount?</p>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  export default DeleteDiscountConfirmationModal