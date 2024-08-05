import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { UseAuthContext } from "./hooks/useauthcontext";

import CategorySelect from "./Components/CategorySelect";
import ProductCard from "./Components/Home/ProductCard";
import ProductSlider from "./Components/Home/ProductSlider";
import CategoryList from "./Components/Home/CategoryList";

const Home = () => {
  const { user } = UseAuthContext();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use the correct environment variable
  const apiUrl = process.env.API_URL || "http://localhost:5000"; // Default for development

  useEffect(() => {
    const getUserData = async () => {
      try {
        if (!user) {
          throw new Error("User not authenticated");
        }

        // Use apiUrl variable for requests
        const response = await axios.get(
          `${apiUrl}/auth/userData/${user.user._id}`
        );
        setUserData(response.data);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [user, apiUrl]); // Include apiUrl as a dependency

  if (loading) {
    return (
      <div className="flex w-[100px] mx-auto align-center mt-[20%]">
        <img src="/pikachu.gif" alt="Pikachu" className="w-[70px]" />
      </div>
    );
  }

  return (
    <div className="h-fit flex-col px-4 py-2">
      {error && <p className="text-red-500">{error}</p>}
      {userData && <p>Welcome, {userData.email}</p>}
      <div className="hero-section grid grid-cols-10 gap-2">
        <div className="col-span-2 border-2 md:hidden">
          <CategorySelect />
        </div>
        <div className="hidden md:grid md:col-span-2 rounded-lg border shadow-sm">
          <CategoryList />
        </div>
        <div className="col-span-8 rounded-lg border shadow-sm">
          <ProductSlider />
        </div>
      </div>
      <ProductCard />
    </div>
  );
};

export default Home;
