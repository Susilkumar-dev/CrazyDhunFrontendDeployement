



import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeadphonesAlt } from 'react-icons/fa';
import axios from 'axios'; // Import axios directly

const SignUpPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setError('');
        setLoading(true);
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/public/register`, { username, email, password });
            console.log(data.message);
            navigate('/verify-otp', { state: { email: email } });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="relative z-10 w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-8">
                <div className="mb-6 flex items-center justify-center">
                    <FaHeadphonesAlt className="text-green-400 text-3xl mr-2" />
                    <h1 className="font-extrabold text-2xl text-white">dhun</h1>
                </div>
                <h2 className="text-xl font-bold text-center text-white mb-6">Create Account</h2>
                {error && <p className="text-red-400 text-center mb-4">{error}</p>}
                <form onSubmit={handleSignUp}>
                    <div className="mb-4"><label className="block text-gray-200 mb-1">Username</label><input onChange={(e) => setUsername(e.target.value)} type="text" className="w-full p-2 text-black rounded" required /></div>
                    <div className="mb-4"><label className="block text-gray-200 mb-1">Email</label><input onChange={(e) => setEmail(e.target.value)} type="email" className="w-full p-2 text-black rounded" required /></div>
                    <div className="mb-4"><label className="block text-gray-200 mb-1">Password</label><input onChange={(e) => setPassword(e.target.value)} type="password" className="w-full p-2 text-black rounded" required /></div>
                    <div className="mb-6"><label className="block text-gray-200 mb-1">Confirm Password</label><input onChange={(e) => setConfirmPassword(e.target.value)} type="password" className="w-full p-2 text-black rounded" required /></div>
                    <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full disabled:bg-gray-500">
                        {loading ? 'Sending...' : 'Sign Up'}
                    </button>
                </form>
                <p className="text-center text-gray-300 mt-4">
                    Already have an account?{' '}
                    <Link to="/signin" className="text-green-400 hover:underline font-semibold">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;
