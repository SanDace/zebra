import React from "react";
import { Routes, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const location = useLocation();

  // Check if the current location is either "/login" or "/register"
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div>
      {!isAuthPage && <Navbar />}

      <Routes>{children}</Routes>
    </div>
  );
};

export default Layout;
