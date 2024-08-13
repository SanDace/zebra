import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Success = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const encodedResponse = params.get("data");
  const apiUrl =
    "https://ecommerce-backend-rwsg.onrender.com/esewa/complete-payment"; // Backend API endpoint

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

  // Redirect to order page after displaying payment success
  useEffect(() => {
    if (paymentData) {
      const timer = setTimeout(() => {
        window.location.href = "/profile/orders"; // Replace with your actual order page URL
      }, 1000); // Redirect after 3 seconds (adjust as needed)

      return () => clearTimeout(timer);
    }
  }, [paymentData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!paymentData) {
    return <div>No payment data found.</div>;
  }

  return (
    <div>
      <h1>Payment Success</h1>
      <p>Transaction Code: {paymentData.transaction_code}</p>
      <p>Status: {paymentData.status}</p>
      <p>Total Amount: {paymentData.amount}</p>
      <p>Transaction UUID: {paymentData.transaction_uuid}</p>
      {/* Display other relevant payment data */}
    </div>
  );
};

export default Success;
