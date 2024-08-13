import React, { useState, useEffect } from "react";
import axios from "axios";
import { UseAuthContext } from "../../../../hooks/useauthcontext";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
const UpdateAddress = ({ onAddressUpdate }) => {
  const { user } = UseAuthContext();
  const [address, setAddress] = useState(null);
  const [formData, setFormData] = useState({
    city: "",
    state: "",
    postalCode: "",
    country: "",
    tole: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL; // Default for development

  // Fetch the address for the user
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/address/user/${user.user._id}`
        );
        if (response.data.length > 0) {
          const addressData = response.data[0];
          setAddress(addressData);
          setFormData({
            city: addressData.city || "",
            state: addressData.state || "",
            postalCode: addressData.postalCode || "",
            country: addressData.country || "",
            tole: addressData.tole || "",
            phone: addressData.phone || "",
          });
        }
      } catch (error) {
        setErrorMessage("Error fetching address");
        console.error("Error fetching address:", error);
      }
    };

    fetchAddress();
  }, [user.user._id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!address?._id) {
        throw new Error("Address ID is missing");
      }
      await axios.put(`${apiUrl}/address/${address._id}`, formData);
      onAddressUpdate();
      toast.success("Address updated successfully");
    } catch (error) {
      setErrorMessage(
        "An error occurred: " + (error.response?.data?.error || error.message)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!address) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-xl font-medium text-center underline">
        Update Address
      </h1>
      {errorMessage && (
        <div className="text-red-500 text-center mb-4">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md mx-auto pt-3">
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
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex justify-center items-center">
                Updating
                <FaSpinner className="animate-spin h-5 w-5 ml-1 text-white" />
              </span>
            ) : (
              "Update"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateAddress;
