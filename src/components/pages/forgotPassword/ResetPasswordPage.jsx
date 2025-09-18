// ResetPasswordPage.jsx
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  // Get email from navigation state
  const [email, setEmail] = useState(location.state?.email || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/reset-password`,
        { email, otp, newPassword }
      );
      setMessage(data.message);
      // Redirect to sign in page after successful reset
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white p-8 rounded-xl w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded"
          >
            Reset Password
          </button>
        </form>
        
        <p className="text-center text-gray-600 mt-4">
          <Link to="/signin" className="text-green-500 hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;