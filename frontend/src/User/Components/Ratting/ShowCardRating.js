import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const ShowCardRating = ({ productId, ratingsUpdated }) => {
  const [averageRating, setAverageRating] = useState(0);
  const [ratingsCount, setRatingsCount] = useState(0);
  const apiUrl = process.env.REACT_APP_API_URL  // Default for development

  useEffect(() => {
    fetchAverageRating();
  }, [productId, ratingsUpdated]);

  const fetchAverageRating = async () => {
    try {
      const response = await axios.get(`${apiUrl}/rating/${productId}`);
      const ratings = response.data.ratings;

      if (ratings.length > 0) {
        const totalRating = ratings.reduce((acc, curr) => acc + curr.rating, 0);
        const average = totalRating / ratings.length;
        setAverageRating(average);
        setRatingsCount(ratings.length);
      }
    } catch (error) {
      console.error("Error fetching average rating:", error);
    }
  };

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <FontAwesomeIcon
          key={index}
          icon={faStar}
          className={`h-5 w-4 ${
            index < Math.floor(averageRating)
              ? "text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-2 text-xs font-semibold">
        ({averageRating.toFixed(1)}/5)&nbsp;
      </span>
      <span className="text-xs font-semibold">{ratingsCount}</span>
    </div>
  );
};

export default ShowCardRating;
