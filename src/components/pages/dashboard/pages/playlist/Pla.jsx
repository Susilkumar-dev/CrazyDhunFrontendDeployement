
// import React, { useState, useEffect, useContext } from 'react';
// import { FaPlus, FaPlay, FaTrash, FaMusic, FaRandom, FaEdit, FaSearch, FaFilter, FaSort } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { PlayerContext } from '../../../../../context/PlayerContext';
// import { useTheme } from '../../../../../context/ThemeContext';
// import { motion, AnimatePresence } from 'framer-motion';

// const buildImageUrl = (path) => {
//     if (!path) return 'https://via.placeholder.com/160';
//     if (path.startsWith('http')) return path;
//     return `${import.meta.env.VITE_API_URL}/${path.replace(/\\/g, '/')}`;
// };

// // Function to generate a gradient based on playlist name
// const generateGradient = (name) => {
//     const colors = [
//         'from-purple-500 to-pink-500',
//         'from-blue-500 to-cyan-500',
//         'from-green-500 to-emerald-500',
//         'from-yellow-500 to-orange-500',
//         'from-red-500 to-pink-500',
//         'from-indigo-500 to-purple-500',
//         'from-teal-500 to-blue-500',
//         'from-amber-500 to-yellow-500'
//     ];
    
//     let hash = 0;
//     for (let i = 0; i < name.length; i++) {
//         hash = name.charCodeAt(i) + ((hash << 5) - hash);
//     }
    
//     return colors[Math.abs(hash) % colors.length];
// };

// const PlaylistsPage = () => {
//     const [playlists, setPlaylists] = useState([]);
//     const [filteredPlaylists, setFilteredPlaylists] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [newPlaylistName, setNewPlaylistName] = useState("");
//     const [editingPlaylist, setEditingPlaylist] = useState(null);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [sortOption, setSortOption] = useState("name");
//     const [filterOption, setFilterOption] = useState("all");
//     const { fetchUserPlaylists, playSong } = useContext(PlayerContext);
//     const { isDarkMode } = useTheme();
//     const navigate = useNavigate();

//     const fetchPlaylists = async () => {
//         setLoading(true);
//         try {
//             const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
//             const config = { headers: { Authorization: `Bearer ${token}` } };
//             const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/user/playlists`, config);
//             setPlaylists(data);
//             setFilteredPlaylists(data);
//         } catch (error) {
//             console.error("Failed to fetch playlists", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchPlaylists();
//     }, []);

//     // Filter and sort playlists
//     useEffect(() => {
//         let result = [...playlists];
        
//         // Apply search filter
//         if (searchQuery) {
//             result = result.filter(playlist =>
//                 playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
//             );
//         }
        
//         // Apply content filter
//         if (filterOption === "empty") {
//             result = result.filter(playlist => playlist.songs.length === 0);
//         } else if (filterOption === "hasSongs") {
//             result = result.filter(playlist => playlist.songs.length > 0);
//         }
        
//         // Apply sorting
//         if (sortOption === "name") {
//             result.sort((a, b) => a.name.localeCompare(b.name));
//         } else if (sortOption === "songs") {
//             result.sort((a, b) => b.songs.length - a.songs.length);
//         } else if (sortOption === "recent") {
//             // Assuming playlists have a createdAt field
//             result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         }
        
//         setFilteredPlaylists(result);
//     }, [playlists, searchQuery, sortOption, filterOption]);

//     const handleCreatePlaylist = async (e) => {
//         e.preventDefault();
//         try {
//             const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
//             const config = { headers: { Authorization: `Bearer ${token}` } };
//             // Corrected line: Removed the comma inside the backticks
//             await axios.post(`${import.meta.env.VITE_API_URL}/user/playlists`, { name: newPlaylistName }, config);
//             setIsModalOpen(false);
//             setNewPlaylistName("");
//             fetchPlaylists();
//             fetchUserPlaylists();
//         } catch (error) {
//             alert("Failed to create playlist.");
//             console.error("Error creating playlist:", error); // Add console log for debugging
//         }
//     };

//     const handleEditPlaylist = async (e) => {
//         e.preventDefault();
//         try {
//             const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
//             const config = { headers: { Authorization: `Bearer ${token}` } };
//             await axios.put(`${import.meta.env.VITE_API_URL}/user/playlists/${editingPlaylist._id}`,
//                 { name: newPlaylistName }, config);
//             setIsEditModalOpen(false);
//             setNewPlaylistName("");
//             setEditingPlaylist(null);
//             fetchPlaylists();
//             fetchUserPlaylists();
//         } catch (error) {
//             alert("Failed to update playlist.");
//         }
//     };

//     const handleQuickPlay = async (playlistId) => {
//         try {
//              const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
//              const config = { headers: { Authorization: `Bearer ${token}` } };
//              const { data: playlistDetails } = await axios.get(`${import.meta.env.VITE_API_URL}/user/playlists/${playlistId}`, config);
//              if (playlistDetails.songs.length > 0) {
//                  playSong(playlistDetails.songs[0], playlistDetails.songs, {type: 'Playlist', name: playlistDetails.name});
//              } else {
//                  alert("This playlist is empty!");
//              }
//         } catch(error) {
//             console.error("Could not play playlist", error);
//         }
//     };

//     const handleShufflePlay = async (playlistId) => {
//         try {
//              const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
//              const config = { headers: { Authorization: `Bearer ${token}` } };
//              const { data: playlistDetails } = await axios.get(`${import.meta.env.VITE_API_URL}/user/playlists/${playlistId}`, config);
//              if (playlistDetails.songs.length > 0) {
//                  // Shuffle the songs array
//                  const shuffledSongs = [...playlistDetails.songs].sort(() => Math.random() - 0.5);
//                  playSong(shuffledSongs[0], shuffledSongs, {type: 'Playlist', name: playlistDetails.name});
//              } else {
//                  alert("This playlist is empty!");
//              }
//         } catch(error) {
//             console.error("Could not play playlist", error);
//         }
//     };

//     const handleDeletePlaylist = async (playlistId, playlistName) => {
//         if (window.confirm(`Delete playlist "${playlistName}"?`)) {
//             try {
//                 const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
//                 const config = { headers: { Authorization: `Bearer ${token}` } };
//                 await axios.delete(`${import.meta.env.VITE_API_URL}/user/playlists/${playlistId}`, config);
//                 setPlaylists(playlists.filter(p => p._id !== playlistId));
//                 fetchUserPlaylists();
//             } catch (error) {
//                 alert("Failed to delete playlist.");
//             }
//         }
//     };

//     const openEditModal = (playlist) => {
//         setEditingPlaylist(playlist);
//         setNewPlaylistName(playlist.name);
//         setIsEditModalOpen(true);
//     };

//     return (
//         <div className={`min-h-screen transition-colors duration-300 p-6 md:p-10 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
//             {/* Create Modal */}
//             <AnimatePresence>
//                 {isModalOpen && (
//                     <motion.div
//                         className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                     >
//                         <motion.div
//                             className={`p-8 rounded-2xl shadow-2xl w-full max-w-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
//                             initial={{ opacity: 0, scale: 0.9 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             exit={{ opacity: 0, scale: 0.9 }}
//                         >
//                             <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Create New Playlist</h2>
//                             <form onSubmit={handleCreatePlaylist}>
//                                 <input
//                                     type="text"
//                                     value={newPlaylistName}
//                                     onChange={(e) => setNewPlaylistName(e.target.value)}
//                                     placeholder="My Awesome Playlist"
//                                     className={`w-full p-3 rounded mb-6 focus:ring-2 focus:outline-none transition-colors ${isDarkMode ? 'bg-gray-700 text-white focus:ring-green-400' : 'bg-gray-100 text-gray-900 focus:ring-green-500'}`}
//                                     required
//                                     autoFocus
//                                 />
//                                 <div className="flex justify-end space-x-4">
//                                     <button
//                                         type="button"
//                                         onClick={() => setIsModalOpen(false)}
//                                         className={`px-6 py-2 rounded-full transition-colors ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'}`}
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         type="submit"
//                                         className="px-6 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors"
//                                     >
//                                         Create
//                                     </button>
//                                 </div>
//                             </form>
//                         </motion.div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             {/* Edit Modal */}
//             <AnimatePresence>
//                 {isEditModalOpen && (
//                     <motion.div
//                         className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                     >
//                         <motion.div
//                             className={`p-8 rounded-2xl shadow-2xl w-full max-w-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
//                             initial={{ opacity: 0, scale: 0.9 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             exit={{ opacity: 0, scale: 0.9 }}
//                         >
//                             <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Rename Playlist</h2>
//                             <form onSubmit={handleEditPlaylist}>
//                                 <input
//                                     type="text"
//                                     value={newPlaylistName}
//                                     onChange={(e) => setNewPlaylistName(e.target.value)}
//                                     placeholder="Playlist Name"
//                                     className={`w-full p-3 rounded mb-6 focus:ring-2 focus:outline-none transition-colors ${isDarkMode ? 'bg-gray-700 text-white focus:ring-green-400' : 'bg-gray-100 text-gray-900 focus:ring-green-500'}`}
//                                     required
//                                     autoFocus
//                                 />
//                                 <div className="flex justify-end space-x-4">
//                                     <button
//                                         type="button"
//                                         onClick={() => setIsEditModalOpen(false)}
//                                         className={`px-6 py-2 rounded-full transition-colors ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'}`}
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         type="submit"
//                                         className="px-6 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors"
//                                     >
//                                         Save
//                                     </button>
//                                 </div>
//                             </form>
//                         </motion.div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             {/* Header */}
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//                 <div>
//                     <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Your Playlists</h1>
//                     <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Create and manage your music collections</p>
//                 </div>
//                 <button
//                     onClick={() => setIsModalOpen(true)}
//                     className={`font-bold py-3 px-6 rounded-full flex items-center shadow-lg transition-colors ${isDarkMode ? 'bg-green-700 hover:bg-green-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
//                 >
//                     <FaPlus className="mr-2" /> New Playlist
//                 </button>
//             </div>

//             {/* Search and Filter Bar */}
//             <div className={`p-4 rounded-xl mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
//                 <div className="flex flex-col md:flex-row gap-4 items-center">
//                     <div className={`flex items-center flex-1 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
//                         <FaSearch className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
//                         <input
//                             type="text"
//                             placeholder="Search playlists..."
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             className={`w-full bg-transparent focus:outline-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
//                         />
//                     </div>
                    
//                     <div className="flex gap-2">
//                         <div className={`relative flex items-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
//                             <FaFilter className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
//                             <select
//                                 value={filterOption}
//                                 onChange={(e) => setFilterOption(e.target.value)}
//                                 className={`appearance-none bg-transparent focus:outline-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
//                             >
//                                 <option value="all">All Playlists</option>
//                                 <option value="hasSongs">With Songs</option>
//                                 <option value="empty">Empty</option>
//                             </select>
//                         </div>
                        
//                         <div className={`relative flex items-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
//                             <FaSort className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
//                             <select
//                                 value={sortOption}
//                                 onChange={(e) => setSortOption(e.target.value)}
//                                 className={`appearance-none bg-transparent focus:outline-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
//                             >
//                                 <option value="name">By Name</option>
//                                 <option value="songs">By Song Count</option>
//                                 <option value="recent">Recently Added</option>
//                             </select>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {loading ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                     {[...Array(8)].map((_, i) => (
//                         <div key={i} className={`p-4 rounded-2xl animate-pulse ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
//                             <div className={`w-full h-40 rounded-xl mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
//                             <div className={`h-4 rounded mb-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
//                             <div className={`h-3 rounded w-2/3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <motion.div
//                     className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
//                     initial="hidden"
//                     animate="visible"
//                     variants={{
//                         visible: { transition: { staggerChildren: 0.1 } }
//                     }}
//                 >
//                     {filteredPlaylists.length === 0 ? (
//                         <div className="col-span-full text-center py-20">
//                             <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
//                                 <FaMusic className={`text-3xl ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
//                             </div>
//                             <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                                 {searchQuery ? "No matching playlists" : "No playlists yet"}
//                             </h2>
//                             <p className={`mb-6 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
//                                 {searchQuery ? "Try a different search term" : "Create your first playlist to organize your favorite songs"}
//                             </p>
//                             {!searchQuery && (
//                                 <button
//                                     onClick={() => setIsModalOpen(true)}
//                                     className={`font-bold py-3 px-8 rounded-full hover:bg-green-600 transition-colors ${isDarkMode ? 'bg-green-700 text-white' : 'bg-green-500 text-white'}`}
//                                 >
//                                     <FaPlus className="mr-2 inline" /> Create First Playlist
//                                 </button>
//                             )}
//                         </div>
//                     ) : (
//                         <>
//                             {/* Create Playlist Card */}
//                             <motion.div
//                                 variants={{
//                                     hidden: { opacity: 0, y: 20 },
//                                     visible: { opacity: 1, y: 0 }
//                                 }}
//                                 className={`p-6 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed cursor-pointer transition-colors h-80 ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-green-500' : 'bg-white border-gray-300 hover:border-green-400 shadow-md'}`}
//                                 onClick={() => setIsModalOpen(true)}
//                                 whileHover={{ scale: 1.03 }}
//                                 whileTap={{ scale: 0.98 }}
//                             >
//                                 <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
//                                     <FaPlus className={`text-2xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
//                                 </div>
//                                 <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Create New Playlist</p>
//                             </motion.div>

//                             {/* Playlist Cards */}
//                             {filteredPlaylists.map(pl => (
//                                 <motion.div
//                                     key={pl._id}
//                                     variants={{
//                                         hidden: { opacity: 0, y: 20 },
//                                         visible: { opacity: 1, y: 0 }
//                                     }}
//                                     className={`p-4 rounded-2xl shadow-md hover:shadow-lg transition-all group relative overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
//                                     whileHover={{ y: -5 }}
//                                 >
//                                     <div className="relative">
//                                         {pl.coverArt ? (
//                                             <img
//                                                 src={buildImageUrl(pl.coverArt)}
//                                                 alt={pl.name}
//                                                 className="w-full h-48 object-cover rounded-xl mb-4 shadow-md"
//                                             />
//                                         ) : (
//                                             <div className={`w-full h-48 rounded-xl mb-4 flex items-center justify-center shadow-md bg-gradient-to-br ${generateGradient(pl.name)}`}>
//                                                 <FaMusic className="text-4xl text-white opacity-80" />
//                                             </div>
//                                         )}
                                        
//                                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity gap-2">
//                                             <button
//                                                 onClick={(e) => { e.stopPropagation(); handleQuickPlay(pl._id); }}
//                                                 className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors transform hover:scale-110"
//                                                 title="Play"
//                                             >
//                                                 <FaPlay />
//                                             </button>
//                                             <button
//                                                 onClick={(e) => { e.stopPropagation(); handleShufflePlay(pl._id); }}
//                                                 className="bg-purple-500 text-white p-3 rounded-full hover:bg-purple-600 transition-colors transform hover:scale-110"
//                                                 title="Shuffle Play"
//                                             >
//                                                 <FaRandom />
//                                             </button>
//                                         </div>
                                        
//                                         <div className="absolute top-2 right-2 flex gap-2">
//                                             <button
//                                                 onClick={(e) => { e.stopPropagation(); openEditModal(pl); }}
//                                                 className="p-2 bg-blue-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                                                 title="Edit"
//                                             >
//                                                 <FaEdit size={12} />
//                                             </button>
//                                             <button
//                                                 onClick={(e) => { e.stopPropagation(); handleDeletePlaylist(pl._id, pl.name); }}
//                                                 className="p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                                                 title="Delete"
//                                             >
//                                                 <FaTrash size={12} />
//                                             </button>
//                                         </div>
//                                     </div>
                                    
//                                     <div
//                                         className="cursor-pointer"
//                                         onClick={() => navigate(`/dashboard/playlist/${pl._id}`)}
//                                     >
//                                         <h3 className="font-bold text-lg truncate">{pl.name}</h3>
//                                         <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                                             {pl.songs.length} song{pl.songs.length !== 1 ? 's' : ''}
//                                         </p>
//                                     </div>
//                                 </motion.div>
//                             ))}
//                         </>
//                     )}
//                 </motion.div>
//             )}
//         </div>
//     );
// };

// export default PlaylistsPage;





// import React, { useState, useEffect, useContext } from 'react';
// import { FaPlus, FaPlay, FaTrash, FaMusic, FaRandom, FaEdit, FaSearch, FaFilter, FaSort, FaSpinner } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { PlayerContext } from '../../../../../context/PlayerContext';
// import { useTheme } from '../../../../../context/ThemeContext';
// import { motion, AnimatePresence } from 'framer-motion';

// const buildImageUrl = (path) => {
//     if (!path) return 'https://via.placeholder.com/160';
//     if (path.startsWith('http')) return path;
//     return `${import.meta.env.VITE_API_URL}/${path.replace(/\\/g, '/')}`;
// };

// // Function to generate a gradient based on playlist name
// const generateGradient = (name) => {
//     const colors = [
//         'from-purple-500 to-pink-500',
//         'from-blue-500 to-cyan-500',
//         'from-green-500 to-emerald-500',
//         'from-yellow-500 to-orange-500',
//         'from-red-500 to-pink-500',
//         'from-indigo-500 to-purple-500',
//         'from-teal-500 to-blue-500',
//         'from-amber-500 to-yellow-500'
//     ];
    
//     let hash = 0;
//     for (let i = 0; i < name.length; i++) {
//         hash = name.charCodeAt(i) + ((hash << 5) - hash);
//     }
    
//     return colors[Math.abs(hash) % colors.length];
// };

// const PlaylistsPage = () => {
//     const [playlists, setPlaylists] = useState([]);
//     const [filteredPlaylists, setFilteredPlaylists] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [newPlaylistName, setNewPlaylistName] = useState(""); // Holds name for create/edit
//     const [editingPlaylist, setEditingPlaylist] = useState(null); // Stores the playlist object being edited
//     const [searchQuery, setSearchQuery] = useState("");
//     const [sortOption, setSortOption] = useState("name");
//     const [filterOption, setFilterOption] = useState("all");
//     const [isCreating, setIsCreating] = useState(false); // New state for create loading
//     const [isSaving, setIsSaving] = useState(false);     // New state for edit loading
//     const { fetchUserPlaylists, playSong } = useContext(PlayerContext);
//     const { isDarkMode } = useTheme();
//     const navigate = useNavigate();

//     const fetchPlaylists = async () => {
//         setLoading(true);
//         try {
//             const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
//             if (!token) {
//                 console.warn("No authentication token found. User might not be logged in.");
//                 setLoading(false);
//                 return;
//             }
//             const config = { headers: { Authorization: `Bearer ${token}` } };
//             const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/user/playlists`, config);
//             setPlaylists(data);
//             setFilteredPlaylists(data);
//         } catch (error) {
//             console.error("Failed to fetch playlists:", error.response?.data || error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchPlaylists();
//     }, []);

//     // Filter and sort playlists
//     useEffect(() => {
//         let result = [...playlists];
        
//         // Apply search filter
//         if (searchQuery) {
//             result = result.filter(playlist =>
//                 playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
//             );
//         }
        
//         // Apply content filter
//         if (filterOption === "empty") {
//             result = result.filter(playlist => playlist.songs.length === 0);
//         } else if (filterOption === "hasSongs") {
//             result = result.filter(playlist => playlist.songs.length > 0);
//         }
        
//         // Apply sorting
//         if (sortOption === "name") {
//             result.sort((a, b) => a.name.localeCompare(b.name));
//         } else if (sortOption === "songs") {
//             result.sort((a, b) => b.songs.length - a.songs.length);
//         } else if (sortOption === "recent") {
//             // Assuming playlists have a createdAt field
//             result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         }
        
//         setFilteredPlaylists(result);
//     }, [playlists, searchQuery, sortOption, filterOption]);

//     const handleCreatePlaylist = async (e) => {
//         e.preventDefault();
//         setIsCreating(true); // Start loading
//         try {
//             const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
//             if (!token) {
//                 alert("You must be logged in to create a playlist.");
//                 setIsCreating(false);
//                 return;
//             }
//             const config = { headers: { Authorization: `Bearer ${token}` } };
//             await axios.post(`${import.meta.env.VITE_API_URL}/user/playlists`, { name: newPlaylistName }, config);
//             setIsModalOpen(false);
//             setNewPlaylistName("");
//             fetchPlaylists(); // Re-fetch all playlists to update the list
//             fetchUserPlaylists(); // Update context if necessary
//         } catch (error) {
//             alert(`Failed to create playlist: ${error.response?.data?.message || error.message}`);
//             console.error("Error creating playlist:", error.response?.data || error.message);
//         } finally {
//             setIsCreating(false); // End loading
//         }
//     };

//     const handleEditPlaylist = async (e) => {
//         e.preventDefault();
//         if (!editingPlaylist || !newPlaylistName.trim()) {
//             alert("Playlist to edit or new name is invalid.");
//             return;
//         }

//         setIsSaving(true); // Start loading
//         try {
//             const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
//             if (!token) {
//                 alert("You must be logged in to edit a playlist.");
//                 setIsSaving(false);
//                 return;
//             }
//             const config = { headers: { Authorization: `Bearer ${token}` } };
            
//             // CORRECTED: Ensure the ID of the playlist being edited and the new name are sent.
//             await axios.put(`${import.meta.env.VITE_API_URL}/user/playlists/${editingPlaylist._id}`,
//                 { name: newPlaylistName }, // Send the new name in the request body
//                 config
//             );
//             setIsEditModalOpen(false);
//             setNewPlaylistName(""); // Clear input after successful edit
//             setEditingPlaylist(null); // Clear editing state
//             fetchPlaylists(); // Re-fetch all playlists to show the updated name
//             fetchUserPlaylists(); // Update context if necessary
//         } catch (error) {
//             alert(`Failed to update playlist: ${error.response?.data?.message || error.message}`);
//             console.error("Error updating playlist:", error.response?.data || error.message);
//         } finally {
//             setIsSaving(false); // End loading
//         }
//     };

//     const handleQuickPlay = async (playlistId) => {
//         try {
//              const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
//              if (!token) {
//                 alert("You must be logged in to play songs.");
//                 return;
//             }
//              const config = { headers: { Authorization: `Bearer ${token}` } };
//              const { data: playlistDetails } = await axios.get(`${import.meta.env.VITE_API_URL}/user/playlists/${playlistId}`, config);
//              if (playlistDetails.songs.length > 0) {
//                  playSong(playlistDetails.songs[0], playlistDetails.songs, {type: 'Playlist', name: playlistDetails.name});
//              } else {
//                  alert("This playlist is empty!");
//              }
//         } catch(error) {
//             console.error("Could not play playlist:", error.response?.data || error.message);
//             alert(`Failed to play playlist: ${error.response?.data?.message || error.message}`);
//         }
//     };

//     const handleShufflePlay = async (playlistId) => {
//         try {
//              const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
//              if (!token) {
//                 alert("You must be logged in to shuffle play.");
//                 return;
//             }
//              const config = { headers: { Authorization: `Bearer ${token}` } };
//              const { data: playlistDetails } = await axios.get(`${import.meta.env.VITE_API_URL}/user/playlists/${playlistId}`, config);
//              if (playlistDetails.songs.length > 0) {
//                  const shuffledSongs = [...playlistDetails.songs].sort(() => Math.random() - 0.5);
//                  playSong(shuffledSongs[0], shuffledSongs, {type: 'Playlist', name: playlistDetails.name});
//              } else {
//                  alert("This playlist is empty!");
//              }
//         } catch(error) {
//             console.error("Could not shuffle play playlist:", error.response?.data || error.message);
//             alert(`Failed to shuffle play playlist: ${error.response?.data?.message || error.message}`);
//         }
//     };

//     const handleDeletePlaylist = async (playlistId, playlistName) => {
//         if (window.confirm(`Delete playlist "${playlistName}"?`)) {
//             try {
//                 const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
//                 if (!token) {
//                     alert("You must be logged in to delete a playlist.");
//                     return;
//                 }
//                 const config = { headers: { Authorization: `Bearer ${token}` } };
//                 await axios.delete(`${import.meta.env.VITE_API_URL}/user/playlists/${playlistId}`, config);
//                 setPlaylists(playlists.filter(p => p._id !== playlistId));
//                 fetchUserPlaylists(); // Update context if necessary
//             } catch (error) {
//                 alert(`Failed to delete playlist: ${error.response?.data?.message || error.message}`);
//                 console.error("Error deleting playlist:", error.response?.data || error.message);
//             }
//         }
//     };

//     const openEditModal = (playlist) => {
//         setEditingPlaylist(playlist); // Store the entire playlist object
//         setNewPlaylistName(playlist.name); // Populate input with current name
//         setIsEditModalOpen(true);
//     };

//     return (
//         <div className={`min-h-screen transition-colors duration-300 p-6 md:p-10 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
//             {/* Create Modal */}
//             <AnimatePresence>
//                 {isModalOpen && (
//                     <motion.div
//                         className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                     >
//                         <motion.div
//                             className={`p-8 rounded-2xl shadow-2xl w-full max-w-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
//                             initial={{ opacity: 0, scale: 0.9 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             exit={{ opacity: 0, scale: 0.9 }}
//                         >
//                             <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Create New Playlist</h2>
//                             <form onSubmit={handleCreatePlaylist}>
//                                 <input
//                                     type="text"
//                                     value={newPlaylistName}
//                                     onChange={(e) => setNewPlaylistName(e.target.value)}
//                                     placeholder="My Awesome Playlist"
//                                     className={`w-full p-3 rounded mb-6 focus:ring-2 focus:outline-none transition-colors ${isDarkMode ? 'bg-gray-700 text-white focus:ring-green-400' : 'bg-gray-100 text-gray-900 focus:ring-green-500'}`}
//                                     required
//                                     autoFocus
//                                     disabled={isCreating}
//                                 />
//                                 <div className="flex justify-end space-x-4">
//                                     <button
//                                         type="button"
//                                         onClick={() => !isCreating && setIsModalOpen(false)}
//                                         className={`px-6 py-2 rounded-full transition-colors ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'} ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
//                                         disabled={isCreating}
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         type="submit"
//                                         className="px-6 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors flex items-center justify-center"
//                                         disabled={isCreating}
//                                     >
//                                         {isCreating ? (
//                                             <>
//                                                 <FaSpinner className="animate-spin mr-2" /> Creating...
//                                             </>
//                                         ) : (
//                                             'Create'
//                                         )}
//                                     </button>
//                                 </div>
//                             </form>
//                         </motion.div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             {/* Edit Modal */}
//             <AnimatePresence>
//                 {isEditModalOpen && (
//                     <motion.div
//                         className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                     >
//                         <motion.div
//                             className={`p-8 rounded-2xl shadow-2xl w-full max-w-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
//                             initial={{ opacity: 0, scale: 0.9 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             exit={{ opacity: 0, scale: 0.9 }}
//                         >
//                             <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Rename Playlist</h2>
//                             <form onSubmit={handleEditPlaylist}>
//                                 <input
//                                     type="text"
//                                     value={newPlaylistName} // Value is tied to newPlaylistName
//                                     onChange={(e) => setNewPlaylistName(e.target.value)}
//                                     placeholder="Playlist Name"
//                                     className={`w-full p-3 rounded mb-6 focus:ring-2 focus:outline-none transition-colors ${isDarkMode ? 'bg-gray-700 text-white focus:ring-green-400' : 'bg-gray-100 text-gray-900 focus:ring-green-500'}`}
//                                     required
//                                     autoFocus
//                                     disabled={isSaving}
//                                 />
//                                 <div className="flex justify-end space-x-4">
//                                     <button
//                                         type="button"
//                                         onClick={() => !isSaving && setIsEditModalOpen(false)}
//                                         className={`px-6 py-2 rounded-full transition-colors ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'} ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
//                                         disabled={isSaving}
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         type="submit"
//                                         className="px-6 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors flex items-center justify-center"
//                                         disabled={isSaving}
//                                     >
//                                         {isSaving ? (
//                                             <>
//                                                 <FaSpinner className="animate-spin mr-2" /> Saving...
//                                             </>
//                                         ) : (
//                                             'Save'
//                                         )}
//                                     </button>
//                                 </div>
//                             </form>
//                         </motion.div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             {/* Header */}
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//                 <div>
//                     <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Your Playlists</h1>
//                     <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Create and manage your music collections</p>
//                 </div>
//                 <button
//                     onClick={() => { setIsModalOpen(true); setNewPlaylistName(""); }} // Clear input for new playlist
//                     className={`font-bold py-3 px-6 rounded-full flex items-center shadow-lg transition-colors ${isDarkMode ? 'bg-green-700 hover:bg-green-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
//                 >
//                     <FaPlus className="mr-2" /> New Playlist
//                 </button>
//             </div>

//             {/* Search and Filter Bar */}
//             <div className={`p-4 rounded-xl mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
//                 <div className="flex flex-col md:flex-row gap-4 items-center">
//                     <div className={`flex items-center flex-1 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
//                         <FaSearch className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
//                         <input
//                             type="text"
//                             placeholder="Search playlists..."
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             className={`w-full bg-transparent focus:outline-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
//                         />
//                     </div>
                    
//                     <div className="flex gap-2">
//                         <div className={`relative flex items-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
//                             <FaFilter className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
//                             <select
//                                 value={filterOption}
//                                 onChange={(e) => setFilterOption(e.target.value)}
//                                 className={`appearance-none bg-transparent focus:outline-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
//                             >
//                                 <option value="all">All Playlists</option>
//                                 <option value="hasSongs">With Songs</option>
//                                 <option value="empty">Empty</option>
//                             </select>
//                         </div>
                        
//                         <div className={`relative flex items-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
//                             <FaSort className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
//                             <select
//                                 value={sortOption}
//                                 onChange={(e) => setSortOption(e.target.value)}
//                                 className={`appearance-none bg-transparent focus:outline-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
//                             >
//                                 <option value="name">By Name</option>
//                                 <option value="songs">By Song Count</option>
//                                 <option value="recent">Recently Added</option>
//                             </select>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {loading ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                     {[...Array(8)].map((_, i) => (
//                         <div key={i} className={`p-4 rounded-2xl animate-pulse ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
//                             <div className={`w-full h-40 rounded-xl mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
//                             <div className={`h-4 rounded mb-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
//                             <div className={`h-3 rounded w-2/3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <motion.div
//                     className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
//                     initial="hidden"
//                     animate="visible"
//                     variants={{
//                         visible: { transition: { staggerChildren: 0.1 } }
//                     }}
//                 >
//                     {filteredPlaylists.length === 0 && !searchQuery ? (
//                         <div className="col-span-full text-center py-20">
//                             <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
//                                 <FaMusic className={`text-3xl ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
//                             </div>
//                             <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                                 No playlists yet
//                             </h2>
//                             <p className={`mb-6 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
//                                 Create your first playlist to organize your favorite songs
//                             </p>
//                             <button
//                                 onClick={() => { setIsModalOpen(true); setNewPlaylistName(""); }}
//                                 className={`font-bold py-3 px-8 rounded-full hover:bg-green-600 transition-colors ${isDarkMode ? 'bg-green-700 text-white' : 'bg-green-500 text-white'}`}
//                             >
//                                 <FaPlus className="mr-2 inline" /> Create First Playlist
//                             </button>
//                         </div>
//                     ) : filteredPlaylists.length === 0 && searchQuery ? (
//                         <div className="col-span-full text-center py-20">
//                             <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
//                                 <FaMusic className={`text-3xl ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
//                             </div>
//                             <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                                 No matching playlists
//                             </h2>
//                             <p className={`mb-6 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
//                                 Try a different search term or adjust your filters.
//                             </p>
//                         </div>
//                     ) : (
//                         <>
//                             {/* Create Playlist Card */}
//                             <motion.div
//                                 variants={{
//                                     hidden: { opacity: 0, y: 20 },
//                                     visible: { opacity: 1, y: 0 }
//                                 }}
//                                 className={`p-6 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed cursor-pointer transition-colors h-80 ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-green-500' : 'bg-white border-gray-300 hover:border-green-400 shadow-md'}`}
//                                 onClick={() => { setIsModalOpen(true); setNewPlaylistName(""); }} // Clear input for new playlist
//                                 whileHover={{ scale: 1.03 }}
//                                 whileTap={{ scale: 0.98 }}
//                             >
//                                 <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
//                                     <FaPlus className={`text-2xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
//                                 </div>
//                                 <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Create New Playlist</p>
//                             </motion.div>

//                             {/* Playlist Cards */}
//                             {filteredPlaylists.map(pl => (
//                                 <motion.div
//                                     key={pl._id}
//                                     variants={{
//                                         hidden: { opacity: 0, y: 20 },
//                                         visible: { opacity: 1, y: 0 }
//                                     }}
//                                     className={`p-4 rounded-2xl shadow-md hover:shadow-lg transition-all group relative overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
//                                     whileHover={{ y: -5 }}
//                                 >
//                                     <div className="relative">
//                                         {pl.coverArt ? (
//                                             <img
//                                                 src={buildImageUrl(pl.coverArt)}
//                                                 alt={pl.name}
//                                                 className="w-full h-48 object-cover rounded-xl mb-4 shadow-md"
//                                             />
//                                         ) : (
//                                             <div className={`w-full h-48 rounded-xl mb-4 flex items-center justify-center shadow-md bg-gradient-to-br ${generateGradient(pl.name)}`}>
//                                                 <FaMusic className="text-4xl text-white opacity-80" />
//                                             </div>
//                                         )}
                                        
//                                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity gap-2">
//                                             <button
//                                                 onClick={(e) => { e.stopPropagation(); handleQuickPlay(pl._id); }}
//                                                 className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors transform hover:scale-110"
//                                                 title="Play"
//                                             >
//                                                 <FaPlay />
//                                             </button>
//                                             <button
//                                                 onClick={(e) => { e.stopPropagation(); handleShufflePlay(pl._id); }}
//                                                 className="bg-purple-500 text-white p-3 rounded-full hover:bg-purple-600 transition-colors transform hover:scale-110"
//                                                 title="Shuffle Play"
//                                             >
//                                                 <FaRandom />
//                                             </button>
//                                         </div>
                                        
//                                         <div className="absolute top-2 right-2 flex gap-2">
//                                             <button
//                                                 onClick={(e) => { e.stopPropagation(); openEditModal(pl); }}
//                                                 className="p-2 bg-blue-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                                                 title="Edit"
//                                             >
//                                                 <FaEdit size={12} />
//                                             </button>
//                                             <button
//                                                 onClick={(e) => { e.stopPropagation(); handleDeletePlaylist(pl._id, pl.name); }}
//                                                 className="p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                                                 title="Delete"
//                                             >
//                                                 <FaTrash size={12} />
//                                             </button>
//                                         </div>
//                                     </div>
                                    
//                                     <div
//                                         className="cursor-pointer"
//                                         onClick={() => navigate(`/dashboard/playlist/${pl._id}`)}
//                                     >
//                                         <h3 className="font-bold text-lg truncate">{pl.name}</h3>
//                                         <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                                             {pl.songs.length} song{pl.songs.length !== 1 ? 's' : ''}
//                                         </p>
//                                     </div>
//                                 </motion.div>
//                             ))}
//                         </>
//                     )}
//                 </motion.div>
//             )}
//         </div>
//     );
// };

// export default PlaylistsPage;



import React, { useState, useEffect, useContext } from 'react';
import { FaPlus, FaPlay, FaTrash, FaMusic, FaRandom, FaEdit, FaSearch, FaFilter, FaSort, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PlayerContext } from '../../../../../context/PlayerContext';
import { useTheme } from '../../../../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const buildImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/160';
    if (path.startsWith('http')) return path;
    return `${import.meta.env.VITE_API_URL}/${path.replace(/\\/g, '/')}`;
};

// Function to generate a gradient based on playlist name
const generateGradient = (name) => {
    const colors = [
        'from-purple-500 to-pink-500',
        'from-blue-500 to-cyan-500',
        'from-green-500 to-emerald-500',
        'from-yellow-500 to-orange-500',
        'from-red-500 to-pink-500',
        'from-indigo-500 to-purple-500',
        'from-teal-500 to-blue-500',
        'from-amber-500 to-yellow-500'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
};

const PlaylistsPage = () => {
    const [playlists, setPlaylists] = useState([]);
    const [filteredPlaylists, setFilteredPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState(""); // Holds name for create/edit
    const [editingPlaylist, setEditingPlaylist] = useState(null); // Stores the playlist object being edited
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("name");
    const [filterOption, setFilterOption] = useState("all");
    const [isCreating, setIsCreating] = useState(false); // New state for create loading
    const [isSaving, setIsSaving] = useState(false);     // New state for edit loading
    const { fetchUserPlaylists, playSong } = useContext(PlayerContext);
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();

    const fetchPlaylists = async () => {
        setLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            if (!token) {
                console.warn("No authentication token found. User might not be logged in.");
                setLoading(false);
                return;
            }
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/user/playlists`, config);
            setPlaylists(data);
            setFilteredPlaylists(data);
        } catch (error) { 
            console.error("Failed to fetch playlists:", error.response?.data || error.message); 
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => { 
        fetchPlaylists(); 
    }, []);

    // Filter and sort playlists
    useEffect(() => {
        let result = [...playlists];
        
        // Apply search filter
        if (searchQuery) {
            result = result.filter(playlist => 
                playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        // Apply content filter
        if (filterOption === "empty") {
            result = result.filter(playlist => playlist.songs.length === 0);
        } else if (filterOption === "hasSongs") {
            result = result.filter(playlist => playlist.songs.length > 0);
        }
        
        // Apply sorting
        if (sortOption === "name") {
            result.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === "songs") {
            result.sort((a, b) => b.songs.length - a.songs.length);
        } else if (sortOption === "recent") {
            // Assuming playlists have a createdAt field
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        
        setFilteredPlaylists(result);
    }, [playlists, searchQuery, sortOption, filterOption]);

    const handleCreatePlaylist = async (e) => {
        e.preventDefault();
        setIsCreating(true); // Start loading
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            if (!token) {
                alert("You must be logged in to create a playlist.");
                setIsCreating(false);
                return;
            }
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(`${import.meta.env.VITE_API_URL}/user/playlists`, { name: newPlaylistName }, config);
            setIsModalOpen(false); 
            setNewPlaylistName("");
            fetchPlaylists(); // Re-fetch all playlists to update the list
            fetchUserPlaylists(); // Update context if necessary
        } catch (error) { 
            alert(`Failed to create playlist: ${error.response?.data?.message || error.message}`); 
            console.error("Error creating playlist:", error.response?.data || error.message); 
        } finally {
            setIsCreating(false); // End loading
        }
    };

    const handleEditPlaylist = async (e) => {
        e.preventDefault();
        if (!editingPlaylist || !newPlaylistName.trim()) {
            alert("Playlist to edit or new name is invalid.");
            return;
        }

      setIsSaving(true); 
try {
  const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
  if (!token) {
    alert("You must be logged in to edit a playlist.");
    setIsSaving(false);
    return;
  }

  console.log("👉 Editing Playlist:", editingPlaylist);
  console.log("👉 New Playlist Name:", newPlaylistName);
  console.log("👉 Token:", token);

  const config = { headers: { Authorization: `Bearer ${token}` } };

  await axios.patch(
    `${import.meta.env.VITE_API_URL}/user/playlists/${editingPlaylist?._id}`, 
    { name: newPlaylistName },
    config
  );

  console.log("✅ Playlist updated successfully!");

  setIsEditModalOpen(false);
  setNewPlaylistName("");
  setEditingPlaylist(null);
  fetchPlaylists();
  fetchUserPlaylists();

} catch (error) { 
  console.error("❌ Error response:", error.response?.data);
  console.error("❌ Error message:", error.message);
  alert(`Failed to update playlist: ${error.response?.data?.message || error.message}`);
} finally {
  setIsSaving(false);
}

    };

    const handleQuickPlay = async (playlistId) => {
        try {
             const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
             if (!token) {
                alert("You must be logged in to play songs.");
                return;
            }
             const config = { headers: { Authorization: `Bearer ${token}` } };
             const { data: playlistDetails } = await axios.get(`${import.meta.env.VITE_API_URL}/user/playlists/${playlistId}`, config);
             if (playlistDetails.songs.length > 0) {
                 playSong(playlistDetails.songs[0], playlistDetails.songs, {type: 'Playlist', name: playlistDetails.name});
             } else { 
                 alert("This playlist is empty!"); 
             }
        } catch(error) { 
            console.error("Could not play playlist:", error.response?.data || error.message); 
            alert(`Failed to play playlist: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleShufflePlay = async (playlistId) => {
        try {
             const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
             if (!token) {
                alert("You must be logged in to shuffle play.");
                return;
            }
             const config = { headers: { Authorization: `Bearer ${token}` } };
             const { data: playlistDetails } = await axios.get(`${import.meta.env.VITE_API_URL}/user/playlists/${playlistId}`, config);
             if (playlistDetails.songs.length > 0) {
                 const shuffledSongs = [...playlistDetails.songs].sort(() => Math.random() - 0.5);
                 playSong(shuffledSongs[0], shuffledSongs, {type: 'Playlist', name: playlistDetails.name});
             } else { 
                 alert("This playlist is empty!"); 
             }
        } catch(error) { 
            console.error("Could not shuffle play playlist:", error.response?.data || error.message); 
            alert(`Failed to shuffle play playlist: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleDeletePlaylist = async (playlistId, playlistName) => {
        if (window.confirm(`Delete playlist "${playlistName}"?`)) {
            try {
                const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
                if (!token) {
                    alert("You must be logged in to delete a playlist.");
                    return;
                }
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`${import.meta.env.VITE_API_URL}/user/playlists/${playlistId}`, config);
                setPlaylists(playlists.filter(p => p._id !== playlistId));
                fetchUserPlaylists(); // Update context if necessary
            } catch (error) { 
                alert(`Failed to delete playlist: ${error.response?.data?.message || error.message}`); 
                console.error("Error deleting playlist:", error.response?.data || error.message); 
            }
        }
    };

    const openEditModal = (playlist) => {
        setEditingPlaylist(playlist); // Store the entire playlist object
        setNewPlaylistName(playlist.name); // Populate input with current name
        setIsEditModalOpen(true);
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 p-6 md:p-10 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Create Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div 
                        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className={`p-8 rounded-2xl shadow-2xl w-full max-w-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                            initial={{ opacity: 0, scale: 0.9 }} 
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Create New Playlist</h2>
                            <form onSubmit={handleCreatePlaylist}>
                                <input 
                                    type="text" 
                                    value={newPlaylistName} 
                                    onChange={(e) => setNewPlaylistName(e.target.value)}
                                    placeholder="My Awesome Playlist"
                                    className={`w-full p-3 rounded mb-6 focus:ring-2 focus:outline-none transition-colors ${isDarkMode ? 'bg-gray-700 text-white focus:ring-green-400' : 'bg-gray-100 text-gray-900 focus:ring-green-500'}`}
                                    required
                                    autoFocus
                                    disabled={isCreating} 
                                />
                                <div className="flex justify-end space-x-4">
                                    <button 
                                        type="button" 
                                        onClick={() => !isCreating && setIsModalOpen(false)} 
                                        className={`px-6 py-2 rounded-full transition-colors ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'} ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={isCreating}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-6 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors flex items-center justify-center"
                                        disabled={isCreating} 
                                    >
                                        {isCreating ? (
                                            <>
                                                <FaSpinner className="animate-spin mr-2" /> Creating...
                                            </>
                                        ) : (
                                            'Create'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <motion.div 
                        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className={`p-8 rounded-2xl shadow-2xl w-full max-w-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                            initial={{ opacity: 0, scale: 0.9 }} 
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Rename Playlist</h2>
                            <form onSubmit={handleEditPlaylist}>
                                <input 
                                    type="text" 
                                    value={newPlaylistName} // Value is tied to newPlaylistName
                                    onChange={(e) => setNewPlaylistName(e.target.value)}
                                    placeholder="Playlist Name"
                                    className={`w-full p-3 rounded mb-6 focus:ring-2 focus:outline-none transition-colors ${isDarkMode ? 'bg-gray-700 text-white focus:ring-green-400' : 'bg-gray-100 text-gray-900 focus:ring-green-500'}`}
                                    required
                                    autoFocus
                                    disabled={isSaving} 
                                />
                                <div className="flex justify-end space-x-4">
                                    <button 
                                        type="button" 
                                        onClick={() => !isSaving && setIsEditModalOpen(false)} 
                                        className={`px-6 py-2 rounded-full transition-colors ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'} ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-6 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors flex items-center justify-center"
                                        disabled={isSaving} 
                                    >
                                        {isSaving ? (
                                            <>
                                                <FaSpinner className="animate-spin mr-2" /> Saving...
                                            </>
                                        ) : (
                                            'Save'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Your Playlists</h1>
                    <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Create and manage your music collections</p>
                </div>
                <button 
                    onClick={() => { setIsModalOpen(true); setNewPlaylistName(""); }} // Clear input for new playlist
                    className={`font-bold py-3 px-6 rounded-full flex items-center shadow-lg transition-colors ${isDarkMode ? 'bg-green-700 hover:bg-green-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                >
                    <FaPlus className="mr-2" /> New Playlist
                </button>
            </div>

            {/* Search and Filter Bar */}
            <div className={`p-4 rounded-xl mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className={`flex items-center flex-1 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <FaSearch className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <input
                            type="text"
                            placeholder="Search playlists..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full bg-transparent focus:outline-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                        />
                    </div>
                    
                    <div className="flex gap-2">
                        <div className={`relative flex items-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <FaFilter className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <select
                                value={filterOption}
                                onChange={(e) => setFilterOption(e.target.value)}
                                className={`appearance-none bg-transparent focus:outline-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                            >
                                <option value="all">All Playlists</option>
                                <option value="hasSongs">With Songs</option>
                                <option value="empty">Empty</option>
                            </select>
                        </div>
                        
                        <div className={`relative flex items-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <FaSort className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className={`appearance-none bg-transparent focus:outline-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                            >
                                <option value="name">By Name</option>
                                <option value="songs">By Song Count</option>
                                <option value="recent">Recently Added</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className={`p-4 rounded-2xl animate-pulse ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                            <div className={`w-full h-40 rounded-xl mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                            <div className={`h-4 rounded mb-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                            <div className={`h-3 rounded w-2/3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                        </div>
                    ))}
                </div>
            ) : (
                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.1 } }
                    }}
                >
                    {filteredPlaylists.length === 0 && !searchQuery ? ( 
                        <div className="col-span-full text-center py-20">
                            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                                <FaMusic className={`text-3xl ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            </div>
                            <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                No playlists yet
                            </h2>
                            <p className={`mb-6 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                Create your first playlist to organize your favorite songs
                            </p>
                            <button 
                                onClick={() => { setIsModalOpen(true); setNewPlaylistName(""); }} 
                                className={`font-bold py-3 px-8 rounded-full hover:bg-green-600 transition-colors ${isDarkMode ? 'bg-green-700 text-white' : 'bg-green-500 text-white'}`}
                            >
                                <FaPlus className="mr-2 inline" /> Create First Playlist
                            </button>
                        </div>
                    ) : filteredPlaylists.length === 0 && searchQuery ? ( 
                        <div className="col-span-full text-center py-20">
                            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                                <FaMusic className={`text-3xl ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            </div>
                            <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                No matching playlists
                            </h2>
                            <p className={`mb-6 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                Try a different search term or adjust your filters.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Create Playlist Card */}
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                className={`p-6 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed cursor-pointer transition-colors h-80 ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-green-500' : 'bg-white border-gray-300 hover:border-green-400 shadow-md'}`}
                                onClick={() => { setIsModalOpen(true); setNewPlaylistName(""); }} // Clear input for new playlist
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                    <FaPlus className={`text-2xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                                </div>
                                <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Create New Playlist</p>
                            </motion.div>

                            {/* Playlist Cards */}
                            {filteredPlaylists.map(pl => (
                                <motion.div 
                                    key={pl._id}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                    className={`p-4 rounded-2xl shadow-md hover:shadow-lg transition-all group relative overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="relative">
                                        {pl.coverArt ? (
                                            <img 
                                                src={buildImageUrl(pl.coverArt)} 
                                                alt={pl.name} 
                                                className="w-full h-48 object-cover rounded-xl mb-4 shadow-md"
                                            />
                                        ) : (
                                            <div className={`w-full h-48 rounded-xl mb-4 flex items-center justify-center shadow-md bg-gradient-to-br ${generateGradient(pl.name)}`}>
                                                <FaMusic className="text-4xl text-white opacity-80" />
                                            </div>
                                        )}
                                        
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity gap-2">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleQuickPlay(pl._id); }}
                                                className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors transform hover:scale-110"
                                                title="Play"
                                            >
                                                <FaPlay />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleShufflePlay(pl._id); }}
                                                className="bg-purple-500 text-white p-3 rounded-full hover:bg-purple-600 transition-colors transform hover:scale-110"
                                                title="Shuffle Play"
                                            >
                                                <FaRandom />
                                            </button>
                                        </div>
                                        
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); openEditModal(pl); }}
                                                className="p-2 bg-blue-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Edit"
                                            >
                                                <FaEdit size={12} />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDeletePlaylist(pl._id, pl.name); }}
                                                className="p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Delete"
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div 
                                        className="cursor-pointer"
                                        onClick={() => navigate(`/dashboard/playlist/${pl._id}`)}
                                    >
                                        <h3 className="font-bold text-lg truncate">{pl.name}</h3>
                                        <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {pl.songs.length} song{pl.songs.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default PlaylistsPage;