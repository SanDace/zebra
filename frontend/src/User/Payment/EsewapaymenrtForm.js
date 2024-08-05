import React, { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useParams } from "react-router-dom";

const EsewaPaymentForm = () => {
  const secretKey = "8gBm/:&EnhH.1/q";
  const { id } = useParams();

  // State variables
  const [formData, setFormData] = useState({
    amount: "", // Will be set based on product price
    tax_amount: "10", // Default tax amount, can be fetched or calculated
    product_service_charge: "0",
    product_delivery_charge: "0",
    success_url: "http://localhost:3000/payment_succcess",
    failure_url: "http://localhost:3000/payment_failure",
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: "",
  });

  // Fetch product price based on productId
  useEffect(() => {
    const fetchProductPrice = async () => {
      try {
        const response = await axios.get(`/api/product/${id}`);
        const price = response.data.price;
        setFormData((prevFormData) => ({
          ...prevFormData,
          amount: price.toString(), // Convert price to string if necessary
        }));
      } catch (error) {
        console.error("Error fetching product price:", error);
      }
    };

    if (id) {
      fetchProductPrice();
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

    // Generate a unique transaction_uuid for each request
    const uniqueTransactionUUID = uuidv4();

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

    // Update formData with calculated total amount and transaction_uuid
    const updatedFormData = {
      ...formData,
      amount: parsedAmount.toFixed(2), // Ensure two decimal places for amount
      total_amount: totalAmount.toFixed(2), // Ensure two decimal places for total_amount
      transaction_uuid: uniqueTransactionUUID,
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
    <form onSubmit={handleSubmit}>
      <button type="submit">Pay with eSewa</button>
    </form>
  );
};

export default EsewaPaymentForm;
