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
    <footer className="bg-gray-800 text-white py-6 mt-24">
      <div className="container mx-auto max-w-[95%] sm:max-w-[90%] lg:max-w-[80%] px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          {/* Quick Links */}
          <div>
            <h5 className="font-bold text-lg mb-3">Quick Links</h5>
            <ul>
              <li className="mb-2">
                <Link to="/" className="hover:text-gray-300 transition">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="hover:text-gray-300 transition">
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="hover:text-gray-300 transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h5 className="font-bold text-lg mb-3">Contact Us</h5>
            <p className="flex items-center justify-center md:justify-start">
              <FaEnvelope className="mr-2" /> info@example.com
            </p>
            <p className="flex items-center justify-center md:justify-start mt-2">
              <FaPhone className="mr-2" /> +123 456 7890
            </p>
          </div>

          {/* Social Media Links */}
          <div>
            <h5 className="font-bold text-lg mb-3">Follow Us</h5>
            <div className="flex justify-center md:justify-start space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-500 transition"
              >
                <FaFacebook size="1.5em" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400 transition"
              >
                <FaTwitter size="1.5em" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-pink-500 transition"
              >
                <FaInstagram size="1.5em" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center border-t border-gray-700 mt-6 pt-4">
          <p>&copy; {new Date().getFullYear()} Zebra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
