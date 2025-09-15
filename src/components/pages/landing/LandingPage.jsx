



import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { motion } from 'framer-motion';

const PlaylistCard = ({ image, title, description, isDarkMode }) => (
  <div className={`rounded-lg shadow-lg overflow-hidden group transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl ${
    isDarkMode ? 'bg-gray-800 bg-opacity-50' : 'bg-white'
  }`}>
    <img src={image} alt={title} className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110" />
    <div className="p-4">
      <h3 className={`font-bold text-lg truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{description}</p>
    </div>
  </div>
);

const LandingPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate loading when component mounts
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
      }`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto ${
            isDarkMode ? 'border-green-400' : 'border-green-600'
          }`}></div>
          <p className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-b from-gray-900 via-green-900 to-black text-white' 
        : 'bg-gradient-to-b from-gray-100 via-green-100 to-gray-300 text-gray-900'
    }`}>
      
      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full ${
            isDarkMode 
              ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>
      
      <header className="absolute top-0 left-0 right-0 p-6 z-10">
        {/* You can add a logo or navigation here */}
      </header>
      
      <div className="container mx-auto px-6 py-24">
        {/* Hero Section */}
        <section className="text-center pt-16 pb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight"
          >
            Discover Your Next Favorite Song
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className={`text-lg mb-8 max-w-3xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Your ultimate destination for an endless library of music. Create playlists, discover new artists, and enjoy your favorite tracks, all in one place.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link 
              to="/signup" 
              className={`inline-block font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 ${
                isDarkMode 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              Get Started for Free
            </Link>
          </motion.div>
        </section>

        {/* Featured Playlists */}
        <section className="mt-12">
          <h2 className={`text-3xl font-bold mb-8 text-center ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Featured Playlists</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            <PlaylistCard 
              image="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" 
              title="Top Global Hits" 
              description="The biggest tracks from around the world."
              isDarkMode={isDarkMode}
            />
            <PlaylistCard 
              image="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" 
              title="Party Anthems" 
              description="Get the party started with these bangers."
              isDarkMode={isDarkMode}
            />
            <PlaylistCard 
              image="https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" 
              title="Chill & Relax" 
              description="Unwind and relax with calming beats."
              isDarkMode={isDarkMode}
            />
            <PlaylistCard 
              image="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" 
              title="Workout Energy" 
              description="High-energy tracks to fuel your workout."
              isDarkMode={isDarkMode}
            />
            <PlaylistCard 
              image="https://images.unsplash.com/photo-1487180144351-b8472da7d491?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=872&q=80" 
              title="Rock Classics" 
              description="Legendary tracks from the greatest bands."
              isDarkMode={isDarkMode}
            />
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className={`text-center py-8 mt-16 border-t ${
        isDarkMode ? 'border-gray-800 text-gray-400' : 'border-gray-300 text-gray-600'
      }`}>
        <p>&copy; 2024 Dhun. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;