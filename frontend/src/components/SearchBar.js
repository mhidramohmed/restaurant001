import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ setSearchTerm, className='' }) => {
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase()); 
  };

  return (
    <div className={`relative flex-grow md:mx-4 ${className}`}>
      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text" />
      <input
        type="text"
        placeholder="Trouver un plat"
        onChange={handleSearch}
        className="w-full h-12 pl-10 pr-4 py-2 bg-secondary text-text rounded-lg border-none focus:outline-none focus:border-none focus:ring-0"
      />
    </div>
  );
};

export default SearchBar;
