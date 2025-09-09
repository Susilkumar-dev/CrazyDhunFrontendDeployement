




// components/dashboard/MobileFooter.js (updated with theme)
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaCompass, FaBook, FaSearch, FaUser } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';

const MobileFooter = () => {
    const { isDarkMode } = useTheme();
    
    const linkClasses = (isActive) => {
        const baseClasses = "flex flex-col items-center justify-center w-full transition-colors";
        const activeClasses = isDarkMode 
            ? "text-green-500" 
            : "text-green-600";
        const inactiveClasses = isDarkMode 
            ? "text-gray-400 hover:text-white" 
            : "text-gray-500 hover:text-gray-900";
        
        return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
    };

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-sm border-t z-40 transition-colors duration-300" style={{
            backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            borderColor: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(209, 213, 219, 0.5)'
        }}>
            <div className="flex justify-around items-center h-16">
                <NavLink to="/dashboard" end className={({ isActive }) => linkClasses(isActive)}>
                    <FaHome size={22} />
                    <span className="text-xs mt-1">Home</span>
                </NavLink>
                <NavLink to="/dashboard/explore" className={({ isActive }) => linkClasses(isActive)}>
                    <FaCompass size={22} />
                    <span className="text-xs mt-1">Explore</span>
                </NavLink>
                <NavLink to="/dashboard/search" className={({ isActive }) => linkClasses(isActive)}>
                    <FaSearch size={22} />
                    <span className="text-xs mt-1">Search</span>
                </NavLink>
                <NavLink to="/dashboard/library" className={({ isActive }) => linkClasses(isActive)}>
                    <FaBook size={22} />
                    <span className="text-xs mt-1">Library</span>
                </NavLink>
                 <NavLink to="/dashboard/account" className={({ isActive }) => linkClasses(isActive)}>
                    <FaUser size={22} />
                    <span className="text-xs mt-1">Account</span>
                </NavLink>
            </div>
        </div>
    );
};

export default MobileFooter;