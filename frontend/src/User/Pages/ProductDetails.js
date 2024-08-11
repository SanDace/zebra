import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CartContext } from "./../context/CartContext";
import { UseAuthContext } from "../hooks/useauthcontext";

import Magnifier from "../Components/Magnifier";
import CommentForm from "../Components/Comment/CommentForm";
import CommentList from "../Components/Comment/CommentList";
import ProductRating from "../Components/Ratting/ProductRatting";
import ShowRating from "../Components/Ratting/ShowRating";

const ProductDetails = () => {
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { user } = UseAuthContext();
  const user_id = user?.user._id; // Safely access user_id using optional chaining
  const navigate = useNavigate();
  const { updateCartCount } = useContext(CartContext);
  const [showModal, setShowModal] = useState(false);
  const [ratingsUpdated, setRatingsUpdated] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    setLoading(true);

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/product/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleCartClick = () => {
    navigate("/cart");
  };

  const addToCart = async () => {
    if (!user_id) {
      setShowModal(true);
      return;
    }

    setAddingToCart(true);

    try {
      const response = await axios.post(`${apiUrl}/api/cart/add`, {
        userId: user_id,
        productId: id,
        quantity: 1,
      });
      console.log("Product added to cart:", response.data);

      updateCartCount(1);

      toast.success(
        <div>
          Product Added to cart.
          <span onClick={handleCartClick} className="underline">
            View Cart
          </span>
        </div>
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!user_id) {
      setShowModal(true);
      return;
    }

    navigate(`/makeorder/${id}`);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="flex w-[100px] mx-auto align-center mt-[20%]">
        <img src="/pikachu.gif" alt="Pikachu" className="w-[70px]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex w-full h-[57vh] justify-center items-center">
        <p className="text-xl font-bold">Product not found.</p>
      </div>
    );
  }

  const handleRatingUpdate = () => {
    setRatingsUpdated(!ratingsUpdated);
  };

  return (
    <div className="container mx-auto p-3">
      <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <div className="hidden md:block">
            <Magnifier src={`${apiUrl}/images/${product.photo}`} />
          </div>
        </div>
        <div className="md:w-1/2 p-4 flex flex-col">
          <div className="block md:hidden">
            <img
              src={`${apiUrl}/images/${product.photo}`}
              alt={product.name}
              className="h-[250px] lg:h-[350px] w-full object-contain"
            />
          </div>
          <h1 className="text-xl font-[600] mb-2">{product.name}</h1>

          {product.categoryId && (
            <p className="text-sm text-gray-800 mb-4">
              Category:&nbsp;&nbsp;
              {product.categoryId.name}
            </p>
          )}
          <p className="text-2xl text-blue-500 font-400 mb-4">
            RS. {product.price}
          </p>
          <div className="flex items-center mb-4">
            Ratings:
            <ShowRating productId={id} ratingsUpdated={ratingsUpdated} />
          </div>
          <p className="text-gray-700 mb-6">{product.details}</p>
          <div className="flex col gap-3">
            <div className="mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                onClick={addToCart}
                disabled={addingToCart}
              >
                {addingToCart ? (
                  <p className="flex flex-row">
                    Adding <FaSpinner className="animate-spin ml-1 mt-1" />
                  </p>
                ) : (
                  "Add to Cart"
                )}
              </button>
            </div>
            <div className="mt-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="comment-section mt-4">
        {user_id ? (
          <CommentForm user_id={user_id} product_id={id} />
        ) : (
          <CommentList product_id={id} />
        )}

        <ProductRating
          productId={id}
          userId={user_id}
          onRatingUpdate={handleRatingUpdate}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Please Log In</h2>
            <p>
              You need to log in to add products to the cart or make a purchase.
            </p>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
                onClick={() => navigate("/login")}
              >
                Log In
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
