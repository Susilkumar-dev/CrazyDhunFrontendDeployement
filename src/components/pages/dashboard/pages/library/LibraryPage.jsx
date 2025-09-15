

import React, { useState, useEffect, useContext } from "react";
import { FaPlay, FaHeart, FaClock, FaHistory, FaPlus, FaMusic } from "react-icons/fa";
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
  const { playSong, likedSongs: likedSongIds, recentlyPlayed = [] } = useContext(PlayerContext);
  const { isDarkMode } = useTheme();

  const likedSongsList = allSongs.filter((song) => likedSongIds?.has(song._id));
  
  // Safely get recently played songs
  const recentlyPlayedSongs = allSongs.filter(song =>
    Array.isArray(recentlyPlayed) && recentlyPlayed.some(rp => rp && rp.songId === song._id)
  ).sort((a, b) => {
    const aIndex = recentlyPlayed.findIndex(rp => rp && rp.songId === a._id);
    const bIndex = recentlyPlayed.findIndex(rp => rp && rp.songId === b._id);
    return bIndex - aIndex;
  });

  // Get top artists based on play count
  const topArtists = Object.entries(
    allSongs.reduce((acc, song) => {
      if (song.artist) {
        acc[song.artist] = (acc[song.artist] || 0) + 1;
      }
      return acc;
    }, {})
  )
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .map(([artist]) => artist);

  useEffect(() => {
    const fetchAllSongs = async () => {
      try {
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

  const albums = allSongs.reduce((acc, song) => {
    if (song.album) {
      if (!acc[song.album]) acc[song.album] = { songs: [], cover: song.coverArtPath };
      acc[song.album].songs.push(song);
    }
    return acc;
  }, {});

  const artists = allSongs.reduce((acc, song) => {
    if (song.artist) {
      if (!acc[song.artist]) acc[song.artist] = { songs: [], cover: null };
      acc[song.artist].songs.push(song);
    }
    return acc;
  }, {});

  const renderContent = () => {
    if (loading) return <LibrarySkeleton isDarkMode={isDarkMode} />;
    
    switch (activeTab) {
      case "Liked Songs":
        return <SongList songs={likedSongsList} playContext={playSong} queue={likedSongsList} isDarkMode={isDarkMode} />;
      case "Albums":
        return <AlbumArtistList data={albums} type="Album" redirectBase="/dashboard/album" isDarkMode={isDarkMode} />;
      case "Artists":
        return <AlbumArtistList data={artists} type="Artist" redirectBase="/dashboard/artist" isDarkMode={isDarkMode} />;
      case "Recently Played":
        return <RecentlyPlayed songs={recentlyPlayedSongs} playContext={playSong} queue={recentlyPlayedSongs} isDarkMode={isDarkMode} />;
      case "Songs":
      default:
        return <SongList songs={allSongs} playContext={playSong} queue={allSongs} isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div className={`p-6 md:p-10 min-h-screen bg-gradient-to-b ${isDarkMode ? 'from-gray-900 via-gray-800 to-gray-900' : 'from-gray-100 via-gray-50 to-gray-100'} ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
      >
        <div>
          <h1 className={`text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${isDarkMode ? 'from-green-400 to-emerald-500' : 'from-green-500 to-emerald-600'}`}>
            Your Library
          </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Access your personal music collection</p>
        </div>
        
        {topArtists.length > 0 && (
          <div className="mt-4 md:mt-0">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Top Artists</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {topArtists.map(artist => (
                <span key={artist} className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  {artist}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Tabs */}
      <div className={`flex space-x-2 mb-10 overflow-x-auto no-scrollbar pb-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
        {tabs.map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-3 rounded-lg font-semibold whitespace-nowrap transition-all duration-300 relative ${
              activeTab === tab
                ? isDarkMode ? "text-white" : "text-gray-900"
                : isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-800"
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-200/50'}`}>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Total Songs</p>
          <p className="text-2xl font-bold">{allSongs.length}</p>
        </div>
        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-200/50'}`}>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Liked Songs</p>
          <p className="text-2xl font-bold">{likedSongsList.length}</p>
        </div>
        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-200/50'}`}>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Albums</p>
          <p className="text-2xl font-bold">{Object.keys(albums).length}</p>
        </div>
        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-200/50'}`}>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Artists</p>
          <p className="text-2xl font-bold">{Object.keys(artists).length}</p>
        </div>
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
const RecentlyPlayed = ({ songs, playContext, queue, isDarkMode }) => {
  if (!songs || songs.length === 0) {
    return (
      <div className="text-center py-16">
        <FaHistory className={`text-5xl mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>No recently played songs</p>
        <p className={`text-sm mt-2 ${isDarkMode ? "text-gray-600" : "text-gray-500"}`}>Songs you play will appear here</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
        {songs.slice(0, 4).map((song, index) => (
          <motion.div
            key={song._id || index}
            className={`p-4 rounded-2xl hover:bg-opacity-80 cursor-pointer shadow-lg relative group overflow-hidden ${isDarkMode ? 'bg-gray-900/40 hover:bg-gray-800' : 'bg-white/80 hover:bg-gray-100'}`}
            whileHover={{ scale: 1.03 }}
            onClick={() => playContext(song, queue)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <img
              src={buildImageUrl(song.coverArtPath)}
              alt={song.title}
              className="w-full h-44 object-cover rounded-xl mb-4"
            />
            <div className={`absolute top-4 right-4 rounded-full p-2 ${isDarkMode ? 'bg-black/70' : 'bg-white/90'}`}>
              <FaClock className="text-green-400" />
            </div>
            {/* <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl ${isDarkMode ? 'bg-black/40' : 'bg-white/70'}`}>
              <FaPlay className="text-green-400 text-3xl drop-shadow-lg" />
            </div> */}
            <h3 className="text-lg font-bold truncate">{song.title}</h3>
            <p className={`text-sm truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{song.artist}</p>
          </motion.div>
        ))}
      </div>
      
      {songs.length > 4 && (
        <div>
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <span>All Recently Played</span>
            <span className={`ml-2 text-sm px-2 py-1 rounded ${isDarkMode ? 'text-gray-400 bg-gray-800' : 'text-gray-600 bg-gray-200'}`}>
              {songs.length} songs
            </span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {songs.slice(4).map((song, index) => (
              <motion.div
                key={song._id || index + 4}
                className={`p-4 rounded-2xl hover:bg-opacity-80 cursor-pointer shadow-lg relative group overflow-hidden ${isDarkMode ? 'bg-gray-900/40 hover:bg-gray-800' : 'bg-white/80 hover:bg-gray-100'}`}
                whileHover={{ scale: 1.03 }}
                onClick={() => playContext(song, queue)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index + 4) * 0.05 }}
              >
                <img
                  src={buildImageUrl(song.coverArtPath)}
                  alt={song.title}
                  className="w-full h-44 object-cover rounded-xl mb-4"
                />
                {/* <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl ${isDarkMode ? 'bg-black/40' : 'bg-white/70'}`}>
                  <FaPlay className="text-green-400 text-3xl drop-shadow-lg" />
                </div> */}
                <h3 className="text-lg font-bold truncate">{song.title}</h3>
                <p className={`text-sm truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{song.artist}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ------------------ SONG LIST ------------------
const SongList = ({ songs, playContext, queue, isDarkMode }) => {
  if (!songs || songs.length === 0) return (
    <div className="text-center py-16">
      <FaMusic className={`text-5xl mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
      <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>No songs found</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {songs.map((song, index) => (
        <motion.div
          key={song._id || index}
          className={`p-4 rounded-2xl hover:bg-opacity-80 cursor-pointer shadow-lg relative group overflow-hidden ${isDarkMode ? 'bg-gray-900/40 hover:bg-gray-800' : 'bg-white/80 hover:bg-gray-100'}`}
          whileHover={{ scale: 1.03 }}
          onClick={() => playContext(song, queue)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <img
            src={buildImageUrl(song.coverArtPath)}
            alt={song.title}
            className="w-full h-44 object-cover rounded-xl mb-4"
          />
          {/* <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl ${isDarkMode ? 'bg-black/40' : 'bg-white/70'}`}>
            <FaPlay className="text-green-400 text-3xl drop-shadow-lg" />
          </div> */}
          <h3 className="text-lg font-bold truncate">{song.title}</h3>
          <p className={`text-sm truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{song.artist}</p>
        </motion.div>
      ))}
    </div>
  );
};

// ------------------ ALBUM / ARTIST LIST ------------------
const AlbumArtistList = ({ data, type, redirectBase, isDarkMode }) => {
  const entries = Object.entries(data);
  if (entries.length === 0) return (
    <div className="text-center py-16">
      {type === "Artist" ? (
        <>
          <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <span className="text-2xl">🎤</span>
          </div>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>No artists found</p>
        </>
      ) : (
        <>
          <div className={`w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <span className="text-2xl">🎵</span>
          </div>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>No albums found</p>
        </>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {entries.map(([name, item], index) => {
        // For artists, use a placeholder image instead of song cover
        const imageUrl = type === "Artist"
          ? `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=160`
          : buildImageUrl(item.cover);
          
        return (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              to={`${redirectBase}/${encodeURIComponent(name)}`}
              className="group relative flex flex-col items-center text-center transition-all duration-300"
            >
              <div className={`relative mb-3 ${type === "Artist" ? "w-36 h-36" : "w-full h-44"}`}>
                <img
                  src={imageUrl}
                  alt={name}
                  className={`object-cover shadow-lg ${type === "Artist" ? "w-full h-full rounded-full border-2 border-green-500" : "w-full h-full rounded-xl"}`}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-full">
                  {/* <button className="bg-green-500 p-3 rounded-full text-white hover:scale-110 transition-transform">
                    <FaPlay />
                  </button> */}
                </div>
              </div>
              <h3 className="font-bold truncate w-36">{name}</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {item.songs.length} {type.toLowerCase()}{item.songs.length !== 1 ? "s" : ""}
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {[...Array(10)].map((_, index) => (
        <div key={index} className={`p-4 rounded-2xl shadow-lg animate-pulse ${isDarkMode ? 'bg-gray-800/40' : 'bg-gray-200/40'}`}>
          <div className={`w-full h-44 rounded-xl mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          <div className={`h-4 rounded mb-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          <div className={`h-3 rounded w-2/3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
        </div>
      ))}
    </div>
  );
};

export default LibraryPage;
