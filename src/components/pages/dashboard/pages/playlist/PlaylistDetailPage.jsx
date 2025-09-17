



import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PlayerContext } from '../../../../../context/PlayerContext';
import { FaPlay, FaClock, FaRegClock, FaMusic, FaEllipsisH, FaHeart, FaShare, FaPlus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../../../context/ThemeContext';

const buildImageUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/160';
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_URL}/${path.replace(/\\/g, '/')}`;
};

const formatTime = (seconds) => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  return hours > 0
    ? `${hours} hr ${minutes % 60} min`
    : `${minutes} min`;
};

const PlaylistDetailPage = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const { playSong, recentlyPlayed = [] } = useContext(PlayerContext);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/user/playlists/${id}`, config);
        setPlaylist(data);
      } catch (error) {
        console.error("Failed to fetch playlist details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylist();
  }, [id]);

  // Calculate total duration
  const totalDuration = playlist?.songs.reduce((total, song) => total + (song.duration || 0), 0) || 0;

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 md:p-10">
      <div className="animate-pulse">
        <div className="flex flex-col md:flex-row items-center md:items-end mb-10">
          <div className="w-48 h-48 md:w-60 md:h-60 rounded-2xl bg-gradient-to-br from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-800 shadow-lg mr-6 mb-6 md:mb-0"></div>
          <div className="flex-1 text-center md:text-left">
            <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded-full mb-4"></div>
            <div className="h-12 w-80 bg-gray-300 dark:bg-gray-700 rounded-xl mb-4"></div>
            <div className="h-5 w-48 bg-gray-300 dark:bg-gray-700 rounded-full mb-4"></div>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700/60 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
  
  if (!playlist) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center max-w-md p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <FaMusic className="text-3xl text-red-500 dark:text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Playlist not found</h1>
        <p className="text-gray-600 dark:text-gray-400">The playlist you're looking for doesn't exist or may have been removed.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white p-6 md:p-10 transition-colors duration-300">
      {/* Playlist Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end mb-10">
        <motion.div
          className="relative mr-0 md:mr-8 mb-6 md:mb-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={imageError ? 'https://via.placeholder.com/300' : buildImageUrl(playlist.coverArt)}
            alt={playlist.name}
            className="w-48 h-48 md:w-60 md:h-60 rounded-2xl object-cover shadow-xl"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={() => playlist.songs.length > 0 && playSong(
                playlist.songs[0],
                playlist.songs,
                {type: 'Playlist', id: playlist._id, name: playlist.name}
              )}
              className="bg-green-500 text-white p-4 rounded-full hover:bg-green-600 hover:scale-110 transition-all duration-200 shadow-lg"
              disabled={playlist.songs.length === 0}
            >
              <FaPlay className="text-lg ml-1" />
            </button>
          </div>
        </motion.div>
        
        <div className="text-center md:text-left flex-1">
          <p className="text-xs uppercase tracking-widest text-green-600 dark:text-green-400 mb-2 font-semibold">Playlist</p>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {playlist.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm md:text-base">
            {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'} • {formatDuration(totalDuration)}
          </p>
          
          <div className="flex flex-wrap gap-3 justify-center md:justify-start items-center mt-6">
            <button
              onClick={() => playlist.songs.length > 0 && playSong(
                playlist.songs[0],
                playlist.songs,
                {type: 'Playlist', id: playlist._id, name: playlist.name}
              )}
              className="bg-green-500 dark:bg-green-600 text-white px-8 py-3 rounded-full flex items-center font-medium hover:bg-green-600 dark:hover:bg-green-500 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={playlist.songs.length === 0}
            >
              <FaPlay className="mr-2 text-sm" /> Play
            </button>
            
            <button className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              <FaHeart className="text-lg text-gray-600 dark:text-gray-300" />
            </button>
            
            <button className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              <FaShare className="text-lg text-gray-600 dark:text-gray-300" />
            </button>
            
            <button className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              <FaEllipsisH className="text-lg text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Song List */}
      {playlist.songs.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-white/70 dark:bg-gray-800/40 backdrop-blur-sm shadow-sm">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <FaMusic className="text-3xl text-gray-400 dark:text-gray-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-500 dark:text-gray-400 mb-2">This playlist is empty</h2>
          <p className="text-gray-400 dark:text-gray-500 mb-6">Add songs to your playlist to see them here</p>
          <button className="bg-green-500 dark:bg-green-600 text-white px-6 py-2 rounded-full flex items-center mx-auto font-medium hover:bg-green-600 dark:hover:bg-green-500 transition-all">
            <FaPlus className="mr-2 text-sm" /> Add Songs
          </button>
        </div>
      ) : (
        <motion.div
          className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Table Header */}
          <div className="grid grid-cols-[auto,1fr,auto] md:grid-cols-[auto,1fr,1fr,auto] gap-4 p-6 border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm font-medium">
            <div className="w-10 text-center">#</div>
            <div>Title</div>
            <div className="hidden md:block">Album</div>
            <div className="flex justify-end pr-4">
              <FaRegClock />
            </div>
          </div>
          
          {/* Song Items */}
          <AnimatePresence>
            {playlist.songs.map((song, index) => {
              const isRecentlyPlayed = recentlyPlayed.some(rp => rp && rp.songId === song._id);
              
              return (
                <motion.div
                  key={song._id}
                  className="grid grid-cols-[auto,1fr,auto] md:grid-cols-[auto,1fr,1fr,auto] gap-4 p-4 items-center hover:bg-gray-100/70 dark:hover:bg-gray-700/40 transition-all duration-200 cursor-pointer group relative"
                  whileHover={{ x: 4 }}
                  onClick={() => playSong(
                    song,
                    playlist.songs,
                    {type: 'Playlist', id: playlist._id, name: playlist.name}
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="w-10 text-center text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                    <span className="group-hover:hidden">{index + 1}</span>
                    <FaPlay className="hidden group-hover:block mx-auto text-green-500 dark:text-green-400 text-xs" />
                  </div>
                  
                  <div className="flex items-center min-w-0">
                    <img
                      src={buildImageUrl(song.coverArtPath)}
                      alt={song.title}
                      className="w-12 h-12 rounded-lg object-cover mr-4 shadow-sm flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="font-medium truncate text-gray-800 dark:text-gray-200">{song.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{song.artist}</p>
                    </div>
                  </div>
                  
                  <div className="hidden md:block text-gray-600 dark:text-gray-400 text-sm truncate min-w-0">
                    {song.album || 'Unknown Album'}
                  </div>
                  
                  <div className="flex items-center justify-end text-gray-500 dark:text-gray-400 text-sm pr-2">
                    {isRecentlyPlayed && (
                      <FaClock className="text-green-500 dark:text-green-400 mr-2 flex-shrink-0" title="Recently played" />
                    )}
                    <span className="text-xs font-medium">
                      {formatTime(song.duration)}
                    </span>
                  </div>
                  
                  {/* Hover action buttons */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-white dark:bg-gray-800 pl-2 rounded-lg">
                    <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400">
                      <FaHeart className="text-sm" />
                    </button>
                    <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                      <FaEllipsisH className="text-sm" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default PlaylistDetailPage;