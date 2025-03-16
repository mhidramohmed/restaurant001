import React from 'react'
import { useCart } from '@/contexts/CartContext'

const MenuItemModal = ({ item, onClose }) => {
  const { addItem } = useCart()
  const { id, name, price, image, description, discount } = item

  const handleAddToCart = () => {
    // Add item to cart with the new price if discount is active
    addItem({
      id,
      name,
      price: discount && discount.is_active ? discount.new_price : price, // Use the new price if discount is active
      image,
      discount
    })
  }

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

        <div className="flex flex-col items-center relative">
          {/* Image */}
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-64 object-cover rounded-lg mb-4" 
          />

          {/* Discount Badge */}
          {discount && discount.is_active ? (
              <div className="absolute top-1 right-1 bg-primary text-white px-2 py-1 rounded-lg z-10 font-bold">
                -{discount.discount_percentage}%
              </div>
              ) : null}

          {/* Title and Price */}
          <h3 className="text-3xl font-semibold text-primary mb-2">{item.name}</h3>
          
          {/* Price and Discount Information */}
          <div className="flex gap-2 items-center">
            {discount && discount.is_active ? (
              <div className="flex gap-2 items-end">
                <p className="text-primary font-medium">{discount.new_price.toFixed(2)} Dhs</p>
                <p className="text-gray-500 line-through text-sm">{price} Dhs</p>
              </div>
            ) : (
              <p className="text-primary font-medium">{price} Dhs</p>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-700 mb-6 text-center">{description}</p>

          {/* Action buttons */}
          <div className="w-full flex justify-between">
            {/* Add to Cart button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Ajouter au panier
            </button>

            {/* Close Modal button */}
            <button
              onClick={onClose}
              className="w-full bg-gray-300 text-gray-700 py-2 ml-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuItemModal
