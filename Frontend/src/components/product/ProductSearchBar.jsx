import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductSearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleQuickSearch = (term) => {
    setSearchTerm(term);
    onSearch(term);
  };

  return (
    <div className="w-full p-4 flex gap-4 items-center">
      

      <div className="flex flex-wrap gap-2">
        {["Cement", "Tiles", "Bricks", "Paint", "Steel"].map((term) => (
          <button
            key={term}
            onClick={() => handleQuickSearch(term)}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
          >
            {term}
          </button>
        ))}
      </div>
      <div className="w-full md:w-1/2 flex">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-l-md"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default ProductSearchBar;
