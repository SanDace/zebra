import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import axios from "axios";
import Magnifier from "../Components/Magnifier";

const SingleProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${apiUrl}/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  return (
    <div className="container mx-auto p-6">
      {product && (
        <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col md:flex-row">
          <div className="md:w-1/2 p-4 cursor-zoom-in">
            <Magnifier src={`${apiUrl}/images/${product.photo}`} />
          </div>
          <div className="md:w-1/2 p-4 flex flex-col">
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-xl text-gray-800 mb-4">${product.price}</p>
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((star, index) => (
                  <svg
                    key={index}
                    className="w-6 h-6 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.378 4.243a1 1 0 00.95.69h4.462c.969 0 1.371 1.24.588 1.81l-3.618 2.63a1 1 0 00-.364 1.118l1.378 4.243c.3.921-.755 1.688-1.54 1.118l-3.618-2.63a1 1 0 00-1.175 0l-3.618 2.63c-.784.57-1.838-.197-1.54-1.118l1.378-4.243a1 1 0 00-.364-1.118L2.16 9.67c-.783-.57-.381-1.81.588-1.81h4.462a1 1 0 00.95-.69L9.049 2.927z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-gray-600">(120 reviews)</span>
            </div>
            <p className="text-gray-700 mb-6">{product.details}</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
              Add to Cart
            </button>

            <Link
              to={`/admin/products/update/${id}`}
              className="text-blue-500 hover:text-blue-700 inline-block"
            >
              Update
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleProduct;
