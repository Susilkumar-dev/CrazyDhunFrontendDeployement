// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaEdit, FaTrash, FaPlus, FaSearch, FaMusic, FaTimes, FaCheck, FaEye, FaEyeSlash } from 'react-icons/fa';
// import { useTheme } from '../../../../../context/ThemeContext';

// const AdminManageSongs = () => {
//   const [songs, setSongs] = useState([]);
//   const [filteredSongs, setFilteredSongs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedSong, setSelectedSong] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filters, setFilters] = useState({
//     artist: '',
//     album: '',
//     genre: '',
//     status: ''
//   });
//   const { isDarkMode } = useTheme();

//   // Form state
//   const [formData, setFormData] = useState({
//     title: '',
//     artist: '',
//     album: '',
//     genre: '',
//     releaseDate: '',
//     songFile: null,
//     coverImage: null
//   });

//   // Fetch all songs
//   const fetchSongs = async () => {
//     try {
//       const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         }
//       };

//       // Use the public endpoint that works in AlbumManager
//       const { data } = await axios.get(
//         `${import.meta.env.VITE_API_URL}/public/songs`,
//         config
//       );
//       setSongs(data);
//       setFilteredSongs(data);
//     } catch (error) {
//       if (error.response?.status === 404) {
//         setError('API endpoint not found. Please check your server configuration.');
//       } else if (error.response?.status === 401) {
//         setError('Authentication failed. Please log in again.');
//       } else {
//         setError('Failed to fetch songs. Please try again later.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSongs();
//   }, []);

//   // Apply filters and search
//   useEffect(() => {
//     let results = songs;

//     // Apply search term
//     if (searchTerm) {
//       results = results.filter(song =>
//         song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         song.artist.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Apply filters
//     if (filters.artist) {
//       results = results.filter(song => song.artist === filters.artist);
//     }

//     if (filters.album) {
//       results = results.filter(song => song.album === filters.album);
//     }

//     if (filters.genre) {
//       results = results.filter(song => song.genre === filters.genre);
//     }

//     if (filters.status) {
//       const isActive = filters.status === 'Active';
//       results = results.filter(song => song.status === isActive);
//     }

//     setFilteredSongs(results);
//   }, [searchTerm, filters, songs]);

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Handle file inputs
//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: files[0]
//     }));
//   };

//   // Add new song
//   const handleAddSong = async (e) => {
//     e.preventDefault();
//     try {
//       const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
//       const config = {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`
//         }
//       };

//       const formDataToSend = new FormData();
//       formDataToSend.append('title', formData.title);
//       formDataToSend.append('artist', formData.artist);
//       formDataToSend.append('album', formData.album);
//       formDataToSend.append('genre', formData.genre);
//       formDataToSend.append('releaseDate', formData.releaseDate);
//       if (formData.songFile) formDataToSend.append('songFile', formData.songFile);
//       if (formData.coverImage) formDataToSend.append('coverArt', formData.coverImage);

//       // Try different endpoints if admin endpoint doesn't work
//       try {
//         await axios.post(`${import.meta.env.VITE_API_URL}/admin/songs`, formDataToSend, config);
//       } catch (adminError) {
//         // Fallback to regular songs endpoint if admin endpoint fails
//         await axios.post(`${import.meta.env.VITE_API_URL}/songs`, formDataToSend, config);
//       }

//       setMessage('Song added successfully');
//       setShowAddModal(false);
//       setFormData({
//         title: '',
//         artist: '',
//         album: '',
//         genre: '',
//         releaseDate: '',
//         songFile: null,
//         coverImage: null
//       });
//       fetchSongs(); // Refresh the list
//     } catch (error) {
//       setError('Failed to add song');
//       console.error('Error adding song:', error);
//     }
//   };

//   // Update song
//   const handleUpdateSong = async (e) => {
//     e.preventDefault();
//     try {
//       const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
//       const config = {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`
//         }
//       };

//       const formDataToSend = new FormData();
//       formDataToSend.append('title', formData.title);
//       formDataToSend.append('artist', formData.artist);
//       formDataToSend.append('album', formData.album);
//       formDataToSend.append('genre', formData.genre);
//       formDataToSend.append('releaseDate', formData.releaseDate);
//       if (formData.songFile) formDataToSend.append('songFile', formData.songFile);
//       if (formData.coverImage) formDataToSend.append('coverArt', formData.coverImage);

//       // Try different endpoints if admin endpoint doesn't work
//       try {
//         await axios.put(`${import.meta.env.VITE_API_URL}/admin/songs/${selectedSong._id}`, formDataToSend, config);
//       } catch (adminError) {
//         // Fallback to regular songs endpoint if admin endpoint fails
//         await axios.put(`${import.meta.env.VITE_API_URL}/songs/${selectedSong._id}`, formDataToSend, config);
//       }

//       setMessage('Song updated successfully');
//       setShowEditModal(false);
//       setFormData({
//         title: '',
//         artist: '',
//         album: '',
//         genre: '',
//         releaseDate: '',
//         songFile: null,
//         coverImage: null
//       });
//       fetchSongs(); // Refresh the list
//     } catch (error) {
//       setError('Failed to update song');
//       console.error('Error updating song:', error);
//     }
//   };

//   // Delete song
//   const handleDeleteSong = async () => {
//     try {
//       const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
//       const config = { headers: { Authorization: `Bearer ${token}` } };

//       // Try different endpoints if admin endpoint doesn't work
//       try {
//         await axios.delete(`${import.meta.env.VITE_API_URL}/admin/songs/${selectedSong._id}`, config);
//       } catch (adminError) {
//         // Fallback to regular songs endpoint if admin endpoint fails
//         await axios.delete(`${import.meta.env.VITE_API_URL}/songs/${selectedSong._id}`, config);
//       }

//       setMessage('Song deleted successfully');
//       setShowDeleteModal(false);
//       fetchSongs(); // Refresh the list
//     } catch (error) {
//       setError('Failed to delete song');
//       console.error('Error deleting song:', error);
//     }
//   };

//   // Toggle song status
//   const toggleSongStatus = async (song) => {
//     try {
//       const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
//       const config = { headers: { Authorization: `Bearer ${token}` } };

//       // Try different endpoints if admin endpoint doesn't work
//       try {
//         await axios.patch(
//           `${import.meta.env.VITE_API_URL}/admin/songs/${song._id}/status`,
//           { status: !song.status },
//           config
//         );
//       } catch (adminError) {
//         // Fallback to regular songs endpoint if admin endpoint fails
//         await axios.patch(
//           `${import.meta.env.VITE_API_URL}/songs/${song._id}/status`,
//           { status: !song.status },
//           config
//         );
//       }

//       setMessage(`Song ${!song.status ? 'activated' : 'deactivated'} successfully`);
//       fetchSongs(); // Refresh the list
//     } catch (error) {
//       console.error('Error toggling song status:', error);
//       setError('Failed to update song status');
//     }
//   };

//   // Open edit modal and pre-fill form
//   const openEditModal = (song) => {
//     setSelectedSong(song);
//     setFormData({
//       title: song.title,
//       artist: song.artist,
//       album: song.album,
//       genre: song.genre,
//       releaseDate: song.releaseDate ? new Date(song.releaseDate).toISOString().split('T')[0] : '',
//       songFile: null,
//       coverImage: null
//     });
//     setShowEditModal(true);
//   };

//   // Open delete confirmation modal
//   const openDeleteModal = (song) => {
//     setSelectedSong(song);
//     setShowDeleteModal(true);
//   };

//   // Get unique values for filter dropdowns
//   const getUniqueValues = (key) => {
//     return [...new Set(songs.map(song => song[key]))].filter(value => value);
//   };

//   if (loading) {
//     return (
//       <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
//         <div className="animate-pulse text-center">
//           <FaMusic className={`text-5xl mx-auto mb-4 ${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`} />
//           <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading songs...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
//             Manage Songs
//           </h1>
//           <button
//             onClick={() => setShowAddModal(true)}
//             className={`flex items-center px-4 py-2 rounded-lg ${
//               isDarkMode
//                 ? 'bg-green-600 hover:bg-green-700 text-white'
//                 : 'bg-green-500 hover:bg-green-600 text-white'
//             }`}
//           >
//             <FaPlus className="mr-2" /> Add New Song
//           </button>
//         </div>

//         {/* Messages */}
//         {message && (
//           <div className={`p-3 mb-6 rounded-lg ${isDarkMode ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-700'}`}>
//             {message}
//           </div>
//         )}

//         {error && (
//           <div className={`p-3 mb-6 rounded-lg ${isDarkMode ? 'bg-red-900/40 text-red-300' : 'bg-red-100 text-red-700'}`}>
//             {error}
//           </div>
//         )}

//         {/* Search & Filters */}
//         <div className={`p-4 mb-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
//           <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//             <div className="md:col-span-2">
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <FaSearch className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search by title or artist..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
//                     isDarkMode
//                       ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
//                       : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
//                   }`}
//                 />
//               </div>
//             </div>

//             <div>
//               <select
//                 value={filters.artist}
//                 onChange={(e) => setFilters({...filters, artist: e.target.value})}
//                 className={`w-full p-2 rounded-lg border ${
//                   isDarkMode
//                     ? 'bg-gray-700 border-gray-600 text-white'
//                     : 'bg-white border-gray-300 text-gray-900'
//                 }`}
//               >
//                 <option value="">All Artists</option>
//                 {getUniqueValues('artist').map(artist => (
//                   <option key={artist} value={artist}>{artist}</option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <select
//                 value={filters.album}
//                 onChange={(e) => setFilters({...filters, album: e.target.value})}
//                 className={`w-full p-2 rounded-lg border ${
//                   isDarkMode
//                     ? 'bg-gray-700 border-gray-600 text-white'
//                     : 'bg-white border-gray-300 text-gray-900'
//                 }`}
//               >
//                 <option value="">All Albums</option>
//                 {getUniqueValues('album').map(album => (
//                   <option key={album} value={album}>{album}</option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <select
//                 value={filters.genre}
//                 onChange={(e) => setFilters({...filters, genre: e.target.value})}
//                 className={`w-full p-2 rounded-lg border ${
//                   isDarkMode
//                     ? 'bg-gray-700 border-gray-600 text-white'
//                     : 'bg-white border-gray-300 text-gray-900'
//                 }`}
//               >
//                 <option value="">All Genres</option>
//                 {getUniqueValues('genre').map(genre => (
//                   <option key={genre} value={genre}>{genre}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="mt-4">
//             <select
//               value={filters.status}
//               onChange={(e) => setFilters({...filters, status: e.target.value})}
//               className={`w-full md:w-auto p-2 rounded-lg border ${
//                 isDarkMode
//                   ? 'bg-gray-700 border-gray-600 text-white'
//                   : 'bg-white border-gray-300 text-gray-900'
//               }`}
//             >
//               <option value="">All Status</option>
//               <option value="Active">Active</option>
//               <option value="Inactive">Inactive</option>
//             </select>
//           </div>
//         </div>

//         {/* Songs Table */}
//         <div className={`rounded-xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
//           <table className="w-full">
//             <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}>
//               <tr>
//                 <th className="p-3 text-left">🎵 Title</th>
//                 <th className="p-3 text-left">👤 Artist</th>
//                 <th className="p-3 text-left">💿 Album</th>
//                 <th className="p-3 text-left">🎶 Genre</th>
//                 <th className="p-3 text-left">📅 Release Date</th>
//                 <th className="p-3 text-left">📂 Status</th>
//                 <th className="p-3 text-left">⚙️ Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredSongs.length === 0 ? (
//                 <tr>
//                   <td colSpan="7" className="p-6 text-center">
//                     No songs found. {songs.length === 0 ? 'Add your first song!' : 'Try changing your search or filters.'}
//                   </td>
//                 </tr>
//               ) : (
//                 filteredSongs.map(song => (
//                   <tr key={song._id} className={isDarkMode ? 'border-b border-gray-700 hover:bg-gray-700' : 'border-b border-gray-200 hover:bg-gray-50'}>
//                     <td className="p-3">{song.title}</td>
//                     <td className="p-3">{song.artist}</td>
//                     <td className="p-3">{song.album}</td>
//                     <td className="p-3">{song.genre}</td>
//                     <td className="p-3">{song.releaseDate ? new Date(song.releaseDate).toLocaleDateString() : 'N/A'}</td>
//                     <td className="p-3">
//                       <span className={`px-2 py-1 rounded-full text-xs ${
//                         song.status
//                           ? (isDarkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800')
//                           : (isDarkMode ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800')
//                       }`}>
//                         {song.status ? 'Active' : 'Inactive'}
//                       </span>
//                     </td>
//                     <td className="p-3">
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => toggleSongStatus(song)}
//                           className={`p-2 rounded-full ${
//                             song.status
//                               ? (isDarkMode ? 'text-red-400 hover:bg-red-900/30' : 'text-red-500 hover:bg-red-100')
//                               : (isDarkMode ? 'text-green-400 hover:bg-green-900/30' : 'text-green-500 hover:bg-green-100')
//                           }`}
//                           title={song.status ? 'Deactivate' : 'Activate'}
//                         >
//                           {song.status ? <FaEyeSlash /> : <FaEye />}
//                         </button>
//                         <button
//                           onClick={() => openEditModal(song)}
//                           className={`p-2 rounded-full ${isDarkMode ? 'text-blue-400 hover:bg-blue-900/30' : 'text-blue-500 hover:bg-blue-100'}`}
//                           title="Edit"
//                         >
//                           <FaEdit />
//                         </button>
//                         <button
//                           onClick={() => openDeleteModal(song)}
//                           className={`p-2 rounded-full ${isDarkMode ? 'text-red-400 hover:bg-red-900/30' : 'text-red-500 hover:bg-red-100'}`}
//                           title="Delete"
//                         >
//                           <FaTrash />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Add Song Modal */}
//         <AnimatePresence>
//           {showAddModal && (
//             <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 className={`rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
//               >
//                 <div className="p-6">
//                   <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold">Add New Song</h2>
//                     <button
//                       onClick={() => setShowAddModal(false)}
//                       className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
//                     >
//                       <FaTimes />
//                     </button>
//                   </div>

//                   <form onSubmit={handleAddSong}>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                       <div>
//                         <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                           Song Title *
//                         </label>
//                         <input
//                           type="text"
//                           name="title"
//                           value={formData.title}
//                           onChange={handleInputChange}
//                           className={`w-full p-3 rounded-lg border ${
//                             isDarkMode
//                               ? 'bg-gray-700 border-gray-600 text-white'
//                               : 'bg-white border-gray-300 text-gray-900'
//                           }`}
//                           required
//                         />
//                       </div>

//                       <div>
//                         <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                           Artist *
//                         </label>
//                         <input
//                           type="text"
//                           name="artist"
//                           value={formData.artist}
//                           onChange={handleInputChange}
//                           className={`w-full p-3 rounded-lg border ${
//                             isDarkMode
//                               ? 'bg-gray-700 border-gray-600 text-white'
//                               : 'bg-white border-gray-300 text-gray-900'
//                           }`}
//                           required
//                         />
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                       <div>
//                         <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                           Album
//                         </label>
//                         <input
//                           type="text"
//                           name="album"
//                           value={formData.album}
//                           onChange={handleInputChange}
//                           className={`w-full p-3 rounded-lg border ${
//                             isDarkMode
//                               ? 'bg-gray-700 border-gray-600 text-white'
//                               : 'bg-white border-gray-300 text-gray-900'
//                           }`}
//                         />
//                       </div>

//                       <div>
//                         <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                           Genre *
//                         </label>
//                         <select
//                           name="genre"
//                           value={formData.genre}
//                           onChange={handleInputChange}
//                           className={`w-full p-3 rounded-lg border ${
//                             isDarkMode
//                               ? 'bg-gray-700 border-gray-600 text-white'
//                               : 'bg-white border-gray-300 text-gray-900'
//                           }`}
//                           required
//                         >
//                           <option value="">Select Genre</option>
//                           <option value="Pop">Pop</option>
//                           <option value="Rock">Rock</option>
//                           <option value="Hip Hop">Hip Hop</option>
//                           <option value="R&B">R&B</option>
//                           <option value="Jazz">Jazz</option>
//                           <option value="Classical">Classical</option>
//                           <option value="Electronic">Electronic</option>
//                           <option value="Folk">Folk</option>
//                           <option value="Country">Country</option>
//                           <option value="Reggae">Reggae</option>
//                           <option value="Blues">Blues</option>
//                           <option value="Metal">Metal</option>
//                           <option value="Indie">Indie</option>
//                           <option value="Lo-fi">Lo-fi</option>
//                           <option value="Other">Other</option>
//                         </select>
//                       </div>
//                     </div>

//                     <div className="mb-4">
//                       <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                         Release Date
//                       </label>
//                       <input
//                         type="date"
//                         name="releaseDate"
//                         value={formData.releaseDate}
//                         onChange={handleInputChange}
//                         className={`w-full p-3 rounded-lg border ${
//                           isDarkMode
//                             ? 'bg-gray-700 border-gray-600 text-white'
//                             : 'bg-white border-gray-300 text-gray-900'
//                         }`}
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                       <div>
//                         <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                           Song File (MP3/WAV) *
//                         </label>
//                         <input
//                           type="file"
//                           name="songFile"
//                           onChange={handleFileChange}
//                           accept=".mp3,.wav"
//                           className={`w-full p-3 rounded-lg border ${
//                             isDarkMode
//                               ? 'bg-gray-700 border-gray-600 text-white'
//                               : 'bg-white border-gray-300 text-gray-900'
//                           }`}
//                           required
//                         />
//                       </div>

//                       <div>
//                         <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                           Cover Image (JPG/PNG)
//                         </label>
//                         <input
//                           type="file"
//                           name="coverImage"
//                           onChange={handleFileChange}
//                           accept=".jpg,.jpeg,.png"
//                           className={`w-full p-3 rounded-lg border ${
//                             isDarkMode
//                               ? 'bg-gray-700 border-gray-600 text-white'
//                               : 'bg-white border-gray-300 text-gray-900'
//                           }`}
//                         />
//                       </div>
//                     </div>

//                     <div className="flex justify-end space-x-4">
//                       <button
//                         type="button"
//                         onClick={() => setShowAddModal(false)}
//                         className={`px-4 py-2 rounded-lg ${
//                           isDarkMode
//                             ? 'bg-gray-700 hover:bg-gray-600 text-white'
//                             : 'bg-gray-300 hover:bg-gray-400 text-gray-900'
//                         }`}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="submit"
//                         className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
//                       >
//                         Save Song
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </motion.div>
//             </div>
//           )}
//         </AnimatePresence>

//         {/* Edit Song Modal */}
//         <AnimatePresence>
//           {showEditModal && (
//             <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 className={`rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
//               >
//                 <div className="p-6">
//                   <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold">Edit Song</h2>
//                     <button
//                       onClick={() => setShowEditModal(false)}
//                       className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
//                     >
//                       <FaTimes />
//                     </button>
//                   </div>

//                   <form onSubmit={handleUpdateSong}>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                       <div>
//                         <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                           Song Title *
//                         </label>
//                         <input
//                           type="text"
//                           name="title"
//                           value={formData.title}
//                           onChange={handleInputChange}
//                           className={`w-full p-3 rounded-lg border ${
//                             isDarkMode
//                               ? 'bg-gray-700 border-gray-600 text-white'
//                               : 'bg-white border-gray-300 text-gray-900'
//                           }`}
//                           required
//                         />
//                       </div>

//                       <div>
//                         <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                           Artist *
//                         </label>
//                         <input
//                           type="text"
//                           name="artist"
//                           value={formData.artist}
//                           onChange={handleInputChange}
//                           className={`w-full p-3 rounded-lg border ${
//                             isDarkMode
//                               ? 'bg-gray-700 border-gray-600 text-white'
//                               : 'bg-white border-gray-300 text-gray-900'
//                           }`}
//                           required
//                         />
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                       <div>
//                         <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                           Album
//                         </label>
//                         <input
//                           type="text"
//                           name="album"
//                           value={formData.album}
//                           onChange={handleInputChange}
//                           className={`w-full p-3 rounded-lg border ${
//                             isDarkMode
//                               ? 'bg-gray-700 border-gray-600 text-white'
//                               : 'bg-white border-gray-300 text-gray-900'
//                           }`}
//                         />
//                       </div>

//                       <div>
//                         <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                           Genre *
//                         </label>
//                         <select
//                           name="genre"
//                           value={formData.genre}
//                           onChange={handleInputChange}
//                           className={`w-full p-3 rounded-lg border ${
//                             isDarkMode
//                               ? 'bg-gray-700 border-gray-600 text-white'
//                               : 'bg-white border-gray-300 text-gray-900'
//                           }`}
//                           required
//                         >
//                           <option value="">Select Genre</option>
//                           <option value="Pop">Pop</option>
//                           <option value="Rock">Rock</option>
//                           <option value="Hip Hop">Hip Hop</option>
//                           <option value="R&B">R&B</option>
//                           <option value="Jazz">Jazz</option>
//                           <option value="Classical">Classical</option>
//                           <option value="Electronic">Electronic</option>
//                           <option value="Folk">Folk</option>
//                           <option value="Country">Country</option>
//                           <option value="Reggae">Reggae</option>
//                           <option value="Blues">Blues</option>
//                           <option value="Metal">Metal</option>
//                           <option value="Indie">Indie</option>
//                           <option value="Lo-fi">Lo-fi</option>
//                           <option value="Other">Other</option>
//                         </select>
//                       </div>
//                     </div>

//                     <div className="mb-4">
//                       <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                         Release Date
//                       </label>
//                       <input
//                         type="date"
//                         name="releaseDate"
//                         value={formData.releaseDate}
//                         onChange={handleInputChange}
//                         className={`w-full p-3 rounded-lg border ${
//                           isDarkMode
//                             ? 'bg-gray-700 border-gray-600 text-white'
//                             : 'bg-white border-gray-300 text-gray-900'
//                         }`}
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                       <div>
//                         <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                           Song File (MP3/WAV)
//                         </label>
//                         <input
//                           type="file"
//                           name="songFile"
//                           onChange={handleFileChange}
//                           accept=".mp3,.wav"
//                           className={`w-full p-3 rounded-lg border ${
//                             isDarkMode
//                               ? 'bg-gray-700 border-gray-600 text-white'
//                               : 'bg-white border-gray-300 text-gray-900'
//                           }`}
//                         />
//                         <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//                           Leave empty to keep current file
//                         </p>
//                       </div>

//                       <div>
//                         <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                           Cover Image (JPG/PNG)
//                         </label>
//                         <input
//                           type="file"
//                           name="coverImage"
//                           onChange={handleFileChange}
//                           accept=".jpg,.jpeg,.png"
//                           className={`w-full p-3 rounded-lg border ${
//                             isDarkMode
//                               ? 'bg-gray-700 border-gray-600 text-white'
//                               : 'bg-white border-gray-300 text-gray-900'
//                           }`}
//                         />
//                         <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//                           Leave empty to keep current image
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex justify-end space-x-4">
//                       <button
//                         type="button"
//                         onClick={() => setShowEditModal(false)}
//                         className={`px-4 py-2 rounded-lg ${
//                           isDarkMode
//                             ? 'bg-gray-700 hover:bg-gray-600 text-white'
//                             : 'bg-gray-300 hover:bg-gray-400 text-gray-900'
//                         }`}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="submit"
//                         className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
//                       >
//                         Update Song
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </motion.div>
//             </div>
//           )}
//         </AnimatePresence>

//         {/* Delete Confirmation Modal */}
//         <AnimatePresence>
//           {showDeleteModal && (
//             <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 className={`rounded-xl max-w-md w-full p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
//               >
//                 <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
//                 <p className="mb-6">
//                   Are you sure you want to delete the song "{selectedSong?.title}" by {selectedSong?.artist}?
//                 </p>
//                 <div className="flex justify-end space-x-4">
//                   <button
//                     onClick={() => setShowDeleteModal(false)}
//                     className={`px-4 py-2 rounded-lg ${
//                       isDarkMode
//                         ? 'bg-gray-700 hover:bg-gray-600 text-white'
//                         : 'bg-gray-300 hover:bg-gray-400 text-gray-900'
//                     }`}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleDeleteSong}
//                     className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </motion.div>
//             </div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default AdminManageSongs;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaMusic,
  FaTimes,
  FaCheck,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useTheme } from "../../../../../context/ThemeContext";

const AdminManageSongs = () => {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    artist: "",
    album: "",
    genre: "",
    status: "",
  });
  const { isDarkMode } = useTheme();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    album: "",
    genre: "",
    releaseDate: "",
    language: "",
    tags: "",
    songFile: null,
    coverImage: null,
  });

  // Fetch all songs
  const fetchSongs = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Use the public endpoint that works in AlbumManager
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/public/songs`,
        config
      );
      setSongs(data);
      setFilteredSongs(data);
    } catch (error) {
      if (error.response?.status === 404) {
        setError(
          "API endpoint not found. Please check your server configuration."
        );
      } else if (error.response?.status === 401) {
        setError("Authentication failed. Please log in again.");
      } else {
        setError("Failed to fetch songs. Please try again later.");
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

    // Apply search term
    if (searchTerm) {
      results = results.filter(
        (song) =>
          song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          song.artist.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.artist) {
      results = results.filter((song) => song.artist === filters.artist);
    }

    if (filters.album) {
      results = results.filter((song) => song.album === filters.album);
    }

    if (filters.genre) {
      results = results.filter((song) => song.genre === filters.genre);
    }

    if (filters.status) {
      const isActive = filters.status === "Active";
      results = results.filter((song) => song.status === isActive);
    }

    setFilteredSongs(results);
  }, [searchTerm, filters, songs]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file inputs
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  // Add new song
  const handleAddSong = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("artist", formData.artist);
      formDataToSend.append("album", formData.album);
      formDataToSend.append("genre", formData.genre);
      formDataToSend.append("releaseDate", formData.releaseDate);
      formDataToSend.append("language", formData.language);
      formDataToSend.append("tags", formData.tags);
      if (formData.songFile)
        formDataToSend.append("songFile", formData.songFile);
      if (formData.coverImage)
        formDataToSend.append("coverArt", formData.coverImage);

      // Try different endpoints if admin endpoint doesn't work
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/admin/songs`,
          formDataToSend,
          config
        );
      } catch (adminError) {
        // Fallback to regular songs endpoint if admin endpoint fails
        await axios.post(
          `${import.meta.env.VITE_API_URL}/songs`,
          formDataToSend,
          config
        );
      }

      setMessage("Song added successfully");
      setShowAddModal(false);
      setFormData({
        title: "",
        artist: "",
        album: "",
        genre: "",
        releaseDate: "",
        language: "",
        tags: "",
        songFile: null,
        coverImage: null,
      });
      fetchSongs(); // Refresh the list
    } catch (error) {
      setError("Failed to add song");
      console.error("Error adding song:", error);
    }
  };

  // Update song
  const handleUpdateSong = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("artist", formData.artist);
      formDataToSend.append("album", formData.album);
      formDataToSend.append("genre", formData.genre);
      formDataToSend.append("releaseDate", formData.releaseDate);
      formDataToSend.append("language", formData.language);
      formDataToSend.append("tags", formData.tags);
      if (formData.songFile)
        formDataToSend.append("songFile", formData.songFile);
      if (formData.coverImage)
        formDataToSend.append("coverArt", formData.coverImage);

      // Try different endpoints if admin endpoint doesn't work
      try {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/admin/songs/${selectedSong._id}`,
          formDataToSend,
          config
        );
      } catch (adminError) {
        // Fallback to regular songs endpoint if admin endpoint fails
        await axios.put(
          `${import.meta.env.VITE_API_URL}/songs/${selectedSong._id}`,
          formDataToSend,
          config
        );
      }

      setMessage("Song updated successfully");
      setShowEditModal(false);
      setFormData({
        title: "",
        artist: "",
        album: "",
        genre: "",
        releaseDate: "",
        language: "",
        tags: "",
        songFile: null,
        coverImage: null,
      });
      fetchSongs(); // Refresh the list
    } catch (error) {
      setError("Failed to update song");
      console.error("Error updating song:", error);
    }
  };
  // Delete song
  const handleDeleteSong = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Try different endpoints if admin endpoint doesn't work
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/admin/songs/${selectedSong._id}`,
          config
        );
      } catch (adminError) {
        // Fallback to regular songs endpoint if admin endpoint fails
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/songs/${selectedSong._id}`,
          config
        );
      }

      setMessage("Song deleted successfully");
      setShowDeleteModal(false);
      fetchSongs(); // Refresh the list
    } catch (error) {
      setError("Failed to delete song");
      console.error("Error deleting song:", error);
    }
  };

  // Toggle song status
  const toggleSongStatus = async (song) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Try different endpoints if admin endpoint doesn't work
      try {
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/admin/songs/${song._id}/status`,
          { status: !song.status },
          config
        );
      } catch (adminError) {
        // Fallback to regular songs endpoint if admin endpoint fails
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/songs/${song._id}/status`,
          { status: !song.status },
          config
        );
      }

      setMessage(
        `Song ${!song.status ? "activated" : "deactivated"} successfully`
      );
      fetchSongs(); // Refresh the list
    } catch (error) {
      console.error("Error toggling song status:", error);
      setError("Failed to update song status");
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
      releaseDate: song.releaseDate
        ? new Date(song.releaseDate).toISOString().split("T")[0]
        : "",
      songFile: null,
      coverImage: null,
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
    return [...new Set(songs.map((song) => song[key]))].filter(
      (value) => value
    );
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <div className="animate-pulse text-center">
          <FaMusic
            className={`text-5xl mx-auto mb-4 ${
              isDarkMode ? "text-gray-700" : "text-gray-300"
            }`}
          />
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            Loading songs...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-4 md:p-6 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1
            className={`text-2xl sm:text-3xl font-bold ${
              isDarkMode ? "text-green-400" : "text-green-600"
            }`}
          >
            Manage Songs
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className={`flex items-center px-4 py-2 rounded-lg w-full sm:w-auto justify-center ${
              isDarkMode
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            <FaPlus className="mr-2" /> Add New Song
          </button>
        </div>

        {/* Messages */}
        {message && (
          <div
            className={`p-3 mb-6 rounded-lg ${
              isDarkMode
                ? "bg-green-900/40 text-green-300"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            className={`p-3 mb-6 rounded-lg ${
              isDarkMode
                ? "bg-red-900/40 text-red-300"
                : "bg-red-100 text-red-700"
            }`}
          >
            {error}
          </div>
        )}

        {/* Search & Filters */}
        <div
          className={`p-4 mb-6 rounded-xl ${
            isDarkMode ? "bg-gray-800" : "bg-white shadow-md"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaSearch
                    className={isDarkMode ? "text-gray-400" : "text-gray-500"}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search by title or artist..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>
            </div>

            <div>
              <select
                value={filters.artist}
                onChange={(e) =>
                  setFilters({ ...filters, artist: e.target.value })
                }
                className={`w-full p-2 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="">All Artists</option>
                {getUniqueValues("artist").map((artist) => (
                  <option key={artist} value={artist}>
                    {artist}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={filters.album}
                onChange={(e) =>
                  setFilters({ ...filters, album: e.target.value })
                }
                className={`w-full p-2 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="">All Albums</option>
                {getUniqueValues("album").map((album) => (
                  <option key={album} value={album}>
                    {album}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={filters.genre}
                onChange={(e) =>
                  setFilters({ ...filters, genre: e.target.value })
                }
                className={`w-full p-2 rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="">All Genres</option>
                {getUniqueValues("genre").map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className={`w-full md:w-auto p-2 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Songs Table - Mobile Card View */}
        <div className="block md:hidden">
          {filteredSongs.length === 0 ? (
            <div
              className={`p-6 text-center rounded-xl ${
                isDarkMode ? "bg-gray-800" : "bg-white shadow-md"
              }`}
            >
              No songs found.{" "}
              {songs.length === 0
                ? "Add your first song!"
                : "Try changing your search or filters."}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSongs.map((song) => (
                <div
                  key={song._id}
                  className={`p-4 rounded-xl ${
                    isDarkMode ? "bg-gray-800" : "bg-white shadow-md"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg truncate">{song.title}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ml-2 flex-shrink-0 ${
                        song.status
                          ? isDarkMode
                            ? "bg-green-800 text-green-200"
                            : "bg-green-100 text-green-800"
                          : isDarkMode
                          ? "bg-red-800 text-red-200"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {song.status ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="font-medium w-20">Artist:</span>
                      <span className="truncate">{song.artist}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-20">Album:</span>
                      <span className="truncate">{song.album}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-20">Genre:</span>
                      <span>{song.genre}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-20">Released:</span>
                      <span>
                        {song.releaseDate
                          ? new Date(song.releaseDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => toggleSongStatus(song)}
                      className={`p-2 rounded-full ${
                        song.status
                          ? isDarkMode
                            ? "text-red-400 hover:bg-red-900/30"
                            : "text-red-500 hover:bg-red-100"
                          : isDarkMode
                          ? "text-green-400 hover:bg-green-900/30"
                          : "text-green-500 hover:bg-green-100"
                      }`}
                      title={song.status ? "Deactivate" : "Activate"}
                    >
                      {song.status ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(song)}
                        className={`p-2 rounded-full ${
                          isDarkMode
                            ? "text-blue-400 hover:bg-blue-900/30"
                            : "text-blue-500 hover:bg-blue-100"
                        }`}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => openDeleteModal(song)}
                        className={`p-2 rounded-full ${
                          isDarkMode
                            ? "text-red-400 hover:bg-red-900/30"
                            : "text-red-500 hover:bg-red-100"
                        }`}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Songs Table - Desktop View */}
        <div
          className={`hidden md:block rounded-xl overflow-x-auto ${
            isDarkMode ? "bg-gray-800" : "bg-white shadow-md"
          }`}
        >
          <table className="w-full">
            <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-100"}>
              <tr>
                <th className="p-3 text-left">🎵 Title</th>
                <th className="p-3 text-left">👤 Artist</th>
                <th className="p-3 text-left">💿 Album</th>
                <th className="p-3 text-left">🎶 Genre</th>
                <th className="p-3 text-left">📅 Release Date</th>
                <th className="p-3 text-left">📂 Status</th>
                <th className="p-3 text-left">⚙️ Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSongs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center">
                    No songs found.{" "}
                    {songs.length === 0
                      ? "Add your first song!"
                      : "Try changing your search or filters."}
                  </td>
                </tr>
              ) : (
                filteredSongs.map((song) => (
                  <tr
                    key={song._id}
                    className={
                      isDarkMode
                        ? "border-b border-gray-700 hover:bg-gray-700"
                        : "border-b border-gray-200 hover:bg-gray-50"
                    }
                  >
                    <td className="p-3">{song.title}</td>
                    <td className="p-3">{song.artist}</td>
                    <td className="p-3">{song.album}</td>
                    <td className="p-3">{song.genre}</td>
                    <td className="p-3">
                      {song.releaseDate
                        ? new Date(song.releaseDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          song.status
                            ? isDarkMode
                              ? "bg-green-800 text-green-200"
                              : "bg-green-100 text-green-800"
                            : isDarkMode
                            ? "bg-red-800 text-red-200"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {song.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleSongStatus(song)}
                          className={`p-2 rounded-full ${
                            song.status
                              ? isDarkMode
                                ? "text-red-400 hover:bg-red-900/30"
                                : "text-red-500 hover:bg-red-100"
                              : isDarkMode
                              ? "text-green-400 hover:bg-green-900/30"
                              : "text-green-500 hover:bg-green-100"
                          }`}
                          title={song.status ? "Deactivate" : "Activate"}
                        >
                          {song.status ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        <button
                          onClick={() => openEditModal(song)}
                          className={`p-2 rounded-full ${
                            isDarkMode
                              ? "text-blue-400 hover:bg-blue-900/30"
                              : "text-blue-500 hover:bg-blue-100"
                          }`}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => openDeleteModal(song)}
                          className={`p-2 rounded-full ${
                            isDarkMode
                              ? "text-red-400 hover:bg-red-900/30"
                              : "text-red-500 hover:bg-red-100"
                          }`}
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

        {/* Add Song Modal */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="p-4 md:p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl md:text-2xl font-bold">
                      Add New Song
                    </h2>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className={`p-2 rounded-full ${
                        isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                      }`}
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <form onSubmit={handleAddSong}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          className={`block mb-2 text-sm font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Song Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className={`w-full p-3 rounded-lg border ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                          required
                        />
                      </div>

                      <div>
                        <label
                          className={`block mb-2 text-sm font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Artist *
                        </label>
                        <input
                          type="text"
                          name="artist"
                          value={formData.artist}
                          onChange={handleInputChange}
                          className={`w-full p-3 rounded-lg border ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          className={`block mb-2 text-sm font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Album
                        </label>
                        <input
                          type="text"
                          name="album"
                          value={formData.album}
                          onChange={handleInputChange}
                          className={`w-full p-3 rounded-lg border ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        />
                      </div>

                      <div>
                        <label
                          className={`block mb-2 text-sm font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Genre *
                        </label>
                        <select
                          name="genre"
                          value={formData.genre}
                          onChange={handleInputChange}
                          className={`w-full p-3 rounded-lg border ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
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

                    <div className="mb-4">
                      <label
                        className={`block mb-2 text-sm font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Release Date
                      </label>
                      <input
                        type="date"
                        name="releaseDate"
                        value={formData.releaseDate}
                        onChange={handleInputChange}
                        className={`w-full p-3 rounded-lg border ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          className={`block mb-2 text-sm font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Language
                        </label>
                        <select
                          name="language"
                          value={formData.language}
                          onChange={handleInputChange}
                          className={`w-full p-3 rounded-lg border ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        >
                          <option value="">Select Language</option>
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="German">German</option>
                          <option value="Hindi">Hindi</option>
                          <option value="Japanese">Japanese</option>
                          <option value="Korean">Korean</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label
                          className={`block mb-2 text-sm font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          name="tags"
                          value={formData.tags}
                          onChange={handleInputChange}
                          placeholder="rock, pop, 2023, favorite"
                          className={`w-full p-3 rounded-lg border ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label
                          className={`block mb-2 text-sm font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Song File (MP3/WAV) *
                        </label>
                        <input
                          type="file"
                          name="songFile"
                          onChange={handleFileChange}
                          accept=".mp3,.wav"
                          className={`w-full p-3 rounded-lg border ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                          required
                        />
                      </div>

                      <div>
                        <label
                          className={`block mb-2 text-sm font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Cover Image (JPG/PNG)
                        </label>
                        <input
                          type="file"
                          name="coverImage"
                          onChange={handleFileChange}
                          accept=".jpg,.jpeg,.png"
                          className={`w-full p-3 rounded-lg border ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                      <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className={`px-4 py-2 rounded-lg mt-2 sm:mt-0 ${
                          isDarkMode
                            ? "bg-gray-700 hover:bg-gray-600 text-white"
                            : "bg-gray-300 hover:bg-gray-400 text-gray-900"
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        Save Song
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Edit Song Modal */}
        <AnimatePresence>
          {showEditModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="p-4 md:p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl md:text-2xl font-bold">Edit Song</h2>
                    <button
                      onClick={() => setShowEditModal(false)}
                      className={`p-2 rounded-full ${
                        isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                      }`}
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <form onSubmit={handleUpdateSong}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          className={`block mb-2 text-sm font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Song Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className={`w-full p-3 rounded-lg border ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                          required
                        />
                      </div>

                      <div>
                        <label
                          className={`block mb-2 text-sm font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Artist *
                        </label>
                        <input
                          type="text"
                          name="artist"
                          value={formData.artist}
                          onChange={handleInputChange}
                          className={`w-full p-3 rounded-lg border ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          className={`block mb-2 text-sm font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Language
                        </label>
                        <select
                          name="language"
                          value={formData.language}
                          onChange={handleInputChange}
                          className={`w-full p-3 rounded-lg border ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        >
                          <option value="">Select Language</option>
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="German">German</option>
                          <option value="Hindi">Hindi</option>
                          <option value="Japanese">Japanese</option>
                          <option value="Korean">Korean</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label
                          className={`block mb-2 text-sm font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          name="tags"
                          value={formData.tags}
                          onChange={handleInputChange}
                          placeholder="rock, pop, 2023, favorite"
                          className={`w-full p-3 rounded-lg border ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          className={`block mb-2 text-sm font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Album
                        </label>
                        <input
                          type="text"
                          name="album"
                          value={formData.album}
                          onChange={handleInputChange}
                          className={`w-full p-3 rounded-lg border ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        />
                      </div>

                      <div>
                        <label
                          className={`block mb-2 text-sm font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Genre *
                        </label>
                        <select
                          name="genre"
                          value={formData.genre}
                          onChange={handleInputChange}
                          className={`w-full p-3 rounded-lg border ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
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

                    <div className="mb-4">
                      <label
                        className={`block mb-2 text-sm font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Release Date
                      </label>
                      <input
                        type="date"
                        name="releaseDate"
                        value={formData.releaseDate}
                        onChange={handleInputChange}
                        className={`w-full p-3 rounded-lg border ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label
                          className={`block mb-2 text-sm font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Song File (MP3/WAV)
                        </label>
                        <input
                          type="file"
                          name="songFile"
                          onChange={handleFileChange}
                          accept=".mp3,.wav"
                          className={`w-full p-3 rounded-lg border ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        />
                        <p
                          className={`text-xs mt-1 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Leave empty to keep current file
                        </p>
                      </div>

                      <div>
                        <label
                          className={`block mb-2 text-sm font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Cover Image (JPG/PNG)
                        </label>
                        <input
                          type="file"
                          name="coverImage"
                          onChange={handleFileChange}
                          accept=".jpg,.jpeg,.png"
                          className={`w-full p-3 rounded-lg border ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        />
                        <p
                          className={`text-xs mt-1 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Leave empty to keep current image
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                      <button
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        className={`px-4 py-2 rounded-lg mt-2 sm:mt-0 ${
                          isDarkMode
                            ? "bg-gray-700 hover:bg-gray-600 text-white"
                            : "bg-gray-300 hover:bg-gray-400 text-gray-900"
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`rounded-xl max-w-md w-full p-4 md:p-6 ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
                <p className="mb-6">
                  Are you sure you want to delete the song "
                  {selectedSong?.title}" by {selectedSong?.artist}?
                </p>
                <div className="flex flex-col-reverse sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className={`px-4 py-2 rounded-lg mt-2 sm:mt-0 ${
                      isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-300 hover:bg-gray-400 text-gray-900"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteSong}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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
