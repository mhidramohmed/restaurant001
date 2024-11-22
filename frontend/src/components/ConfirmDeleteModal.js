const Modal = ({ onClose, children }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
          {/* Close Button */}
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

  
const ConfirmDeleteModal = ({ categoryName, onClose }) => {
    return (
      <Modal onClose={onClose}>
        <h2 className="text-lg font-semibold text-text mb-4">
          Are you sure you want to delete {categoryName}?
        </h2>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2"
          >
            Cancel
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded-md">
            Delete
          </button>
        </div>
      </Modal>
    );
  };
  
  export default ConfirmDeleteModal;
  