// SearchBar.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ query, setQuery, clearQuery, className = "" }) => {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/search?q=${query}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative flex items-center ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for items"
        className="p-1 px-2 w-64 sm:w-80 md:w-96 lg:w-full rounded-l-md outline-none"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 px-2 rounded-r-md hover:bg-blue-600 focus:outline-none"
      >
        <FaSearch className="text-base " />
      </button>
    </form>
  );
};

export default SearchBar;