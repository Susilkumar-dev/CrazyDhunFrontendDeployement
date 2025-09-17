
import React, { useState, useEffect, useContext, useMemo } from "react";
import { FaPlay, FaPause, FaHeart, FaClock, FaHistory, FaMusic, FaUser, FaCircleNotch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { PlayerContext } from "../../../../../context/PlayerContext";
import { useTheme } from "../../../../../context/ThemeContext";
import { Link } from "react-router-dom";

const buildImageUrl = (path) => {
  if (!path) return "https://via.placeholder.com/160";
  if (path.startsWith("http")) return path;
  return `${import.meta.env.VITE_API_URL}/${path.replace(/\\/g, "/")}`;
};

const LibraryPage = () => {
  const [activeTab, setActiveTab] = useState("Recently Played");
  const tabs = ["Recently Played", "Songs", "Liked Songs", "Albums", "Artists"];
  const [allSongs, setAllSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  
  // Destructure all necessary values from PlayerContext
  const { playSong, togglePlayPause, likedSongs: likedSongIds, currentSong, isPlaying } = useContext(PlayerContext);
  const { isDarkMode } = useTheme();

  // Function to add song to recently played
  const addToRecentlyPlayed = (song) => {
    try {
      const stored = localStorage.getItem('recentlyPlayed');
      let recentlyPlayed = stored ? JSON.parse(stored) : [];
      
      // Ensure it's an array
      if (!Array.isArray(recentlyPlayed)) {
        recentlyPlayed = [];
      }
      
      // Remove if already exists
      recentlyPlayed = recentlyPlayed.filter(item => item.songId !== song._id);
      
      // Add to beginning
      recentlyPlayed.unshift({
        songId: song._id,
        timestamp: Date.now()
      });
      
      // Keep only last 50 items
      if (recentlyPlayed.length > 50) {
        recentlyPlayed = recentlyPlayed.slice(0, 50);
      }
      
      localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
      // Update state to trigger re-render
      setRecentlyPlayed(recentlyPlayed);
    } catch (error) {
      console.error("Error adding to recently played:", error);
    }
  };

  // Get recently played from localStorage with 24h expiration
  useEffect(() => {
    const getRecentlyPlayed = () => {
      try {
        const stored = localStorage.getItem('recentlyPlayed');
        if (!stored) return [];
        
        const data = JSON.parse(stored);
        
        // Handle cases where data is not an array
        if (!Array.isArray(data)) {
          console.error("Recently played data is not an array:", data);
          // Reset to empty array if data is corrupted
          localStorage.setItem('recentlyPlayed', JSON.stringify([]));
          return [];
        }
        
        const now = Date.now();
        const validItems = data.filter(item => now - item.timestamp < 24 * 60 * 60 * 1000);
        
        // Update storage with only valid items
        if (validItems.length !== data.length) {
          localStorage.setItem('recentlyPlayed', JSON.stringify(validItems));
        }
        
        setRecentlyPlayed(validItems);
      } catch (error) {
        console.error("Error reading recently played:", error);
        return [];
      }
    };
    
    getRecentlyPlayed();
  }, []);

  const likedSongsList = allSongs.filter((song) => likedSongIds?.has(song._id));
  
  // Get recently played songs with proper data
  const recentlyPlayedSongs = useMemo(() => {
    return recentlyPlayed
      .map(item => {
        const song = allSongs.find(s => s._id === item.songId);
        return song ? { ...song, playedAt: item.timestamp } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.playedAt - a.playedAt);
  }, [recentlyPlayed, allSongs]);

  useEffect(() => {
    const fetchAllSongs = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/public/songs`);
        setAllSongs(data);
      } catch (error) {
        console.error("Failed to fetch library data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllSongs();
  }, []);

  // Handle playing a song and adding to recently played
  const handlePlaySong = (song, queue, e) => {
    if (e) e.stopPropagation(); // Prevent bubbling up to parent click handlers
    
    if (currentSong && currentSong._id === song._id) {
      togglePlayPause();
    } else {
      playSong(song, queue);
      addToRecentlyPlayed(song);
    }
  };

  // Get albums with proper data
  const albums = useMemo(() => {
    return allSongs.reduce((acc, song) => {
      if (song.album) {
        if (!acc[song.album]) {
          acc[song.album] = {
            songs: [],
            cover: song.coverArtPath,
            artist: song.artist // Store artist for album
          };
        }
        acc[song.album].songs.push(song);
      }
      return acc;
    }, {});
  }, [allSongs]);

  // Get artists with proper data including images
  const artists = useMemo(() => {
    return allSongs.reduce((acc, song) => {
      if (song.artist) {
        if (!acc[song.artist]) {
          acc[song.artist] = {
            songs: [],
            image: song.artistPic || null, // Assuming song.artistPic exists for an artist's main image
            count: 0
          };
        }
        acc[song.artist].songs.push(song);
        acc[song.artist].count += 1;
      }
      return acc;
    }, {});
  }, [allSongs]);

  const renderContent = () => {
    if (loading) return <LibrarySkeleton isDarkMode={isDarkMode} />;
    
    switch (activeTab) {
      case "Liked Songs":
        return <SongList songs={likedSongsList} playContext={handlePlaySong} queue={likedSongsList} isDarkMode={isDarkMode} currentSong={currentSong} isPlaying={isPlaying} />;
      case "Albums":
        return <AlbumList albums={albums} playContext={handlePlaySong} isDarkMode={isDarkMode} currentSong={currentSong} isPlaying={isPlaying} />;
      case "Artists":
        return <ArtistList artists={artists} playContext={handlePlaySong} isDarkMode={isDarkMode} isPlaying={isPlaying} currentSong={currentSong}/>;
      case "Recently Played":
        return <RecentlyPlayed songs={recentlyPlayedSongs} playContext={handlePlaySong} queue={recentlyPlayedSongs} isDarkMode={isDarkMode} currentSong={currentSong} isPlaying={isPlaying}/>;
      case "Songs":
      default:
        return <SongList songs={allSongs} playContext={handlePlaySong} queue={allSongs} isDarkMode={isDarkMode} isPlaying={isPlaying} currentSong={currentSong} />;
    }
  };

  return (
    <div className={`p-6 md:p-10 min-h-screen bg-gradient-to-b ${isDarkMode ? 'from-gray-900 via-gray-800 to-gray-900' : 'from-gray-100 via-gray-50 to-gray-100'} ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div>
          <h1 className={`text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${isDarkMode ? 'from-green-400 to-emerald-500' : 'from-green-500 to-emerald-600'} mb-2`}>
            Your Library
          </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-lg`}>Access your personal music collection</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className={`flex space-x-2 mb-10 overflow-x-auto no-scrollbar pb-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
        {tabs.map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all duration-300 relative ${
              activeTab === tab
                ? isDarkMode ? "text-white bg-gray-800 shadow-lg" : "text-gray-900 bg-white shadow-md"
                : isDarkMode ? "text-gray-400 hover:text-gray-300 bg-gray-800/40" : "text-gray-600 hover:text-gray-800 bg-gray-100/70"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r rounded-t-lg ${isDarkMode ? 'from-green-400 to-emerald-500' : 'from-green-500 to-emerald-600'}`}
                layoutId="activeTab"
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-5 rounded-2xl backdrop-blur-sm ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}
        >
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Total Songs</p>
          <p className="text-2xl font-bold mt-1">{allSongs.length}</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-5 rounded-2xl backdrop-blur-sm ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}
        >
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Liked Songs</p>
          <p className="text-2xl font-bold mt-1">{likedSongsList.length}</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-5 rounded-2xl backdrop-blur-sm ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}
        >
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Albums</p>
          <p className="text-2xl font-bold mt-1">{Object.keys(albums).length}</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`p-5 rounded-2xl backdrop-blur-sm ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}
        >
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Artists</p>
          <p className="text-2xl font-bold mt-1">{Object.keys(artists).length}</p>
        </motion.div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ------------------ RECENTLY PLAYED ------------------
const RecentlyPlayed = ({ songs, playContext, queue, isDarkMode, currentSong, isPlaying }) => {
  if (!songs || songs.length === 0) {
    return (
      <div className="text-center py-16">
        <FaHistory className={`text-5xl mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>No recently played songs</p>
        <p className={`text-sm mt-2 ${isDarkMode ? "text-gray-600" : "text-gray-500"}`}>
          Songs you play will appear here and will be automatically removed after 24 hours
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {songs.map((song, index) => {
        const uniqueKey = `recent-${song._id}-${song.playedAt}-${index}`;
        const isThisSongPlaying = currentSong && currentSong._id === song._id && isPlaying;
        const isThisSongCurrent = currentSong && currentSong._id === song._id;
        
        return (
          <motion.div
            key={uniqueKey}
            className={`p-4 rounded-2xl cursor-pointer shadow-lg relative group overflow-hidden backdrop-blur-sm border ${
              isDarkMode 
                ? 'bg-gray-800/40 hover:bg-gray-700/60 border-gray-700' 
                : 'bg-white/80 hover:bg-gray-100 border-gray-200'
            } transition-all duration-300`}
            whileHover={{ y: -5, scale: 1.02 }}
            onClick={(e) => playContext(song, queue, e)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="relative overflow-hidden rounded-xl mb-4">
              <img
                src={buildImageUrl(song.coverArtPath)}
                alt={song.title}
                className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Play/Pause Button Overlay */}
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 rounded-xl
                           ${isThisSongCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} 
                           ${isDarkMode ? 'bg-black/50' : 'bg-white/80'}`}
                   onClick={(e) => playContext(song, queue, e)}
              >
                <button className="bg-green-500 p-3 rounded-full text-white hover:scale-110 transition-transform shadow-lg">
                  {isThisSongPlaying ? <FaPause className="text-xl" /> : <FaPlay className="text-xl ml-1" />}
                </button>
              </div>
              <div className={`absolute top-2 right-2 rounded-full p-2 ${isDarkMode ? 'bg-black/70' : 'bg-white/90'}`}>
                <FaClock className="text-green-400" />
              </div>
            </div>
            <h3 className="text-lg font-bold truncate">{song.title}</h3>
            <p className={`text-sm truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>{song.artist}</p>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Played: {new Date(song.playedAt).toLocaleTimeString()}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
};

// ------------------ SONG LIST ------------------
const SongList = ({ songs, playContext, queue, isDarkMode, currentSong, isPlaying }) => {
  if (!songs || songs.length === 0) return (
    <div className="text-center py-16">
      <FaMusic className={`text-5xl mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
      <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>No songs found</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {songs.map((song, index) => {
        const uniqueKey = `song-${song._id}-${index}`;
        const isThisSongPlaying = currentSong && currentSong._id === song._id && isPlaying;
        const isThisSongCurrent = currentSong && currentSong._id === song._id;

        return (
          <motion.div
            key={uniqueKey}
            className={`p-4 rounded-2xl cursor-pointer shadow-lg relative group overflow-hidden backdrop-blur-sm border ${
              isDarkMode 
                ? 'bg-gray-800/40 hover:bg-gray-700/60 border-gray-700' 
                : 'bg-white/80 hover:bg-gray-100 border-gray-200'
            } transition-all duration-300`}
            whileHover={{ y: -5, scale: 1.02 }}
            onClick={(e) => playContext(song, queue, e)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="relative overflow-hidden rounded-xl mb-4">
              <img
                src={buildImageUrl(song.coverArtPath)}
                alt={song.title}
                className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Play/Pause Button Overlay */}
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 rounded-xl
                           ${isThisSongCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} 
                           ${isDarkMode ? 'bg-black/50' : 'bg-white/80'}`}
                   onClick={(e) => playContext(song, queue, e)}
              >
                <button className="bg-green-500 p-3 rounded-full text-white hover:scale-110 transition-transform shadow-lg">
                  {isThisSongPlaying ? <FaPause className="text-xl" /> : <FaPlay className="text-xl ml-1" />}
                </button>
              </div>
            </div>
            <h3 className="text-lg font-bold truncate">{song.title}</h3>
            <p className={`text-sm truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>{song.artist}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

// ------------------ ALBUM LIST ------------------
const AlbumList = ({ albums, isDarkMode, playContext, currentSong, isPlaying }) => {
  const entries = Object.entries(albums);
  
  if (entries.length === 0) return (
    <div className="text-center py-16">
      <div className={`w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
        <span className="text-2xl">🎵</span>
      </div>
      <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>No albums found</p>
    </div>
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {entries.map(([name, album], index) => {
        const uniqueKey = `album-${name}-${index}`;
        // For albums, we check if ANY song from this album is the current song
        const isAnySongInAlbumPlaying = album.songs.some(song => currentSong && currentSong._id === song._id && isPlaying);
        const isAnySongInAlbumCurrent = album.songs.some(song => currentSong && currentSong._id === song._id);

        return (
          <motion.div
            key={uniqueKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group"
          >
            <Link
              to={`/dashboard/album/${encodeURIComponent(name)}`}
              className="group relative flex flex-col items-center text-center transition-all duration-300"
            >
              <div className="relative mb-3 w-full aspect-square overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={buildImageUrl(album.cover)}
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 rounded-2xl
                             ${isAnySongInAlbumCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                             bg-black/50`}
                >
                  <button 
                    className="bg-green-500 p-4 rounded-full text-white hover:scale-110 transition-transform shadow-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (album.songs.length > 0) {
                        playContext(album.songs[0], album.songs, e);
                      }
                    }}
                  >
                    {isAnySongInAlbumPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
                  </button>
                </div>
              </div>
              <h3 className="font-bold truncate w-full text-lg">{name}</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                {album.artist}
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                {album.songs.length} {album.songs.length !== 1 ? "songs" : "song"}
              </p>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

// ------------------ ARTIST LIST ------------------
const ArtistList = ({ artists, isDarkMode, playContext, currentSong, isPlaying }) => {
  const entries = Object.entries(artists);
  
  if (entries.length === 0) return (
    <div className="text-center py-16">
      <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
        <FaUser className="text-2xl" />
      </div>
      <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>No artists found</p>
    </div>
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {entries.map(([name, artist], index) => {
        const imageUrl = artist.image ? buildImageUrl(artist.image) : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=160`;
        const uniqueKey = `artist-${name}-${index}`;
        // For artists, check if ANY song by this artist is the current song
        const isAnySongByArtistPlaying = artist.songs.some(song => currentSong && currentSong._id === song._id && isPlaying);
        const isAnySongByArtistCurrent = artist.songs.some(song => currentSong && currentSong._id === song._id);

        return (
          <motion.div
            key={uniqueKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group"
          >
            <Link
              to={`/dashboard/artist/${encodeURIComponent(name)}`}
              className="group relative flex flex-col items-center text-center transition-all duration-300"
            >
              <div className="relative mb-3 w-36 h-36 overflow-hidden rounded-full shadow-lg border-2 border-green-500">
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 rounded-full
                             ${isAnySongByArtistCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                             bg-black/50`}
                >
                  <button 
                    className="bg-green-500 p-3 rounded-full text-white hover:scale-110 transition-transform shadow-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (artist.songs.length > 0) {
                        playContext(artist.songs[0], artist.songs, e);
                      }
                    }}
                  >
                    {isAnySongByArtistPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
                  </button>
                </div>
              </div>
              <h3 className="font-bold truncate w-36 text-lg">{name}</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                {artist.count} {artist.count !== 1 ? "songs" : "song"}
              </p>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

// ------------------ LOADING SKELETON ------------------
const LibrarySkeleton = ({ isDarkMode }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      {/* Spinning circle loader */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="mb-6"
      >
        <FaCircleNotch className={`text-5xl ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
      </motion.div>
      
      {/* Wave text effect */}
      <div className="flex space-x-1 mb-8">
        {["L", "o", "a", "d", "i", "n", "g", " ", ".", ".", "."].map((letter, index) => (
          <motion.span
            key={index}
            initial={{ y: 0 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              delay: index * 0.1 
            }}
            className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-500'}`}
          >
            {letter}
          </motion.span>
        ))}
      </div>
      
      {/* Grid skeleton as fallback */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full mt-8">
        {[...Array(10)].map((_, index) => (
          <motion.div 
            key={`skeleton-${index}`} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-2xl shadow-lg overflow-hidden relative ${
              isDarkMode ? 'bg-gray-800/40' : 'bg-gray-200/40'
            }`}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <div className={`w-full h-44 rounded-xl mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <div className={`h-4 rounded mb-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <div className={`h-3 rounded w-2/3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LibraryPage;