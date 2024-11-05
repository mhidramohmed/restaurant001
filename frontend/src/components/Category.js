// Category.js
import React from 'react';

const Category = ({ name, image }) => {
  return (
    <div className="flex items-center space-x-4 p-3 border border-primary rounded-full cursor-pointer">
      <div className="w-12 h-12 rounded-full overflow-hidden">
        <img
          src={image}
          // src='https://via.placeholder.com/60'
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-text font-medium pr-2">{name}</p>
    </div>
  );
};

export default Category;
