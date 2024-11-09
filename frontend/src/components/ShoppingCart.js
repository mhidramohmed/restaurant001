// components/ShoppingCart.js
'use client';
import MainButton from './MainButton';
import { LuShoppingCart, LuTrash2 } from "react-icons/lu";
import { useCart } from '@/contexts/CartContext';

const ShoppingCart = () => {
  const { items, removeItem, updateQuantity, getTotal } = useCart();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b pb-4">
        <MainButton className="bg-primary text-background">
          <LuShoppingCart />
        </MainButton>
        <h2 className="text-xl font-bold text-text">Shopping Cart</h2>
        <span className="text-text">{items.length} items</span>
      </div>

      <div className="flex-1 overflow-y-auto mt-4">
        {items.length === 0 ? (
          <p className="text-center text-text">Start shopping!</p>
        ) : (
          <ul className="w-full space-y-4">
            {items.map((item) => (
              <li key={item.id} className="border-b pb-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={item.image} 
                    alt={item.name} 
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

      <div className="border-t pt-4 mt-auto">
        <div className="flex justify-between mt-2 text-text text-lg font-bold">
          <p>Total</p>
          <p className="text-xl">{getTotal()} Dhs</p>
        </div>
        <MainButton className="mt-2 w-full bg-primary text-background">
          Checkout
        </MainButton>
      </div>
    </div>
  );
};

export default ShoppingCart;