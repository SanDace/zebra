import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AddDiscount = () => {
  const [discountRate, setDiscountRate] = useState("");
  const [startsFrom, setStartsFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    if (!discountRate) {
      errors.discountRate = "Discount rate is required";
    } else if (discountRate < 1 || discountRate > 100) {
      errors.discountRate = "Discount rate must be between 1 and 100";
    }
    if (new Date(startsFrom) < new Date().setHours(0, 0, 0, 0)) {
      errors.startsFrom = "Starting date cannot be in the past";
    }
    if (new Date(validUntil) <= new Date().setHours(0, 0, 0, 0)) {
      errors.validUntil = "Valid until date cannot be in the past";
    } else if (startsFrom && new Date(validUntil) < new Date(startsFrom)) {
      errors.validUntil =
        "Valid until date must be greater than or equal to the starting date";
    }

    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    try {
      const discountData = {
        discount_rate: discountRate,
        starts_from: startsFrom,
        valid_until: validUntil,
      };
      const response = await axios.post("/discounts/create", discountData);

      if (response.status === 201) {
        toast.success("Discount Created");
        navigate("/admin/discounts");
      } else {
        setError("Something went wrong");
      }
    } catch (error) {
      setError(error.message );
      console.error("Error creating discount:", error);
    }
  };

  const handleInputChange = (e, field) => {
    if (error[field]) {
      setError((prev) => ({ ...prev, [field]: "" }));
    }

    switch (field) {
      case "discountRate":
        setDiscountRate(e.target.value);
        break;
      case "startsFrom":
        setStartsFrom(e.target.value);
        break;
      case "validUntil":
        setValidUntil(e.target.value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold text-center text-indigo-700">
        Add Discount
      </h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Discount Rate (%)
          </label>
          <input
            type="number"
            value={discountRate}
            onChange={(e) => handleInputChange(e, "discountRate")}
            className={`mt-2 block w-full px-3 py-2 border ${
              error.discountRate ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          />
          {error.discountRate && (
            <p className="text-sm text-red-500">{error.discountRate}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Starts From
          </label>
          <input
            type="date"
            value={startsFrom}
            onChange={(e) => handleInputChange(e, "startsFrom")}
            className={`mt-2 block w-full px-3 py-2 border ${
              error.startsFrom ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          />
          {error.startsFrom && (
            <p className="text-sm text-red-500">{error.startsFrom}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Valid Until
          </label>
          <input
            type="date"
            value={validUntil}
            onChange={(e) => handleInputChange(e, "validUntil")}
            className={`mt-2 block w-full px-3 py-2 border ${
              error.validUntil ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          />
          {error.validUntil && (
            <p className="text-sm text-red-500">{error.validUntil}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
      {error.server && <div className="mt-4 text-red-600">{error.server}</div>}
    </div>
  );
};

export default AddDiscount;
