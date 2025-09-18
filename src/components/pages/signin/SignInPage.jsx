



// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaHeadphonesAlt } from "react-icons/fa";
// import bgVid from "../../../assets/me.mp4";
// import axios from 'axios'; // Import axios directly

// const SignInPage = () => {
//     const navigate = useNavigate();
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');

//     const handleSignIn = async (e) => {
//         e.preventDefault();
//         setError('');
//         try {
//             const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/public/login`, { email, password });
//             localStorage.setItem('userInfo', JSON.stringify(data.userDetails));
//             navigate("/dashboard");
//         } catch (err) {
//             setError(err.response?.data?.message || 'Login failed.');
//         }
//     };

//     return (
//         <div className="relative min-h-screen flex items-center justify-center">
//             <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover"><source src={bgVid} type="video/mp4" /></video>
//             <div className="absolute inset-0 bg-black/60"></div>
//             <div className="relative z-10 w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-8">
//                 <div className="mb-6 flex items-center justify-center"><FaHeadphonesAlt className="text-green-400 text-3xl mr-2" /><h1 className="font-extrabold text-2xl text-white">dhun</h1></div>
//                 <h2 className="text-xl font-bold text-center text-white mb-6">Sign In</h2>
//                 {error && <p className="text-red-400 text-center mb-4">{error}</p>}
//                 <form onSubmit={handleSignIn}>
//                     <div className="mb-4"><label className="block text-gray-200 mb-1">Email</label><input onChange={(e) => setEmail(e.target.value)} type="email" className="w-full p-2 text-black rounded" required /></div>
//                     <div className="mb-6"><label className="block text-gray-200 mb-1">Password</label><input onChange={(e) => setPassword(e.target.value)} type="password" className="w-full p-2 text-black rounded" required /></div>
//                     <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full">Sign In</button>
//                 </form>
//                 <p className="text-center text-gray-300 mt-4">
//                     Don't have an account?{" "}
//                     <Link to="/signup" className="text-green-400 hover:underline font-semibold">Sign Up</Link>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default SignInPage;


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeadphonesAlt } from "react-icons/fa";
import bgVid from "../../../assets/me.mp4";
import axios from "axios";

const SignInPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/public/login`,
        { email, password }
      );
      localStorage.setItem("userInfo", JSON.stringify(data.userDetails));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check credentials.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={bgVid} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-8">
        <div className="mb-6 flex items-center justify-center">
          <FaHeadphonesAlt className="text-green-400 text-3xl mr-2" />
          <h1 className="font-extrabold text-2xl text-white">dhun</h1>
        </div>

        <h2 className="text-xl font-bold text-center text-white mb-6">Sign In</h2>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label className="block text-gray-200 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 text-black rounded"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-200 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 text-black rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-gray-300 mt-4">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-green-400 hover:underline font-semibold"
          >
            Sign Up
          </Link>
        </p>
        
        {/* Add Forgot Password link */}
        <p className="text-center text-gray-300 mt-2">
          <Link
            to="/forgot-password"
            className="text-green-400 hover:underline font-semibold"
          >
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
