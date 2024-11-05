// ShoppingCart.js
import MainButton from './MainButton';
import { LuShoppingCart } from "react-icons/lu";

const ShoppingCart = () => {
  const items = []; // Empty array for now

  return (
    <div className="flex flex-col h-full">
      {/* Upper Section */}
      <div className="flex items-center justify-between border-b pb-4">
        <MainButton className="bg-primary text-background">
          <LuShoppingCart />
        </MainButton>
        <h2 className="text-xl font-bold text-text">Shopping Cart</h2>
        <span className="text-text">{items.length} items</span>
      </div>

      {/* Middle Section */}
      <div className="flex-1 flex items-center justify-center mt-4">
        {items.length === 0 ? (
          <p className="text-center text-text">Start shopping!</p>
        ) : (
          <ul className="w-full">
            {items.map((item) => (
              <li key={item.id} className="border-b py-2">
                <span>{item.name}</span>
                {/* You can add more details here like price and quantity */}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Bottom Section */}
      <div className="border-t pt-4">
        <div className="flex justify-between mt-2 text-text text-lg font-bold">
            <p>Total</p>
            <p className='text-xl'>0 Dhs</p>
        </div>
        <MainButton className="mt-2 w-full bg-primary text-background">
          Checkout
        </MainButton>
      </div>
    </div>
  );
};

export default ShoppingCart;
