import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { FaHome, FaCompass, FaMusic, FaSignOutAlt, FaSearch, FaHeadphonesAlt, FaBars, FaTimes, FaGuitar } from 'react-icons/fa';

const DashBoard = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleSignOut = () => {
        localStorage.removeItem('user')
        navigate('/signin')
    }

    
    const linkClasses = "flex items-center p-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200";
    const activeLinkClasses = "bg-green-600 text-white font-semibold";

    const sidebarContent = (
        <div className="flex flex-col h-full">
            <div className="relative w-full max-w-md mb-6">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-gray-900 border border-gray-700 rounded-full py-2 px-4 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>

           
            <nav className="flex flex-col space-y-2">
                <NavLink to="/dashboard" end className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                    <FaHome className="mr-4" />
                    <span>Home</span>
                </NavLink>
                <NavLink to="/dashboard/explore" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                    <FaCompass className="mr-4" />
                    <span>Explore</span>
                </NavLink>
                <NavLink to="/dashboard/playlist" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                    <FaMusic className="mr-4" />
                    <span>Playlist</span>
                </NavLink>
                
            </nav>

           
            <button onClick={handleSignOut} className="mt-auto flex items-center p-3 text-red-400 hover:bg-gray-700 hover:text-red-300 rounded-lg transition-colors duration-200">
                <FaSignOutAlt className="mr-4"/>
                <span>Sign Out</span>
            </button>
        </div>
    );

    return (
        <>
           
            <header className="md:hidden bg-gray-800 p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-40 border-b border-gray-700">
                <Link to="/dashboard" className="flex items-center text-white">
                    <FaHeadphonesAlt className="text-green-500 text-2xl mr-2" />
                    <span className="font-bold text-lg">MightyMusic</span>
                </Link>
                <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2">
                    {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </header>

            
            <div className={`md:hidden fixed top-0 left-0 h-full w-64 bg-gray-800 p-4 border-r border-gray-700 z-30 flex flex-col transition-transform duration-300 ease-in-out transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{paddingTop: '5rem'}}>
                {sidebarContent}
            </div>

            <div className="hidden md:flex w-64 bg-gray-800 h-screen fixed top-0 left-0 p-4 border-r border-gray-700 flex-col">
                 <h1 className="font-bold text-2xl px-3 mb-6 text-white flex items-center">
                    <FaHeadphonesAlt className="text-green-500 mr-3"/> dhun
                 </h1>
                {sidebarContent}
            </div>
        </>
    );
}

export default DashBoard