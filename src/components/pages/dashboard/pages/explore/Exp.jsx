

// import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
// import { FaPlay, FaPause, FaSearch, FaHeadphonesAlt, FaHeart, FaRegHeart, FaFilter, FaTimes, FaMusic, FaUser } from 'react-icons/fa';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { PlayerContext } from '../../../../../context/PlayerContext';
// import { useTheme } from '../../../../../context/ThemeContext';
// import { motion, AnimatePresence } from 'framer-motion';

// // --- Helper to build image URLs ---
// const buildImageUrl = (path) => {
//   if (!path) return 'https://via.placeholder.com/160';
//   if (path.startsWith('http')) return path;
//   return `${import.meta.env.VITE_API_URL}/${path.replace(/\\/g, '/')}`;
// };

// // --- Ripple Effect Button ---
// const RippleButton = ({ children, onClick, className = '', disabled = false }) => {
//   const [ripple, setRipple] = useState({ x: 0, y: 0, active: false });

//   const handleClick = (e) => {
//     if (disabled) return;
    
//     const rect = e.currentTarget.getBoundingClientRect();
//     setRipple({
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//       active: true
//     });
//     setTimeout(() => setRipple({ ...ripple, active: false }), 600);
//     if (onClick) onClick(e);
//   };

//   return (
//     <button
//       className={`ripple-button relative overflow-hidden rounded-lg transition-all duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} ${className}`}
//       onClick={handleClick}
//       disabled={disabled}
//     >
//       {children}
//       {ripple.active && (
//         <span
//           className="ripple absolute bg-white bg-opacity-40 rounded-full animate-ripple"
//           style={{
//             left: ripple.x,
//             top: ripple.y,
//             width: 0,
//             height: 0,
//             transform: 'translate(-50%, -50%)',
//           }}
//         />
//       )}
//     </button>
//   );
// };

// // --- Music Card Component ---
// const MusicCard = ({ item, playAction }) => {
//   const { isDarkMode } = useTheme();
//   const { currentSong, isPlaying, likedSongs, likeSong, unlikeSong } = useContext(PlayerContext);
//   const isCurrentlyPlaying = currentSong && currentSong._id === item._id;
  
//   // Handle both array and Set formats for likedSongs
//   const isLiked = useMemo(() => {
//     if (!likedSongs) return false;
//     if (Array.isArray(likedSongs)) return likedSongs.includes(item._id);
//     if (likedSongs instanceof Set) return likedSongs.has(item._id);
//     return false;
//   }, [likedSongs, item._id]);

//   const handleLikeClick = (e) => {
//     e.stopPropagation();
//     if (isLiked) {
//       unlikeSong(item._id);
//     } else {
//       likeSong(item._id);
//     }
//   };

//   const handleCardClick = () => {
//     playAction();
//   };

//   return (
//     <motion.div
//       className="flex-shrink-0 w-[160px] cursor-pointer"
//       whileHover={{ y: -5 }}
//       transition={{ duration: 0.2 }}
//       onClick={handleCardClick}
//     >
//       <div className={`p-2 rounded-xl backdrop-blur-md border ${
//         isDarkMode
//           ? 'bg-gray-800/70 border-gray-700'
//           : 'bg-white/70 border-gray-200'
//       } shadow-lg`}>
//         <div className="relative">
//           <img
//             src={buildImageUrl(item.coverArtPath)}
//             alt={item.title}
//             className="w-[144px] h-[144px] object-cover rounded-lg shadow-md"
//           />
//           <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
//             <RippleButton
//               onClick={(e) => {
//                 e.stopPropagation();
//                 playAction();
//               }}
//               className="bg-green-500 text-white p-3 rounded-full shadow-xl play-button"
//             >
//               {isCurrentlyPlaying && isPlaying ? <FaPause size={14} /> : <FaPlay size={14} className="ml-0.5" />}
//             </RippleButton>
//           </div>
//         </div>
//         <div className="mt-2 text-left">
//           <h3 className={`font-semibold text-sm truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//             {item.title}
//           </h3>
//           <p className="text-xs text-gray-400 mt-0.5 truncate">{item.artist}</p>
//           <div className="flex justify-between items-center mt-2">
//             <span className="text-xs text-gray-500">{item.genre || 'Unknown'}</span>
//             <RippleButton
//               onClick={handleLikeClick}
//               className="text-red-500 hover:text-red-600 p-1"
//             >
//               {isLiked ? <FaHeart size={12} /> : <FaRegHeart size={12} />}
//             </RippleButton>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // --- Category Card Component ---
// const CategoryCard = ({ title, gradient, icon, onClick, count }) => {
//   return (
//     <RippleButton
//       onClick={onClick}
//       className={`${gradient} rounded-xl p-4 flex flex-col justify-between items-start h-24 w-full text-white text-left shadow-lg overflow-hidden relative`}
//     >
//       <div className="text-2xl absolute top-3 right-3 opacity-80">{icon}</div>
//       <h3 className="text-md font-semibold mt-auto">{title}</h3>
//       {count && <span className="text-xs opacity-80">{count} songs</span>}
//     </RippleButton>
//   );
// };

// // --- Popular Artist Card ---
// const PopularArtistCard = ({ artist }) => {
//   const { isDarkMode } = useTheme();
//   const navigate = useNavigate();

//   const handleClick = () => {
//     navigate(`/dashboard/artist/${encodeURIComponent(artist.name)}`);
//   };

//   return (
//     <motion.div
//       className="flex-shrink-0 w-[140px] cursor-pointer"
//       whileHover={{ y: -5 }}
//       onClick={handleClick}
//     >
//       <div className={`p-3 rounded-xl backdrop-blur-md border ${
//         isDarkMode
//           ? 'bg-gray-800/70 border-gray-700'
//           : 'bg-white/70 border-gray-200'
//       } shadow-lg flex flex-col items-center`}>
//         <div className="relative mb-3">
//           <img
//             src={buildImageUrl(artist.image)}
//             alt={artist.name}
//             className="w-20 h-20 object-cover rounded-full shadow-md"
//           />
//           <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
//             <FaUser className="text-white" />
//           </div>
//         </div>
//         <div className="text-center">
//           <h4 className={`font-semibold text-sm truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//             {artist.name}
//           </h4>
//           <p className="text-xs text-gray-400 mt-0.5">{artist.count} songs</p>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // --- Trending Song Item Component ---
// const TrendingSongItem = ({ song, index, playAction }) => {
//   const { isDarkMode } = useTheme();
//   const { currentSong, isPlaying, likedSongs, likeSong, unlikeSong } = useContext(PlayerContext);
//   const isCurrentlyPlaying = currentSong && currentSong._id === song._id;
  
//   // Handle both array and Set formats for likedSongs
//   const isLiked = useMemo(() => {
//     if (!likedSongs) return false;
//     if (Array.isArray(likedSongs)) return likedSongs.includes(song._id);
//     if (likedSongs instanceof Set) return likedSongs.has(song._id);
//     return false;
//   }, [likedSongs, song._id]);

//   const handleLikeClick = (e) => {
//     e.stopPropagation();
//     if (isLiked) {
//       unlikeSong(song._id);
//     } else {
//       likeSong(song._id);
//     }
//   };

//   const handleRowClick = () => {
//     playAction();
//   };

//   return (
//     <motion.div
//       className={`flex items-center p-3 rounded-xl cursor-pointer backdrop-blur-md border ${
//         isDarkMode
//           ? 'bg-gray-800/70 border-gray-700 hover:bg-gray-700/80'
//           : 'bg-white/70 border-gray-200 hover:bg-gray-50/80'
//       } ${isCurrentlyPlaying ? 'ring-2 ring-green-500' : ''}`}
//       whileHover={{ x: 5 }}
//       onClick={handleRowClick}
//     >
//       <span className={`text-lg font-bold mr-4 w-6 text-center ${
//         isDarkMode ? 'text-gray-400' : 'text-gray-500'
//       }`}>
//         {index + 1}
//       </span>
//       <img
//         src={buildImageUrl(song.coverArtPath)}
//         alt={song.title}
//         className="w-12 h-12 object-cover rounded-lg"
//       />
//       <div className="ml-3 flex-1 min-w-0">
//         <h3 className={`font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//           {song.title}
//         </h3>
//         <p className="text-xs text-gray-500 truncate">{song.artist}</p>
//       </div>
//       <div className="flex items-center space-x-3 ml-auto">
//         <RippleButton
//           onClick={(e) => {
//             e.stopPropagation();
//             playAction();
//           }}
//           className="p-2 text-green-500 hover:text-green-600 focus:outline-none"
//         >
//           {isCurrentlyPlaying && isPlaying ? <FaPause /> : <FaPlay />}
//         </RippleButton>
//         <RippleButton
//           onClick={handleLikeClick}
//           className="p-2 text-red-500 hover:text-red-600 focus:outline-none"
//         >
//           {isLiked ? <FaHeart /> : <FaRegHeart />}
//         </RippleButton>
//       </div>
//     </motion.div>
//   );
// };

// // --- Filter Modal Component ---
// const FilterModal = ({ isOpen, onClose, filters, setFilters, applyFilters, stats }) => {
//   const { isDarkMode } = useTheme();
  
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className={`w-full max-w-md rounded-2xl p-6 backdrop-blur-md border ${
//         isDarkMode
//           ? 'bg-gray-800/90 border-gray-700'
//           : 'bg-white/90 border-gray-200'
//       } shadow-xl`}>
//         <div className="flex justify-between items-center mb-6">
//           <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//             Filter Songs
//           </h2>
//           <button onClick={onClose} className={`p-2 rounded-full ${
//             isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
//           }`}>
//             <FaTimes className={isDarkMode ? 'text-white' : 'text-gray-900'} />
//           </button>
//         </div>

//         <div className="space-y-6">
//           <div>
//             <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Language</h3>
//             <div className="flex flex-wrap gap-2">
//               {stats?.languages?.map(lang => (
//                 <button
//                   key={lang}
//                   onClick={() => setFilters(prev => ({
//                     ...prev,
//                     language: prev.language === lang ? '' : lang
//                   }))}
//                   className={`px-3 py-1 rounded-full text-sm ${
//                     filters.language === lang
//                       ? 'bg-green-500 text-white'
//                       : isDarkMode
//                         ? 'bg-gray-700 text-white'
//                         : 'bg-gray-200 text-gray-900'
//                   }`}
//                 >
//                   {lang}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div>
//             <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Genre</h3>
//             <div className="flex flex-wrap gap-2">
//               {stats?.genres?.map(genre => (
//                 <button
//                   key={genre}
//                   onClick={() => setFilters(prev => ({
//                     ...prev,
//                     genre: prev.genre === genre ? '' : genre
//                   }))}
//                   className={`px-3 py-1 rounded-full text-sm ${
//                     filters.genre === genre
//                       ? 'bg-green-500 text-white'
//                       : isDarkMode
//                         ? 'bg-gray-700 text-white'
//                         : 'bg-gray-200 text-gray-900'
//                   }`}
//                 >
//                   {genre}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div>
//             <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Mood</h3>
//             <div className="flex flex-wrap gap-2">
//               {['High Energy', 'Chill', 'Focus', 'Happy', 'Sad'].map(mood => (
//                 <button
//                   key={mood}
//                   onClick={() => setFilters(prev => ({
//                     ...prev,
//                     mood: prev.mood === mood ? '' : mood
//                   }))}
//                   className={`px-3 py-1 rounded-full text-sm ${
//                     filters.mood === mood
//                       ? 'bg-green-500 text-white'
//                       : isDarkMode
//                         ? 'bg-gray-700 text-white'
//                         : 'bg-gray-200 text-gray-900'
//                   }`}
//                 >
//                   {mood}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="flex justify-end gap-3">
//             <RippleButton
//               onClick={() => setFilters({ language: '', genre: '', mood: '' })}
//               className={`px-4 py-2 ${
//                 isDarkMode
//                   ? 'bg-gray-700 text-white'
//                   : 'bg-gray-200 text-gray-900'
//               }`}
//             >
//               Clear
//             </RippleButton>
//             <RippleButton
//               onClick={applyFilters}
//               className="px-4 py-2 bg-green-500 text-white"
//             >
//               Apply
//             </RippleButton>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Main Explore Page ---
// const Exp = () => {
//   const [songs, setSongs] = useState([]);
//   const [artists, setArtists] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeFilter, setActiveFilter] = useState(null);
//   const [filteredSongs, setFilteredSongs] = useState([]);
//   const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
//   const [filters, setFilters] = useState({ language: '', genre: '', mood: '' });
//   const [searchQuery, setSearchQuery] = useState('');
//   const { playSong, likeSong, unlikeSong, likedSongs } = useContext(PlayerContext);
//   const { isDarkMode } = useTheme();
//   const navigate = useNavigate();

//   // Fetch all data on component mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [songsRes] = await Promise.all([
//           axios.get(`${import.meta.env.VITE_API_URL}/public/songs`)
//         ]);
        
//         setSongs(songsRes.data);
        
//         // Process artist data from songs
//         const artistMap = {};
//         songsRes.data.forEach(song => {
//           if (!artistMap[song.artist]) {
//             artistMap[song.artist] = {
//               name: song.artist,
//               image: song.artistPic,
//               count: 0
//             };
//           }
//           artistMap[song.artist].count++;
//         });
        
//         // Convert to array and sort by count
//         const artistList = Object.values(artistMap).sort((a, b) => b.count - a.count);
//         setArtists(artistList);
        
//         // Calculate stats
//         const languages = [...new Set(songsRes.data.map(song => song.language).filter(Boolean))];
//         const genres = [...new Set(songsRes.data.map(song => song.genre).filter(Boolean))];
        
//         setStats({
//           totalSongs: songsRes.data.length,
//           languages,
//           genres
//         });
//       } catch (error) {
//         console.error("Failed to fetch data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   // Memoized data processing
//   const { newReleases, topCharts } = useMemo(() => {
//     const newReleases = [...songs]
//       .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
//       .slice(0, 10);
      
//     const topCharts = [...songs]
//       .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
//       .slice(0, 5);

//     return { newReleases, topCharts };
//   }, [songs]);

//   // Filter songs by category
//   const filterSongs = useCallback((category, type = 'genre') => {
//     setActiveFilter({ type, value: category });
//     if (category === 'all') {
//       setFilteredSongs(songs);
//     } else {
//       const filtered = songs.filter(song => {
//         if (type === 'genre') {
//           return song.genre?.toLowerCase().includes(category.toLowerCase());
//         } else if (type === 'mood') {
//           return song.mood?.toLowerCase().includes(category.toLowerCase());
//         } else if (type === 'language') {
//           return song.language?.toLowerCase().includes(category.toLowerCase());
//         }
//         return false;
//       });
//       setFilteredSongs(filtered);
//     }
//   }, [songs]);

//   // Apply filters from modal
//   const applyFilters = useCallback(() => {
//     const filtered = songs.filter(song => {
//       let matches = true;
//       if (filters.language) {
//         matches = matches && song.language?.toLowerCase().includes(filters.language.toLowerCase());
//       }
//       if (filters.genre) {
//         matches = matches && song.genre?.toLowerCase().includes(filters.genre.toLowerCase());
//       }
//       if (filters.mood) {
//         matches = matches && song.mood?.toLowerCase().includes(filters.mood.toLowerCase());
//       }
//       return matches;
//     });
    
//     setFilteredSongs(filtered);
//     setActiveFilter({ type: 'filtered', value: 'Custom Filter' });
//     setIsFilterModalOpen(false);
//   }, [filters, songs]);

//   // Handle search
//   const handleSearch = useCallback(() => {
//     if (!searchQuery.trim()) {
//       setActiveFilter(null);
//       return;
//     }
    
//     const filtered = songs.filter(song =>
//       song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       song.album.toLowerCase().includes(searchQuery.toLowerCase())
//     );
    
//     setFilteredSongs(filtered);
//     setActiveFilter({ type: 'search', value: searchQuery });
//   }, [searchQuery, songs]);

//   // Handle Enter key in search
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSearch();
//     }
//   };

//   // --- Category Card Data (with gradients) ---
//   const topCategories = [
//     { name: "New releases", icon: "💿", gradient: "bg-gradient-to-br from-blue-500 to-indigo-600", key: "new_releases", action: () => filterSongs('all') },
//     { name: "Charts", icon: "📈", gradient: "bg-gradient-to-br from-red-500 to-pink-600", key: "charts", action: () => filterSongs('all') },
//     { name: "Moods and genres", icon: "😄", gradient: "bg-gradient-to-br from-purple-500 to-deep-purple-600", key: "moods_genres", action: () => setIsFilterModalOpen(true) },
//     { name: "Discover", icon: "🔍", gradient: "bg-gradient-to-br from-teal-500 to-green-600", key: "discover", action: () => filterSongs('all') },
//   ];

//   // --- Genre categories (with gradients and counts) ---
//   const genres = useMemo(() => {
//     if (!stats?.genres) return [];
    
//     return stats.genres.slice(0, 6).map(genre => ({
//       name: genre,
//       gradient: "bg-gradient-to-br from-purple-500 to-indigo-600",
//       key: genre.toLowerCase(),
//       count: songs.filter(s => s.genre === genre).length,
//       action: () => filterSongs(genre, 'genre')
//     }));
//   }, [stats, songs]);

//   // Mood categories
//   const moods = [
//     { name: "High Energy", gradient: "bg-gradient-to-br from-red-500 to-orange-500", key: "high_energy", action: () => filterSongs('High Energy', 'mood') },
//     { name: "Chill", gradient: "bg-gradient-to-br from-blue-500 to-cyan-500", key: "chill", action: () => filterSongs('Chill', 'mood') },
//     { name: "Focus", gradient: "bg-gradient-to-br from-green-500 to-emerald-500", key: "focus", action: () => filterSongs('Focus', 'mood') },
//     { name: "Happy", gradient: "bg-gradient-to-br from-yellow-500 to-amber-500", key: "happy", action: () => filterSongs('Happy', 'mood') },
//     { name: "Sad", gradient: "bg-gradient-to-br from-indigo-500 to-purple-500", key: "sad", action: () => filterSongs('Sad', 'mood') },
//   ];

//   if (loading) return (
//     <div className={`min-h-screen flex items-center justify-center ${
//       isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
//     }`}>
//       <div className="text-center">
//         <FaHeadphonesAlt className="text-4xl text-green-500 mx-auto mb-4 animate-pulse" />
//         <p>Exploring new music...</p>
//       </div>
//     </div>
//   );

//   return (
//     <div className={`min-h-screen pb-20 explore-container ${isDarkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-b from-blue-50 to-gray-100 text-gray-900'} font-sans`}>
//       <main className="p-4 sm:p-6 max-w-7xl mx-auto">
//         {/* Header with Search */}
//         <div className={`p-4 rounded-xl mb-8 backdrop-blur-md border ${
//           isDarkMode
//             ? 'bg-gray-800/70 border-gray-700'
//             : 'bg-white/70 border-gray-200'
//         } shadow-lg`}>
//           <h1 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
//             Explore Music
//           </h1>
//           <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
//             Discover {stats?.totalSongs || 0} songs across {stats?.languages?.length || 0} languages
//           </p>
//           <div className="relative flex items-center">
//             <input
//               type="text"
//               placeholder="Search songs..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               onKeyPress={handleKeyPress}
//               className={`w-full py-2 pl-10 pr-4 rounded-full focus:outline-none focus:ring-2 ${
//                 isDarkMode
//                   ? 'bg-gray-700 text-white focus:ring-green-500'
//                   : 'bg-white text-gray-900 focus:ring-green-500'
//               }`}
//             />
//             <button
//               onClick={handleSearch}
//               className={`absolute right-3 p-1 rounded-full ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
//             >
//               <FaSearch />
//             </button>
//             {searchQuery && (
//               <button
//                 onClick={() => {
//                   setSearchQuery('');
//                   setActiveFilter(null);
//                 }}
//                 className="absolute right-12 top-3 text-gray-500"
//               >
//                 <FaTimes />
//               </button>
//             )}
            
//           </div>
//         </div>

//         {/* Filtered View */}
//         {activeFilter && (
//           <motion.section
//             className="mb-8"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//                 {activeFilter.type === 'search'
//                   ? `Search Results for "${activeFilter.value}"`
//                   : `${activeFilter.value} Music`}
//                 <span className="text-sm font-normal ml-2">({filteredSongs.length} songs)</span>
//               </h2>
//               <button
//                 onClick={() => setActiveFilter(null)}
//                 className={`flex items-center text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
//               >
//                 Show all
//               </button>
//             </div>
//             {filteredSongs.length > 0 ? (
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//                 {filteredSongs.map((song) => (
//                   <MusicCard
//                     key={song._id}
//                     item={song}
//                     playAction={() => playSong(song, filteredSongs)}
//                   />
//                 ))}
//               </div>
//             ) : (
//               <div className={`text-center py-10 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                 No songs found. Try a different search or filter.
//               </div>
//             )}
//           </motion.section>
//         )}

//         {/* Top 4 Navigation/Category Cards */}
//         {!activeFilter && (
//           <AnimatePresence>
//             <motion.div
//               className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.1 }}
//             >
//               {topCategories.map((cat) => (
//                 <CategoryCard
//                   key={cat.key}
//                   title={cat.name}
//                   gradient={cat.gradient}
//                   icon={cat.icon}
//                   onClick={cat.action}
//                 />
//               ))}
//             </motion.div>

//             {/* New Albums and Singles Section */}
//             <motion.section
//               className="mb-8"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.2 }}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//                   New albums and singles
//                 </h2>
//                 {newReleases.length > 0 && (
//                   <RippleButton
//                     className={`text-sm p-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
//                     onClick={() => playSong(newReleases[0], newReleases)}
//                   >
//                     <FaPlay />
//                   </RippleButton>
//                 )}
//               </div>
//               {newReleases.length > 0 ? (
//                 <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
//                   {newReleases.map((song) => (
//                     <MusicCard
//                       key={song._id}
//                       item={song}
//                       playAction={() => playSong(song, newReleases)}
//                     />
//                   ))}
//                 </div>
//               ) : (
//                 <div className={`text-center py-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                   No new releases available.
//                 </div>
//               )}
//             </motion.section>

//             {/* Moods Section */}
//             <motion.section
//               className="mb-8"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.3 }}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//                   Moods
//                 </h2>
//               </div>
//               {moods.length > 0 ? (
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
//                   {moods.map((mood) => (
//                     <CategoryCard
//                       key={mood.key}
//                       title={mood.name}
//                       gradient={mood.gradient}
//                       icon="🎵"
//                       onClick={mood.action}
//                     />
//                   ))}
//                 </div>
//               ) : (
//                 <div className={`text-center py-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                   No mood data available.
//                 </div>
//               )}
//             </motion.section>

//             {/* Genres Section */}
//             <motion.section
//               className="mb-8"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.3 }}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//                   Genres
//                 </h2>
//                 <div className="flex gap-2">
//                   <RippleButton
//                     className={`text-sm p-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
//                     onClick={() => setIsFilterModalOpen(true)}
//                   >
//                     <FaFilter />
//                   </RippleButton>
//                   <RippleButton
//                     className={`text-sm p-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
//                     onClick={() => filterSongs('all')}
//                   >
//                     View all
//                   </RippleButton>
//                 </div>
//               </div>
//               {genres.length > 0 ? (
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                   {genres.map((genre) => (
//                     <CategoryCard
//                       key={genre.key}
//                       title={genre.name}
//                       gradient={genre.gradient}
//                       icon={<FaMusic />}
//                       count={genre.count}
//                       onClick={genre.action}
//                     />
//                   ))}
//                 </div>
//               ) : (
//                 <div className={`text-center py-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                   No genre data available.
//                 </div>
//               )}
//             </motion.section>

//             {/* Popular Artists Section */}
//             <motion.section
//               className="mb-8"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.4 }}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//                   Popular artists
//                 </h2>
//                 <button
//                   onClick={() => filterSongs('all')}
//                   className={`flex items-center text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
//                 >
//                   View all
//                 </button>
//               </div>
//               {artists.length > 0 ? (
//                 <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
//                   {artists.slice(0, 10).map((artist) => (
//                     <PopularArtistCard
//                       key={artist.name}
//                       artist={artist}
//                     />
//                   ))}
//                 </div>
//               ) : (
//                 <div className={`text-center py-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                   No artist data available.
//                 </div>
//               )}
//             </motion.section>

//             {/* Trending Section */}
//             <motion.section
//               className="mb-8"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.5 }}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//                   Trending
//                 </h2>
//                 {topCharts.length > 0 && (
//                   <RippleButton
//                     className={`text-sm p-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
//                     onClick={() => playSong(topCharts[0], topCharts)}
//                   >
//                     <FaPlay />
//                   </RippleButton>
//                 )}
//               </div>
//               {topCharts.length > 0 ? (
//                 <div className="grid grid-cols-1 gap-3">
//                   {topCharts.map((song, index) => (
//                     <TrendingSongItem
//                       key={song._id}
//                       song={song}
//                       index={index}
//                       playAction={() => playSong(song, topCharts)}
//                     />
//                   ))}
//                 </div>
//               ) : (
//                 <div className={`text-center py-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                   No trending songs available.
//                 </div>
//               )}
//             </motion.section>
//           </AnimatePresence>
//         )}

//         {/* Filter Modal */}
//         <FilterModal
//           isOpen={isFilterModalOpen}
//           onClose={() => setIsFilterModalOpen(false)}
//           filters={filters}
//           setFilters={setFilters}
//           applyFilters={applyFilters}
//           stats={stats}
//         />
//       </main>
//     </div>
//   );
// };

// export default Exp;




import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { FaPlay, FaPause, FaSearch, FaHeadphonesAlt, FaHeart, FaRegHeart, FaFilter, FaTimes, FaMusic, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PlayerContext } from '../../../../../context/PlayerContext';
import { useTheme } from '../../../../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

// --- Helper to build image URLs ---
const buildImageUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/160';
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_URL}/${path.replace(/\\/g, '/')}`;
};

// --- Ripple Effect Button ---
const RippleButton = ({ children, onClick, className = '', disabled = false }) => {
  const [ripple, setRipple] = useState({ x: 0, y: 0, active: false });

  const handleClick = (e) => {
    if (disabled) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true
    });
    setTimeout(() => setRipple({ ...ripple, active: false }), 600);
    if (onClick) onClick(e);
  };

  return (
    <button 
      className={`ripple-button relative overflow-hidden rounded-lg transition-all duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} ${className}`} 
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
      {ripple.active && (
        <span 
          className="ripple absolute bg-white bg-opacity-40 rounded-full animate-ripple" 
          style={{ 
            left: ripple.x, 
            top: ripple.y,
            width: 0,
            height: 0,
            transform: 'translate(-50%, -50%)',
          }} 
        />
      )}
    </button>
  );
};

// --- Music Card Component ---
const MusicCard = ({ item, playAction, onAlbumClick }) => {
  const { isDarkMode } = useTheme();
  const { currentSong, isPlaying, likedSongs, likeSong, unlikeSong } = useContext(PlayerContext);
  const isCurrentlyPlaying = currentSong && currentSong._id === item._id;
  
  // Handle both array and Set formats for likedSongs
  const isLiked = useMemo(() => {
    if (!likedSongs) return false;
    if (Array.isArray(likedSongs)) return likedSongs.includes(item._id);
    if (likedSongs instanceof Set) return likedSongs.has(item._id);
    return false;
  }, [likedSongs, item._id]);

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (isLiked) {
      unlikeSong(item._id);
    } else {
      likeSong(item._id);
    }
  };

  const handleCardClick = () => {
    if (onAlbumClick) {
      onAlbumClick(item.album);
    } else {
      playAction();
    }
  };

  return (
    <motion.div 
      className="flex-shrink-0 w-[160px] cursor-pointer"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
    >
      <div className={`p-2 rounded-xl backdrop-blur-md border ${
        isDarkMode 
          ? 'bg-gray-800/70 border-gray-700' 
          : 'bg-white/70 border-gray-200'
      } shadow-lg`}>
        <div className="relative">
          <img
            src={buildImageUrl(item.coverArtPath)}
            alt={item.title}
            className="w-[144px] h-[144px] object-cover rounded-lg shadow-md"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
            <RippleButton
              onClick={(e) => {
                e.stopPropagation();
                playAction();
              }}
              className="bg-green-500 text-white p-3 rounded-full shadow-xl play-button"
            >
              {isCurrentlyPlaying && isPlaying ? <FaPause size={14} /> : <FaPlay size={14} className="ml-0.5" />}
            </RippleButton>
          </div>
        </div>
        <div className="mt-2 text-left">
          <h3 className={`font-semibold text-sm truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {item.title}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{item.artist}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">{item.genre || 'Unknown'}</span>
            <RippleButton
              onClick={handleLikeClick}
              className="text-red-500 hover:text-red-600 p-1"
            >
              {isLiked ? <FaHeart size={12} /> : <FaRegHeart size={12} />}
            </RippleButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Category Card Component ---
const CategoryCard = ({ title, gradient, icon, onClick, count }) => {
  return (
    <RippleButton
      onClick={onClick}
      className={`${gradient} rounded-xl p-4 flex flex-col justify-between items-start h-24 w-full text-white text-left shadow-lg overflow-hidden relative`}
    >
      <div className="text-2xl absolute top-3 right-3 opacity-80">{icon}</div>
      <h3 className="text-md font-semibold mt-auto">{title}</h3>
      {count && <span className="text-xs opacity-80">{count} songs</span>}
    </RippleButton>
  );
};

// --- Popular Artist Card ---
const PopularArtistCard = ({ artist }) => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/dashboard/artist/${encodeURIComponent(artist.name)}`);
  };

  return (
    <motion.div 
      className="flex-shrink-0 w-[140px] cursor-pointer"
      whileHover={{ y: -5 }}
      onClick={handleClick}
    >
      <div className={`p-3 rounded-xl backdrop-blur-md border ${
        isDarkMode 
          ? 'bg-gray-800/70 border-gray-700' 
          : 'bg-white/70 border-gray-200'
      } shadow-lg flex flex-col items-center`}>
        <div className="relative mb-3">
          <img
            src={buildImageUrl(artist.image)}
            alt={artist.name}
            className="w-20 h-20 object-cover rounded-full shadow-md"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
            <FaUser className="text-white" />
          </div>
        </div>
        <div className="text-center">
          <h4 className={`font-semibold text-sm truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {artist.name}
          </h4>
          <p className="text-xs text-gray-400 mt-0.5">{artist.count} songs</p>
        </div>
      </div>
    </motion.div>
  );
};

// --- Trending Song Item Component ---
const TrendingSongItem = ({ song, index, playAction }) => {
  const { isDarkMode } = useTheme();
  const { currentSong, isPlaying, likedSongs, likeSong, unlikeSong } = useContext(PlayerContext);
  const isCurrentlyPlaying = currentSong && currentSong._id === song._id;
  
  // Handle both array and Set formats for likedSongs
  const isLiked = useMemo(() => {
    if (!likedSongs) return false;
    if (Array.isArray(likedSongs)) return likedSongs.includes(song._id);
    if (likedSongs instanceof Set) return likedSongs.has(song._id);
    return false;
  }, [likedSongs, song._id]);

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (isLiked) {
      unlikeSong(song._id);
    } else {
      likeSong(song._id);
    }
  };

  const handleRowClick = () => {
    playAction();
  };

  return (
    <motion.div
      className={`flex items-center p-3 rounded-xl cursor-pointer backdrop-blur-md border ${
        isDarkMode
          ? 'bg-gray-800/70 border-gray-700 hover:bg-gray-700/80'
          : 'bg-white/70 border-gray-200 hover:bg-gray-50/80'
      } ${isCurrentlyPlaying ? 'ring-2 ring-green-500' : ''}`}
      whileHover={{ x: 5 }}
      onClick={handleRowClick}
    >
      <span className={`text-lg font-bold mr-4 w-6 text-center ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        {index + 1}
      </span>
      <img
        src={buildImageUrl(song.coverArtPath)}
        alt={song.title}
        className="w-12 h-12 object-cover rounded-lg"
      />
      <div className="ml-3 flex-1 min-w-0">
        <h3 className={`font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {song.title}
        </h3>
        <p className="text-xs text-gray-500 truncate">{song.artist}</p>
      </div>
      <div className="flex items-center space-x-3 ml-auto">
        <RippleButton
          onClick={(e) => {
            e.stopPropagation();
            playAction();
          }}
          className="p-2 text-green-500 hover:text-green-600 focus:outline-none"
        >
          {isCurrentlyPlaying && isPlaying ? <FaPause /> : <FaPlay />}
        </RippleButton>
        <RippleButton
          onClick={handleLikeClick}
          className="p-2 text-red-500 hover:text-red-600 focus:outline-none"
        >
          {isLiked ? <FaHeart /> : <FaRegHeart />}
        </RippleButton>
      </div>
    </motion.div>
  );
};

// --- Filter Modal Component ---
const FilterModal = ({ isOpen, onClose, filters, setFilters, applyFilters, stats }) => {
  const { isDarkMode } = useTheme();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md rounded-2xl p-6 backdrop-blur-md border ${
        isDarkMode 
          ? 'bg-gray-800/90 border-gray-700' 
          : 'bg-white/90 border-gray-200'
      } shadow-xl`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Filter Songs
          </h2>
          <button onClick={onClose} className={`p-2 rounded-full ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}>
            <FaTimes className={isDarkMode ? 'text-white' : 'text-gray-900'} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Language</h3>
            <div className="flex flex-wrap gap-2">
              {stats?.languages?.map(lang => (
                <button
                  key={lang}
                  onClick={() => setFilters(prev => ({
                    ...prev,
                    language: prev.language === lang ? '' : lang
                  }))}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.language === lang 
                      ? 'bg-green-500 text-white' 
                      : isDarkMode 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Genre</h3>
            <div className="flex flex-wrap gap-2">
              {stats?.genres?.map(genre => (
                <button
                  key={genre}
                  onClick={() => setFilters(prev => ({
                    ...prev,
                    genre: prev.genre === genre ? '' : genre
                  }))}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.genre === genre 
                      ? 'bg-green-500 text-white' 
                      : isDarkMode 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Mood</h3>
            <div className="flex flex-wrap gap-2">
              {['High Energy', 'Chill', 'Focus', 'Happy', 'Sad'].map(mood => (
                <button
                  key={mood}
                  onClick={() => setFilters(prev => ({
                    ...prev,
                    mood: prev.mood === mood ? '' : mood
                  }))}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.mood === mood 
                      ? 'bg-green-500 text-white' 
                      : isDarkMode 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <RippleButton
              onClick={() => setFilters({ language: '', genre: '', mood: '' })}
              className={`px-4 py-2 ${
                isDarkMode 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              Clear
            </RippleButton>
            <RippleButton
              onClick={applyFilters}
              className="px-4 py-2 bg-green-500 text-white"
            >
              Apply
            </RippleButton>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Explore Page ---
const Exp = () => {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({ language: '', genre: '', mood: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const { playSong, likeSong, unlikeSong, likedSongs } = useContext(PlayerContext);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Only fetch the main songs data
        const songsRes = await axios.get(`${import.meta.env.VITE_API_URL}/public/songs`);
        
        setSongs(songsRes.data);
        
        // Process artist data from songs
        const artistMap = {};
        songsRes.data.forEach(song => {
          if (!artistMap[song.artist]) {
            artistMap[song.artist] = {
              name: song.artist,
              image: song.artistPic,
              count: 0
            };
          }
          artistMap[song.artist].count++;
        });
        
        // Convert to array and sort by count
        const artistList = Object.values(artistMap).sort((a, b) => b.count - a.count);
        setArtists(artistList);
        
        // Calculate stats
        const languages = [...new Set(songsRes.data.map(song => song.language).filter(Boolean))];
        const genres = [...new Set(songsRes.data.map(song => song.genre).filter(Boolean))];
        
        // Calculate trending songs locally (top 10 by viewCount)
        const trendingSongs = songsRes.data
          .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
          .slice(0, 10);
        
        setStats({
          totalSongs: songsRes.data.length,
          languages,
          genres,
          trendingSongs
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load music data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Memoized data processing
  const { newReleases, topCharts } = useMemo(() => {
    const newReleases = [...songs]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 10);
      
    // Use trending songs from stats if available, otherwise fall back to viewCount sorting
    let trendingSongs = [];
    if (stats?.trendingSongs) {
      trendingSongs = stats.trendingSongs.slice(0, 5);
    } else {
      trendingSongs = [...songs]
        .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
        .slice(0, 5);
    }

    return { newReleases, topCharts: trendingSongs };
  }, [songs, stats]);

  // Filter songs by category
  const filterSongs = useCallback((category, type = 'genre') => {
    setActiveFilter({ type, value: category });
    if (category === 'all') {
      setFilteredSongs(songs);
    } else {
      const filtered = songs.filter(song => {
        if (type === 'genre') {
          return song.genre?.toLowerCase().includes(category.toLowerCase());
        } else if (type === 'mood') {
          return song.mood?.toLowerCase().includes(category.toLowerCase());
        } else if (type === 'language') {
          return song.language?.toLowerCase().includes(category.toLowerCase());
        }
        return false;
      });
      setFilteredSongs(filtered);
    }
  }, [songs]);

  // Apply filters from modal
  const applyFilters = useCallback(() => {
    const filtered = songs.filter(song => {
      let matches = true;
      if (filters.language) {
        matches = matches && song.language?.toLowerCase().includes(filters.language.toLowerCase());
      }
      if (filters.genre) {
        matches = matches && song.genre?.toLowerCase().includes(filters.genre.toLowerCase());
      }
      if (filters.mood) {
        matches = matches && song.mood?.toLowerCase().includes(filters.mood.toLowerCase());
      }
      return matches;
    });
    
    setFilteredSongs(filtered);
    setActiveFilter({ type: 'filtered', value: 'Custom Filter' });
    setIsFilterModalOpen(false);
  }, [filters, songs]);

  // Handle search
  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      setActiveFilter(null);
      return;
    }
    
    const filtered = songs.filter(song => 
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.album.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredSongs(filtered);
    setActiveFilter({ type: 'search', value: searchQuery });
  }, [searchQuery, songs]);

  // Handle Enter key in search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle album click - redirect to album page
  const handleAlbumClick = useCallback((albumName) => {
    navigate(`/dashboard/album/${encodeURIComponent(albumName)}`);
  }, [navigate]);

  // --- Category Card Data (with gradients) ---
  const topCategories = [
    { name: "New releases", icon: "💿", gradient: "bg-gradient-to-br from-blue-500 to-indigo-600", key: "new_releases", action: () => filterSongs('all') },
    { name: "Charts", icon: "📈", gradient: "bg-gradient-to-br from-red-500 to-pink-600", key: "charts", action: () => filterSongs('all') },
    { name: "Moods and genres", icon: "😄", gradient: "bg-gradient-to-br from-purple-500 to-deep-purple-600", key: "moods_genres", action: () => setIsFilterModalOpen(true) },
    { name: "Discover", icon: "🔍", gradient: "bg-gradient-to-br from-teal-500 to-green-600", key: "discover", action: () => filterSongs('all') },
  ];

  // --- Genre categories (with gradients and counts) ---
  const genres = useMemo(() => {
    if (!stats?.genres) return [];
    
    return stats.genres.slice(0, 6).map(genre => ({
      name: genre,
      gradient: "bg-gradient-to-br from-purple-500 to-indigo-600",
      key: genre.toLowerCase(),
      count: songs.filter(s => s.genre === genre).length,
      action: () => filterSongs(genre, 'genre')
    }));
  }, [stats, songs]);

  // Mood categories
  const moods = [
    { name: "High Energy", gradient: "bg-gradient-to-br from-red-500 to-orange-500", key: "high_energy", action: () => filterSongs('High Energy', 'mood') },
    { name: "Chill", gradient: "bg-gradient-to-br from-blue-500 to-cyan-500", key: "chill", action: () => filterSongs('Chill', 'mood') },
    { name: "Focus", gradient: "bg-gradient-to-br from-green-500 to-emerald-500", key: "focus", action: () => filterSongs('Focus', 'mood') },
    { name: "Happy", gradient: "bg-gradient-to-br from-yellow-500 to-amber-500", key: "happy", action: () => filterSongs('Happy', 'mood') },
    { name: "Sad", gradient: "bg-gradient-to-br from-indigo-500 to-purple-500", key: "sad", action: () => filterSongs('Sad', 'mood') },
  ];

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="text-center">
        <FaHeadphonesAlt className="text-4xl text-green-500 mx-auto mb-4 animate-pulse" />
        <p>Exploring new music...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className={`min-h-screen flex items-center justify-center ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="text-center">
        <FaHeadphonesAlt className="text-4xl text-red-500 mx-auto mb-4" />
        <p className="text-lg mb-2">Error Loading Music</p>
        <p className="text-sm text-gray-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen pb-20 explore-container ${isDarkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-b from-blue-50 to-gray-100 text-gray-900'} font-sans`}>
      <main className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Header with Search */}
        <div className={`p-4 rounded-xl mb-8 backdrop-blur-md border ${
          isDarkMode 
            ? 'bg-gray-800/70 border-gray-700' 
            : 'bg-white/70 border-gray-200'
        } shadow-lg`}>
          <h1 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
            Explore Music
          </h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
            Discover {stats?.totalSongs || 0} songs across {stats?.languages?.length || 0} languages
          </p>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search songs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`w-full py-2 pl-10 pr-4 rounded-full focus:outline-none focus:ring-2 ${
                isDarkMode 
                  ? 'bg-gray-700 text-white focus:ring-green-500' 
                  : 'bg-white text-gray-900 focus:ring-green-500'
              }`}
            />
            <button 
              onClick={handleSearch}
              className={`absolute right-3 p-1 rounded-full ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <FaSearch />
            </button>
            {searchQuery && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter(null);
                }}
                className="absolute right-12 top-3 text-gray-500"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Filtered View */}
        {activeFilter && (
          <motion.section 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {activeFilter.type === 'search' 
                  ? `Search Results for "${activeFilter.value}"` 
                  : `${activeFilter.value} Music`}
                <span className="text-sm font-normal ml-2">({filteredSongs.length} songs)</span>
              </h2>
              <button 
                onClick={() => setActiveFilter(null)}
                className={`flex items-center text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Show all
              </button>
            </div>
            {filteredSongs.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredSongs.map((song) => (
                  <MusicCard
                    key={song._id}
                    item={song}
                    playAction={() => playSong(song, filteredSongs)}
                    onAlbumClick={handleAlbumClick}
                  />
                ))}
              </div>
            ) : (
              <div className={`text-center py-10 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No songs found. Try a different search or filter.
              </div>
            )}
          </motion.section>
        )}

        {/* Top 4 Navigation/Category Cards */}
        {!activeFilter && (
          <AnimatePresence>
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {topCategories.map((cat) => (
                <CategoryCard
                  key={cat.key}
                  title={cat.name}
                  gradient={cat.gradient}
                  icon={cat.icon}
                  onClick={cat.action}
                />
              ))}
            </motion.div>

            {/* New Albums and Singles Section */}
            <motion.section 
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  New albums and singles
                </h2>
                {newReleases.length > 0 && (
                  <RippleButton 
                    className={`text-sm p-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => playSong(newReleases[0], newReleases)}
                  >
                    <FaPlay />
                  </RippleButton>
                )}
              </div>
              {newReleases.length > 0 ? (
                <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                  {newReleases.map((song) => (
                    <MusicCard
                      key={song._id}
                      item={song}
                      playAction={() => playSong(song, newReleases)}
                      onAlbumClick={handleAlbumClick}
                    />
                  ))}
                </div>
              ) : (
                <div className={`text-center py-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No new releases available.
                </div>
              )}
            </motion.section>

            {/* Moods Section */}
            <motion.section 
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Moods
                </h2>
              </div>
              {moods.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {moods.map((mood) => (
                    <CategoryCard
                      key={mood.key}
                      title={mood.name}
                      gradient={mood.gradient}
                      icon="🎵"
                      onClick={mood.action}
                    />
                  ))}
                </div>
              ) : (
                <div className={`text-center py-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No mood data available.
                </div>
              )}
            </motion.section>

            {/* Genres Section */}
            <motion.section 
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Genres
                </h2>
                <div className="flex gap-2">
                  <RippleButton 
                    className={`text-sm p-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setIsFilterModalOpen(true)}
                  >
                    <FaFilter />
                  </RippleButton>
                  <RippleButton 
                    className={`text-sm p-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => filterSongs('all')}
                  >
                    View all
                  </RippleButton>
                </div>
              </div>
              {genres.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {genres.map((genre) => (
                    <CategoryCard
                      key={genre.key}
                      title={genre.name}
                      gradient={genre.gradient}
                      icon={<FaMusic />}
                      count={genre.count}
                      onClick={genre.action}
                    />
                  ))}
                </div>
              ) : (
                <div className={`text-center py-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No genre data available.
                </div>
              )}
            </motion.section>

            {/* Popular Artists Section */}
            <motion.section 
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Popular artists
                </h2>
                <button 
                  onClick={() => filterSongs('all')}
                  className={`flex items-center text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  View all
                </button>
              </div>
              {artists.length > 0 ? (
                <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                  {artists.slice(0, 10).map((artist) => (
                    <PopularArtistCard
                      key={artist.name}
                      artist={artist}
                    />
                  ))}
                </div>
              ) : (
                <div className={`text-center py-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No artist data available.
                </div>
              )}
            </motion.section>

            {/* Trending Section */}
            <motion.section 
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Trending
                </h2>
                {topCharts.length > 0 && (
                  <RippleButton 
                    className={`text-sm p-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => playSong(topCharts[0], topCharts)}
                  >
                    <FaPlay />
                  </RippleButton>
                )}
              </div>
              {topCharts.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {topCharts.map((song, index) => (
                    <TrendingSongItem
                      key={song._id}
                      song={song}
                      index={index}
                      playAction={() => playSong(song, topCharts)}
                    />
                  ))}
                </div>
              ) : (
                <div className={`text-center py-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No trending songs available.
                </div>
              )}
            </motion.section>
          </AnimatePresence>
        )}

        {/* Filter Modal */}
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          filters={filters}
          setFilters={setFilters}
          applyFilters={applyFilters}
          stats={stats}
        />
      </main>
    </div>
  );
};

export default Exp;