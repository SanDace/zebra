import { useState } from "react";
import { UseAuthContext } from "./useauthcontext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import axios from "axios";

export const UseLogin = () => {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = UseAuthContext();
  const navigate = useNavigate();

  const login = async (email, password) => {
    setError(null);
    setIsLoading(true);
    const apiUrl = process.env.REACT_APP_API_URL; // Default for development
    console.log(apiUrl);

    try {
      const response = await axios.post(`${apiUrl}/auth/login`, {
        email,
        password,
      });

      const json = response.data;

      // localStorage.setItem("user", json);
      localStorage.setItem("user", JSON.stringify(json));
      dispatch({ type: "LOGIN", payload: json });
      setMessage("Logged in successfully!");
      toast.success("You are logged in");
      navigate("/");
    } catch (err) {
      if (err.response) {
        // Server responded with an error status code
        setError(
          err.response.data.error || `An error occurred: ${err.message}`
        );
      } else {
        // An error occurred while sending the request
        // setError("An error occurred. Please try again later.");
        setError(`An error occurred: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error, message };
};
