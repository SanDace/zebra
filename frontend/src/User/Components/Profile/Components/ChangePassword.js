import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { UseAuthContext } from "../../../hooks/useauthcontext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    newPasswordStrength: "", // State to handle password strength message
    server: "",
  });
  const apiUrl = process.env.REACT_APP_API_URL; // Default for development

  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user } = UseAuthContext();

  // Function to check password strength
  const checkPasswordStrength = (password) => {
    // Regular expressions for password strength criteria
    const regex = {
      length: /.{8,}/,
      lowercase: /[a-z]/,
      uppercase: /[A-Z]/,
      digit: /\d/,
      special: /[!@#$%^&*(),.?":{}|<>]/,
    };

    // Check each criteria and return appropriate message
    if (!regex.length.test(password)) {
      return "Password should be at least 8 characters long";
    }
    if (!regex.lowercase.test(password)) {
      return "Password should contain at least one lowercase letter";
    }
    if (!regex.uppercase.test(password)) {
      return "Password should contain at least one uppercase letter";
    }
    if (!regex.digit.test(password)) {
      return "Password should contain at least one number";
    }
    if (!regex.special.test(password)) {
      return "Password should contain at least one special character";
    }

    return ""; // Return empty string if all criteria are met
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    let validationErrors = {};
    if (!currentPassword) {
      validationErrors.currentPassword = "Current Password is required";
    }
    if (!newPassword) {
      validationErrors.newPassword = "New Password is required";
    } else {
      const strengthMessage = checkPasswordStrength(newPassword);
      if (strengthMessage) {
        validationErrors.newPassword = strengthMessage;
      }
    }
    if (newPassword !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(validationErrors).length > 0) {
      setMessage(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${apiUrl}/profile/changePassword`,
        { currentPassword, newPassword },
        {
          // Assuming user.token is properly set in context or props
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage({
        ...message,
        server: error.response?.data?.message || "Error changing password",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e, field) => {
    setMessage({
      ...message,
      [field]: "",
      newPasswordStrength:
        field === "newPassword" ? checkPasswordStrength(e.target.value) : "",
    });

    switch (field) {
      case "currentPassword":
        setCurrentPassword(e.target.value);
        break;
      case "newPassword":
        setNewPassword(e.target.value);
        break;
      case "confirmPassword":
        setConfirmPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-4 p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold text-center text-indigo-700">
        Change Password
      </h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => handleInputChange(e, "currentPassword")}
              onFocus={() => setMessage({ ...message, currentPassword: "" })}
              className={`mt-2 block w-full px-3 py-2 border ${
                message.currentPassword ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
            <span
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            >
              {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {message.currentPassword && (
            <p className="text-sm text-red-500">{message.currentPassword}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => handleInputChange(e, "newPassword")}
              onFocus={() =>
                setMessage({
                  ...message,
                  newPassword: "",
                  newPasswordStrength: "",
                })
              }
              className={`mt-2 block w-full px-3 py-2 border ${
                message.newPassword ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
            <span
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {message.newPassword && (
            <p className="text-sm text-red-500">{message.newPassword}</p>
          )}
          {message.newPasswordStrength && (
            <p className="text-sm text-red-500">
              {message.newPasswordStrength}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => handleInputChange(e, "confirmPassword")}
              onFocus={() => setMessage({ ...message, confirmPassword: "" })}
              className={`mt-2 block w-full px-3 py-2 border ${
                message.confirmPassword ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {message.confirmPassword && (
            <p className="text-sm text-red-500">{message.confirmPassword}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {loading ? "Changing..." : "Change Password"}
        </button>
        {message.server && (
          <div className="mt-4 text-red-600">{message.server}</div>
        )}
      </form>
    </div>
  );
};

export default ChangePassword;
