import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner } from "react-icons/fa"; // Import spinner icon

const ProductRating = ({ productId, userId, onRatingUpdate }) => {
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(null);
  const [canRate, setCanRate] = useState(false); // State to determine if user can rate
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track submission status

  useEffect(() => {
    checkPurchaseStatus();
  }, []);

  useEffect(() => {
    if (canRate) {
      fetchUserRating();
    }
  }, [canRate]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const fetchUserRating = async () => {
    try {
      const response = await axios.get(
        `/rating/get/${productId}?userId=${userId}`
      );
      if (response.data.rating) {
        setUserRating(response.data.rating);
        setRating(response.data.rating); // Set initial rating to user's existing rating
      }
    } catch (error) {
      // toast.error("Error fetching user rating");
      console.error("Error fetching user rating:", error);
    }
  };

  const checkPurchaseStatus = async () => {
    try {
      const response = await axios.get(
        `/api/purchase/check/${productId}/${userId}`
      );
      console.log(response.data);
      if (response.data.payment) {
        setCanRate(true);
      } else {
        // toast.info("You need to purchase this product to rate it.");
      }
    } catch (error) {
      // toast.error("Error checking purchase status");
      console.error("Error checking purchase status:", error);
    } finally {
      setIsLoading(false); // Set loading state to false regardless of the outcome
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true); // Set submission state to true
    try {
      await axios.post(`/rating/add/${productId}`, { rating, userId });
      fetchUserRating();
      onRatingUpdate(); // Notify parent component of the rating update
      toast.success("Rating submitted successfully");
    } catch (error) {
      toast.error("Error submitting rating");
      console.error("Error submitting rating:", error.message);
    } finally {
      setIsSubmitting(false); // Set submission state to false after submission
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Optional: Show loading indicator while checking purchase status
  }

  if (!canRate) {
    return <div>Cannot rate</div>; // Optional: Show message if user cannot rate
  }

  return (
    <div>
      <ToastContainer />
      <div className="flex align-center flex-col ">
        <div className="">
          {userRating ? (
            <span className="ml-2 text-green-600">
              You ratted: {userRating}
            </span>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting} // Disable button if no rating is selected or if submitting
              className={`ml-2 px-4 py-2 rounded focus:outline-none ${
                rating === 0 || isSubmitting
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <FaSpinner className="animate-spin mr-2" /> Submitting...
                </div>
              ) : (
                "Submit"
              )}
            </button>
          )}
        </div>
        <div className="">
          {[1, 2, 3, 4, 5].map((value) => (
            <FontAwesomeIcon
              key={value}
              icon={faStar}
              className={`h-6 w-6 cursor-pointer ${
                value <= rating ? "text-yellow-400" : "text-gray-300"
              } ${userRating ? "cursor-not-allowed" : ""}`}
              onClick={() => !userRating && handleRatingChange(value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductRating;
