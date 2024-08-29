import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import ShowCardRating from "./Ratting/ShowCardRating";
import ProductCard from "./Home/ProductCard";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${apiUrl}/search?q=${query}`);
        setResults(response.data);
        console.log(response.data);
      } catch (err) {
        setError(
          err.response?.data?.error || "Something went wrong. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query, apiUrl]);

  if (!loading) {
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
          Search Results for "{query}"
        </h1>
        <p className="text-center text-red-600">{error}</p>
        <p className="text-center mt-4">
          <Link to="/" className="underline">
            Go to Product Page
          </Link>
        </p>
      </div>
    );
  }

  // if (results.length === 0) {
  //   return (
  //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  //       <h1 className="text-xl font-semibold my-4">
  //         Search Results for "{query}"
  //       </h1>
  //       <p className="text-center text-gray-600">No results found.</p>
  //       <p className="text-center mt-4">
  //         <Link to="/" className="underline">
  //           Go to Product Page
  //         </Link>
  //       </p>
  //       <div className="py-3">
  //         <span className="text-xl">Similar Products</span>
  //         <ProductCard />
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold my-4">Search Results for "{query}"</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((item) => (
          <Link
            key={item._id}
            to={`/products/${item._id}`}
            className="text-xl font-semibold hover:shadow-md group"
          >
            <li className="border p-4 rounded-md shadow-md">
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <img
                src={`${apiUrl}/images/${item.photo}`}
                className="group-hover:scale-105 duration-150"
                alt={item.name}
              />
              <p className="text-gray-600">${item.price}</p>
              <div className="flex items-center justify-between mt-5 bg-gray-100">
                <ShowCardRating
                  className="text-yellow-500"
                  productId={item._id}
                  size="small"
                />
              </div>
            </li>
          </Link>
        ))}
      </ul>

      <div className="py-3">
        <span className="text-xl underline">Similar Products</span>
        <ProductCard />
      </div>
    </div>
  );
};

export default SearchResults;
