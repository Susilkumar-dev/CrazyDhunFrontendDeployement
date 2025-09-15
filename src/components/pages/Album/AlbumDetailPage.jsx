



import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { PlayerContext } from "../../../context/PlayerContext";
import { useTheme } from "../../../context/ThemeContext";
import { FaPlay, FaClock, FaHeart, FaRandom, FaArrowLeft, FaMusic } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const buildImageUrl = (path) => {
  if (!path) return "https://via.placeholder.com/160";
  if (path.startsWith("http")) return path;
  return `${import.meta.env.VITE_API_URL}/${path.replace(/\\/g, "/")}`;
};

const AlbumDetailPage = () => {
  const { albumName } = useParams();
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [albumSongs, setAlbumSongs] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const { playSong, currentSong, isPlaying, likedSongs, toggleLike } = useContext(PlayerContext);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/public/songs`);
        setSongs(data);

        // filter album songs
        const albumTracks = data.filter((s) => s.album === albumName);
        setAlbumSongs(albumTracks);

        // recommended: same artist but different albums
        if (albumTracks.length > 0) {
          const artist = albumTracks[0].artist;
          const rec = data.filter(
            (s) => s.artist === artist && s.album !== albumName
          );
          setRecommended(rec.slice(0, 8)); // show max 8
        }
      } catch (err) {
        console.error("Error fetching songs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [albumName]);

  const handlePlayAlbum = () => {
    if (albumSongs.length > 0) {
      playSong(albumSongs[0], albumSongs);
      setIsPlayingAll(true);
    }
  };

  const handleShufflePlay = () => {
    if (albumSongs.length > 0) {
      const shuffledSongs = [...albumSongs].sort(() => Math.random() - 0.5);
      playSong(shuffledSongs[0], shuffledSongs);
      setIsPlayingAll(true);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="animate-pulse text-center">
          <div className={`w-32 h-32 rounded-lg mx-auto mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
          <div className={`h-6 w-48 rounded mx-auto mb-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
          <div className={`h-4 w-32 rounded mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
        </div>
      </div>
    );
  }

  if (albumSongs.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="text-center">
          <FaMusic className={`text-5xl mx-auto mb-4 ${isDarkMode ? 'text-gray-700' : 'text-gray-400'}`} />
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Album Not Found</h2>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            The album "{albumName}" doesn't exist or has no songs.
          </p>
          <button
            onClick={() => navigate(-1)}
            className={`mt-4 px-4 py-2 rounded-full ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'}`}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const album = albumSongs[0];
  const totalDuration = albumSongs.reduce((total, song) => total + (song.duration || 0), 0);
  const totalMinutes = Math.floor(totalDuration / 60);

  return (
    <div className={`min-h-screen pb-20 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900'}`}>
      {/* Header with Back Button */}
      <div className={`sticky top-0 z-10 ${isDarkMode ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-md p-4 flex items-center`}>
        <button
          onClick={() => navigate(-1)}
          className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
        >
          <FaArrowLeft />
        </button>
        <h1 className="ml-4 font-semibold truncate">{albumName}</h1>
      </div>

      {/* Album Hero Section */}
      <div className={`p-6 md:p-10 ${isDarkMode ? 'bg-gradient-to-t from-gray-900 to-gray-800/50' : 'bg-gradient-to-t from-white to-gray-100/50'}`}>
        <div className="flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group"
          >
            <img
              src={buildImageUrl(album.coverArtPath)}
              alt={albumName}
              className="w-48 h-48 md:w-60 md:h-60 object-cover rounded-xl shadow-2xl"
            />
            <div className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center transition-opacity ${isDarkMode ? 'bg-black/40' : 'bg-white/40'}`}>
              <button
                onClick={handlePlayAlbum}
                className="p-4 rounded-full bg-green-500 hover:bg-green-400 transition-colors"
              >
                <FaPlay className="text-white" />
              </button>
            </div>
          </motion.div>

          <div className="flex-1 text-center md:text-left">
            <p className="text-sm uppercase tracking-wider opacity-70">Album</p>
            <h1 className="text-4xl md:text-5xl font-bold mt-1 mb-4">{albumName}</h1>
            <div className="flex items-center justify-center md:justify-start space-x-4 text-sm opacity-80">
              <span className="flex items-center">
                <FaMusic className="mr-1" /> {albumSongs.length} songs
              </span>
              <span>•</span>
              <span>{totalMinutes} min</span>
              <span>•</span>
              <span>{album.artist}</span>
            </div>

            <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
              <button
                onClick={handlePlayAlbum}
                className="px-6 py-3 rounded-full bg-green-500 hover:bg-green-400 text-white font-medium flex items-center transition-colors"
              >
                <FaPlay className="mr-2" /> Play
              </button>
              <button
                onClick={handleShufflePlay}
                className="px-6 py-3 rounded-full border flex items-center transition-colors"
                style={{
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
                }}
              >
                <FaRandom className="mr-2" /> Shuffle
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Songs List */}
      <div className="p-6 md:p-10">
        <h2 className="text-2xl font-bold mb-6">Songs</h2>
        
        <div className={`rounded-xl overflow-hidden ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-md`}>
          <div className={`grid grid-cols-12 px-4 py-3 text-sm font-medium border-b ${isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
            <div className="col-span-1">#</div>
            <div className="col-span-6">Title</div>
            <div className="col-span-3">Album</div>
            <div className="col-span-2 flex justify-end">
              <FaClock />
            </div>
          </div>
          
          <AnimatePresence>
            {albumSongs.map((song, index) => (
              <motion.div
                key={song._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`grid grid-cols-12 px-4 py-3 items-center group hover:${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'} transition-colors ${
                  currentSong?._id === song._id ? (isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100/50') : ''
                }`}
              >
                <div className="col-span-1 text-gray-400 group-hover:hidden">
                  {index + 1}
                </div>
                <div className="col-span-1 hidden group-hover:block">
                  <button
                    onClick={() => playSong(song, albumSongs)}
                    className="text-white p-1 rounded-full bg-green-500 hover:bg-green-400 transition-colors"
                  >
                    <FaPlay size={10} />
                  </button>
                </div>
                
                <div className="col-span-6 flex items-center">
                  <img
                    src={buildImageUrl(song.coverArtPath)}
                    alt={song.title}
                    className="w-10 h-10 object-cover rounded mr-3"
                  />
                  <div>
                    <p className={`font-medium ${currentSong?._id === song._id ? 'text-green-500' : ''}`}>
                      {song.title}
                    </p>
                    <p className="text-sm opacity-70">{song.artist}</p>
                  </div>
                </div>
                
                <div className="col-span-3 text-sm opacity-70 truncate">
                  {song.album}
                </div>
                
                <div className="col-span-2 flex justify-end items-center space-x-3">
                  <button
                    onClick={() => toggleLike(song._id)}
                    className={`p-1 rounded-full transition-colors ${
                      likedSongs?.has(song._id) 
                        ? 'text-red-500 hover:text-red-400' 
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    <FaHeart />
                  </button>
                  <span className="text-sm opacity-70">
                    {formatDuration(song.duration)}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Recommended Albums */}
      {recommended.length > 0 && (
        <div className="p-6 md:p-10">
          <h2 className="text-2xl font-bold mb-6">More by {album.artist}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {recommended.map((song) => (
              <motion.div
                key={song._id}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
                onClick={() => navigate(`/dashboard/album/${song.album}`)}
              >
                <div className="relative mb-3">
                  <img
                    src={buildImageUrl(song.coverArtPath)}
                    alt={song.title}
                    className="w-full aspect-square object-cover rounded-xl shadow-lg"
                  />
                  <div className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center transition-opacity ${isDarkMode ? 'bg-black/40' : 'bg-white/40'}`}>
                    <button className="p-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors">
                      <FaPlay className="text-white" />
                    </button>
                  </div>
                </div>
                <p className="font-semibold truncate">{song.title}</p>
                <p className="text-sm opacity-70 truncate">{song.album}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumDetailPage;
