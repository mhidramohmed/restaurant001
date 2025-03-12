'use client'
// import Image from 'next/image'
import MainButton from './MainButton'
import { LuShoppingCart } from "react-icons/lu"
import { FiEye } from "react-icons/fi"
import { useCart } from '@/contexts/CartContext'

const Card = ({ image, name, price, id, discount, onDetails }) => {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    // Add item with new price if there's a discount
    addItem({
      id,
      name,
      price: discount ? discount.new_price : price,
      originalPrice: discount ? price : null,
      image,
      discount
    })
  }

  return (
    <div className="h-[370px] border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden relative">
      {/* Discount Badge */}
      {discount && discount.is_active && (
        <div className="absolute top-1 right-1 bg-primary text-white px-2 py-1 rounded-lg z-10 font-bold">
          {discount.discount_percentage}%
        </div>
      )}
      
      <div className="h-2/3">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-t-lg"
        />
      </div>

      <div className="h-1/3 p-4 flex flex-col justify-between">
        <h3 className="text-lg font-semibold text-text leading-tight">{name}</h3>
        <div className="flex items-center justify-between mt-2">
          <div>
            {discount && discount.is_active ? (
              <div className="flex flex-col">
                <p className="text-primary font-medium">{discount.new_price} Dhs</p>
                <p className="text-gray-500 line-through text-sm">{price} Dhs</p>
              </div>
            ) : (
              <p className="text-primary font-medium">{price} Dhs</p>
            )}
          </div>
          <div className="flex space-x-2">
            <MainButton onClick={handleAddToCart} className="bg-primary text-white">
              <LuShoppingCart />
            </MainButton>
            <MainButton onClick={onDetails} className="bg-secondary text-text">
              <FiEye className="text-xl" />
            </MainButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card