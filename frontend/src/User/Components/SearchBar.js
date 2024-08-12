import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ query, setQuery, clearQuery }) => {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      try {
        const response = await axios.get(`${apiUrl}/api/products`, {
          params: {
            search: query,
          },
        });
        const searchResults = response.data.products;
        // Redirect to search results page with the search query
        navigate(`/search?q=${query}`, { state: { searchResults } });
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
  };

  return (
    <div className=" ">
      <form onSubmit={handleSearch} className="relative flex items-center  w-">
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
    </div>
  );
};

export default SearchBar;
