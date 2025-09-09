



// components/dashboard/DashBoard.js (updated with responsive design and theme)
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { 
    FaHome, FaCompass, FaMusic, FaSignOutAlt, FaSearch, 
    FaHeadphonesAlt, FaBars, FaTimes, FaUserAlt, FaBook,
    FaPlus, FaCheck, FaUpload, FaLink, FaSun, FaMoon 
} from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';

const DashBoard = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const { isDarkMode, toggleTheme } = useTheme();

    useEffect(() => {
        const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (storedUserInfo) {
            setUserInfo(storedUserInfo);
        }
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('userInfo');
        navigate('/signin');
    };
    
    const linkClasses = (isActive) => {
        const baseClasses = "flex items-center p-3 rounded-lg transition-colors duration-200";
        const activeClasses = isDarkMode 
            ? "bg-green-600 text-white font-semibold" 
            : "bg-green-500 text-white font-semibold";
        const inactiveClasses = isDarkMode 
            ? "text-gray-300 hover:bg-gray-700 hover:text-white" 
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900";
        
        return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
    };

    const sidebarContent = (
        <div className="flex flex-col h-full md:pb-24">
            <nav className="flex flex-col space-y-2">
                {/* Theme Toggle */}
                <button 
                    onClick={toggleTheme}
                    className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                        isDarkMode 
                            ? "text-gray-300 hover:bg-gray-700 hover:text-white" 
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                    {isDarkMode ? (
                        <>
                            <FaSun className="mr-4" />
                            <span>Light Mode</span>
                        </>
                    ) : (
                        <>
                            <FaMoon className="mr-4" />
                            <span>Dark Mode</span>
                        </>
                    )}
                </button>

                {/* Standard User Links */}
                <NavLink to="/dashboard" end className={({ isActive }) => linkClasses(isActive)}>
                    <FaHome className="mr-4" /><span>Home</span>
                </NavLink>
                <NavLink to="/dashboard/explore" className={({ isActive }) => linkClasses(isActive)}>
                    <FaCompass className="mr-4" /><span>Explore</span>
                </NavLink>
                <NavLink to="/dashboard/playlist" className={({ isActive }) => linkClasses(isActive)}>
                    <FaMusic className="mr-4" /><span>Playlist</span>
                </NavLink>
                <NavLink to="/dashboard/library" className={({ isActive }) => linkClasses(isActive)}>
                    <FaBook className="mr-4" /><span>Library</span>
                </NavLink>
                <NavLink to="/dashboard/account" className={({ isActive }) => linkClasses(isActive)}>
                    <FaUserAlt className="mr-4" /><span>Account</span>
                </NavLink>

                <hr className={isDarkMode ? "border-gray-700 my-2" : "border-gray-300 my-2"} />

                {/* Role-Specific Links */}
                {userInfo && userInfo.role === 'admin' ? (
                    // ADMIN VIEW
                    <>
                        <NavLink to="/dashboard/upload-song" className={({ isActive }) => linkClasses(isActive)}>
                            <FaUpload className="mr-4" />
                            <span>Upload Song (File)</span>
                        </NavLink>
                        <NavLink to="/dashboard/add-song-url" className={({ isActive }) => linkClasses(isActive)}>
                            <FaLink className="mr-4" />
                            <span>Add Song (URL)</span>
                        </NavLink>
                        <NavLink to="/dashboard/approvals" className={({ isActive }) => linkClasses(isActive)}>
                            <FaCheck className="mr-4" />
                            <span>Approvals</span>
                        </NavLink>
                    </>
                ) : (
                    // REGULAR USER VIEW
                    <NavLink to="/dashboard/add-song" className={({ isActive }) => linkClasses(isActive)}>
                        <FaPlus className="mr-4" />
                        <span>Request Song</span>
                    </NavLink>
                )}
            </nav>

            <button 
                onClick={handleSignOut} 
                className={`mt-auto flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    isDarkMode 
                        ? "text-red-400 hover:bg-gray-700 hover:text-red-300" 
                        : "text-red-600 hover:bg-gray-100 hover:text-red-700"
                }`}
            >
                <FaSignOutAlt className="mr-4"/>
                <span>Sign Out</span>
            </button>
        </div>
    );

    return (
        <>
            <header className={`md:hidden p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-40 border-b ${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}>
                <Link to="/dashboard" className={`flex items-center ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    <FaHeadphonesAlt className={`text-2xl mr-2 ${isDarkMode ? "text-green-500" : "text-green-600"}`} />
                    <span className="font-bold text-lg">dhun</span>
                </Link>
                <button 
                    onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} 
                    className={isDarkMode ? "text-white p-2" : "text-gray-900 p-2"}
                >
                    {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </header>

            <div className={`md:hidden fixed top-0 left-0 h-full w-64 p-4 flex flex-col transition-transform duration-300 ease-in-out transform ${
                isDarkMode ? "bg-gray-800 border-r border-gray-700" : "bg-white border-r border-gray-200"
            } ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{paddingTop: '5rem'}}>
                {sidebarContent}
            </div>

            <div className={`hidden md:flex w-64 h-screen fixed top-0 left-0 p-4 flex-col ${
                isDarkMode ? "bg-gray-800 border-r border-gray-700" : "bg-white border-r border-gray-200"
            }`}>
                <h1 className={`font-bold text-2xl px-3 mb-6 flex items-center ${
                    isDarkMode ? "text-white" : "text-gray-900"
                }`}>
                    <FaHeadphonesAlt className={`mr-3 ${isDarkMode ? "text-green-500" : "text-green-600"}`} /> dhun
                </h1>
                {sidebarContent}
            </div>
        </>
    );
}

export default DashBoard;