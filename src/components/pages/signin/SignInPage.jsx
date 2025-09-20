


// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaHeadphonesAlt } from "react-icons/fa";
// import bgVid from "../../../assets/me.mp4";
// import axios from "axios";

// const SignInPage = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleSignIn = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const { data } = await axios.post(
//         `${import.meta.env.VITE_API_URL}/public/login`,
//         { email, password }
//       );
//       localStorage.setItem("userInfo", JSON.stringify(data.userDetails));
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed. Check credentials.");
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center">
//       <video
//         autoPlay
//         loop
//         muted
//         playsInline
//         className="absolute inset-0 w-full h-full object-cover"
//       >
//         <source src={bgVid} type="video/mp4" />
//       </video>
//       <div className="absolute inset-0 bg-black/60"></div>

//       <div className="relative z-10 w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-8">
//         <div className="mb-6 flex items-center justify-center">
//           <FaHeadphonesAlt className="text-green-400 text-3xl mr-2" />
//           <h1 className="font-extrabold text-2xl text-white">dhun</h1>
//         </div>

//         <h2 className="text-xl font-bold text-center text-white mb-6">Sign In</h2>

//         {error && <p className="text-red-400 text-center mb-4">{error}</p>}

//         <form onSubmit={handleSignIn}>
//           <div className="mb-4">
//             <label className="block text-gray-200 mb-1">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full p-2 text-black rounded"
//               required
//             />
//           </div>

//           <div className="mb-6">
//             <label className="block text-gray-200 mb-1">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full p-2 text-black rounded"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full"
//           >
//             Sign In
//           </button>
//         </form>

//         <p className="text-center text-gray-300 mt-4">
//           Don't have an account?{" "}
//           <Link
//             to="/signup"
//             className="text-green-400 hover:underline font-semibold"
//           >
//             Sign Up
//           </Link>
//         </p>
        
//         {/* Add Forgot Password link */}
//         <p className="text-center text-gray-300 mt-2">
//           <Link
//             to="/forgot-password"
//             className="text-green-400 hover:underline font-semibold"
//           >
//             Forgot Password?
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SignInPage;






import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeadphonesAlt, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import bgVid from "../../../assets/me.mp4";
import axios from "axios";

const SignInPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/public/login`,
        { email, password }
      );
      localStorage.setItem("userInfo", JSON.stringify(data.userDetails));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={bgVid} type="video/mp4" />
      </video>
      
      {/* Enhanced overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-purple-900/30 to-black/70"></div>
      
      {/* Floating particles animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 2}px`,
              height: `${Math.random() * 10 + 2}px`,
              backgroundColor: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#4ADE80' : '#60A5FA',
              opacity: 0.6,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md mx-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 transform transition-all duration-500 hover:scale-[1.02]">
        {/* Logo with enhanced styling */}
        <div className="mb-8 flex flex-col items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-400 rounded-full opacity-70 blur-md"></div>
            <FaHeadphonesAlt className="relative text-green-400 text-4xl mr-2 z-10" />
          </div>
          <h1 className="font-extrabold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400 mt-2">
            dhun
          </h1>
        </div>

        <h2 className="text-2xl font-bold text-center text-white mb-8 relative">
          Sign In
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mt-2"></div>
        </h2>

        {error && (
          <div className="mb-6 p-3 bg-red-400/10 border border-red-400/30 rounded-lg text-red-200 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-6">
          <div className="relative">
            <label className="block text-gray-200 mb-2 ml-1">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent transition-all duration-300"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-gray-200 mb-2 ml-1">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent transition-all duration-300"
                placeholder="Enter your password"
                required
              />
              <button 
                type="button" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <label className="flex items-center text-gray-300 text-sm">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-green-400 bg-black/30 border-white/10 rounded focus:ring-green-400" />
              <span className="ml-2">Remember me</span>
            </label>
            
            <Link
              to="/forgot-password"
              className="text-sm text-green-400 hover:text-green-300 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all duration-500 shadow-lg ${
              isLoading 
                ? "bg-gray-600 cursor-not-allowed" 
                : "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 hover:shadow-green-500/30"
            } flex items-center justify-center`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-white/10 w-full"></div>
          <span className="bg-white/5 text-gray-400 text-sm px-2 rounded-lg">or</span>
          <div className="border-t border-white/10 w-full"></div>
        </div>

        <p className="text-center text-gray-300">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-green-400 hover:text-green-300 font-semibold transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </div>

      {/* Add CSS for floating animation */}
      <style>
        {`
          @keyframes float {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 0.6;
            }
            50% {
              transform: translateY(-20px) rotate(10deg);
              opacity: 0.8;
            }
            100% {
              transform: translateY(0) rotate(0deg);
              opacity: 0.6;
            }
          }
          .animate-float {
            animation: float 10s infinite ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default SignInPage;