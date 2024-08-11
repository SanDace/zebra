import React, { useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false); // New state to track form submission
  const { token } = useParams();
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000"; // Default for development

  // Function to check password strength
  const isStrongPassword = (password) => {
    // Regular expressions to check for various criteria
    const containsLowerCase = /[a-z]/.test(password);
    const containsUpperCase = /[A-Z]/.test(password);
    const containsNumbers = /\d/.test(password);
    const containsSpecialChars = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
      password
    );

    // Check if all criteria are met
    return (
      password.length >= 8 &&
      containsLowerCase &&
      containsUpperCase &&
      containsNumbers &&
      containsSpecialChars
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (newPassword !== confirmPassword) {
        setErrorMessage("Confirm password does not match");
      } else if (!isStrongPassword(newPassword)) {
        setErrorMessage(
          "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character."
        );
      } else {
        const response = await axios.post(`${apiUrl}/auth/reset-password`, {
          newPassword,
          token,
        });
        setSuccessMessage(response.data.message);
        setFormSubmitted(true); // Set form submission state to true on success
      }
    } catch (err) {
      setErrorMessage(err.error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      {!formSubmitted ? ( // Render the form if form is not submitted
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto p-8 bg-white shadow-lg rounded mt-10"
        >
          <h3 className="text-2xl font-semibold mb-6 text-center">
            Reset Password
          </h3>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              required
              className="w-full px-4 py-2 mb-4 text-lg border rounded"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute top-1/2 transform -translate-y-1/2 right-3"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              required
              className="w-full px-4 py-2 mb-4 text-lg border rounded"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute top-1/2 transform -translate-y-1/2 right-3"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            className="w-full py-3 text-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded relative flex justify-center items-center"
            type="submit"
          >
            Reset Password
          </button>
          {errorMessage && <p className=" mt-1 text-red-500">{errorMessage}</p>}
          {successMessage && <p>{successMessage}</p>}
        </form>
      ) : null}{" "}
      {/* Render nothing if form is submitted */}
      {formSubmitted && ( // Render the success message if form is submitted
        <div className="max-w-md mx-auto p-8 bg-white shadow-lg rounded mt-10">
          <h3 className="text-2xl font-semibold mb-6 text-center">
            Password Reset Successfully
          </h3>
          <p>Your password has been reset successfully.</p>
          <Link to="/login"> Login </Link>
        </div>
      )}
    </>
  );
};

export default ResetPassword;
