import React from 'react';

const MenuItemModal = ({ item, onClose, onAddToCart }) => {
  const image = item.image;
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const imageUrl =  `${baseURL}/${image.replace(/^\/+/, '')}`;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-gray-700 hover:text-gray-500"
        >
          X
        </button>

        <div className="flex flex-col items-center">
          {/* Image */}
          <img src={imageUrl} alt={item.name} className="w-full h-64 object-cover rounded-lg mb-4" />
          
          {/* Title and Price */}
          <h3 className="text-3xl font-semibold text-primary mb-2">{item.name}</h3>
          <p className="text-xl text-primary mb-4">${item.price}</p>

          {/* Description */}
          <p className="text-sm text-gray-700 mb-6 text-center">{item.description}</p>

          {/* Action buttons */}
          <div className="w-full flex justify-between">
            {/* Add to Cart button */}
            <button
              onClick={onAddToCart}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Add to Cart
            </button>

            {/* Close Modal button */}
            <button
              onClick={onClose}
              className="w-full bg-gray-300 text-gray-700 py-2 ml-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemModal;
