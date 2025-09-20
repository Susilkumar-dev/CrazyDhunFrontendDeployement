import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeadphonesAlt } from 'react-icons/fa';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/public/forgot-password`,
        { email }
      );
      
      setMessage(data.message);
      // Navigate to reset password page with email
      navigate('/reset-password', { state: { email: data.email || email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending reset OTP');
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

        <h2 className="text-xl font-bold text-center text-white mb-6">Reset Password</h2>
        
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

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-200 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your email"
              required
            />
            <p className="text-gray-400 text-sm mt-2">
              Enter your email address and we'll send you a password reset OTP.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded disabled:bg-gray-600"
          >
            {loading ? 'Sending...' : 'Send Reset OTP'}
          </button>
        </form>

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

export default ForgotPasswordPage;