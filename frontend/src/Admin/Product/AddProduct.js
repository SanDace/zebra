import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AddProduct = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(""); // New state for stock
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/category/form`);
        setCategories(response.data);
        setError({});
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError({
          categories: "Failed to fetch categories. Please try again later.",
        });
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    let validationErrors = {};
    if (!image) {
      validationErrors.image = "Image is required";
    } else if (image.size > 1 * 1024 * 1024) {
      validationErrors.image = "Image size should not be greater than 1MB";
    }
    if (!name) {
      validationErrors.name = "Name is required";
    } else if (name.length > 125) {
      validationErrors.name = "Name should not be greater than 125 characters";
    }
    if (!details) {
      validationErrors.details = "Details are required";
    } else if (details.length > 700) {
      validationErrors.details =
        "Details should not be greater than 700 characters";
    }
    if (!price) {
      validationErrors.price = "Price is required";
    } else if (price < 0) {
      validationErrors.price = "Price must be positive";
    }

    if (!stock) {
      validationErrors.stock = "Stock is required"; // Validation for stock
    } else if (stock < 0) {
      validationErrors.stock = "Stock must be a positive number";
    }

    if (!categoryId) {
      validationErrors.categoryId = "Category is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("photo", image);
      formData.append("name", name);
      formData.append("details", details);
      formData.append("price", price);
      formData.append("stock", stock); // Add stock to formData
      formData.append("categoryId", categoryId);

      const response = await axios.post(
        // `http://localhost:3001/products/create`,t
        `${apiUrl}/products/create`,
        formData
      );

      if (response.status === 201) {
        toast.success("Product Created");
        navigate("/admin/products");
      } else {
        setError({ server: "Something went wrong" });
      }
    } catch (error) {
      setError({ server: "Internal server error" });
      console.error("Error uploading media:", error.message);
    }
  };

  const handleInputChange = (e, field) => {
    setError((prev) => ({ ...prev, [field]: "" }));

    switch (field) {
      case "image":
        setImage(e.target.files[0]);
        break;
      case "name":
        setName(e.target.value);
        break;
      case "details":
        setDetails(e.target.value);
        break;
      case "price":
        setPrice(e.target.value);
        break;
      case "stock":
        setStock(e.target.value); // Handle stock input change
        break;
      case "categoryId":
        setCategoryId(e.target.value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold text-center text-indigo-700">
        Add Product
      </h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleInputChange(e, "image")}
            className={`mt-2 block w-full px-3 py-2 border ${
              error.image ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          />
          {error.image && <p className="text-sm text-red-500">{error.image}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleInputChange(e, "name")}
            maxLength={255}
            className={`mt-2 block w-full px-3 py-2 border ${
              error.name ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          />
          <p className="text-sm text-gray-500">{name.length}/255 characters</p>
          {error.name && <p className="text-sm text-red-500">{error.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Details
          </label>
          <textarea
            value={details}
            onChange={(e) => handleInputChange(e, "details")}
            maxLength={1000}
            className={`mt-2 block w-full px-3 py-2 border ${
              error.details ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          />
          <p className="text-sm text-gray-500">
            {details.length}/1000 characters
          </p>
          {error.details && (
            <p className="text-sm text-red-500">{error.details}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => handleInputChange(e, "price")}
            className={`mt-2 block w-full px-3 py-2 border ${
              error.price ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          />
          {error.price && <p className="text-sm text-red-500">{error.price}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Stock
          </label>
          <input
            type="number"
            value={stock}
            onChange={(e) => handleInputChange(e, "stock")}
            className={`mt-2 block w-full px-3 py-2 border ${
              error.stock ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          />
          {error.stock && <p className="text-sm text-red-500">{error.stock}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => handleInputChange(e, "categoryId")}
            className={`mt-2 block w-full px-3 py-2 border ${
              error.categoryId ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {error.categoryId && (
            <p className="text-sm text-red-500">{error.categoryId}</p>
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

export default AddProduct;
