



// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaHeadphonesAlt } from 'react-icons/fa';
// import axios from 'axios'; // Import axios directly

// const SignUpPage = () => {
//     const navigate = useNavigate();
//     const [username, setUsername] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);

//     const handleSignUp = async (e) => {
//         e.preventDefault();
//         if (password !== confirmPassword) {
//             setError("Passwords do not match");
//             return;
//         }
//         setError('');
//         setLoading(true);
//         try {
//             const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/public/register`, { username, email, password });
//             console.log(data.message);
//             navigate('/verify-otp', { state: { email: email } });
//         } catch (err) {
//             setError(err.response?.data?.message || 'Registration failed.');
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-900">
//             <div className="relative z-10 w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-8">
//                 <div className="mb-6 flex items-center justify-center">
//                     <FaHeadphonesAlt className="text-green-400 text-3xl mr-2" />
//                     <h1 className="font-extrabold text-2xl text-white">dhun</h1>
//                 </div>
//                 <h2 className="text-xl font-bold text-center text-white mb-6">Create Account</h2>
//                 {error && <p className="text-red-400 text-center mb-4">{error}</p>}
//                 <form onSubmit={handleSignUp}>
//                     <div className="mb-4"><label className="block text-gray-200 mb-1">Username</label><input onChange={(e) => setUsername(e.target.value)} type="text" className="w-full p-2 text-black rounded" required /></div>
//                     <div className="mb-4"><label className="block text-gray-200 mb-1">Email</label><input onChange={(e) => setEmail(e.target.value)} type="email" className="w-full p-2 text-black rounded" required /></div>
//                     <div className="mb-4"><label className="block text-gray-200 mb-1">Password</label><input onChange={(e) => setPassword(e.target.value)} type="password" className="w-full p-2 text-black rounded" required /></div>
//                     <div className="mb-6"><label className="block text-gray-200 mb-1">Confirm Password</label><input onChange={(e) => setConfirmPassword(e.target.value)} type="password" className="w-full p-2 text-black rounded" required /></div>
//                     <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full disabled:bg-gray-500">
//                         {loading ? 'Sending...' : 'Sign Up'}
//                     </button>
//                 </form>
//                 <p className="text-center text-gray-300 mt-4">
//                     Already have an account?{' '}
//                     <Link to="/signin" className="text-green-400 hover:underline font-semibold">Sign In</Link>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default SignUpPage;






import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaHeadphonesAlt, 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaCheck,
  FaArrowLeft 
} from 'react-icons/fa';
import axios from 'axios';

const SignUpPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

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
            setShowSuccess(true);
            setTimeout(() => {
                navigate('/verify-otp', { state: { email: email } });
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="absolute rounded-full bg-purple-500 opacity-10 animate-pulse" 
                        style={{
                            width: `${100 + i * 50}px`,
                            height: `${100 + i * 50}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: `${10 + i * 2}s`
                        }} 
                    />
                ))}
            </div>

            {/* Back button */}
            <Link to="/" className="absolute top-6 left-6 text-white hover:text-purple-300 transition-colors duration-300 z-10">
                <FaArrowLeft className="text-xl" />
            </Link>

            <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 transform transition-all duration-500 hover:scale-[1.02]">
                {/* Success animation */}
                {showSuccess && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-2xl z-20 animate-fadeIn">
                        <div className="text-center p-8">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-popIn">
                                <FaCheck className="text-2xl text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Account Created!</h3>
                            <p className="text-purple-200">Redirecting to verification...</p>
                        </div>
                    </div>
                )}

                {/* Logo */}
                <div className="mb-8 flex flex-col items-center">
                    <div className="flex items-center justify-center mb-2">
                        <div className="relative">
                            <FaHeadphonesAlt className="text-green-400 text-4xl z-10 relative" />
                            <div className="absolute -inset-3 bg-green-400/20 rounded-full blur-md"></div>
                        </div>
                        <h1 className="font-extrabold text-3xl text-white ml-2">dhun</h1>
                    </div>
                    <p className="text-purple-200 text-sm">Your music, your way</p>
                </div>

                <h2 className="text-2xl font-bold text-center text-white mb-8">Create Your Account</h2>
                
                {error && (
                    <div className="mb-6 p-3 bg-red-400/10 border border-red-400/30 rounded-lg text-red-300 text-center animate-shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignUp} className="space-y-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUser className="text-gray-400" />
                        </div>
                        <input 
                            onChange={(e) => setUsername(e.target.value)} 
                            type="text" 
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300" 
                            placeholder="Username"
                            required 
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="text-gray-400" />
                        </div>
                        <input 
                            onChange={(e) => setEmail(e.target.value)} 
                            type="email" 
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300" 
                            placeholder="Email Address"
                            required 
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-gray-400" />
                        </div>
                        <input 
                            onChange={(e) => setPassword(e.target.value)} 
                            type="password" 
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300" 
                            placeholder="Password"
                            required 
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-gray-400" />
                        </div>
                        <input 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            type="password" 
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300" 
                            placeholder="Confirm Password"
                            required 
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Account...
                            </>
                        ) : 'Create Account'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-center text-gray-300">
                        Already have an account?{' '}
                        <Link to="/signin" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-300">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes popIn {
                    0% { transform: scale(0); opacity: 0; }
                    70% { transform: scale(1.1); }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                .animate-popIn {
                    animation: popIn 0.5s ease-out forwards;
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default SignUpPage;