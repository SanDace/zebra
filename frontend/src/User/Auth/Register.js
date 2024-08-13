import React, { useState } from "react";
import { UseSignup } from "../hooks/usesign";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa"; // Import eye and spinner icons

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const { signup, isLoading, error } = UseSignup();
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log("handleSignup triggered");
    await signup(email, password, role);
  };

  return (
    <form
      onSubmit={handleSignup}
      className="max-w-md mx-auto p-8 bg-white shadow-lg rounded mt-10"
    >
      <h3 className="text-2xl font-semibold mb-6 text-center">Register</h3>
      <input
        className="w-full px-4 py-2 mb-4 text-lg border rounded"
        id="email"
        name="email"
        type="text"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        placeholder="Email"
      />

      <div className="relative">
        <input
          className="w-full px-4 py-2 mb-4 text-lg border rounded"
          id="password"
          type={showPassword ? "text" : "password"} // Toggle password visibility
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Password"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 px-4 py-2 text-lg mb-3 text-gray-500 focus:outline-none"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      <input
        type="hidden"
        onChange={(e) => setRole(e.target.value)}
        defaultValue={"user"}
        readOnly
      />
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="w-full py-3 text-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded"
          disabled={isLoading} // Disable the button while loading
        >
          {isLoading ? (
            <span className="flex justify-center items-center ">
              Loading
              <FaSpinner className="animate-spin h-5 w-5 ml-1 text-white" />
            </span>
          ) : (
            <span className="flex justify-center items-center ">Register</span>
          )}
        </button>
      </div>
      {error && <p className="mt-4 text-red-500">{error}</p>}

      <p className="mt-2">
        Create a New Account &nbsp;
        <Link className="text-blue-600 underline text-bold" to="/login">
          Login
        </Link>
      </p>
    </form>
  );
};

export default Register;
