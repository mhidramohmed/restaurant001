'use client'
// import Image from 'next/image'
import MainButton from './MainButton'
import { LuShoppingCart } from "react-icons/lu"
import { FiEye } from "react-icons/fi"
import { useCart } from '@/contexts/CartContext'

const Card = ({ image, name, price, id, onDetails }) => {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price,
      image
    })
  }
//   const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
//   const imageUrl =  `${baseURL}/${image.replace(/^\/+/, '')}`

  return (
    <div className="h-[350px] border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden">
      <div className="h-2/3">
        <img
          src={image}
          alt={name}
        //   width={350}
        //   height={700}
          className="w-full h-full object-cover rounded-t-lg"
        />
      </div>

      <div className="h-1/3 p-4 flex flex-col justify-between">
        <h3 className="text-lg font-semibold text-text">{name}</h3>
        <div className="flex items-center justify-between mt-2">
          <p className="text-primary font-medium">{price} Dhs</p>
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
