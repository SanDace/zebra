import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateProduct = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/products/${id}`);
        const product = response.data;
        setName(product.name);
        setDetails(product.details);
        setPrice(product.price);
        setCategoryId(product.categoryId._id);
        setError({});
        console.log(product.categoryId);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to fetch product. Please try again later.");
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("/category/form");
        setCategories(response.data);
        setError({});
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to fetch categories. Please try again later.");
      }
    };

    fetchProduct();
    fetchCategories();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      setError((prev) => ({ ...prev, name: "Name is required" }));
      return;
    }
    if (name.length > 225) {
      setError((prev) => ({
        ...prev,
        name: "Name must be less than 125 characters",
      }));
      return;
    }

    if (!details) {
      setError((prev) => ({ ...prev, details: "Details are required" }));
      return;
    }
    if (details.length > 1000) {
      setError((prev) => ({
        ...prev,
        details: "Details must be less than 1000 characters",
      }));
      return;
    }

    if (!price) {
      setError((prev) => ({ ...prev, price: "Price is required" }));
      return;
    }
    if (isNaN(price) || price <= 0) {
      setError((prev) => ({
        ...prev,
        price: "Price must be a positive number",
      }));
      return;
    }

    if (image && image.size > 1 * 1024 * 1024) {
      setError((prev) => ({
        ...prev,
        image: "Image size should not exceed 1MB",
      }));
      return;
    }
    const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
    if (image) {
      const extension = image.name.split(".").pop().toLowerCase();
      if (!allowedExtensions.includes(extension)) {
        setError((prev) => ({
          ...prev,
          image: "Image must be of type JPG, JPEG, PNG, or GIF",
        }));
        return;
      }
    }

    if (!categoryId) {
      setError((prev) => ({ ...prev, categoryId: "Category is required" }));
      return;
    }

    try {
      const formData = new FormData();
      if (image) {
        formData.append("photo", image);
      }
      formData.append("name", name);
      formData.append("details", details);
      formData.append("price", price);
      formData.append("categoryId", categoryId);

      const response = await axios.put(`/products/${id}`, formData);

      if (response.status === 200) {
        toast.success("Product Updated");
        navigate("/admin/products");
      } else {
        setError({ server: "Something went wrong" });
      }
    } catch (error) {
      setError({ server: error.message });
      console.error("Error updating product:", error.message);
    }
  };

  const handleInputChange = (e, field) => {
    if (error[field]) {
      setError((prev) => ({ ...prev, [field]: "" }));
    }

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
        Update Product
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
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => handleInputChange(e, "categoryId")}
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

export default UpdateProduct;
