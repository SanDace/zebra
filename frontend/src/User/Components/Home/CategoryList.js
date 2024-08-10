import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/category/form`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <ul className="">
      {categories.slice(0, 12).map((category) => (
        <li
          key={category._id}
          className="cursor-pointer py-1 px-4 text-sm text-slate-500 hover:text-blue-700 hover:pl-5 hover:shadow-sm hover:bg-gray-50 hover:font-medium mb-px rounded  transition duration-70 ease-in-out"
          onClick={() => navigate(`/products/category/${category._id}`)}
        >
          {category.name}
        </li>
      ))}
    </ul>
  );
};

export default CategoryList;
