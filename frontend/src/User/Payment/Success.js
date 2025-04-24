
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Success = () => {
  const location = useLocation(); // ✅ Proper usage of useLocation
  const params = new URLSearchParams(location.search);
  const encodedResponse = params.get("data");

  const apiUrl = "https://ecommerce-backend-rwsg.onrender.com/esewa/complete-payment";

  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const response = await axios.post(apiUrl, { data: encodedResponse });
        setPaymentData(response.data.paymentData);
      } catch (error) {
        setError("Error saving payment data: " + error.message);
        console.error(
          "Error saving payment data:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoading(false);
      }
    };

    if (encodedResponse) {
      fetchPaymentData();
    } else {
      setLoading(false);
    }
  }, [encodedResponse]);

  useEffect(() => {
    if (paymentData) {
      const timer = setTimeout(() => {
        window.location.href = "/profile/orders"; // Replace with your actual order page URL
      }, 1000); // Redirect after 1 second (adjust if needed)

      return () => clearTimeout(timer);
    }
  }, [paymentData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-lg font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-100">
        <div className="text-lg font-semibold text-red-700">Error: {error}</div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-yellow-100">
        <div className="text-lg font-semibold text-yellow-700">No payment data found.</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-50">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-xl w-full">
        <h1 className="text-3xl font-bold text-green-600 mb-6 text-center">Payment Success</h1>
        <p className="text-xl text-gray-800 mb-4">
          <span className="font-semibold">Transaction Code:</span> {paymentData.transaction_code}
        </p>
        <p className="text-xl text-gray-800 mb-4">
          <span className="font-semibold">Status:</span> {paymentData.status}
        </p>
        <p className="text-xl text-gray-800 mb-4">
          <span className="font-semibold">Total Amount:</span> ${paymentData.amount}
        </p>
        <p className="text-xl text-gray-800 mb-6">
          <span className="font-semibold">Transaction UUID:</span> {paymentData.transaction_uuid}
        </p>
        <div className="text-center">
          <button
            onClick={() => (window.location.href = "/profile/orders")}
            className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition duration-300"
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;
