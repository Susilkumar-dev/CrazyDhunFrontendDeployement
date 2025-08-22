import React from "react";
import { Link } from "react-router-dom";
import { FaHeadphonesAlt } from "react-icons/fa";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-gradient-to-r from-gray-900 via-green-900 to-black backdrop-blur-lg shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <FaHeadphonesAlt className="text-green-400 text-2xl mr-2" />
          <span className="font-extrabold text-xl text-white tracking-wide">
            dhun
          </span>
        </Link>

        <div>
          <Link
            to="/signup"
            className="font-medium text-gray-300 hover:text-green-400 transition-colors duration-200 mr-6"
          >
            Sign Up
          </Link>
          <Link
            to="/signin"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-5 rounded-full transition-all duration-300 shadow-md hover:shadow-green-500/40"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
