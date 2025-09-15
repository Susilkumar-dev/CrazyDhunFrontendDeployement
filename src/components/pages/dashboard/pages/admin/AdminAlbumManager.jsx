import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaMusic, FaPlay, FaEdit, FaTimes, FaCheck } from 'react-icons/fa';
import { useTheme } from '../../../../../context/ThemeContext';

const buildImageUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/160';
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_URL}/${path.replace(/\\/g, '/')}`;
};

const AdminAlbumManager = () => {
  const [albums, setAlbums] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { isDarkMode } = useTheme();

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Fetch all songs
      const { data: songs } = await axios.get(`${import.meta.env.VITE_API_URL}/public/songs`, config);
      
      // Group songs by album
      const albumMap = {};
      songs.forEach(song => {
        if (!albumMap[song.album]) {
          albumMap[song.album] = {
            songs: [],
            cover: song.coverArtPath,
            artist: song.artist
          };
        }
        albumMap[song.album].songs.push(song);
      });
      
      setAlbums(albumMap);
    } catch (error) {
      setError('Failed to fetch albums');
      console.error('Error fetching albums:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlbum = async (albumName) => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Delete all songs in the album
      const albumSongs = albums[albumName].songs;
      for (const song of albumSongs) {
        await axios.delete(`${import.meta.env.VITE_API_URL}/admin/songs/${song._id}`, config);
      }
      
      setMessage(`Album "${albumName}" and all its songs have been deleted`);
      setDeleteConfirm(null);
      fetchAlbums(); // Refresh the list
    } catch (error) {
      setError('Failed to delete album');
      console.error('Error deleting album:', error);
    }
  };

  const handleDeleteSong = async (songId, songTitle) => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/songs/${songId}`, config);
      
      setMessage(`Song "${songTitle}" has been deleted`);
      fetchAlbums(); // Refresh the list
    } catch (error) {
      setError('Failed to delete song');
      console.error('Error deleting song:', error);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="animate-pulse text-center">
          <FaMusic className={`text-5xl mx-auto mb-4 ${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`} />
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading albums...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
          Album Management
        </h1>

        {message && (
          <div className={`p-3 mb-6 rounded-lg ${isDarkMode ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        {error && (
          <div className={`p-3 mb-6 rounded-lg ${isDarkMode ? 'bg-red-900/40 text-red-300' : 'bg-red-100 text-red-700'}`}>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(albums).map(([albumName, albumData]) => (
            <motion.div
              key={albumName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl overflow-hidden shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="relative group">
                <img
                  src={buildImageUrl(albumData.cover)}
                  alt={albumName}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => setSelectedAlbum(albumName)}
                    className="p-3 bg-green-500 rounded-full text-white mr-2"
                  >
                    <FaPlay />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(albumName)}
                    className="p-3 bg-red-500 rounded-full text-white"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg truncate">{albumName}</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {albumData.songs.length} songs • {albumData.artist}
                </p>
              </div>

              {/* Delete Confirmation Modal */}
              {deleteConfirm === albumName && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                  <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} max-w-md w-full mx-4`}>
                    <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
                    <p className="mb-6">Are you sure you want to delete the album "{albumName}" and all {albumData.songs.length} songs?</p>
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className={`px-4 py-2 rounded ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'}`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteAlbum(albumName)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Album Detail Modal */}
        {selectedAlbum && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className={`rounded-xl max-w-4xl w-full max-h-screen overflow-y-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">{selectedAlbum}</h2>
                  <button
                    onClick={() => setSelectedAlbum(null)}
                    className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="mb-6">
                  <img
                    src={buildImageUrl(albums[selectedAlbum].cover)}
                    alt={selectedAlbum}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Songs in this album:</h3>
                  {albums[selectedAlbum].songs.map((song) => (
                    <div
                      key={song._id}
                      className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                    >
                      <div className="flex items-center">
                        <img
                          src={buildImageUrl(song.coverArtPath)}
                          alt={song.title}
                          className="w-12 h-12 object-cover rounded mr-3"
                        />
                        <div>
                          <p className="font-medium">{song.title}</p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {song.artist}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteSong(song._id, song.title)}
                        className={`p-2 rounded-full ${isDarkMode ? 'text-red-400 hover:bg-gray-600' : 'text-red-500 hover:bg-gray-200'}`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAlbumManager;