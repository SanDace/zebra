import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import ShowCardRating from "./Ratting/ShowCardRating";
import { RiMoneyEuroBoxFill } from "react-icons/ri";
import ProductDetails from "./../Pages/ProductDetails";
import ProductCard from "./Home/ProductCard";
const SearchResults = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const query = new URLSearchParams(location.search).get("q");
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchResults = async () => {
      const response = await axios.get(`${apiUrl}/search?q=${query}`);
      setResults(response.data);
      setLoading(false);
    };

    fetchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="flex items-center bg-white z-30 justify-center w-full h-screen absolute  right-0.5">
        <img
          src="/pikachu.gif"
          alt="Pikachu"
          className="w-20 h-20 object-contain mb-16"
        />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  ">
        <h1 className="text-xl font-[600] my-4">
          Search Results for
          <span className="font-[700] ml-2">"{query}"</span>
        </h1>
        <p className="text-center text-gray-600">No results found.</p>
        <p className="text-center mt-4 ">
          <Link to="/" className="underline   ">
            Go to Product Page
          </Link>
        </p>
        <div div className="py-3">
          <span className="text-xl"> Similar Products </span>
          <ProductCard />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full ">
      <h1 className="text-2xl font-bold my-4">Search Results for "{query}"</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((item) => (
          <Link
            key={item._id}
            to={`/products/${item._id}`}
            className="text-xl font-semibold hover:shadow-md group "
          >
            <li className="border p-4 rounded-md shadow-md">
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <img
                src={`${apiUrl}/images/${item.photo}`}
                className="group-hover:scale-105 duration-150"
                alt=""
              />

              <p className="text-gray-600">${item.price}</p>
              <div className="flex items-center  justify-between  mt-5 bg-gray-100">
                <ShowCardRating
                  className="text-yellow-500"
                  productId={item._id}
                  size="small"
                />
              </div>
              {/* Add more item details as needed */}
            </li>
          </Link>
        ))}
        
      </ul>

      <div div className="py-3">
        <span className="text-xl underline"> Similar Products </span>
        <ProductCard />
      </div>
    </div>
  );
};

export default SearchResults;
