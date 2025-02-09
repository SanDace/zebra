import React, { useState, useEffect } from "react";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";

import axios from "axios";

// Install Swiper modules

const ProductSlider = ({ currentPage }) => {
  const [products, setProducts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [error, setError] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;
  // const apiUrl = "http://localhost:3001";

  // Default for development

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/products?page=${currentPage}`
        );
        if (response.data.products && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
          setIsDataFetched(true);
        } else {
          setIsDataFetched(true);
          throw new Error("Products data is not an array");
        }
        setError(null);
      } catch (error) {
        setIsDataFetched(true);
        setError(error.message);
      }
    };

    getAllProducts();
  }, [currentPage]);

  useEffect(() => {
    if (isDataFetched) {
      const swiper = new Swiper(".swiper", {
        loop: true,
        initialSlide: 0,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        autoplay: {
          delay: 4000, // Autoplay delay in milliseconds
        },
      });

      return () => {
        swiper.destroy();
      };
    }
  }, [isDataFetched, products]);

  if (!isDataFetched) {
    return (
      <div className="flex items-center bg-white z-30 justify-center w-full h-screen absolute  right-0.5">
        <img
          src="/pikachu.gif"
          alt="Pikachu"
          className="w-20 h-20 object-contain mb-16"
        />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="swiper relative  rounded-lg   ">
      <div className="swiper-wrapper  ">
        {products.map((product) => (
          <div className="swiper-slide  " key={product._id}>
            <img
              // src={`/images/${product.photo}`}
              src={`${apiUrl}/images/${product.photo}`}
              alt={product.name}
              className=" object-cover w-full h-[350px] transition-transform duration-[150ms]"
            />
            {/*  <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>${product.price}</p> */}
          </div>
        ))}
      </div>
      <div className="absolute bottom-[-5px] w-full ">
        <div className="swiper-pagination "></div>
      </div>
      {/*   <div className="swiper-button-next"></div>
      <div className="swiper-button-prev"></div> */}
    </div>
  );
};

export default ProductSlider;
