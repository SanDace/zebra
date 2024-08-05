import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

const Failure = () => {
  const { transaction_uuid } = useParams(); // Assuming you pass transaction_uuid in the URL params
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  useEffect(() => {
    const deletePurchasedItems = async () => {
      try {
        const result = await axios.post(
          `/esewa/delete-purchased-items/${transaction_uuid}`
        );
        console.log(result.data);
        console.log("Purchased items deleted successfully");
      } catch (error) {
        setError("Error deleting purchased items: " + error.message);
        console.error(
          "Error deleting purchased items:",
          error.response ? error.response.data : error.message
        );
      }
    };

    if (transaction_uuid) {
      deletePurchasedItems();
    }

    // Cleanup function to clear any remaining state or effects
    return () => {
      setError(null); // Reset error state
    };
  }, [transaction_uuid]);

  const handleGoToHome = () => {
    navigate("/", { replace: true }); // Replace current entry with the home page
  };

  return (
    <div>
      <h1>Payment Failed or Canceled</h1>
      {error && <p>Error: {error}</p>}

      <button onClick={handleGoToHome}>Go to Home</button>
    </div>
  );
};

export default Failure;
