import React, { useState } from "react";
import axios from "axios";
import { UseAuthContext } from "../../../../hooks/useauthcontext";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

const AddressForm = ({ onAddressChange }) => {
  const { user } = UseAuthContext();
  const [isAdding, setIsAdding] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL ; // Default for development

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    tole: "",
    phone: "",
    userId: user.user._id, // Use the actual user ID
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      if (formData._id) {
        // If _id exists, it's an update
        await axios.put(`${apiUrl}/address/${formData._id}`, formData);
        console.log("Address updated:", formData);
      } else {
        // Otherwise, it's a new address
        await axios.post(`${apiUrl}/address/create`, formData);
        console.log("Address created:", formData);
      }
      setErrorMessage(""); // Clear any previous error message
      setFormData({
        address: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        tole: "",
        phone: "",
        userId: user.user._id,
      });
      toast.success("Address Added");
      setIsAdding(false);
      onAddressChange(); // Notify parent to refresh address list
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error); // Set error message
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto pt-3">
      <h1 className="text-xl font-medium text-center underline">
        {formData._id ? "Update Address" : "Add your Delivery Address"}
      </h1>
      {errorMessage && (
        <div className="text-red-500 text-center mb-4">{errorMessage}</div>
      )}
      <div className="grid grid-cols-2 gap-4 mb-4 pt-4">
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700"
          >
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-gray-700"
          >
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="postalCode"
            className="block text-sm font-medium text-gray-700"
          >
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="mb-4">
        <label
          htmlFor="tole"
          className="block text-sm font-medium text-gray-700"
        >
          Tole
        </label>
        <input
          type="text"
          id="tole"
          name="tole"
          value={formData.tole}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mt-6">
        <button
          type="submit"
          className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isAdding ? (
            <span className="flex justify-center items-center">
              Adding
              <FaSpinner className="animate-spin h-5 w-5 ml-1 text-white" />
            </span>
          ) : (
            <>Add</>
          )}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
