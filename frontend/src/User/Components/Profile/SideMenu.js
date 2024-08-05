import React, { useState, useEffect } from "react";
import { NavLink, Routes, Route } from "react-router-dom";

import { UseLogout } from "../../hooks/uselogout";
import Setting from "./Setting"; // Import the Settings component
import Profile from "./Profile";
import Orders from "./Orders";
import * as faicons from "react-icons/fa";

const SideMenu = () => {
  const { logout } = UseLogout();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const openLogoutConfirm = () => {
    setShowLogoutConfirm(true);
  };

  const closeLogoutConfirm = () => {
    setShowLogoutConfirm(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSmallScreen(true);
      } else {
        setIsSmallScreen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize(); // Initialize isSmallScreen state on component mount

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex lg:flex-row min-h-screen">
      <aside
        className={`bg-white text-black lg:w-72 lg:border-r pt-2 rounded-md shadow-md ${
          isSmallScreen ? "fixed bottom-0 left-0 right-0" : ""
        }`}
      >
        <nav
          className={`bg-white text-black lg:w-72 border-r p-2 ${
            isSmallScreen
              ? "fixed bottom-0 left-0 right-0"
              : "lg:sticky lg:top-2"
          }`}
        >
          <ul className="flex lg:flex-col flex-row w-full lg:space-y-2 space-x-4 lg:space-x-0 justify-around lg:justify-start items-center lg:items-stretch">
            <li className="mb-2 lg:mb-0">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive
                    ? "block px-4 py-2 rounded-md bg-gray-200 text-black"
                    : "block px-4 py-2 rounded-md hover:bg-gray-200"
                }
                end // Ensure this link is only active for the exact /profile route
              >
                <faicons.FaUser className="inline lg:mr-2" />
                <span className="hidden lg:inline">Profile Details</span>
              </NavLink>
            </li>
            <li className="mb-2 lg:mb-0">
              <NavLink
                to="/profile/setting"
                className={({ isActive }) =>
                  isActive
                    ? "block px-4 py-2 rounded-md bg-gray-200 text-black"
                    : "block px-4 py-2 rounded-md hover:bg-gray-200"
                }
              >
                <faicons.FaCog className="inline lg:mr-2" />
                <span className="hidden lg:inline">Settings</span>
              </NavLink>
            </li>
            <li className="mb-2 lg:mb-0">
              <NavLink
                to="/profile/orders"
                className={({ isActive }) =>
                  isActive
                    ? "block px-4 py-2 rounded-md bg-gray-200 text-black"
                    : "block px-4 py-2 rounded-md hover:bg-gray-200"
                }
              >
                <faicons.FaBoxOpen className="inline lg:mr-2" />
                <span className="hidden lg:inline">Orders</span>
              </NavLink>
            </li>
            <li className="mb-2 lg:mb-0">
              <button
                onClick={openLogoutConfirm}
                className="block w-full text-left px-4 py-2 rounded-md hover:bg-gray-200"
              >
                <faicons.FaSignOutAlt className="inline lg:mr-2" />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex-1  overflow-auto">
        <Routes>
          <Route path="/" element={<Profile />} />
          <Route path="/setting/*" element={<Setting />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <p className="mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-between">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm
              </button>
              <button
                onClick={closeLogoutConfirm}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideMenu;
