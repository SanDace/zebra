import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { UseLogout } from "../hooks/uselogout";
import { UseAuthContext } from "../hooks/useauthcontext";
import { FaBars, FaTimes, FaUserCircle, FaCartPlus } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";
import { FaBoxOpen } from "react-icons/fa";
import { BiSolidHome } from "react-icons/bi";
import { CartContext } from "../context/CartContext";
import navbarPaths from "./Navbarpaths";
import SearchBar from "./SearchBar";
import Fuse from "fuse.js";
import axios from "axios";
import { FiLogOut } from "react-icons/fi";

import { Tooltip as ReactTooltip } from "react-tooltip";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = UseAuthContext();
  const { logout } = UseLogout();
  const { cartCount } = useContext(CartContext);
  const location = useLocation();
  const [searchData, setSearchData] = useState([]);
  const [query, setQuery] = useState("");
  const shouldHideNavbar = navbarPaths.includes(location.pathname);
  const dropdownRef = useRef(null);
  const apiUrl = process.env.REACT_APP_API_URL; // Default for development

  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/products`);
        const searchData = await response.data;
        setSearchData(searchData);
      } catch (error) {
        console.error("Error fetching search data:", error);
      }
    };

    fetchSearchData();
  }, []);

  const fuseOptions = {
    keys: ["title", "description"],
    threshold: 1,
  };

  const fuse = new Fuse(searchData, fuseOptions);

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const closeNavbar = () => {
    setIsOpen(false);
  };

  const openLogoutConfirm = () => {
    setShowLogoutConfirm(true);
  };

  const closeLogoutConfirm = () => {
    setShowLogoutConfirm(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  const clearSearchQuery = () => {
    setQuery("");
  };

  useEffect(() => {
    if (location.pathname === "/") {
      clearSearchQuery();
    }
    closeNavbar();
    closeDropdown();
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div>
      <nav className="bg-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-[345px]">
          <div className="flex items-center justify-between h-16 flex-wrap">
            <div className="flex items-center">
              <Link to="/" className="text-white font-bold text-xl">
                Zebra
              </Link>
            </div>
            {/* Search bar for large screens */}
            <div className=" w-1/4 esm:w-1/2  esm:flex-grow-0  flex-grow ml-1  ">
              <SearchBar
                fuse={fuse}
                query={query}
                setQuery={setQuery}
                clearQuery={clearSearchQuery}
              />
            </div>

            <div className="hidden lg:flex lg:items-center lg:space-x-4">
              <Link
                to="/"
                className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                data-tooltip-id={"home"}
                data-tooltip-content="Home"
              >
                <BiSolidHome className="text-xl" />
                <ReactTooltip
                  place={"bottom-end"}
                  id={"home"}
                  className="z-10  "
                />
              </Link>
              {user && (
                <>
                  <Link
                    to="/cart"
                    className="relative text-white block hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                    data-tooltip-id={"cart"}
                    data-tooltip-content="Cart"
                  >
                    <FaCartPlus className="text-xl" />
                    {cartCount > 0 && (
                      <span className="absolute top-0 right-0 inline-block w-4 h-4 bg-red-500 text-white text-xs font-bold text-center rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <ReactTooltip
                    place={"bottom-end"}
                    id={"cart"}
                    className="z-10 text-sm  "
                  />

                  <Link
                    to="/profile/orders"
                    className="relative text-white block hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                    data-tooltip-id={"order"}
                    data-tooltip-content="Order"
                  >
                    <FaBoxOpen className="text-xl" />
                  </Link>
                  <ReactTooltip
                    place={"bottom-end"}
                    id={"order"}
                    className="z-10 text-sm  "
                  />
                </>
              )}
              {!user ? (
                <Link
                  to="/login"
                  className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                  Login
                </Link>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                    onClick={toggleDropdown}
                    data-tooltip-id={"profile"}
                    data-tooltip-content="Profile"
                  >
                    <FaUserCircle className="h-6 w-6" />
                    <ReactTooltip
                      place={"bottom-end"}
                      id={"profile"}
                      className="z-10 text-sm  "
                    />
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                        onClick={closeDropdown}
                      >
                        Profile
                      </Link>
                      <button
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                        onClick={openLogoutConfirm}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Search bar and menu button for small screens */}
            <div className="flex lg:hidden  items-center">
              <button
                onClick={toggleNavbar}
                className="text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white ml-4"
              >
                {isOpen ? (
                  <FaTimes className="h-6 w-6" />
                ) : (
                  <FaBars className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className={`${isOpen ? "block" : "hidden"} lg:hidden bg-gray-800`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="text-white block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </Link>
            <Link
              to="/profile"
              className="text-white block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
            >
              Profile
            </Link>
            <Link
              to="/login"
              className="text-white block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
            >
              Login
            </Link>
            <Link
              to="/movie"
              className="text-white block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
            >
              Movie
            </Link>
            <Link
              to="/welcome"
              className="text-white block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
            >
              Welcome
            </Link>
            {user && (
              <>
                <Link
                  to="/cart"
                  className="relative text-white flex items-center hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
                >
                  <span className="inline-flex items-center">
                    My Cart
                    <FaCartPlus className="ml-2" />
                  </span>
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 inline-block w-4 h-4 bg-red-500 text-white text-xs font-bold text-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <button
                  className="relative text-white flex items-center hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
                  onClick={openLogoutConfirm}
                >
                  <span className="inline-flex items-center">
                    Logout
                    <FiLogOut className="ml-2" />
                  </span>
                </button>
              </>
            )}
            {user && user.user.role === "admin" && (
              <Link
                to="/admin"
                className="relative text-white flex items-center hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
              >
                <span className="inline-flex items-center">
                  Admin Panel
                  <RiAdminLine className="ml-2" />
                </span>
              </Link>
            )}
            {/* Search bar inside mobile menu */}
            {/*     <SearchBar
              fuse={fuse}
              query={query}
              setQuery={setQuery}
              clearQuery={clearSearchQuery}
              className="lg:hidden w-full sm:w-64"
            /> */}
          </div>
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
      </nav>
    </div>
  );
};

export default Navbar;
