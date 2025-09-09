


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaImage } from 'react-icons/fa';
import { useTheme } from '../../../../../context/ThemeContext';

const AddSongPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [filePath, setFilePath] = useState('');
  const [coverArtPath, setCoverArtPath] = useState('');
  const [artistPic, setArtistPic] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { isDarkMode } = useTheme();

  const isImageUrl = (url) => /\.(jpeg|jpg|gif|png|webp)$/i.test(url);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    const songData = { title, artist, album, filePath, coverArtPath, artistPic };

    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      if (!token) {
        navigate('/signin');
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post(
        'http://localhost:9999/user/songs/request',
        songData,
        config
      );
      setMessage(data.message);
      setTitle('');
      setArtist('');
      setAlbum('');
      setFilePath('');
      setCoverArtPath('');
      setArtistPic('');
      e.target.reset();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative min-h-screen flex items-center justify-center overflow-hidden p-6 ${isDarkMode 
      ? 'bg-gradient-to-br from-[#0f2027] via-[#1a1a2e] to-[#000000] text-white' 
      : 'bg-gradient-to-br from-gray-100 via-blue-50 to-gray-200 text-gray-900'
    }`}>
      {/* Falling Stars Background (only for dark mode) */}
      {isDarkMode && (
        <div className="absolute inset-0 overflow-hidden z-0">
          {Array.from({ length: 35 }).map((_, i) => (
            <span
              key={i}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${3 + Math.random() * 4}s`,
                animationDelay: `${Math.random() * 6}s`,
              }}
            ></span>
          ))}
        </div>
      )}

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-3xl"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${isDarkMode 
              ? 'from-pink-500 via-purple-500 to-cyan-400 drop-shadow-[0_0_25px_rgba(255,0,255,0.7)]' 
              : 'from-pink-600 via-purple-600 to-cyan-500'
            }`}
          >
            🎵 Request a SONG
          </motion.h1>
          <p className={`mt-3 text-lg tracking-wide ${isDarkMode 
            ? 'text-gray-300 drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]' 
            : 'text-gray-600'
          }`}>
            Submit your favorite tracks  ✨
          </p>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`rounded-2xl p-8 space-y-6 ${isDarkMode 
            ? 'bg-black/50 border border-purple-500/40 shadow-[0_0_25px_rgba(0,255,255,0.3)]' 
            : 'bg-white/80 border border-purple-300/60 shadow-lg'
          }`}
        >
          {/* Success & Error Messages */}
          {message && (
            <div className={`p-3 text-center rounded-lg ${isDarkMode 
              ? 'bg-green-900/40 border border-green-500/70 text-green-300 shadow-[0_0_12px_rgba(0,255,0,0.5)]' 
              : 'bg-green-100 border border-green-500/50 text-green-700'
            }`}>
              {message}
            </div>
          )}
          {error && (
            <div className={`p-3 text-center rounded-lg ${isDarkMode 
              ? 'bg-red-900/40 border border-red-500/70 text-red-300 shadow-[0_0_12px_rgba(255,0,0,0.5)]' 
              : 'bg-red-100 border border-red-500/50 text-red-700'
            }`}>
              {error}
            </div>
          )}

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Song Title */}
            <div>
              <label className={`block mb-2 text-sm font-semibold ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>
                Song Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full p-3 rounded-lg focus:ring-2 focus:outline-none placeholder-gray-400 ${
                  isDarkMode 
                    ? 'bg-black/60 border border-cyan-400/50 focus:ring-purple-500 text-white shadow-[0_0_15px_rgba(0,255,255,0.2)]' 
                    : 'bg-white border border-gray-300 focus:ring-purple-500 text-gray-900'
                }`}
                required
              />
            </div>

            {/* Artist */}
            <div>
              <label className={`block mb-2 text-sm font-semibold ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                Artist <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                onChange={(e) => setArtist(e.target.value)}
                className={`w-full p-3 rounded-lg focus:ring-2 focus:outline-none placeholder-gray-400 ${
                  isDarkMode 
                    ? 'bg-black/60 border border-purple-400/50 focus:ring-pink-500 text-white shadow-[0_0_15px_rgba(255,0,255,0.2)]' 
                    : 'bg-white border border-gray-300 focus:ring-pink-500 text-gray-900'
                }`}
                required
              />
            </div>

            {/* Album */}
            <div>
              <label className={`block mb-2 text-sm font-semibold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                Album (Optional)
              </label>
              <input
                type="text"
                onChange={(e) => setAlbum(e.target.value)}
                className={`w-full p-3 rounded-lg focus:ring-2 focus:outline-none placeholder-gray-400 ${
                  isDarkMode 
                    ? 'bg-black/60 border border-pink-400/50 focus:ring-cyan-500 text-white shadow-[0_0_15px_rgba(255,0,255,0.2)]' 
                    : 'bg-white border border-gray-300 focus:ring-cyan-500 text-gray-900'
                }`}
              />
            </div>

            {/* Song URL */}
            <div className="md:col-span-2">
              <label className={`block mb-2 text-sm font-semibold ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>
                Song File URL (.mp3) <span className="text-red-400">*</span>
              </label>
              <input
                type="url"
                placeholder="https://example.com/song.mp3"
                onChange={(e) => setFilePath(e.target.value)}
                className={`w-full p-3 rounded-lg focus:ring-2 focus:outline-none placeholder-gray-400 ${
                  isDarkMode 
                    ? 'bg-black/60 border border-cyan-400/50 focus:ring-purple-500 text-white shadow-[0_0_15px_rgba(0,255,255,0.2)]' 
                    : 'bg-white border border-gray-300 focus:ring-purple-500 text-gray-900'
                }`}
                required
              />
            </div>

            {/* Cover Art */}
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className={`block mb-2 text-sm font-semibold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  Cover Art URL <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/cover.jpg"
                  value={coverArtPath}
                  onChange={(e) => setCoverArtPath(e.target.value)}
                  className={`w-full p-3 rounded-lg focus:ring-2 focus:outline-none placeholder-gray-400 ${
                    isDarkMode 
                      ? 'bg-black/60 border border-pink-400/50 focus:ring-cyan-500 text-white shadow-[0_0_15px_rgba(255,0,255,0.2)]' 
                      : 'bg-white border border-gray-300 focus:ring-cyan-500 text-gray-900'
                  }`}
                  required
                />
              </div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`w-20 h-20 rounded-lg flex items-center justify-center border ${
                  isDarkMode 
                    ? 'bg-black/50 border-purple-400/50 shadow-[0_0_15px_rgba(0,255,255,0.3)]' 
                    : 'bg-white border-gray-300 shadow-md'
                }`}
              >
                {isImageUrl(coverArtPath) ? (
                  <img
                    src={coverArtPath}
                    alt="Cover Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <FaImage className={`text-2xl ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                )}
              </motion.div>
            </div>

            {/* Artist Picture */}
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className={`block mb-2 text-sm font-semibold ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                  Artist Picture URL <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/artist.jpg"
                  value={artistPic}
                  onChange={(e) => setArtistPic(e.target.value)}
                  className={`w-full p-3 rounded-lg focus:ring-2 focus:outline-none placeholder-gray-400 ${
                    isDarkMode 
                      ? 'bg-black/60 border border-purple-400/50 focus:ring-pink-500 text-white shadow-[0_0_15px_rgba(0,255,255,0.2)]' 
                      : 'bg-white border border-gray-300 focus:ring-pink-500 text-gray-900'
                  }`}
                  required
                />
              </div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`w-20 h-20 rounded-lg flex items-center justify-center border ${
                  isDarkMode 
                    ? 'bg-black/50 border-cyan-400/50 shadow-[0_0_15px_rgba(255,0,255,0.3)]' 
                    : 'bg-white border-gray-300 shadow-md'
                }`}
              >
                {isImageUrl(artistPic) ? (
                  <img
                    src={artistPic}
                    alt="Artist Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <FaImage className={`text-2xl ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                )}
              </motion.div>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{
              scale: 1.05,
              boxShadow: isDarkMode ? '0 0 25px rgba(0,255,255,0.8)' : '0 0 15px rgba(128, 90, 213, 0.5)',
            }}
            type="submit"
            disabled={loading}
            className={`w-full mt-6 py-3 px-4 rounded-full font-bold tracking-wide transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-cyan-500 hover:to-pink-600 shadow-[0_0_25px_rgba(255,0,255,0.6)]' 
                : 'bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 hover:from-cyan-400 hover:to-pink-500 text-white shadow-md'
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {loading ? 'Submitting...' : '🚀 Submit for Approval'}
          </motion.button>
        </motion.form>
      </motion.div>

      {/* Star Animation CSS (only for dark mode) */}
      {isDarkMode && (
        <style>{`
          .star {
            position: absolute;
            top: -10px;
            width: 4px;
            height: 4px;
            background: white;
            border-radius: 50%;
            box-shadow: 0 0 10px white, 0 0 20px cyan, 0 0 40px magenta;
            opacity: 0.9;
            animation: fall linear infinite;
          }
          @keyframes fall {
            0% {
              transform: translateY(-20px);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            100% {
              transform: translateY(110vh);
              opacity: 0;
            }
          }
        `}</style>
      )}
    </div>
  );
};

export default AddSongPage;