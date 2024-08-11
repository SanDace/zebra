import { useState } from "react";
import { UseAuthContext } from "./useauthcontext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const UseSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = UseAuthContext();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const signup = async (email, password, role) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const json = await response.json();
      if (!response.ok) {
        setError(json.error);
        setIsLoading(false);
      }
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(json));

        dispatch({ type: "LOGIN", payload: json });
        setIsLoading(false);
        toast.success("Account Created");
        navigate("/");
      }
    } catch (error) {
      setError("An error occurred during signup.");
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};
