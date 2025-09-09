import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaHeadphonesAlt } from 'react-icons/fa';
import axios from 'axios'; // Import axios directly

const VerifyOtpPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!email) {
            setError("Could not find email. Please register again.");
            return;
        }
        try {
            // Send the email and OTP to the backend for verification
            const { data } = await axios.post('http://localhost:9999/public/verify-otp', { email, otp });
            
            // On success, store the returned user object and token in localStorage
            localStorage.setItem('userInfo', JSON.stringify(data));
            
            // Navigate to the dashboard
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="relative z-10 w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-8">
                <div className="mb-6 flex items-center justify-center">
                    <FaHeadphonesAlt className="text-green-400 text-3xl mr-2" />
                    <h1 className="font-extrabold text-2xl">dhun</h1>
                </div>
                <h2 className="text-xl font-bold text-center mb-4">Verify Your Email</h2>
                <p className="text-center text-gray-300 mb-6">An OTP has been sent to {email}</p>
                {error && <p className="text-red-400 text-center mb-4">{error}</p>}
                <form onSubmit={handleVerifyOtp}>
                    <div className="mb-4">
                        <label className="block text-gray-200 mb-1" htmlFor="otp">Enter OTP</label>
                        <input
                            className="w-full border border-gray-400 rounded py-2 px-3 bg-white/80 focus:outline-none focus:ring-2 focus:ring-green-400 text-black"
                            type="text" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} required
                        />
                    </div>
                    <button type="submit" className="w-full bg-green-500 hover:bg-green-600 font-bold py-2 px-4 rounded-full">
                        Verify and Sign Up
                    </button>
                </form>
                 <p className="text-center text-gray-300 mt-4">
                    Didn't get an OTP?{' '}
                    <Link to="/signup" className="text-green-400 hover:underline font-semibold">Register again</Link>
                </p>
            </div>
        </div>
    );
};

export default VerifyOtpPage;