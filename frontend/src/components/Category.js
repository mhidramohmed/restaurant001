// Category.js
import React from 'react';

const Category = ({ title, color }) => {
  return (
    <div className="flex items-center space-x-4 p-3 border border-gray-300 rounded-full cursor-pointer">
      <div className="w-12 h-12 rounded-full overflow-hidden">
        <img
          src={'https://via.placeholder.com/60'}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-text font-medium">{title}</p>
    </div>
  );
};

export default Category;
