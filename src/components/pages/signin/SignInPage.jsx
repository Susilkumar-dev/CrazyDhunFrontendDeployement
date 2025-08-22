import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeadphonesAlt } from "react-icons/fa";
import bgVid from "../../../assets/me.mp4"
const SignInPage = () => {
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    localStorage.setItem("user", "wertyuiopasdfghjklzxcvbnm234567");
    navigate("/dashboard");
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

        <h2 className="text-xl font-bold text-center text-white mb-6">
          Sign In
        </h2>

        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label className="block text-gray-200 mb-1" htmlFor="email">
              Email
            </label>
            <input
              className="w-full border border-gray-400 rounded py-2 px-3 bg-white/80 focus:outline-none focus:ring-2 focus:ring-green-400"
              type="email"
              id="email"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-200 mb-1" htmlFor="password">
              Password
            </label>
            <input
              className="w-full border border-gray-400 rounded py-2 px-3 bg-white/80 focus:outline-none focus:ring-2 focus:ring-green-400"
              type="password"
              id="password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition-all shadow-lg hover:shadow-green-500/40"
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
      </div>
    </div>
  );
};

export default SignInPage;
