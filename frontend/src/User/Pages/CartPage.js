import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { format, isValid } from "date-fns";
import { UseAuthContext } from "../hooks/useauthcontext";
import { CartContext } from "../context/CartContext";

const CartPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const { user } = UseAuthContext();
  const userId = user.user._id;

  const {
    state: cartState,
    dispatch: cartDispatch,
    resetCartCount,
  } = useContext(CartContext);

  useEffect(() => {
    resetCartCount();
  }, [resetCartCount]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`/api/cart/${userId}`);
        cartDispatch({ type: "SET_CART", payload: response.data });
        setIsEmpty(response.data.items.length === 0);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setIsEmpty(true); // Set cart as empty if an error occurs
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
  }, [userId, cartDispatch]);

  const removeFromCart = async (productId) => {
    try {
      await axios.delete("/api/cart/remove", {
        data: { userId, productId },
      });

      cartDispatch({ type: "DELETE_CART_ITEM", payload: { productId } });

      // Check if the cart is empty after removing the item
      if (cartState.cart.items.length === 1) {
        setIsEmpty(true);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      // Make an API call to update the quantity in the backend
      const response = await axios.put("/api/cart/updateQuantity", {
        userId,
        productId,
        newQuantity,
      });

      // Update the cart state in the frontend
      cartDispatch({
        type: "UPDATE_QUANTITY",
        payload: { productId, quantity: newQuantity },
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 ">
      {isLoading ? (
        <div className="flex items-center justify-center mt-5 h-[200px]">
          <img src="/pikachu.gif" alt="Loading..." className="w-20" />
        </div>
      ) : (
        <>
          {cartState.cart && !isEmpty ? (
            <>
              <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border-gray-200 rounded-lg overflow-hidden mb-6">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left py-2 px-3 sticky top-0 bg-gray-100">
                        Product
                      </th>
                      <th className="text-left py-2 px-3 sticky top-0 bg-gray-100">
                        Price
                      </th>
                      <th className="text-left py-2 px-3 sticky top-0 bg-gray-100">
                        Quantity
                      </th>
                      <th className="text-left py-2 px-3 sticky top-0 bg-gray-100">
                        Total
                      </th>
                      <th className="text-left py-2 px-3 sticky top-0 bg-gray-100">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartState.cart.items.map((item) => (
                      <tr
                        key={item.product._id}
                        className="border-b border-gray-200"
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center">
                            <Link to={`/products/${item.product._id}`}>
                              <img
                                src={`/images/${item.product.photo}`}
                                alt={item.product.name}
                                className="w-20 h-20 object-cover mr-4 sm:w-24 sm:h-24"
                              />
                            </Link>
                            <div>
                              <Link to={`/products/${item.product._id}`}>
                                <h2 className="text-lg font-bold">
                                  {item.product.name}
                                </h2>
                              </Link>
                              <p className="text-gray-700">
                                ${item.product.price}
                              </p>
                              <p className="text-gray-600 hidden md:block">
                                Added on:{" "}
                                {isValid(new Date(item.createdAt))
                                  ? format(new Date(item.createdAt), "PPP p")
                                  : "Unknown date"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">${item.product.price}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.product._id,
                                  item.quantity - 1
                                )
                              }
                              disabled={item.quantity === 1}
                              className={`px-2 py-1 bg-gray-200 text-gray-700 rounded-md ${
                                item.quantity === 1
                                  ? "cursor-not-allowed"
                                  : "cursor-pointer hover:bg-gray-300"
                              } focus:outline-none focus:ring focus:ring-gray-400`}
                            >
                              <FontAwesomeIcon icon={faMinus} />
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.product._id,
                                  item.quantity + 1
                                )
                              }
                              className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-400"
                            >
                              <FontAwesomeIcon icon={faPlus} />
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => removeFromCart(item.product._id)}
                            className="text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className=" flex items-center justify-center h-[220px] ">
              <div className="text-center pt-10">
                <p className="text-black">Your cart is empty.</p>
                <Link
                  to="/"
                  className="text-blue-500 underline hover:font-semibold"
                >
                  Browse Products
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CartPage;
