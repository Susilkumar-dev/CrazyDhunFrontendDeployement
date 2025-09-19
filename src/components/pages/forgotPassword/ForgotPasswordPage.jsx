import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiArrowLeft, FiMusic } from "react-icons/fi";
import axios from "axios";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      console.log("Sending request to:", `${import.meta.env.VITE_API_URL}/user/forgot-password`);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/forgot-password`,
        { email }
      );
      
      setMessage(data.message);
      
      // Store email in localStorage for the reset password page
      localStorage.setItem('resetEmail', email);
      
      // Navigate to reset password page
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      console.error("Password reset error:", err);
      if (err.response?.status === 404) {
        setError("Password reset service is currently unavailable. Please try again later.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to send OTP. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="absolute top-6 left-6">
        <Link
          to="/signin"
          className="flex items-center text-white/80 hover:text-white transition-colors"
        >
          <FiArrowLeft className="mr-2" /> Back to Sign In
        </Link>
      </div>
      
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-black/20 py-6 flex justify-center items-center">
          <div className="flex items-center">
            <FiMusic className="text-green-400 text-3xl mr-2" />
            <h1 className="font-bold text-2xl text-white">dhun</h1>
          </div>
        </div>
        
        <div className="px-8 py-8">
          <h2 className="text-2xl font-bold text-center text-white mb-2">Reset Your Password</h2>
          <p className="text-center text-white/70 mb-8">
            Enter your email and we'll send you a verification code
          </p>

          {message && (
            <div className="mb-6 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-center">
              {message}
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-teal-400 hover:from-green-600 hover:to-teal-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                "Send Verification Code"
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-white/60">
              Remember your password?{" "}
              <Link
                to="/signin"
                className="text-green-400 hover:text-green-300 font-semibold transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
        
        <div className="bg-black/20 py-4 px-8 text-center">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Dhun Music. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;