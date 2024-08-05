import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import axios from "axios";
import { useParams } from "react-router-dom";
import { UseAuthContext } from "../hooks/useauthcontext";

const Form = () => {
  const secretKey = "8gBm/:&EnhH.1/q";
  const { id } = useParams();
  const { user } = UseAuthContext();

  // State variables
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    amount: "100",
    tax_amount: "10",
    product_service_charge: "0",
    product_delivery_charge: "0",
    success_url: "http://localhost:3001/esewa/complete-payment",
    failure_url: "https://google.com",
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: "",
    total_amount: "110",
    transaction_uuid: uuidv4(),
    product_code: "EPAYTEST",
  });

  // Fetch product data based on productId (if needed)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/product/${id}`);
        setProduct(response.data); // Assuming the API response contains product details
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Generate signature based on formData
  const generateSignature = (formData) => {
    const dataString = `total_amount=${formData.total_amount},transaction_uuid=${formData.transaction_uuid},product_code=${formData.product_code}`;
    const hash = CryptoJS.HmacSHA256(dataString, secretKey);
    const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    return hashInBase64;
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Update formData with the generated signature
      const updatedFormData = {
        ...formData,
        signature: generateSignature(formData),
        userId: user.user._id,
      };

      // Create a form element to submit the data to eSewa
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
    } catch (error) {
      console.error("Error initializing payment:", error);
    }
  };

  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div>
      <h1>Initiate eSewa Payment</h1>
      {product && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="amount">Amount:</label>
          <input
            type="text"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            required
          />
          <br />
          <label htmlFor="tax_amount">Tax Amount:</label>
          <input
            type="text"
            id="tax_amount"
            name="tax_amount"
            value={formData.tax_amount}
            onChange={handleInputChange}
            required
          />
          <br />
          <label htmlFor="total_amount">Total Amount:</label>
          <input
            type="text"
            id="total_amount"
            name="total_amount"
            value={formData.total_amount}
            onChange={handleInputChange}
            required
          />
          <br />
          <label htmlFor="transaction_uuid">Transaction UUID:</label>
          <input
            type="text"
            id="transaction_uuid"
            name="transaction_uuid"
            value={formData.transaction_uuid}
            onChange={handleInputChange}
            required
          />
          <br />
          <label htmlFor="product_code">Product Code:</label>
          <input
            type="text"
            id="product_code"
            name="product_code"
            value={formData.product_code}
            onChange={handleInputChange}
            required
          />
          <br />
          <label htmlFor="product_service_charge">
            Product Service Charge:
          </label>
          <input
            type="text"
            id="product_service_charge"
            name="product_service_charge"
            value={formData.product_service_charge}
            onChange={handleInputChange}
            required
          />
          <br />
          <label htmlFor="product_delivery_charge">
            Product Delivery Charge:
          </label>
          <input
            type="text"
            id="product_delivery_charge"
            name="product_delivery_charge"
            value={formData.product_delivery_charge}
            onChange={handleInputChange}
            required
          />
          <br />
          <label htmlFor="success_url">Success URL:</label>
          <input
            type="text"
            id="success_url"
            name="success_url"
            value={formData.success_url}
            onChange={handleInputChange}
            required
          />
          <br />
          <label htmlFor="failure_url">Failure URL:</label>
          <input
            type="text"
            id="failure_url"
            name="failure_url"
            value={formData.failure_url}
            onChange={handleInputChange}
            required
          />
          <br />
          <label htmlFor="signed_field_names">Signed Field Names:</label>
          <input
            type="text"
            id="signed_field_names"
            name="signed_field_names"
            value={formData.signed_field_names}
            onChange={handleInputChange}
            required
          />
          <br />
          <label htmlFor="signature">Signature:</label>
          <input
            type="text"
            id="signature"
            name="signature"
            value={formData.signature}
            readOnly
            required
          />
          <br />
          <input value="Submit" type="submit" />
        </form>
      )}
    </div>
  );
};

export default Form;
