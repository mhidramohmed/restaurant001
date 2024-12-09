import React from 'react'
import { useCart } from '@/contexts/CartContext'
// import Image from 'next/image'

const MenuItemModal = ({ item, onClose }) => {
  const { addItem } = useCart()
  const { id, name, price, image } = item
  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price,
      image
    })
  }
//   const img = item.image
//   const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
//   const imageUrl =  `${baseURL}/${img.replace(/^\/+/, '')}`
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
                  <img src={item.image} alt={item.name}
                //   width={100} height={300}
                  className="w-full h-64 object-cover rounded-lg mb-4" />

          {/* Title and Price */}
          <h3 className="text-3xl font-semibold text-primary mb-2">{item.name}</h3>
          <p className="text-xl text-primary mb-4">{item.price} Dhs</p>

          {/* Description */}
          <p className="text-sm text-gray-700 mb-6 text-center">{item.description}</p>

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
