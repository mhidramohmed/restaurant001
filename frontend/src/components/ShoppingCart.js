'use client'
// import Image from 'next/image'
import { useState } from 'react'
import MainButton from './MainButton'
import CheckoutForm from './CheckoutForm'
import { LuShoppingCart, LuTrash2 } from "react-icons/lu"
import { IoClose } from "react-icons/io5"
import { useCart } from '@/contexts/CartContext'
import { toast } from 'react-toastify'

const ShoppingCart = ({ isCartVisible, setIsCartVisible }) => {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const handleOrderSuccess = (paymentMethod) => {
    // Clear cart on successful checkout only when the payment method is cash
    if (paymentMethod === 'cash') {
      clearCart() 
    }
    setIsCheckoutOpen(false)
    setIsCartVisible(false)
  }

//   const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL

  return (
    <div className="flex flex-col h-full">
      {/* Cart Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="text-background bg-primary px-4 py-4 rounded-lg">
          <LuShoppingCart />
        </div>
        <h2 className="text-xl font-bold text-text">PANIER</h2>
        <div>
          <span className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-primary-light text-background text-xl font-bold">
            {items.length}
          </span>
          <button onClick={() => setIsCartVisible(!isCartVisible)} className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-light text-background text-xl font-bold md:hidden">
            <IoClose />
          </button>
        </div>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto mt-4">
        {items.length === 0 ? (
          <p className="text-center text-text">DÉCOUVRIR LES MENUS!</p>
        ) : (
          <ul className="w-full space-y-4">
            {items.map((item) => (
              <li key={item.id} className="border-b pb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    // width={100}
                    // height={100}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-text">{item.name}</h3>
                    <p className="text-primary">{item.price} Dhs</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        className="px-2 py-1 bg-gray-100 rounded"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="px-2 py-1 bg-gray-100 rounded"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        className="ml-auto text-red-500"
                        onClick={() => removeItem(item.id)}
                      >
                        <LuTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Total Price and Checkout */}
      <div className="border-t pt-4 mt-auto">
        <div className="flex justify-between my-2 text-text text-lg font-bold">
          <p>Frais de Livraison</p>
          <p className="text-xl">15.00 Dhs</p>
        </div>
        <div className="flex justify-between my-2 text-text text-lg font-bold">
          <p>Total</p>
          <p className="text-xl">{getTotal()} Dhs</p>
        </div>
        <MainButton className="mt-2 w-full bg-primary text-background"
          onClick={() => items.length > 0 && setIsCheckoutOpen(true)}
          disabled={items.length === 0}
        >
          PASSER LA COMMANDE
        </MainButton>
      </div>


      {/* Checkout Form */}
      {isCheckoutOpen && (
        <CheckoutForm
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={(paymentMethod) => handleOrderSuccess(paymentMethod)} // Pass paymentMethod
          cartItems={items}
          totalPrice={getTotal()}
        />
      )}
    </div>
  )
}

export default ShoppingCart
