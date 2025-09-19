




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash, FaSearch, FaMusic, FaTimes, FaEye, FaEyeSlash, FaFilter, FaSort } from 'react-icons/fa';
import { useTheme } from '../../../../../context/ThemeContext';

const AdminManageSongs = () => {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    artist: '',
    album: '',
    genre: '',
    status: ''
  });
  const [showFiltersMobile, setShowFiltersMobile] = useState(false); // New state for mobile filter visibility
  const { isDarkMode } = useTheme();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    language: '',
    tag: '',
    releaseDate: '',
    songFile: null,
    coverImage: null
  });

  // Fetch all songs
  const fetchSongs = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      };

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/public/songs`,
        config
      );
      setSongs(data);
      setFilteredSongs(data);
    } catch (error) {
      if (error.response?.status === 404) {
        setError('API endpoint not found. Please check your server configuration.');
      } else if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else {
        setError('Failed to fetch songs. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let results = songs;

    if (searchTerm) {
      results = results.filter(song =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.artist) {
      results = results.filter(song => song.artist === filters.artist);
    }

    if (filters.album) {
      results = results.filter(song => song.album === filters.album);
    }

    if (filters.genre) {
      results = results.filter(song => song.genre === filters.genre);
    }

    if (filters.status) {
      const isActive = filters.status === 'Active';
      results = results.filter(song => song.status === isActive);
    }

    setFilteredSongs(results);
  }, [searchTerm, filters, songs]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file inputs
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  // Update song
  const handleUpdateSong = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      };

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('artist', formData.artist);
      formDataToSend.append('album', formData.album);
      formDataToSend.append('genre', formData.genre);
      formDataToSend.append('language', formData.language);
      formDataToSend.append('tag', formData.tag);
      formDataToSend.append('releaseDate', formData.releaseDate);
      if (formData.songFile) formDataToSend.append('songFile', formData.songFile);
      if (formData.coverImage) formDataToSend.append('coverArt', formData.coverImage);

      try {
        await axios.put(`${import.meta.env.VITE_API_URL}/admin/songs/${selectedSong._id}`, formDataToSend, config);
      } catch (adminError) {
        await axios.put(`${import.meta.env.VITE_API_URL}/songs/${selectedSong._id}`, formDataToSend, config);
      }

      setMessage('Song updated successfully');
      setShowEditModal(false);
      setFormData({
        title: '',
        artist: '',
        album: '',
        genre: '',
        language: '',
        tag: '',
        releaseDate: '',
        songFile: null,
        coverImage: null
      });
      fetchSongs();
    } catch (error) {
      setError('Failed to update song. Please check your inputs and try again.');
      console.error('Error updating song:', error);
    }
  };

  // Delete song
  const handleDeleteSong = async () => {
    setMessage('');
    setError('');
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/admin/songs/${selectedSong._id}`, config);
      } catch (adminError) {
        await axios.delete(`${import.meta.env.VITE_API_URL}/songs/${selectedSong._id}`, config);
      }

      setMessage('Song deleted successfully');
      setShowDeleteModal(false);
      fetchSongs();
    } catch (error) {
      setError('Failed to delete song.');
      console.error('Error deleting song:', error);
    }
  };

  // Toggle song status
  const toggleSongStatus = async (song) => {
    setMessage('');
    setError('');
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/admin/songs/${song._id}/status`,
          { status: !song.status },
          config
        );
      } catch (adminError) {
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/songs/${song._id}/status`,
          { status: !song.status },
          config
        );
      }

      setMessage(`Song ${!song.status ? 'activated' : 'deactivated'} successfully`);
      fetchSongs();
    } catch (error) {
      console.error('Error toggling song status:', error);
      setError('Failed to update song status.');
    }
  };

  // Open edit modal and pre-fill form
  const openEditModal = (song) => {
    setSelectedSong(song);
    setFormData({
      title: song.title,
      artist: song.artist,
      album: song.album,
      genre: song.genre,
      language: song.language || '',
      tag: song.tag || '',
      releaseDate: song.releaseDate ? new Date(song.releaseDate).toISOString().split('T')[0] : '',
      songFile: null,
      coverImage: null
    });
    setShowEditModal(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (song) => {
    setSelectedSong(song);
    setShowDeleteModal(true);
  };

  // Get unique values for filter dropdowns
  const getUniqueValues = (key) => {
    return [...new Set(songs.map(song => song[key]))].filter(value => value);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <FaMusic className={`text-6xl mx-auto mb-4 animate-bounce ${isDarkMode ? 'text-green-500' : 'text-green-600'}`} />
          <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Loading your songs...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 md:p-6 lg:p-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8 text-center md:text-left">
          <h1 className={`text-3xl md:text-4xl font-extrabold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
            Manage Music Library
          </h1>
          <p className={`mt-2 text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Effortlessly oversee, edit, and curate all songs.
          </p>
        </div>

        {/* Messages */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-3 mb-4 md:mb-6 rounded-lg shadow-sm ${isDarkMode ? 'bg-green-800/40 text-green-200' : 'bg-green-100 text-green-800'}`}
            >
              {message}
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-3 mb-4 md:mb-6 rounded-lg shadow-sm ${isDarkMode ? 'bg-red-800/40 text-red-200' : 'bg-red-100 text-red-800'}`}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search & Filters */}
        <div className={`p-4 mb-4 md:mb-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
            <div className="relative w-full md:flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
              </div>
              <input
                type="text"
                placeholder="Search by title or artist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-3 py-2.5 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 ease-in-out ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className={`md:hidden flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 ease-in-out ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaFilter /> Filters
            </button>
          </div>

          <AnimatePresence>
            {(showFiltersMobile || window.innerWidth >= 768) && ( // Show filters on mobile if toggled, always on larger screens
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-3 md:mt-0">
                  <div>
                    <label htmlFor="artist-filter" className="sr-only">Filter by Artist</label>
                    <select
                      id="artist-filter"
                      value={filters.artist}
                      onChange={(e) => setFilters({...filters, artist: e.target.value})}
                      className={`w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 ease-in-out ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="">All Artists</option>
                      {getUniqueValues('artist').map(artist => (
                        <option key={artist} value={artist}>{artist}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="album-filter" className="sr-only">Filter by Album</label>
                    <select
                      id="album-filter"
                      value={filters.album}
                      onChange={(e) => setFilters({...filters, album: e.target.value})}
                      className={`w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 ease-in-out ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="">All Albums</option>
                      {getUniqueValues('album').map(album => (
                        <option key={album} value={album}>{album}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="genre-filter" className="sr-only">Filter by Genre</label>
                    <select
                      id="genre-filter"
                      value={filters.genre}
                      onChange={(e) => setFilters({...filters, genre: e.target.value})}
                      className={`w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 ease-in-out ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="">All Genres</option>
                      {getUniqueValues('genre').map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="status-filter" className="sr-only">Filter by Status</label>
                    <select
                      id="status-filter"
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                      className={`w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 ease-in-out ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Songs List/Table */}
        <div className={`rounded-xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="hidden lg:block"> {/* Desktop Table */}
            <table className="w-full text-left">
              <thead className={isDarkMode ? 'bg-gray-700 border-b border-gray-700' : 'bg-gray-100 border-b border-gray-200'}>
                <tr>
                  <th className="p-4 text-sm font-semibold tracking-wide">🎵 Title</th>
                  <th className="p-4 text-sm font-semibold tracking-wide">👤 Artist</th>
                  <th className="p-4 text-sm font-semibold tracking-wide">💿 Album</th>
                  <th className="p-4 text-sm font-semibold tracking-wide">🎶 Genre</th>
                  <th className="p-4 text-sm font-semibold tracking-wide">📅 Release Date</th>
                  <th className="p-4 text-sm font-semibold tracking-wide">📂 Status</th>
                  <th className="p-4 text-sm font-semibold tracking-wide">⚙️ Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSongs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-6 text-center text-gray-500">
                      No songs found. {songs.length === 0 ? 'Start by adding new songs!' : 'Try adjusting your search or filters.'}
                    </td>
                  </tr>
                ) : (
                  filteredSongs.map(song => (
                    <tr key={song._id} className={isDarkMode ? 'border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200' : 'border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200'}>
                      <td className="p-4 font-medium">{song.title}</td>
                      <td className="p-4 text-gray-400">{song.artist}</td>
                      <td className="p-4 text-gray-400">{song.album}</td>
                      <td className="p-4 text-gray-400">{song.genre}</td>
                      <td className="p-4 text-gray-400">{song.releaseDate ? new Date(song.releaseDate).toLocaleDateString() : 'N/A'}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          song.status
                            ? (isDarkMode ? 'bg-green-700 text-green-100' : 'bg-green-100 text-green-700')
                            : (isDarkMode ? 'bg-red-700 text-red-100' : 'bg-red-100 text-red-700')
                        }`}>
                          {song.status ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleSongStatus(song)}
                            className={`p-2 rounded-full text-lg transition-colors duration-200 ${
                              song.status
                                ? (isDarkMode ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-100')
                                : (isDarkMode ? 'text-green-400 hover:bg-green-900/30' : 'text-green-600 hover:bg-green-100')
                            }`}
                            title={song.status ? 'Deactivate' : 'Activate'}
                          >
                            {song.status ? <FaEyeSlash /> : <FaEye />}
                          </button>
                          <button
                            onClick={() => openEditModal(song)}
                            className={`p-2 rounded-full text-lg transition-colors duration-200 ${isDarkMode ? 'text-blue-400 hover:bg-blue-900/30' : 'text-blue-600 hover:bg-blue-100'}`}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => openDeleteModal(song)}
                            className={`p-2 rounded-full text-lg transition-colors duration-200 ${isDarkMode ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-100'}`}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="lg:hidden p-4 grid gap-4">
            {filteredSongs.length === 0 ? (
              <p className="p-6 text-center text-gray-500">
                No songs found. {songs.length === 0 ? 'Start by adding new songs!' : 'Try adjusting your search or filters.'}
              </p>
            ) : (
              filteredSongs.map(song => (
                <div key={song._id} className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border rounded-lg shadow-sm p-4 relative`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg">{song.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      song.status
                        ? (isDarkMode ? 'bg-green-700 text-green-100' : 'bg-green-100 text-green-700')
                        : (isDarkMode ? 'bg-red-700 text-red-100' : 'bg-red-100 text-red-700')
                    }`}>
                      {song.status ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm mb-1`}>
                    <span className="font-semibold">Artist:</span> {song.artist}
                  </p>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm mb-1`}>
                    <span className="font-semibold">Album:</span> {song.album}
                  </p>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm mb-1`}>
                    <span className="font-semibold">Genre:</span> {song.genre}
                  </p>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm mb-4`}>
                    <span className="font-semibold">Release:</span> {song.releaseDate ? new Date(song.releaseDate).toLocaleDateString() : 'N/A'}
                  </p>

                  <div className="flex justify-end space-x-2 border-t pt-3 mt-3">
                    <button
                      onClick={() => toggleSongStatus(song)}
                      className={`p-2 rounded-full text-lg transition-colors duration-200 ${
                        song.status
                          ? (isDarkMode ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-100')
                          : (isDarkMode ? 'text-green-400 hover:bg-green-900/30' : 'text-green-600 hover:bg-green-100')
                      }`}
                      title={song.status ? 'Deactivate' : 'Activate'}
                    >
                      {song.status ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    <button
                      onClick={() => openEditModal(song)}
                      className={`p-2 rounded-full text-lg transition-colors duration-200 ${isDarkMode ? 'text-blue-400 hover:bg-blue-900/30' : 'text-blue-600 hover:bg-blue-100'}`}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => openDeleteModal(song)}
                      className={`p-2 rounded-full text-lg transition-colors duration-200 ${isDarkMode ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-100'}`}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

{/* Edit Song Modal */}
{/* Edit Song Modal */}
<AnimatePresence>
  {showEditModal && (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        className={`rounded-xl w-full 
          max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 
          max-h-[85vh] overflow-y-auto ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}
      >
        <div className="p-3 sm:p-4 md:p-6">
          <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-6 border-b pb-2 sm:pb-3">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Edit Song</h2>
            <button
              onClick={() => setShowEditModal(false)}
              className={`p-1.5 sm:p-2 rounded-full transition-colors duration-200 ${
                isDarkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FaTimes className="text-lg sm:text-xl" />
            </button>
          </div>

          <form onSubmit={handleUpdateSong}>
            {/* === Title & Artist === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="title" className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Song Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label htmlFor="artist" className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Artist *
                </label>
                <input
                  type="text"
                  id="artist"
                  name="artist"
                  value={formData.artist}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>
            </div>

            {/* === Album & Genre === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="album" className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Album
                </label>
                <input
                  type="text"
                  id="album"
                  name="album"
                  value={formData.album}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label htmlFor="genre" className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Genre *
                </label>
                <select
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  className={`w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                  required
                >
                  <option value="">Select Genre</option>
                  <option value="Pop">Pop</option>
                  <option value="Rock">Rock</option>
                  <option value="Hip Hop">Hip Hop</option>
                  <option value="R&B">R&B</option>
                  <option value="Jazz">Jazz</option>
                  <option value="Classical">Classical</option>
                  <option value="Electronic">Electronic</option>
                  <option value="Folk">Folk</option>
                  <option value="Country">Country</option>
                  <option value="Reggae">Reggae</option>
                  <option value="Blues">Blues</option>
                  <option value="Metal">Metal</option>
                  <option value="Indie">Indie</option>
                  <option value="Lo-fi">Lo-fi</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* === Language & Tag === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="language" className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Language
                </label>
                <input
                  type="text"
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  placeholder="e.g. English, Spanish"
                  className={`w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label htmlFor="tag" className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Tag
                </label>
                <input
                  type="text"
                  id="tag"
                  name="tag"
                  value={formData.tag}
                  onChange={handleInputChange}
                  placeholder="e.g. Trending, New Release"
                  className={`w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            {/* === Release Date === */}
            <div className="mb-4">
              <label htmlFor="releaseDate" className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Release Date
              </label>
              <input
                type="date"
                id="releaseDate"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleInputChange}
                className={`w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
              />
            </div>

            {/* === Song File & Cover Image === */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 md:mb-6">
              <div>
                <label htmlFor="songFile" className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Song File (MP3/WAV)
                </label>
                <input
                  type="file"
                  id="songFile"
                  name="songFile"
                  onChange={handleFileChange}
                  accept=".mp3,.wav"
                  className={`w-full p-2.5 rounded-lg border file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white file:bg-green-700 file:text-white hover:file:bg-green-600'
                      : 'bg-gray-50 border-gray-300 text-gray-900 file:bg-green-500 file:text-white hover:file:bg-green-600'
                  }`}
                />
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Leave empty to keep current file
                </p>
              </div>

              <div>
                <label htmlFor="coverImage" className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Cover Image (JPG/PNG)
                </label>
                <input
                  type="file"
                  id="coverImage"
                  name="coverImage"
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png"
                  className={`w-full p-2.5 rounded-lg border file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white file:bg-green-700 file:text-white hover:file:bg-green-600'
                      : 'bg-gray-50 border-gray-300 text-gray-900 file:bg-green-500 file:text-white hover:file:bg-green-600'
                  }`}
                />
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Leave empty to keep current image
                </p>
              </div>
            </div>

            {/* === Buttons === */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 md:gap-4 pt-3 sm:pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors duration-200 font-semibold ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-300 hover:bg-gray-400 text-gray-900'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-white font-semibold transition-colors duration-200"
              >
                Update Song
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>


        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3 }}
                className={`rounded-xl max-w-md w-full p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
              >
                <h3 className="text-xl font-bold mb-4 border-b pb-3">Confirm Delete</h3>
                <p className="mb-6 text-gray-700 dark:text-gray-300">
                  Are you sure you want to delete the song "<span className="font-semibold">{selectedSong?.title}</span>" by <span className="font-semibold">{selectedSong?.artist}</span>? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3 md:space-x-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 font-semibold ${
                      isDarkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-300 hover:bg-gray-400 text-gray-900'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteSong}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white font-semibold transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminManageSongs;