import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import ShowCardRating from "./Ratting/ShowCardRating";
import ProductCard from "./Home/ProductCard";

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q")?.trim();
  const formattedQuery = query ? query.toLowerCase() : "";
  const apiUrl = process.env.REACT_APP_API_URL;

  const [results, setResults] = useState(location.state?.searchResults || []);
  const [loading, setLoading] = useState(!location.state?.searchResults);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!formattedQuery || location.state?.searchResults) return;

    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${apiUrl}/api/search`, {
          params: { q: formattedQuery },
        });
        if (response?.data) {
          setResults(response.data.products);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Search error:", err);
        setError("Something went wrong. Please try again.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [formattedQuery, apiUrl, location.state?.searchResults]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-white">
        <img
          src="/pikachu.gif"
          alt="Loading..."
          className="w-20 h-20 object-contain mb-16"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl font-semibold my-4">
          Search Results for "{formattedQuery}"
        </h1>
        <p className="text-center text-red-600">{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl font-semibold my-4">
          Search Results for "{formattedQuery}"
        </h1>
        <p className="text-center text-gray-600">No results found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold my-6 text-gray-800">
        Search Results for "{formattedQuery}"
      </h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.map((item) => (
          <Link key={item._id} to={`/products/${item._id}`} className="group">
            <li className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="overflow-hidden rounded-xl mb-4">
                <img
                  src={`${apiUrl}/images/${item.photo}`}
                  alt={item.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">
                {item.name}
              </h2>
              <p className="text-gray-600 text-sm mt-1">${item.price}</p>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
