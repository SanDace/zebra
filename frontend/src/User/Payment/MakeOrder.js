import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { UseAuthContext } from "../hooks/useauthcontext";

const MakeOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = UseAuthContext();
  const userId = user?.user._id;
  const apiUrl = process.env.REACT_APP_API_URL; // Default for development

  useEffect(() => {
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

  const handleEsweaClick = async () => {
    if (quantity > product.stock) {
      setError("Order quantity exceeds available stock");
      return;
    }

    try {
      const transaction_uuid = uuidv4();
      const totalPrice = product.price * quantity;

      const response = await axios.post(`${apiUrl}/esewa/initialize-esewa`, {
        id: product._id,
        totalPrice: totalPrice,
        transaction_uuid: transaction_uuid,
        product_code: "EPAYTEST",
        user_id: userId,
        quantity: quantity,
        paymentMethod: "esewa",
      });

      console.log("POST request response:", response.data);
      navigate(`/paymentoptions/${response.data.purchasedItemData._id}`);
    } catch (error) {
      console.error("Error initializing eSewa payment:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="text-lg font-semibold mb-4">Payment Option</div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white shadow-md rounded-lg p-6 relative">
          <h2 className="text-xl font-[400] mb-2">{product.name}</h2>
          {product.photo && (
            <img
              src={`${apiUrl}/images/${product.photo}`}
              alt={product.name}
              className="w-full h-64 object-contain mb-4 rounded-lg"
            />
          )}
          <p className="text-gray-600 mb-4">{product.details}</p>
          <div className="border-t border-gray-200 pt-4">
            <p className="mb-2">
              <span className="font-semibold">Stock:</span> {product.stock}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Quantity:</span>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                max={product.stock}
                className="ml-2 border border-gray-300 rounded p-1 w-16"
              />
            </p>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
          <p className="mb-2">
            <span className="font-semibold">Item amount:</span> Rs.{" "}
            {product.price}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Quantity:</span> {quantity}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Total Price:</span> Rs.{" "}
            {(product.price * quantity).toFixed(2)}
          </p>
          <p className="text-gray-600 mb-4">All taxes included</p>
          <button
            onClick={handleEsweaClick}
            className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default MakeOrder;
