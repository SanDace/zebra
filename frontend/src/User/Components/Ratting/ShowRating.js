import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const ShowRating = ({ productId, ratingsUpdated }) => {
  const [averageRating, setAverageRating] = useState(0);
  const [ratingsCount, setRatingsCount] = useState(0);

  useEffect(() => {
    fetchAverageRating();
  }, [productId, ratingsUpdated]);

  const fetchAverageRating = async () => {
    try {
      const response = await axios.get(`/rating/${productId}`);
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
    <div className="relative">
      <div className="flex items-center">
        <span className="mr-2"></span>
        {[1, 2, 3, 4, 5].map((value) => (
          <FontAwesomeIcon
            key={value}
            icon={faStar}
            className={`h-5 w-4 ${
              value <= averageRating ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-xs font-[500]">
          ({averageRating.toFixed(1)}/5)
        </span>
        &nbsp;
        <span className=" text-xs font-[500]">{ratingsCount} </span>
      </div>
    </div>
  );
};

export default ShowRating;
