import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaHeadphonesAlt } from 'react-icons/fa';
import axios from 'axios';

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Verify OTP, 2: Reset Password

  const email = location.state?.email || '';

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/public/verify-reset-otp`,
        { email, otp }
      );
      
      setMessage(data.message);
      setStep(2); // Move to password reset step
    } catch (err) {
      setError(err.response?.data?.message || 'Error verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/public/reset-password`,
        { email, otp, newPassword: password }
      );
      
      setMessage(data.message);
      setTimeout(() => navigate('/signin'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-8">
        <div className="mb-6 flex items-center justify-center">
          <FaHeadphonesAlt className="text-green-400 text-3xl mr-2" />
          <h1 className="font-extrabold text-2xl text-white">dhun</h1>
        </div>

        <h2 className="text-xl font-bold text-center text-white mb-6">
          {step === 1 ? 'Verify OTP' : 'Set New Password'}
        </h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {message && (
          <div className="bg-green-500/20 border border-green-500 text-green-300 p-3 rounded mb-4">
            {message}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-4">
              <label className="block text-gray-200 mb-2">Email</label>
              <input
                type="email"
                value={email}
                className="w-full p-3 bg-gray-700 text-white rounded opacity-70"
                disabled
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-200 mb-2">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter 6-digit OTP"
                required
                maxLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded disabled:bg-gray-600"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label className="block text-gray-200 mb-2">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter new password"
                required
                minLength={6}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-200 mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Confirm new password"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded disabled:bg-gray-600"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <Link 
            to="/signin" 
            className="text-green-400 hover:underline font-semibold"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;