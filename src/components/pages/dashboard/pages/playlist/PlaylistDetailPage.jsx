




import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PlayerContext } from '../../../../../context/PlayerContext';
import { FaPlay, FaClock, FaRegClock, FaMusic } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTheme } from '../../../../../context/ThemeContext';

const buildImageUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/160';
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_URL}/${path.replace(/\\/g, '/')}`;
};

const PlaylistDetailPage = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
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
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return hours > 0 
      ? `${hours} hr ${minutes % 60} min` 
      : `${minutes} min`;
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-10">
      <div className="animate-pulse">
        <div className="flex flex-col md:flex-row items-center md:items-end mb-10">
          <div className="w-40 h-40 md:w-52 md:h-52 rounded-xl bg-gray-300 dark:bg-gray-700 mr-6 mb-4 md:mb-0"></div>
          <div>
            <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-12 w-64 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
  
  if (!playlist) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Playlist not found</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">The playlist you're looking for doesn't exist.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white p-6 md:p-10 transition-colors duration-300">
      {/* Playlist Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end mb-10">
        <motion.img
          src={buildImageUrl(playlist.coverArt)}
          alt={playlist.name}
          className="w-40 h-40 md:w-52 md:h-52 rounded-xl object-cover shadow-lg mr-6 mb-4 md:mb-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        />
        <div className="text-center md:text-left">
          <p className="text-sm uppercase tracking-wider text-green-600 dark:text-green-400 mb-1">Playlist</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2">{playlist.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {playlist.songs.length} songs • {formatDuration(totalDuration)}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
            <button 
              onClick={() => playlist.songs.length > 0 && playSong(playlist.songs[0], playlist.songs)}
              className="bg-green-500 dark:bg-green-600 text-white px-6 py-2 rounded-full flex items-center hover:bg-green-600 dark:hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={playlist.songs.length === 0}
            >
              <FaPlay className="mr-2" /> Play
            </button>
          </div>
        </div>
      </div>

      {/* Song List */}
      {playlist.songs.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            <FaMusic className="text-3xl text-gray-500 dark:text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">This playlist is empty</h2>
          <p className="text-gray-500 dark:text-gray-500">Add songs to your playlist to see them here</p>
        </div>
      ) : (
        <motion.div 
          className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-md overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Table Header */}
          <div className="grid grid-cols-[auto,1fr,auto] md:grid-cols-[auto,1fr,1fr,auto] gap-4 p-4 border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm font-medium">
            <div className="w-8">#</div>
            <div>Title</div>
            <div className="hidden md:block">Album</div>
            <div className="flex justify-end">
              <FaRegClock />
            </div>
          </div>
          
          {/* Song Items */}
          {playlist.songs.map((song, index) => {
            const isRecentlyPlayed = recentlyPlayed.some(rp => rp && rp.songId === song._id);
            
            return (
              <motion.div
                key={song._id}
                className="grid grid-cols-[auto,1fr,auto] md:grid-cols-[auto,1fr,1fr,auto] gap-4 p-4 items-center hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
                whileHover={{ x: 4 }}
                onClick={() => playSong(song, playlist.songs)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="w-8 text-gray-500 dark:text-gray-400 group-hover:hidden">
                  {index + 1}
                </div>
                <div className="hidden group-hover:block">
                  <FaPlay className="text-green-500 dark:text-green-400" />
                </div>
                
                <div className="flex items-center">
                  <img
                    src={buildImageUrl(song.coverArtPath)}
                    alt={song.title}
                    className="w-12 h-12 rounded-md object-cover mr-4 shadow-sm"
                  />
                  <div>
                    <h3 className="font-medium truncate">{song.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{song.artist}</p>
                  </div>
                </div>
                
                <div className="hidden md:block text-gray-600 dark:text-gray-400 text-sm truncate">
                  {song.album || 'Unknown Album'}
                </div>
                
                <div className="flex items-center justify-end text-gray-500 dark:text-gray-400 text-sm">
                  {isRecentlyPlayed && (
                    <FaClock className="text-green-500 dark:text-green-400 mr-2" title="Recently played" />
                  )}
                  {song.duration ? (
                    `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}`
                  ) : (
                    '--:--'
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default PlaylistDetailPage;
