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
  
  const AddMenuItemModal = ({ categoryName, onClose }) => {
    return (
      <Modal onClose={onClose}>
        <h2 className="text-lg font-semibold text-text mb-4">
          Add Menu Item to {categoryName}
        </h2>
        <form>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Item Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              placeholder="Price"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            <textarea
              placeholder="Description"
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
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md">
              Save
            </button>
          </div>
        </form>
      </Modal>
    );
  };
  
  export default AddMenuItemModal;
  