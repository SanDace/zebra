import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ShowCardRating from "../Ratting/ShowCardRating";

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const getAllProducts = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/products`);
      if (Array.isArray(response.data.products)) {
        setProducts(response.data.products);
      } else {
        throw new Error("Products data is not an array");
      }
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center w-full h-screen">
  //       <img src="/pikachu.gif" alt="Loading..." className="w-20 h-20" />
  //     </div>
  //   );
  // }

  if (error) {
    return <p className="text-red-500 text-center mt-5">Error: {error}</p>;
  }

  return (
    <div className="container mx-auto max-w-[95%] sm:max-w-[90%] lg:max-w-[90%] py-6 px-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {products.map((item) => (
          <Link
            key={item._id}
            to={`/products/${item._id}`}
            className="group block border rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300"
          >
            <div className="relative aspect-[3/2] overflow-hidden">
              <img
                src={`${apiUrl}/images/${item.photo}`}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="px-3 py-2">
              <h2 className="text-sm font-semibold text-gray-800 line-clamp-1 group-hover:text-indigo-600 transition duration-300">
                {item.name}
              </h2>
              <p className="text-gray-600 group-hover:text-indigo-500 transition duration-300">
                ${item.price ? item.price.toFixed(2) : "N/A"}
              </p>
            </div>
            <div className="flex items-center px-3 py-2 bg-gray-100">
              <ShowCardRating productId={item._id} size="small" />
            </div>
          </Link>
        ))}
      </div>
    </div>

  );
};

export default ProductCard;
