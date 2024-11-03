// SearchBar.js
import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = () => {
  return (
    <div className="relative flex-grow mx-4">
      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text" />
      <input
        type="text"
        placeholder="Search a dish"
        className="w-full pl-10 pr-4 py-2 text-text rounded-lg border-none focus:outline-none focus:border-none focus:ring-0"
      />
    </div>
  );
};

export default SearchBar;
