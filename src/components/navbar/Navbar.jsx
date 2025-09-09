// import React from "react";
// import { Link } from "react-router-dom";
// import { FaHeadphonesAlt } from "react-icons/fa";

// const Navbar = () => {
//   return (
//     <header className="fixed top-0 left-0 right-0 z-20 bg-gradient-to-r from-gray-900 via-green-900 to-black backdrop-blur-lg shadow-md">
//       <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
//         <Link to="/" className="flex items-center">
//           <FaHeadphonesAlt className="text-green-400 text-2xl mr-2" />
//           <span className="font-extrabold text-xl text-white tracking-wide">
//             dhun
//           </span>
//         </Link>

//         <div>
//           <Link
//             to="/signup"
//             className="font-medium text-gray-300 hover:text-green-400 transition-colors duration-200 mr-6"
//           >
//             Sign Up
//           </Link>
//           <Link
//             to="/signin"
//             className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-5 rounded-full transition-all duration-300 shadow-md hover:shadow-green-500/40"
//           >
//             Sign In
//           </Link>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;


// components/navbar/Navbar.js (updated with theme toggle)
import React from "react";
import { Link } from "react-router-dom";
import { FaHeadphonesAlt } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-20 backdrop-blur-lg shadow-md transition-colors duration-300 ${
      isDarkMode 
        ? "bg-gradient-to-r from-gray-900 via-green-900 to-black" 
        : "bg-gradient-to-r from-blue-100 via-green-100 to-purple-100"
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <FaHeadphonesAlt className={`text-2xl mr-2 ${
            isDarkMode ? "text-green-400" : "text-green-600"
          }`} />
          <span className={`font-extrabold text-xl tracking-wide ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}>
            dhun
          </span>
        </Link>

        <div className="flex items-center">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full mr-4 ${
              isDarkMode 
                ? "bg-gray-800 text-yellow-300 hover:bg-gray-700" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } transition-colors duration-200`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
          
          <Link
            to="/signup"
            className={`font-medium transition-colors duration-200 mr-6 ${
              isDarkMode 
                ? "text-gray-300 hover:text-green-400" 
                : "text-gray-700 hover:text-green-600"
            }`}
          >
            Sign Up
          </Link>
          <Link
            to="/signin"
            className={`font-semibold py-2 px-5 rounded-full transition-all duration-300 shadow-md ${
              isDarkMode 
                ? "bg-green-500 hover:bg-green-600 text-white hover:shadow-green-500/40" 
                : "bg-green-600 hover:bg-green-700 text-white hover:shadow-green-600/40"
            }`}
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;