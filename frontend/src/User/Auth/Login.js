import { useState } from "react";
import { UseLogin } from "../hooks/uselogin";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, error, isLoading, message } = UseLogin();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-md mx-auto p-8 bg-white shadow-lg rounded mt-10"
    >
      <h3 className="text-2xl font-semibold mb-6 text-center">Login</h3>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        // required
        className="w-full px-4 py-2 mb-4 text-lg border rounded hover:border-l-[5px] focus:outline-none focus:border-slate-500"
        placeholder="Email"
      />
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
          className="w-full pl-4 pr-10 py-2 mb-4 text-lg border rounded hover:border-l-[5px] focus:outline-none focus:border-slate-500"
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
      <button
        type="submit"
        className="w-full py-3 text-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex justify-center items-center">
            Login
            <FaSpinner className="animate-spin h-5 w-5 ml-1 text-white" />
          </span>
        ) : (
          "Login"
        )}
      </button>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {message && <p className="mt-4 text-green-500">{message}</p>}
      <p className="mt-2">
        Create a New Account&nbsp;
        <Link className="text-blue-600 underline font-bold" to="/register">
          Register
        </Link>
      </p>
      <p className="text-blue-600 underline hover:text-blue-700 font-semibold mt-2">
        <Link to="/forget-password">Forget Password</Link>
      </p>
    </form>
  );
};

export default Login;
