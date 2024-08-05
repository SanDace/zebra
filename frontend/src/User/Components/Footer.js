import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-700 text-white py-6 mt-24">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h5 className="font-bold text-lg mb-2">Quick Links</h5>
          <ul>
            <li className="mb-1">
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li className="mb-1">
              <Link to="/about" className="hover:underline">
                About Us
              </Link>
            </li>
            <li className="mb-1">
              <Link to="/contact" className="hover:underline">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
        <div className="mb-4 md:mb-0">
          <h5 className="font-bold text-lg mb-2">Contact Us</h5>
          <p>
            <FaEnvelope className="inline mr-2" />
            info@example.com
          </p>
          <p>
            <FaPhone className="inline mr-2" />
            +123 456 7890
          </p>
        </div>
        <div className="mb-4 md:mb-0">
          <h5 className="font-bold text-lg mb-2">Follow Us</h5>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500"
            >
              <FaFacebook size="1.5em" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400"
            >
              <FaTwitter size="1.5em" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500"
            >
              <FaInstagram size="1.5em" />
            </a>
          </div>
        </div>
      </div>
      <div className="text-center mt-6">
        <p>
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
