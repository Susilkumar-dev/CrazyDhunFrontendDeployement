



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaTimes, FaUserCircle, FaPlay, FaPause, FaFilter, FaSort, FaSearch, FaInfoCircle } from 'react-icons/fa';
import { useTheme } from '../../../../../context/ThemeContext';

// --- Reusable Helper ---
const buildImageUrl = (path) =>
  path
    ? path.startsWith('http')
      ? path
      : `${import.meta.env.VITE_API_URL}/${path.replace(/\\/g, '/')}`
    : 'https://via.placeholder.com/160';

// --- Main Page Component ---
const AdminApprovalPage = () => {
  const [pendingSongs, setPendingSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOption, setFilterOption] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  const [selectedSong, setSelectedSong] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(null);
  const { isDarkMode } = useTheme();

  const fetchPendingSongs = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/songs/pending`,
        config
      );
      setPendingSongs(data);
      setFilteredSongs(data);
    } catch (err) {
      setError('Failed to fetch pending songs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingSongs();
  }, []);

  // Filter and sort songs
  useEffect(() => {
    let result = [...pendingSongs];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(song => 
        song.title.toLowerCase().includes(query) || 
        song.artist.toLowerCase().includes(query) ||
        (song.album && song.album.toLowerCase().includes(query)) ||
        (song.submittedBy?.username && song.submittedBy.username.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    if (sortOption === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortOption === 'artist') {
      result.sort((a, b) => a.artist.localeCompare(b.artist));
    } else if (sortOption === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    setFilteredSongs(result);
  }, [pendingSongs, searchQuery, sortOption]);

  const handleApprove = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/songs/approve/${id}`,
        {},
        config
      );
      setPendingSongs((currentSongs) =>
        currentSongs.filter((song) => song._id !== id)
      );
    } catch (err) {
      alert('Failed to approve song.');
    }
  };

  const handleReject = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/admin/songs/reject/${id}`,
        config
      );
      setPendingSongs((currentSongs) =>
        currentSongs.filter((song) => song._id !== id)
      );
    } catch (err) {
      alert('Failed to reject song.');
    }
  };

  const handlePlayPreview = (song, e) => {
    e.stopPropagation();
    if (audioPlaying === song._id) {
      setAudioPlaying(null);
    } else {
      setAudioPlaying(song._id);
      // Auto-stop after 30 seconds
      setTimeout(() => {
        setAudioPlaying(null);
      }, 30000);
    }
  };

  const openDetailModal = (song) => {
    setSelectedSong(song);
    setShowDetailModal(true);
  };

  const approveAll = async () => {
    if (window.confirm(`Approve all ${filteredSongs.length} songs?`)) {
      try {
        const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        for (const song of filteredSongs) {
          await axios.post(
            `${import.meta.env.VITE_API_URL}/admin/songs/approve/${song._id}`,
            {},
            config
          );
        }
        
        setPendingSongs([]);
      } catch (err) {
        alert('Failed to approve all songs.');
      }
    }
  };

  if (loading)
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <p className={`animate-pulse ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Loading Approvals...</p>
      </div>
    );
    
  if (error) return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <p className={`${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
    </div>
  );

  return (
    <div className={`min-h-screen p-4 md:p-8 relative overflow-hidden ${isDarkMode 
      ? 'bg-gray-900 text-white' 
      : 'bg-gray-100 text-gray-900'}`}>
      
      {/* Animated Ripple + Bubble Background (only for dark mode) */}
      {isDarkMode && (
        <div className="ripple-background absolute inset-0 z-0">
          <div className="circle xxlarge"></div>
          <div className="circle xlarge"></div>
          <div className="circle large"></div>
          <div className="circle medium"></div>
          <div className="circle small"></div>

          {/* Floating Bubbles */}
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
        </div>
      )}

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center md:text-left mb-10"
        >
          <h1 className={`text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${
            isDarkMode ? 'from-emerald-400 to-cyan-400' : 'from-emerald-600 to-cyan-600'
          }`}>
            Approval Queue
          </h1>
          <p className={`mt-2 text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Review and curate new music submitted by users.
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <div className={`p-4 rounded-xl mb-8 ${isDarkMode 
          ? 'bg-gray-800/50 backdrop-blur-md' 
          : 'bg-white/80 backdrop-blur-md shadow-md'}`}>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className={`flex items-center flex-1 p-3 rounded-lg ${isDarkMode 
              ? 'bg-gray-700' 
              : 'bg-gray-100'}`}>
              <FaSearch className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search songs, artists, albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full bg-transparent focus:outline-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              />
            </div>
            
            <div className="flex gap-2">
              <div className={`relative flex items-center p-3 rounded-lg ${isDarkMode 
                ? 'bg-gray-700' 
                : 'bg-gray-100'}`}>
                <FaSort className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className={`appearance-none bg-transparent focus:outline-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="artist">By Artist</option>
                  <option value="title">By Title</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className={`px-4 py-2 rounded-lg ${isDarkMode 
            ? 'bg-gray-800/50' 
            : 'bg-white/80'}`}>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
              <span className="font-bold">{filteredSongs.length}</span> songs awaiting review
            </p>
          </div>
          
          {filteredSongs.length > 0 && (
            <button
              onClick={approveAll}
              className={`px-4 py-2 rounded-lg font-medium ${isDarkMode 
                ? 'bg-green-700 hover:bg-green-600 text-white' 
                : 'bg-green-600 hover:bg-green-500 text-white'}`}
            >
              Approve All
            </button>
          )}
        </div>

        <AnimatePresence>
          {filteredSongs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center py-20 rounded-2xl ${isDarkMode 
                ? 'bg-gray-800/50 backdrop-blur-md' 
                : 'bg-white/80 backdrop-blur-md shadow-md'}`}
            >
              <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {searchQuery ? "No matching songs found" : "The Queue is Clear!"}
              </h2>
              <p className={`mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                {searchQuery ? "Try a different search term" : "No new songs are currently awaiting your approval."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-6"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              initial="hidden"
              animate="visible"
            >
              {filteredSongs.map((song) => (
                <ApprovalCard
                  key={song._id}
                  song={song}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onPlayPreview={handlePlayPreview}
                  onViewDetails={openDetailModal}
                  isPlaying={audioPlaying === song._id}
                  isDarkMode={isDarkMode}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedSong && (
        <DetailModal 
          song={selectedSong} 
          onClose={() => setShowDetailModal(false)} 
          isDarkMode={isDarkMode}
        />
      )}

      {/* Ripple Animation CSS (only for dark mode) */}
      {isDarkMode && (
        <style>{`
          .ripple-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          
          .circle {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            animation: ripple 15s infinite;
            box-shadow: 0px 0px 1px 0px rgba(34, 211, 238, 0.3);
          }
          
          .small {
            width: 200px;
            height: 200px;
            left: -100px;
            bottom: -100px;
          }
          
          .medium {
            width: 400px;
            height: 400px;
            left: -200px;
            bottom: -200px;
          }
          
          .large {
            width: 600px;
            height: 600px;
            left: -300px;
            bottom: -300px;
          }
          
          .xlarge {
            width: 800px;
            height: 800px;
            left: -400px;
            bottom: -400px;
          }
          
          .xxlarge {
            width: 1000px;
            height: 1000px;
            left: -500px;
            bottom: -500px;
          }
          
          .shade1 {
            opacity: 0.2;
          }
          
          .shade2 {
            opacity: 0.5;
          }
          
          .shade3 {
            opacity: 0.7;
          }
          
          .shade4 {
            opacity: 0.8;
          }
          
          .shade5 {
            opacity: 0.9;
          }
          
          @keyframes ripple {
            0% {
              transform: scale(0.8);
            }
            
            50% {
              transform: scale(1.2);
            }
            
            100% {
              transform: scale(0.8);
            }
          }
          
          .bubble {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            opacity: 0.5;
            animation: float 15s infinite;
          }
          
          .bubble:nth-child(1) {
            width: 80px;
            height: 80px;
            left: 5%;
            top: 20%;
          }
          
          .bubble:nth-child(2) {
            width: 100px;
            height: 100px;
            left: 35%;
            top: 80%;
            animation-delay: 2s;
          }
          
          .bubble:nth-child(3) {
            width: 120px;
            height: 120px;
            left: 65%;
            top: 30%;
            animation-delay: 4s;
          }
          
          .bubble:nth-child(4) {
            width: 90px;
            height: 90px;
            left: 80%;
            top: 70%;
            animation-delay: 1s;
          }
          
          .bubble:nth-child(5) {
            width: 60px;
            height: 60px;
            left: 55%;
            top: 10%;
            animation-delay: 3s;
          }
          
          @keyframes float {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 0.5;
              border-radius: 50%;
            }
            
            50% {
              transform: translateY(-50px) rotate(180deg);
              opacity: 0.7;
              border-radius: 40%;
            }
            
            100% {
              transform: translateY(0) rotate(360deg);
              opacity: 0.5;
              border-radius: 50%;
            }
          }
        `}</style>
      )}
    </div>
  );
};

// --- Sub-Component for a single Approval Card ---
const ApprovalCard = ({ song, onApprove, onReject, onPlayPreview, onViewDetails, isPlaying, isDarkMode }) => (
  <motion.div
    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
    layout
    className={`p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 shadow-lg ${
      isDarkMode 
        ? 'bg-gray-800/40 backdrop-blur-xl border border-gray-600/40 shadow-emerald-500/20' 
        : 'bg-white/80 backdrop-blur-xl border border-gray-200 shadow-md'
    }`}
  >
    {/* Images */}
    <div className="flex -space-x-8 relative">
      <img
        src={buildImageUrl(song.artistPic)}
        alt={song.artist}
        className="w-20 h-20 rounded-full object-cover border-2 shadow-md"
        style={{
          borderColor: isDarkMode ? 'rgba(110, 231, 183, 0.4)' : 'rgba(5, 150, 105, 0.4)'
        }}
      />
      <img
        src={buildImageUrl(song.coverArtPath)}
        alt={song.title}
        className="w-20 h-20 rounded-full object-cover border-2 shadow-md"
        style={{
          borderColor: isDarkMode ? 'rgba(34, 211, 238, 0.4)' : 'rgba(6, 182, 212, 0.4)'
        }}
      />
      
      {/* Play Preview Button */}
      {song.filePath && (
        <button
          onClick={(e) => onPlayPreview(song, e)}
          className={`absolute -bottom-2 -right-2 rounded-full p-2 shadow-lg ${
            isDarkMode 
              ? 'bg-cyan-600 hover:bg-cyan-500 text-white' 
              : 'bg-cyan-500 hover:bg-cyan-400 text-white'
          }`}
        >
          {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
        </button>
      )}
    </div>

    {/* Song Info */}
    <div className="flex-1 text-center md:text-left">
      <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{song.title}</h3>
      <p className={`text-md ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{song.artist}</p>
      {song.album && (
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Album: {song.album}</p>
      )}
      <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm">
        <FaUserCircle className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
          Submitted by:{' '}
          <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            {song.submittedBy?.username || 'Unknown User'}
          </span>
        </span>
      </div>
      <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
        {new Date(song.createdAt).toLocaleDateString()}
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={() => onViewDetails(song)}
        className={`p-2 rounded-lg flex items-center gap-2 ${
          isDarkMode 
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        }`}
      >
        <FaInfoCircle /> <span className="hidden sm:inline">Details</span>
      </button>
      
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onReject(song._id)}
          className={`py-2 px-4 rounded-full flex items-center gap-2 transition-all shadow-lg ${
            isDarkMode 
              ? 'bg-red-600/80 hover:bg-red-600 text-white hover:shadow-red-500/40' 
              : 'bg-red-500 hover:bg-red-600 text-white hover:shadow-red-400/40'
          }`}
        >
          <FaTimes /> <span>Reject</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onApprove(song._id)}
          className={`py-2 px-4 rounded-full flex items-center gap-2 transition-all shadow-lg ${
            isDarkMode 
              ? 'bg-green-600/90 hover:bg-green-600 text-white hover:shadow-green-500/40' 
              : 'bg-green-500 hover:bg-green-600 text-white hover:shadow-green-400/40'
          }`}
        >
          <FaCheck /> <span>Approve</span>
        </motion.button>
      </div>
    </div>
  </motion.div>
);

// --- Detail Modal Component ---
const DetailModal = ({ song, onClose, isDarkMode }) => {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-full max-w-2xl rounded-2xl p-6 ${isDarkMode 
          ? 'bg-gray-800 text-white' 
          : 'bg-white text-gray-900'}`}
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">Song Details</h2>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full ${isDarkMode 
              ? 'hover:bg-gray-700' 
              : 'hover:bg-gray-200'}`}
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <img 
              src={buildImageUrl(song.coverArtPath)} 
              alt={song.title}
              className="w-full rounded-lg shadow-md"
            />
            {song.artistPic && (
              <div className="mt-4">
                <p className="font-semibold mb-2">Artist Image:</p>
                <img 
                  src={buildImageUrl(song.artistPic)} 
                  alt={song.artist}
                  className="w-full rounded-lg shadow-md"
                />
              </div>
            )}
          </div>
          
          <div className="md:col-span-2">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Title</h3>
                <p>{song.title}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold">Artist</h3>
                <p>{song.artist}</p>
              </div>
              
              {song.album && (
                <div>
                  <h3 className="text-lg font-semibold">Album</h3>
                  <p>{song.album}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-semibold">Submitted By</h3>
                <p>{song.submittedBy?.username || 'Unknown User'}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold">Submitted On</h3>
                <p>{new Date(song.createdAt).toLocaleDateString()}</p>
              </div>
              
              {song.filePath && (
                <div>
                  <h3 className="text-lg font-semibold">Audio File</h3>
                  <a 
                    href={song.filePath} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`inline-block mt-2 px-4 py-2 rounded-lg ${
                      isDarkMode 
                        ? 'bg-cyan-700 hover:bg-cyan-600 text-white' 
                        : 'bg-cyan-500 hover:bg-cyan-400 text-white'
                    }`}
                  >
                    Listen to Full Song
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminApprovalPage;
