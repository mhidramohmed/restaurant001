"use client";
import MainButton from './MainButton';
import { LuShoppingCart } from "react-icons/lu";
import { IoLink } from "react-icons/io5";

const Card = ({ image, name, price, onAddToCart, onDetails }) => {
  return (
    <div className="h-[450px] border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden">
      {/* Image Section */}
      <div className="h-2/3">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-t-lg"
        />
      </div>
      
      {/* Content Section */}
      <div className="h-1/3 p-4 flex flex-col justify-between">
        <h3 className="text-lg font-semibold text-text">{name}</h3>
        <div className="flex items-center justify-between mt-2">
          {/* Price */}
          <p className="text-primary font-medium">{price} Dhs</p>
          {/* Buttons */}
          <div className="flex space-x-2">
            <MainButton onClick={onAddToCart} className="bg-primary text-white"><LuShoppingCart /></MainButton>
            <MainButton onClick={onDetails} className="bg-secondary text-text"><IoLink /></MainButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
