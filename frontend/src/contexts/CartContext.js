'use client'
import { createContext, useContext, useReducer, useEffect, useState } from 'react'

const CartContext = createContext()
const deliveryFee = 15

const cartReducer = (state, action) => {
  let existingItemIndex
  let newState

  switch (action.type) {
    case 'ADD_ITEM':
      existingItemIndex = state.items.findIndex(item => item.id === action.payload.id)
      
      if (existingItemIndex !== -1) {
        const newItems = [...state.items]
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1
        }
        newState = { ...state, items: newItems }
      } else {
        newState = {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }]
        }
      }
      localStorage.setItem('cart', JSON.stringify(newState))
      return newState

    case 'REMOVE_ITEM':
      newState = {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      }
      localStorage.setItem('cart', JSON.stringify(newState))
      return newState

    case 'UPDATE_QUANTITY':
      newState = {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      }
      localStorage.setItem('cart', JSON.stringify(newState))
      return newState

    case 'CLEAR_CART':
      localStorage.removeItem('cart')
      return { ...state, items: [] }

    case 'LOAD_CART':
      return { ...state, items: action.payload }

    default:
      return state
  }
}

export function CartProvider({ children }) {
  const initialState = { items: [] }
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart).items })
    }
    setIsHydrated(true)
  }, [])

  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (itemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId })
  }

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) {
      removeItem(itemId)
      return
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } })
  }

  const getTotal = () => {
    const totalWithoutDelivery = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
    return (totalWithoutDelivery + deliveryFee).toFixed(2)
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  if (!isHydrated) return null // Prevent rendering mismatched content

  return (
    <CartContext.Provider value={{ 
      items: state.items, 
      addItem, 
      removeItem, 
      updateQuantity,
      getTotal,
      clearCart,
      deliveryFee
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
