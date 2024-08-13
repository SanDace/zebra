import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import ShowCardRating from "../Ratting/ShowCardRating";

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const response = await axios.get(
          `  ${apiUrl}/api/products?page=${currentPage}`
        );
        if (response.data.products && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
          setIsDataFetched(true);
        } else {
          setIsDataFetched(true);
          throw new Error("Products data is not an array");
        }
        setError(null);
      } catch (error) {
        setIsDataFetched(true);
        setError(error.message);
      }
    };

    getAllProducts();
  }, [currentPage]);

  if (error) {
    return <p>Error: {error} </p>;
  }

  /*  if (!isDataFetched) {
    return (
      <div className="flex items-center bg-white z-30 justify-center w-full h-screen absolute top-20 right-0.5">
        <img
          src="/pikachu.gif"
          alt="Pikachu"
          className="w-20 h-20 object-contain mb-16"
        />
      </div>
    );
  } */

  return (
    <div className="container  py-4 ">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
        {products.map((item) => (
          <Link
            key={item._id}
            to={`/products/${item._id}`}
            className="group block border rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative w-full pb-[66.67%] overflow-hidden">
              {/* Maintains a 3:2 aspect ratio */}
              <img
                src={`${apiUrl}/images/${item.photo}`}
                alt={item.name}
                className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 "
              />
            </div>
            <div className="px-2 py-3">
              <h2 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors duration-300">
                {item.name}
              </h2>
              <p className="text-gray-600 group-hover:text-indigo-500 transition-colors duration-300">
                ${item.price ? item.price.toFixed(1) : "N/A"}
              </p>
            </div>
            <div className="flex items-center px-2 bg-gray-100">
              <ShowCardRating
                className="text-yellow-500 "
                productId={item._id}
                size="small"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
