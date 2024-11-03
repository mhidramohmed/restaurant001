"use client";
import MainButton from './MainButton';
import { LuShoppingCart } from "react-icons/lu";
import { IoLink } from "react-icons/io5";

const Card = ({ imgSrc, title, price, onAddToCart, onDetails }) => {
  return (
    <div className="border border-gray-200 rounded-md shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden">
      {/* Image Section */}
      <div className="h-2/3">
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover rounded-t-md"
        />
      </div>
      
      {/* Content Section */}
      <div className="h-1/3 p-4 flex flex-col justify-between">
        <h3 className="text-lg font-semibold text-text">{title}</h3>
        <div className="flex items-center justify-between mt-2">
          {/* Price */}
          <p className="text-primary font-medium">${price}</p>
          {/* Buttons */}
          <div className="flex space-x-2">
            <MainButton onClick={onAddToCart} className="bg-primary text-white"><LuShoppingCart /></MainButton>
            <MainButton onClick={onDetails} className="bg-gray-300 text-text"><IoLink /></MainButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
