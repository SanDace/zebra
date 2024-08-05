import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    const fetchResults = async () => {
      const response = await axios.get(`search?q=${query}`);
      setResults(response.data);
    };

    fetchResults();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold my-4">Search Results for "{query}"</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((item) => (
          <Link
            key={item._id}
            to={`/products/${item._id}`}
            className="text-xl font-semibold hover:underline"
          >
            <li className="border p-4 rounded-md shadow-md">
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p className="text-gray-600">${item.price}</p>
              {/* Add more item details as needed */}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
