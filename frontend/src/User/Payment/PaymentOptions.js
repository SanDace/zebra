import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

const PaymentOptions = () => {
  const secretKey = "8gBm/:&EnhH.1/q";
  const { id } = useParams();
  const apiUrl = process.env.REACT_APP_API_URL; // Default for development

  // State variables
  const [formData, setFormData] = useState({
    amount: "",
    tax_amount: "",
    product_service_charge: "0",
    product_delivery_charge: "0",
    failure_url: "https://zebra-j6vx.onrender.com/payment_failure",
    success_url: "https://zebra-j6vx.onrender.com/payment_success",
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: "",
  });

  // Fetch purchased item based on id
  useEffect(() => {
    const fetchPurchasedItem = async () => {
      try {
        const response = await axios.get(`${apiUrl}/purchaseditem/${id}`);
        const purchasedItem = response.data;

        // Update formData state with fetched purchasedItem data
        const newFormData = {
          amount: purchasedItem.totalPrice,
          tax_amount: 0, // Replace with actual tax amount if applicable
          total_amount: purchasedItem.totalPrice,
          transaction_uuid: purchasedItem.transaction_uuid,
          product_code: "EPAYTEST",
          product_service_charge: 0, // Replace with actual service charge if applicable
          product_delivery_charge: 0, // Replace with actual delivery charge if applicable
          success_url:
            "https://ecommerce-frontend-xrhf.onrender.com/payment_success", // Replace with actual success URL
          failure_url: `https://ecommerce-frontend-xrhf.onrender.com/payment_failure/${purchasedItem.transaction_uuid}`, // Replace with actual failure URL
          signed_field_names: "total_amount,transaction_uuid,product_code",
          signature: "", // Temporary empty signature
        };

        newFormData.signature = generateSignature(newFormData);
        setFormData(newFormData);
      } catch (error) {
        console.error("Error fetching purchased item:", error);
      }
    };

    if (id) {
      fetchPurchasedItem();
    }
  }, [id]);

  const generateSignature = (formData) => {
    const dataString = `total_amount=${formData.total_amount},transaction_uuid=${formData.transaction_uuid},product_code=${formData.product_code}`;
    const hash = CryptoJS.HmacSHA256(dataString, secretKey);
    const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    return hashInBase64;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Ensure amount is a valid numeric value
    const parsedAmount = parseFloat(formData.amount);
    if (isNaN(parsedAmount)) {
      console.error("Invalid amount:", formData.amount);
      return;
    }

    // Calculate total amount
    const totalAmount =
      parsedAmount +
      parseFloat(formData.tax_amount) +
      parseFloat(formData.product_service_charge) +
      parseFloat(formData.product_delivery_charge);

    // Update formData with calculated total amount
    const updatedFormData = {
      ...formData,
      amount: parsedAmount.toFixed(2), // Ensure two decimal places for amount
      total_amount: totalAmount.toFixed(2), // Ensure two decimal places for total_amount
      product_code: "EPAYTEST",
    };

    // Generate the signature with the updated formData
    const signature = generateSignature(updatedFormData);

    // Update formData with the generated signature
    updatedFormData.signature = signature;

    // Create a form element to submit the data
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    // Add form fields
    for (const key in updatedFormData) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = updatedFormData[key];
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-10">
      <Helmet>
        <title>PayMent</title>
      </Helmet>
      <div className="bg-gray-600 text-neutral-300 text-center py-3 font-bold text-lg">
        Payment Option
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="flex justify-center mb-4">
          <img
            src="/images/esewa.jpg"
            alt="eSewa Logo"
            className="h-[100px] rounded-lg"
          />
        </div>
        <div className="flex justify-center">
          <input
            type="submit"
            value="Pay with eSewa"
            className="bg-gray-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg cursor-pointer transition duration-300"
          />
        </div>
      </form>
    </div>
  );
};

export default PaymentOptions;
