import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

const SendEmail = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false); // New state variable for loading
  const [emailSent, setEmailSent] = useState(false); // State variable to track if email has been sent successfully

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the request starts
    setErrorMessage(""); // Clear error message
    setSuccessMessage(""); // Clear success message

    try {
      // Check if the email exists in the database and send reset email
      const response = await axios.post("/auth/send-reset-email", { email });
      setSuccessMessage(response.data.message);
      setErrorMessage("");
      setEmailSent(true); // Set emailSent to true when email is sent successfully
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if email has been sent successfully and show the success message
    if (emailSent) {
      // Clear the email field after email is sent
      setEmail("");
    }
  }, [emailSent]);

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow-lg rounded mt-10">
      {!emailSent ? (
        // Render the form if email has not been sent
        <>
          <h3 className="text-2xl font-semibold mb-6 text-center">
            Verify your Email
          </h3>
          <form onSubmit={handleSubmit}>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 mb-4 text-lg border rounded"
            />

            <button
              type="submit"
              className="w-full py-3 text-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded relative flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center" }}>
                  Sending
                  <FaSpinner className="animate-spin h-5 w-5 ml-2 text-white" />
                </span>
              ) : (
                <span>{"Send Reset Email"}</span>
              )}
            </button>
          </form>
          {errorMessage && (
            <p className="text-red-600 text-bold">{errorMessage}</p>
          )}
        </>
      ) : (
        // Render the success message if email has been sent successfully
        <>
          <h3 className="text-2xl font-semibold mb-6 text-center">
            Email Sent Successfully
          </h3>
          <p className="text-green-600 text-bold mt-1">{successMessage}</p>
        </>
      )}
      <p className="text-blue-600 underline text-bold mt-2">
        <Link to="/login">Go back to login?</Link>
      </p>
    </div>
  );
};

export default SendEmail;
