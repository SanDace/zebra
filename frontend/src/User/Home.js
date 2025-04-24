import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { UseAuthContext } from "./hooks/useauthcontext";
import { Helmet } from "react-helmet";
import CategorySelect from "./Components/CategorySelect";
import ProductCard from "./Components/Home/ProductCard";
import ProductSlider from "./Components/Home/ProductSlider";
import CategoryList from "./Components/Home/CategoryList";

const Home = () => {
  const { user } = UseAuthContext();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Api Assigning 
  const apiUrl = process.env.REACT_APP_API_URL ; 

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

  /* if (loading) {
    return (
      <div className="flex w-[100px] mx-auto align-center mt-[20%]">
        <img src="/pikachu.gif" alt="Pikachu" className="w-[70px]" />
      </div>
    );
  } */

  return (
    <div className="h-fit flex-col px-4 py-2">
      <Helmet>
        <title>Zebra</title>
      </Helmet>
      {/* {error && <p className="text-red-500">{error}</p>} */}
      {/* {userData && <p>Welcome, {userData.email}</p>} */}
      <div className="hero-section grid grid-cols-1 sm:grid-cols-2 md:grid-cols-8 lg:grid-cols-10 gap-2">
        <div className="hidden md:block md:col-span-2 rounded-lg border shadow-sm">
          <CategoryList />
        </div>
        <div className="block md:hidden">
          <CategorySelect />
        </div>

        <div className="col-span-1 sm:col-span-2 md:col-span-6 lg:col-span-8 rounded-lg border shadow-sm">
          <ProductSlider />
        </div>
      </div>
      <ProductCard />
    </div>
  );
};

export default Home;
