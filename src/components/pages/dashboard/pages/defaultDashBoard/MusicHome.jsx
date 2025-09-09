


// import React, { useState, useEffect, useContext, useMemo, useRef, useCallback } from "react";
// import axios from "axios";
// import {
//   FaSearch,
//   FaTimes,
//   FaPlay,
//   FaPause,
//   FaHeart,
//   FaRegHeart,
//   FaStepForward,
//   FaStepBackward,
//   FaHistory,
// } from "react-icons/fa";
// import { PlayerContext } from "../../../../../context/PlayerContext";
// import { motion, AnimatePresence } from "framer-motion";
// import { Link, useNavigate } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { FreeMode, Autoplay } from "swiper/modules";
// import { useTheme } from "../../../../../context/ThemeContext";

// import "swiper/css";
// import "swiper/css/free-mode";

// // -------------------- Helpers --------------------
// const buildImageUrl = (path) =>
//   path
//     ? path.startsWith("http")
//       ? path
//       : `http://localhost:9999/${path.replace(/\\/g, "/")}`
//     : "https://via.placeholder.com/400x400?text=No+Art";

// const IconButton = ({ children, title, onClick, active = false, className = "" }) => (
//   <motion.button
//     whileTap={{ scale: 0.9 }}
//     onClick={onClick}
//     title={title}
//     className={`p-2 rounded-full transition-colors duration-200 ${active ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"} ${className}`}
//     aria-pressed={active}
//   >
//     {children}
//   </motion.button>
// );

// // Ripple effect component
// const RippleEffect = ({ x, y }) => (
//   <motion.div
//     initial={{ opacity: 1, scale: 0 }}
//     animate={{ opacity: 0, scale: 2 }}
//     transition={{ duration: 0.5, ease: "easeOut" }}
//     className="absolute bg-purple-400 dark:bg-purple-500 rounded-full pointer-events-none"
//     style={{
//       left: x,
//       top: y,
//       width: 0,
//       height: 0,
//       paddingBottom: "100%",
//       paddingRight: "100%",
//       transform: 'translate(-50%, -50%)',
//     }}
//   />
// );

// // Confetti burst component
// const ConfettiBurst = ({ x, y, show }) => {
//   if (!show) return null;
//   const colors = ["#10B981", "#EF4444", "#3B82F6", "#F59E0B", "#8B5CF6"];
//   return (
//     <div
//       className="absolute pointer-events-none overflow-hidden"
//       style={{
//         left: x,
//         top: y,
//         width: 0,
//         height: 0,
//         zIndex: 9999,
//       }}
//     >
//       {Array.from({ length: 15 }).map((_, i) => (
//         <motion.span
//           key={i}
//           initial={{ opacity: 1, y: 0, x: 0, scale: 1, rotate: 0 }}
//           animate={{
//             opacity: 0,
//             y: -Math.random() * 100 - 50,
//             x: (Math.random() - 0.5) * 100,
//             scale: Math.random() * 0.5 + 0.5,
//             rotate: Math.random() * 360,
//           }}
//           transition={{ duration: Math.random() * 0.6 + 0.4, ease: "easeOut", delay: Math.random() * 0.1 }}
//           style={{
//             position: "absolute",
//             width: `${Math.random() * 8 + 4}px`,
//             height: `${Math.random() * 8 + 4}px`,
//             backgroundColor: colors[Math.floor(Math.random() * colors.length)],
//             borderRadius: "50%",
//             top: 0,
//             left: 0,
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// // -------------------- Main Component --------------------
// const MusicHome = () => {
//   const [songs, setSongs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { isDarkMode } = useTheme();

//   // Search states / history
//   const [query, setQuery] = useState("");
//   const [searchHistory, setSearchHistory] = useState([]);

//   // Ripple effect state
//   const [ripple, setRipple] = useState(null);

//   // Confetti effect state
//   const [confetti, setConfetti] = useState({ show: false, x: 0, y: 0 });

//   // Player context
//   const {
//     playSong,
//     currentSong,
//     isPlaying,
//     togglePlayPause,
//     likedSongs,
//     likeSong,
//     unlikeSong,
//     duration,
//     currentTime,
//   } = useContext(PlayerContext);

//   useEffect(() => {
//     (async () => {
//       try {
//         const { data } = await axios.get("http://localhost:9999/public/songs");
//         setSongs(Array.isArray(data) ? data : []);
//         const stored = JSON.parse(localStorage.getItem("searchHistory")) || [];
//         setSearchHistory(stored);
//       } catch (err) {
//         console.error("Failed to fetch songs:", err);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   const likedSet = useMemo(() => (likedSongs instanceof Set ? likedSongs : new Set(Array.isArray(likedSongs) ? likedSongs : [])));

//   // Group artists/albums for search and carousels
//   const grouped = useMemo(() => {
//     const artists = {};
//     const albums = {};
//     songs.forEach((song) => {
//       if (song.artist) {
//         if (!artists[song.artist]) artists[song.artist] = { songs: [], cover: song.artistPic || song.coverArtPath };
//         artists[song.artist].songs.push(song);
//       }
//       if (song.album) {
//         if (!albums[song.album]) albums[song.album] = { songs: [], cover: song.coverArtPath };
//         albums[song.album].songs.push(song);
//       }
//     });
//     return { artists, albums };
//   }, [songs]);

//   const topArtists = useMemo(() => Object.entries(grouped.artists).slice(0, 12), [grouped.artists]);
//   const newReleases = useMemo(() => [...songs].reverse().slice(0, 18), [songs]);
//   const topCharts = useMemo(() => [...songs].sort(() => 0.5 - Math.random()).slice(0, 12), [songs]);

//   // Search logic returning groups
//   const filteredResults = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return { songs: [], artists: {}, albums: {} };

//     const songMatches = songs.filter(
//       (s) =>
//         (s.title || "").toLowerCase().includes(q) ||
//         (s.artist || "").toLowerCase().includes(q) ||
//         (s.album || "").toLowerCase().includes(q)
//     );

//     const artistMatches = Object.fromEntries(
//       Object.entries(grouped.artists).filter(([name]) => name.toLowerCase().includes(q))
//     );
//     const albumMatches = Object.fromEntries(
//       Object.entries(grouped.albums).filter(([name]) => name.toLowerCase().includes(q))
//     );

//     return { songs: songMatches, artists: artistMatches, albums: albumMatches };
//   }, [query, songs, grouped]);

//   const handleAddToHistory = (term) => {
//     if (!term || term.trim() === "") return;
//     const newHistory = [term, ...searchHistory.filter((i) => i !== term)].slice(0, 6);
//     setSearchHistory(newHistory);
//     localStorage.setItem("searchHistory", JSON.stringify(newHistory));
//   };

//   const handleRipple = useCallback((e) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     setRipple({
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//       key: Date.now()
//     });
//     setTimeout(() => setRipple(null), 600);
//   }, []);

//   const handleConfetti = useCallback((e) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     setConfetti({
//       show: true,
//       x: e.clientX - rect.left + rect.width / 2,
//       y: e.clientY - rect.top + rect.height / 2,
//     });
//     setTimeout(() => setConfetti({ show: false, x: 0, y: 0 }), 1000);
//   }, []);

//   // Helper for playing/pausing a song from a card
//   const handlePlayAction = useCallback((song, songsList, e) => {
//     if (e) e.stopPropagation();
//     if (currentSong && currentSong._id === song._id) {
//       togglePlayPause();
//     } else {
//       playSong(song, songsList);
//     }
//     if (e) handleRipple(e);
//   }, [currentSong, isPlaying, playSong, togglePlayPause, handleRipple]);

//   // Helper for toggling like
//   const handleToggleLike = useCallback((songId, e) => {
//     e.stopPropagation();
//     const isCurrentlyLiked = likedSet.has(songId);
//     if (isCurrentlyLiked) {
//       unlikeSong(songId);
//     } else {
//       likeSong(songId);
//       handleConfetti(e);
//     }
//   }, [likedSet, likeSong, unlikeSong, handleConfetti]);

//   if (loading) return <div className="p-10 text-center text-green-500 dark:text-green-400">Loading your universe...</div>;

//   return (
//     <div className={`min-h-screen p-4 md:p-8 space-y-12 relative font-sans overflow-hidden transition-colors duration-300 ${
//       isDarkMode
//         ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white"
//         : "bg-gradient-to-b from-blue-50 via-gray-50 to-gray-100 text-gray-900"
//     }`}>
//       {/* Header (Search) */}
//       <motion.header
//         layout
//         className={`p-6 rounded-2xl shadow-lg relative z-10 border ${
//           isDarkMode
//             ? "bg-gray-800/80 border-green-500/30"
//             : "bg-white/80 border-green-400/30"
//         }`}
//       >
//         <h1 className={`text-3xl md:text-4xl font-extrabold ${
//           isDarkMode ? "text-green-400" : "text-green-600"
//         }`}>Welcome to Dhun</h1>
//         <p className={`mt-2 text-lg ${
//           isDarkMode ? "text-gray-300" : "text-gray-600"
//         }`}>Discover, search, and listen to your universe of music.</p>

//         <div className="relative mt-8 max-w-3xl">
//           <input
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onBlur={() => handleAddToHistory(query)}
//             placeholder="Search for anything..."
//             className={`w-full placeholder-gray-500 rounded-full py-3 pl-12 pr-10 text-lg focus:outline-none focus:ring-2 transition-all border ${
//               isDarkMode
//                 ? "bg-gray-700 border-gray-600 focus:ring-green-500 focus:border-green-500 text-white"
//                 : "bg-white border-gray-300 focus:ring-green-500 focus:border-green-500 text-gray-900"
//             }`}
//           />
//           <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${
//             isDarkMode ? "text-green-400" : "text-green-500"
//           }`} />
//           {query && (
//             <button onClick={() => setQuery("")} className={`absolute right-4 top-1/2 -translate-y-1/2 ${
//               isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"
//             }`}>
//               <FaTimes />
//             </button>
//           )}
//         </div>

//         {/* Search history chips */}
//         {searchHistory.length > 0 && (
//           <div className="mt-4 flex items-center gap-2 flex-wrap text-sm">
//             <FaHistory className={isDarkMode ? "text-purple-400" : "text-purple-500"} />
//             {searchHistory.map((h, i) => (
//               <motion.button
//                 key={i}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className={`px-3 py-1 rounded-full transition-colors border ${
//                   isDarkMode
//                     ? "bg-gray-700 border-gray-600 hover:bg-green-900/30 text-green-400"
//                     : "bg-gray-200 border-gray-300 hover:bg-green-100 text-green-600"
//                 }`}
//                 onClick={() => setQuery(h)}
//               >
//                 {h}
//               </motion.button>
//             ))}
//           </div>
//         )}
//       </motion.header>

//       {/* Main area: when query -> search results, else home content */}
//       <AnimatePresence mode="wait">
//         {query ? (
//           <motion.div key="search" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>
//             <SearchResults results={filteredResults} onPlay={(s, q, e) => { playSong(s, q); handleRipple(e); }} onToggleLike={(id, e) => { (likedSet.has(id) ? unlikeSong(id) : likeSong(id)); if (!likedSet.has(id)) handleConfetti(e); }} likedSet={likedSet} />
//           </motion.div>
//         ) : (
//           <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12 relative z-10">
//             {/* Vibe today + right-side Recently Liked */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               <div className={`lg:col-span-2 p-5 rounded-2xl shadow-lg border ${
//                 isDarkMode ? "bg-gray-800/60 border-purple-500/20" : "bg-white/80 border-purple-400/20"
//               }`}>
//                 <VibeToday songs={songs} playSong={(s, q, e) => { playSong(s, q); handleRipple(e); }} />
//               </div>

//               <div className={`p-5 rounded-2xl shadow-lg border ${
//                 isDarkMode ? "bg-gray-800/60 border-purple-500/20" : "bg-white/80 border-purple-400/20"
//               }`}>
//                 <RecentlyLiked songs={songs} likedSet={likedSet} playSong={(s, q, e) => { playSong(s, q); handleRipple(e); }} toggleLike={(id, e) => { (likedSet.has(id) ? unlikeSong(id) : likeSong(id)); if (!likedSet.has(id)) handleConfetti(e); }} />
//               </div>
//             </div>

//             <LiveListening songs={songs} playSong={playSong} handleRipple={handleRipple} currentSong={currentSong} isPlaying={isPlaying} togglePlayPause={togglePlayPause} />
            
//             <SongCarousel
//               title="Top Charts"
//               songs={topCharts}
//               autoPlay={true}
//               CardComponent={ChartCard}
//               handleRipple={handleRipple}
//               handleConfetti={handleConfetti}
//               currentSong={currentSong}
//               isPlaying={isPlaying}
//               togglePlayPause={togglePlayPause}
//             />

//             {/* NEW RELEASES SECTION - Horizontally scrollable */}
//             <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 relative">
//               <h2 className={`text-2xl md:text-3xl font-bold ${
//                 isDarkMode ? "text-green-400" : "text-green-600"
//               }`}>New Releases</h2>
//               <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-300 dark:scrollbar-track-gray-700">
//                 {newReleases.map((song) => (
//                   <MusicCard
//                     key={song._id}
//                     item={song}
//                     playAction={(e) => handlePlayAction(song, newReleases, e)}
//                     isLiked={likedSet.has(song._id)}
//                     onToggleLike={(e) => handleToggleLike(song._id, e)}
//                     currentSong={currentSong}
//                     isPlaying={isPlaying}
//                   />
//                 ))}
//               </div>
//             </motion.section>

//             <ArtistCarousel title="Artist Spotlight" artists={topArtists} autoPlay={true} />
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Ripple container */}
//       <AnimatePresence>
//         {ripple && <RippleEffect key={ripple.key} x={ripple.x} y={ripple.y} />}
//       </AnimatePresence>
//       {/* Confetti container */}
//       <ConfettiBurst show={confetti.show} x={confetti.x} y={confetti.y} />
//     </div>
//   );
// };

// // -------------------- VibeToday (left) + RecentlyLiked (right) --------------------
// const VibeToday = ({ songs, playSong }) => {
//   const navigate = useNavigate();
//   const { isDarkMode } = useTheme();
  
//   // pick a "vibe" based on top artist or random
//   const groupedByArtist = songs.reduce((acc, s) => {
//     if (!s.artist) return acc;
//     if (!acc[s.artist]) acc[s.artist] = [];
//     acc[s.artist].push(s);
//     return acc;
//   }, {});
//   const topArtist = Object.keys(groupedByArtist)[0];
//   const vibeSongs = topArtist ? groupedByArtist[topArtist].slice(0, 6) : songs.slice(0, 6);

//   return (
//     <div>
//       <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>Your Vibe Today</h3>
//       <p className={`text-md mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Curated for you based on what moves you{topArtist ? ` — featuring ${topArtist}` : ""}.</p>

//       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//         {vibeSongs.map((s) => (
//           <motion.div
//             key={s._id}
//             className={`p-4 rounded-xl flex flex-col items-start cursor-pointer transition-colors shadow-lg relative overflow-hidden group border ${
//               isDarkMode
//                 ? "bg-gray-700/50 border-transparent hover:border-purple-500/40 hover:bg-gray-700/70"
//                 : "bg-white/50 border-transparent hover:border-purple-400/40 hover:bg-white/70"
//             }`}
//             whileHover={{ y: -5 }}
//             onClick={(e) => {
//               playSong(s, vibeSongs, e);
//             }}
//           >
//             <img src={buildImageUrl(s.coverArtPath)} alt={s.title} className="w-full h-32 object-cover rounded-lg mb-4 shadow-md" />
//             <div className="w-full">
//               <div className={`font-semibold text-lg leading-tight line-clamp-2 ${
//                 isDarkMode ? "text-white" : "text-gray-900"
//               }`}>{s.title}</div>
//               <div className={`text-sm mt-1 leading-tight line-clamp-1 ${
//                 isDarkMode ? "text-gray-400" : "text-gray-600"
//               }`}>{s.artist}</div>
//               <div className="mt-4 flex items-center justify-between w-full">
//                 <span className={`px-4 py-1 rounded-full text-sm font-medium ${
//                   isDarkMode
//                     ? "bg-green-500 text-white"
//                     : "bg-green-600 text-white"
//                 }`}>Play</span>
//                 <div className={`text-xs ${
//                   isDarkMode ? "text-gray-500" : "text-gray-500"
//                 }`}>• {s.duration ? formatDuration(s.duration) : "—"}</div>
//               </div>
//             </div>
//             {/* Play button overlay */}
//             <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
//               <FaPlay className="text-green-400 text-3xl" />
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const RecentlyLiked = ({ songs, likedSet, playSong, toggleLike }) => {
//   const { isDarkMode } = useTheme();
//   const likedSongs = songs.filter((s) => likedSet.has(s._id)).slice(-6).reverse();
  
//   return (
//     <div>
//       <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>Recently Liked</h3>
//       {likedSongs.length === 0 ? (
//         <p className={`italic ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}>You haven't liked any songs yet. Start exploring!</p>
//       ) : (
//         <div className="space-y-3">
//           {likedSongs.map((s) => (
//             <motion.div
//               key={s._id}
//               className={`flex items-center gap-4 p-3 rounded-md transition-colors cursor-pointer relative group border ${
//                 isDarkMode
//                   ? "bg-gray-700/50 border-transparent hover:bg-gray-700/70 hover:border-green-500/30"
//                   : "bg-white/50 border-transparent hover:bg-white/70 hover:border-green-400/30"
//               }`}
//               whileHover={{ x: 5 }}
//             >
//               <img src={buildImageUrl(s.coverArtPath)} alt={s.title} className="w-14 h-14 rounded object-cover shadow-md" onClick={(e) => playSong(s, likedSongs, e)} />
//               <div className="flex-1 min-w-0" onClick={(e) => playSong(s, likedSongs, e)}>
//                 <div className={`font-semibold leading-tight line-clamp-1 ${
//                   isDarkMode ? "text-white" : "text-gray-900"
//                 }`}>{s.title}</div>
//                 <div className={`text-sm leading-tight line-clamp-1 ${
//                   isDarkMode ? "text-gray-400" : "text-gray-600"
//                 }`}>{s.artist}</div>
//               </div>
//               <motion.button
//                 whileTap={{ scale: 0.8 }}
//                 onClick={(e) => { e.stopPropagation(); toggleLike(s._id, e); }}
//                 className={`p-2 transition-colors ${
//                   isDarkMode
//                     ? "text-green-400 hover:text-red-400"
//                     : "text-green-600 hover:text-red-500"
//                 }`}
//                 aria-label="Toggle like"
//               >
//                 {likedSet.has(s._id) ? <FaHeart className="text-xl" /> : <FaRegHeart className="text-xl" />}
//               </motion.button>
//             </motion.div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // -------------------- SearchResults Component --------------------
// const SearchResults = ({ results, onPlay, onToggleLike, likedSet }) => {
//   const { songs: foundSongs, artists: foundArtists, albums: foundAlbums } = results;
//   const navigate = useNavigate();
//   const { isDarkMode } = useTheme();

//   const hasResults =
//     (foundSongs && foundSongs.length > 0) ||
//     Object.keys(foundArtists).length > 0 ||
//     Object.keys(foundAlbums).length > 0;

//   if (!hasResults)
//     return (
//       <p className={`text-center italic text-xl ${
//         isDarkMode ? "text-gray-400" : "text-gray-600"
//       }`}>No cosmic melodies found for your search.</p>
//     );

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       transition={{ duration: 0.35 }}
//       className="space-y-10"
//     >
//       {/* --- Songs Section --- */}
//       {foundSongs && foundSongs.length > 0 && (
//         <section>
//           <h3 className={`text-2xl font-bold mb-4 ${
//             isDarkMode ? "text-green-400" : "text-green-600"
//           }`}>Songs</h3>
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//             {foundSongs.map((song) => (
//               <motion.div
//                 key={song._id}
//                 className={`p-4 rounded-xl transition-all cursor-pointer relative overflow-hidden group border ${
//                   isDarkMode
//                     ? "bg-gray-700/50 border-transparent hover:bg-gray-700/70 hover:border-green-500/40"
//                     : "bg-white/50 border-transparent hover:bg-white/70 hover:border-green-400/40"
//                 }`}
//                 whileHover={{ y: -5 }}
//                 onClick={(e) => onPlay(song, foundSongs, e)}
//               >
//                 <img
//                   src={buildImageUrl(song.coverArtPath)}
//                   alt={song.title}
//                   className="w-full h-40 object-cover rounded-lg mb-3 shadow-md"
//                 />
//                 <h4 className={`font-semibold text-lg leading-tight line-clamp-2 ${
//                   isDarkMode ? "text-white" : "text-gray-900"
//                 }`}>{song.title}</h4>
//                 <p className={`text-sm mt-1 leading-tight line-clamp-1 ${
//                   isDarkMode ? "text-gray-400" : "text-gray-600"
//                 }`}>{song.artist}</p>
//                 <div className="mt-4 flex items-center justify-between">
//                   <motion.button
//                     whileTap={{ scale: 0.9 }}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onPlay(song, foundSongs, e);
//                     }}
//                     className={`px-4 py-1 rounded-full text-sm font-medium ${
//                       isDarkMode
//                         ? "bg-green-500 text-white"
//                         : "bg-green-600 text-white"
//                     }`}
//                   >
//                     Play
//                   </motion.button>
//                   <motion.button
//                     whileTap={{ scale: 0.8 }}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onToggleLike(song._id, e);
//                     }}
//                     className={`transition-colors ${
//                       isDarkMode
//                         ? "text-white/90 hover:text-red-400"
//                         : "text-gray-700 hover:text-red-500"
//                     }`}
//                   >
//                     {likedSet.has(song._id) ? (
//                       <FaHeart className="text-xl text-red-500" />
//                     ) : (
//                       <FaRegHeart className="text-xl" />
//                     )}
//                   </motion.button>
//                 </div>

//                 {/* Navigate to Artist Page */}
//                 {song.artist && (
//                   <button
//                     className={`mt-2 text-xs ${
//                       isDarkMode
//                         ? "text-gray-500 hover:text-purple-400"
//                         : "text-gray-500 hover:text-purple-600"
//                     } hover:underline`}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       navigate(`/dashboard/artist/${encodeURIComponent(song.artist)}`);
//                     }}
//                   >
//                     View {song.artist}
//                   </button>
//                 )}
//               </motion.div>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* --- Artists Section --- */}
//       {Object.keys(foundArtists).length > 0 && (
//         <section>
//           <h3 className={`text-2xl font-bold mb-4 ${
//             isDarkMode ? "text-purple-400" : "text-purple-600"
//           }`}>Artists</h3>
//           <div className="flex flex-wrap gap-4">
//             {Object.entries(foundArtists).map(([name, data]) => (
//               <motion.div
//                 key={name}
//                 className={`text-center w-40 cursor-pointer p-4 rounded-xl shadow-md border ${
//                   isDarkMode
//                     ? "bg-gray-700/50 border-transparent hover:border-purple-500/40"
//                     : "bg-white/50 border-transparent hover:border-purple-400/40"
//                 }`}
//                 whileHover={{ y: -5 }}
//                 onClick={() => navigate(`/dashboard/artist/${encodeURIComponent(name)}`)}
//               >
//                 <img
//                   src={buildImageUrl(data.cover)}
//                   alt={name}
//                   className="w-32 h-32 rounded-full object-cover shadow-lg mb-3 mx-auto border-2 border-green-500/50"
//                 />
//                 <div className={`font-semibold text-lg leading-tight line-clamp-1 ${
//                   isDarkMode ? "text-white" : "text-gray-900"
//                 }`}>{name}</div>
//                 <div className={`text-sm mt-1 ${
//                   isDarkMode ? "text-gray-400" : "text-gray-600"
//                 }`}>{data.songs.length} songs</div>
//               </motion.div>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* --- Albums Section --- */}
//       {Object.keys(foundAlbums).length > 0 && (
//         <section>
//           <h3 className={`text-2xl font-bold mb-4 ${
//             isDarkMode ? "text-green-400" : "text-green-600"
//           }`}>Albums</h3>
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//             {Object.entries(foundAlbums).map(([name, data]) => (
//               <motion.div
//                 key={name}
//                 className={`p-4 rounded-xl transition-all cursor-pointer relative overflow-hidden group border ${
//                   isDarkMode
//                     ? "bg-gray-700/50 border-transparent hover:bg-gray-700/70 hover:border-green-500/40"
//                     : "bg-white/50 border-transparent hover:bg-white/70 hover:border-green-400/40"
//                 }`}
//                 whileHover={{ y: -5 }}
//                 onClick={() => navigate(`/dashboard/album/${encodeURIComponent(name)}`)}
//               >
//                 <img
//                   src={buildImageUrl(data.cover)}
//                   alt={name}
//                   className="w-full h-40 object-cover rounded-lg mb-3 shadow-md"
//                 />
//                 <h4 className={`font-semibold text-lg leading-tight line-clamp-2 ${
//                   isDarkMode ? "text-white" : "text-gray-900"
//                 }`}>{name}</h4>
//                 <p className={`text-sm mt-1 leading-tight line-clamp-1 ${
//                   isDarkMode ? "text-gray-400" : "text-gray-600"
//                 }`}>{data.songs[0]?.artist || "Various"}</p>
//                 <div className="mt-4 flex items-center justify-between">
//                   <motion.button
//                     whileTap={{ scale: 0.9 }}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onPlay(data.songs[0], data.songs, e);
//                     }}
//                     className={`px-4 py-1 rounded-full text-sm font-medium ${
//                       isDarkMode
//                         ? "bg-green-500 text-white"
//                         : "bg-green-600 text-white"
//                     }`}
//                   >
//                     Play
//                   </motion.button>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </section>
//       )}
//     </motion.div>
//   );
// };

// // -------------------- Carousels & Cards --------------------
// const SongCarousel = ({ title, songs, autoPlay = false, CardComponent, handleRipple, handleConfetti, currentSong, isPlaying, togglePlayPause }) => {
//   const { playSong, likedSongs, likeSong, unlikeSong } = useContext(PlayerContext);
//   const { isDarkMode } = useTheme();
//   const likedSet = useMemo(() => new Set(likedSongs), [likedSongs]);

//   const handleToggleLike = (songId, e) => {
//     e.stopPropagation();
//     const isCurrentlyLiked = likedSet.has(songId);
//     if (isCurrentlyLiked) {
//       unlikeSong(songId);
//     } else {
//       likeSong(songId);
//       handleConfetti(e);
//     }
//   };

//   const handlePlayAction = (song, songsList, e) => {
//     if (e) e.stopPropagation();
//     if (currentSong && currentSong._id === song._id) {
//       togglePlayPause();
//     } else {
//       playSong(song, songsList);
//     }
//     if (e) handleRipple(e);
//   };

//   if (!songs || songs.length === 0) return null;

//   return (
//     <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 relative">
//       <h2 className={`text-2xl md:text-3xl font-bold ${
//         isDarkMode ? "text-green-400" : "text-green-600"
//       }`}>{title}</h2>
//       <Swiper
//         modules={[FreeMode, Autoplay]}
//         freeMode
//         autoplay={autoPlay ? { delay: 2200, disableOnInteraction: false } : false}
//         slidesPerView={"auto"}
//         spaceBetween={20}
//         className="!pb-4"
//       >
//         {songs.map((song, i) => (
//           <SwiperSlide key={song._id} className="!w-auto">
//             <CardComponent
//               item={song}
//               rank={i + 1}
//               songsList={songs}
//               playAction={(e) => handlePlayAction(song, songs, e)}
//               isLiked={likedSet.has(song._id)}
//               onToggleLike={(e) => handleToggleLike(song._id, e)}
//               currentSong={currentSong}
//               isPlaying={isPlaying}
//               togglePlayPause={togglePlayPause}
//             />
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </motion.section>
//   );
// };

// const ArtistCarousel = ({ title, artists, autoPlay = false }) => {
//   const { isDarkMode } = useTheme();
//   if (!artists || artists.length === 0) return null;
  
//   return (
//     <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
//       <h2 className={`text-2xl md:text-3xl font-bold ${
//         isDarkMode ? "text-purple-400" : "text-purple-600"
//       }`}>{title}</h2>
//       <Swiper
//         modules={[FreeMode, Autoplay]}
//         freeMode
//         autoplay={autoPlay ? { delay: 3000, disableOnInteraction: false, reverseDirection: true } : false}
//         slidesPerView={"auto"}
//         spaceBetween={24}
//         className="!pb-4"
//       >
//         {artists.map(([name, data]) => (
//           <SwiperSlide key={name} className="!w-40">
//             <ArtistCard artistName={name} artistData={data} />
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </motion.section>
//   );
// };

// const LiveListening = ({ songs, playSong, handleRipple, currentSong, isPlaying, togglePlayPause }) => {
//   const { isDarkMode } = useTheme();
//   const live = useMemo(() => [...songs].sort(() => 0.5 - Math.random()).slice(0, 6), [songs]);
//   if (!live || live.length === 0) return null;

//   const handleLivePlayAction = (song, songsList, e) => {
//     if (e) e.stopPropagation();
//     if (currentSong && currentSong._id === song._id) {
//       togglePlayPause();
//     } else {
//       playSong(song, songsList);
//     }
//     if (e) handleRipple(e);
//   };

//   return (
//     <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
//       <h2 className={`text-2xl md:text-3xl font-bold ${
//         isDarkMode ? "text-green-400" : "text-green-600"
//       }`}>Live Now</h2>
//       <Swiper
//         modules={[FreeMode, Autoplay]}
//         freeMode
//         slidesPerView={"auto"}
//         autoplay={{ delay: 2500, disableOnInteraction: false }}
//         spaceBetween={20}
//         className="!pb-4"
//       >
//         {live.map((song) => (
//           <SwiperSlide key={song._id} className="!w-60">
//             <LiveListeningCard
//               song={song}
//               playSong={(e) => handleLivePlayAction(song, live, e)}
//               isCurrentSong={currentSong && currentSong._id === song._id}
//               isPlaying={isPlaying}
//             />
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </motion.section>
//   );
// };

// const MusicCard = ({ item: song, playAction, isLiked, onToggleLike, currentSong, isPlaying }) => {
//   const { isDarkMode } = useTheme();
//   const isThisSongPlaying = currentSong && currentSong._id === song._id && isPlaying;
//   const isThisSongPaused = currentSong && currentSong._id === song._id && !isPlaying;

//   const getPlayIcon = () => {
//     if (isThisSongPlaying) return <FaPause className="text-xl" />;
//     return <FaPlay className="text-xl" />;
//   };

//   return (
//     <motion.div
//       className={`relative p-4 rounded-xl group flex flex-col items-center justify-center border transition-all overflow-hidden cursor-pointer w-48 ${
//         isDarkMode
//           ? "bg-gray-700/50 border-transparent hover:border-green-500/40"
//           : "bg-white/50 border-transparent hover:border-green-400/40"
//       }`}
//       whileHover={{ y: -7 }}
//       onClick={playAction}
//     >
//       <img src={buildImageUrl(song.coverArtPath)} alt={song.title} className="w-full h-40 object-cover rounded-lg mb-4 shadow-lg transition-transform group-hover:scale-105" />
//       <div className="text-center w-full">
//         <h3 className={`font-semibold text-lg leading-tight line-clamp-2 ${
//           isDarkMode ? "text-white" : "text-gray-900"
//         }`}>{song.title}</h3>
//         <p className={`text-sm line-clamp-1 ${
//           isDarkMode ? "text-gray-400" : "text-gray-600"
//         }`}>{song.artist}</p>
//       </div>
//       {/* The overlay also contains the play button, keep it for explicit control */}
//       <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
//         <IconButton title={isThisSongPlaying ? "Pause" : "Play"} onClick={playAction}>
//           {getPlayIcon()}
//         </IconButton>
//         <IconButton title={isLiked ? "Unlike" : "Like"} onClick={onToggleLike} active={isLiked}>
//           {isLiked ? <FaHeart className="text-xl" /> : <FaRegHeart className="text-xl" />}
//         </IconButton>
//       </div>
//       {(isThisSongPlaying || isThisSongPaused) && (
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0.8 }}
//           transition={{ duration: 0.2 }}
//           className={`absolute bottom-2 right-2 p-2 rounded-full shadow-lg ${
//             isDarkMode ? "bg-purple-600 text-white" : "bg-purple-500 text-white"
//           }`}
//         >
//           {isThisSongPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
//         </motion.div>
//       )}
//     </motion.div>
//   );
// };

// const ChartCard = ({ item: song, rank, playAction, isLiked, onToggleLike, currentSong, isPlaying }) => {
//   const { isDarkMode } = useTheme();
//   const isThisSongPlaying = currentSong && currentSong._id === song._id && isPlaying;

//   const getPlayIcon = () => {
//     if (isThisSongPlaying) return <FaPause className="text-lg" />;
//     return <FaPlay className="text-lg" />;
//   };

//   return (
//     <motion.div
//       className={`relative p-4 rounded-xl group flex items-center gap-4 border transition-all overflow-hidden w-72 ${
//         isDarkMode
//           ? "bg-gray-700/50 border-transparent hover:border-purple-500/40"
//           : "bg-white/50 border-transparent hover:border-purple-400/40"
//       }`}
//       whileHover={{ y: -5 }}
//     >
//       <div className={`absolute -left-2 -top-2 text-6xl font-extrabold z-0 opacity-80 select-none ${
//         isDarkMode ? "text-purple-500/30" : "text-purple-400/30"
//       }`}>
//         #{rank}
//       </div>
//       <img src={buildImageUrl(song.coverArtPath)} alt={song.title} className="w-20 h-20 object-cover rounded-lg shadow-md z-10" />
//       <div className="flex-1 min-w-0 z-10 cursor-pointer" onClick={playAction}>
//         <h3 className={`font-semibold text-lg leading-tight line-clamp-1 ${
//           isDarkMode ? "text-white" : "text-gray-900"
//         }`}>{song.title}</h3>
//         <p className={`text-sm line-clamp-1 ${
//           isDarkMode ? "text-gray-400" : "text-gray-600"
//         }`}>{song.artist}</p>
//         <p className={`text-xs mt-1 ${
//           isDarkMode ? "text-gray-500" : "text-gray-500"
//         }`}>{song.duration ? formatDuration(song.duration) : "—"}</p>
//       </div>
//       <div className="flex flex-col gap-2 z-10">
//         <IconButton title={isThisSongPlaying ? "Pause" : "Play"} onClick={playAction}>
//           {getPlayIcon()}
//         </IconButton>
//         <IconButton title={isLiked ? "Unlike" : "Like"} onClick={onToggleLike} active={isLiked}>
//           {isLiked ? <FaHeart className="text-lg" /> : <FaRegHeart className="text-lg" />}
//         </IconButton>
//       </div>
//     </motion.div>
//   );
// };

// const ArtistCard = ({ artistName, artistData }) => {
//   const { isDarkMode } = useTheme();
  
//   return (
//     <Link to={`/dashboard/artist/${encodeURIComponent(artistName)}`}>
//       <motion.div
//         className={`text-center p-4 rounded-xl shadow-lg border transition-all w-full ${
//           isDarkMode
//             ? "bg-gray-700/50 border-transparent hover:border-green-500/40"
//             : "bg-white/50 border-transparent hover:border-green-400/40"
//         }`}
//         whileHover={{ y: -7 }}
//       >
//         <img src={buildImageUrl(artistData.cover)} alt={artistName} className="w-28 h-28 rounded-full object-cover shadow-lg mb-3 mx-auto border-2 border-green-500/50 transition-transform group-hover:scale-105" />
//         <h3 className={`font-semibold text-lg leading-tight line-clamp-1 ${
//           isDarkMode ? "text-white" : "text-gray-900"
//         }`}>{artistName}</h3>
//         <p className={`text-sm mt-1 ${
//           isDarkMode ? "text-gray-400" : "text-gray-600"
//         }`}>{artistData.songs.length} songs</p>
//       </motion.div>
//     </Link>
//   );
// };

// const LiveListeningCard = ({ song, playSong, isCurrentSong, isPlaying }) => {
//   const { isDarkMode } = useTheme();
  
//   const getPlayPauseIcon = () => {
//     if (isCurrentSong && isPlaying) return <FaPause className="text-2xl" />;
//     return <FaPlay className="text-2xl" />;
//   };

//   return (
//     <motion.div
//       className={`relative p-5 rounded-2xl shadow-lg border group flex flex-col items-center justify-center transition-all overflow-hidden w-full ${
//         isDarkMode
//           ? "bg-gradient-to-br from-purple-900/40 to-gray-900/50 border-purple-500/50"
//           : "bg-gradient-to-br from-purple-100/40 to-gray-100/50 border-purple-400/50"
//       }`}
//       whileHover={{ y: -7 }}
//       onClick={playSong}
//     >
//       <div className="absolute inset-0 z-0 bg-cover bg-center opacity-20 blur-md" style={{ backgroundImage: `url(${buildImageUrl(song.coverArtPath)})` }}></div>
//       <div className="relative z-10 flex flex-col items-center">
//         <img src={buildImageUrl(song.coverArtPath)} alt={song.title} className="w-32 h-32 object-cover rounded-full mb-4 shadow-xl border-2 border-green-500/60 animate-pulse" />
//         <h3 className={`font-bold text-xl leading-tight line-clamp-1 mb-1 text-center ${
//           isDarkMode ? "text-white" : "text-gray-900"
//         }`}>{song.title}</h3>
//         <p className={`text-md line-clamp-1 mb-3 text-center ${
//           isDarkMode ? "text-gray-300" : "text-gray-700"
//         }`}>{song.artist}</p>
//         <div className="flex items-center gap-2 text-green-500 animate-pulse">
//           <span className="relative flex h-3 w-3">
//             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
//             <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
//           </span>
//           <span className="text-sm font-medium">LIVE</span>
//         </div>
//         <motion.button
//           whileTap={{ scale: 0.9 }}
//           className={`mt-4 px-6 py-2 rounded-full text-lg font-bold flex items-center gap-2 ${
//             isDarkMode
//               ? "bg-green-500 text-white"
//               : "bg-green-600 text-white"
//           }`}
//           onClick={playSong}
//         >
//           {getPlayPauseIcon()} {isCurrentSong && isPlaying ? "Playing" : "Listen Now"}
//         </motion.button>
//       </div>
//     </motion.div>
//   );
// };

// // -------------------- Utility Functions --------------------
// const formatDuration = (seconds) => {
//   if (isNaN(seconds) || seconds < 0) return "0:00";
//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = Math.floor(seconds % 60);
//   return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
// };

// export default MusicHome;









import React, { useState, useEffect, useContext, useMemo, useRef, useCallback } from "react";
import axios from "axios";
import {
  FaSearch,
  FaTimes,
  FaPlay,
  FaPause,
  FaHeart,
  FaRegHeart,
  FaStepForward,
  FaStepBackward,
  FaHistory,
  FaRandom,
  FaRedo,
  FaEllipsisH,
} from "react-icons/fa";
import { PlayerContext } from "../../../../../context/PlayerContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Autoplay } from "swiper/modules";
import { useTheme } from "../../../../../context/ThemeContext";

import "swiper/css";
import "swiper/css/free-mode";

// -------------------- Helpers --------------------
const buildImageUrl = (path) =>
  path
    ? path.startsWith("http")
      ? path
      : `http://localhost:9999/${path.replace(/\\/g, "/")}`
    : "https://via.placeholder.com/400x400?text=No+Art";

const IconButton = ({ children, title, onClick, active = false, className = "" }) => (
  <motion.button
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    title={title}
    className={`p-2 rounded-full transition-colors duration-200 ${active ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"} ${className}`}
    aria-pressed={active}
  >
    {children}
  </motion.button>
);

// Ripple effect component
const RippleEffect = ({ x, y }) => (
  <motion.div
    initial={{ opacity: 1, scale: 0 }}
    animate={{ opacity: 0, scale: 2 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="absolute bg-purple-400 dark:bg-purple-500 rounded-full pointer-events-none"
    style={{
      left: x,
      top: y,
      width: 0,
      height: 0,
      paddingBottom: "100%",
      paddingRight: "100%",
      transform: 'translate(-50%, -50%)',
    }}
  />
);

// Confetti burst component
const ConfettiBurst = ({ x, y, show }) => {
  if (!show) return null;
  const colors = ["#10B981", "#EF4444", "#3B82F6", "#F59E0B", "#8B5CF6"];
  return (
    <div
      className="absolute pointer-events-none overflow-hidden"
      style={{
        left: x,
        top: y,
        width: 0,
        height: 0,
        zIndex: 9999,
      }}
    >
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 1, y: 0, x: 0, scale: 1, rotate: 0 }}
          animate={{
            opacity: 0,
            y: -Math.random() * 100 - 50,
            x: (Math.random() - 0.5) * 100,
            scale: Math.random() * 0.5 + 0.5,
            rotate: Math.random() * 360,
          }}
          transition={{ duration: Math.random() * 0.6 + 0.4, ease: "easeOut", delay: Math.random() * 0.1 }}
          style={{
            position: "absolute",
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 8 + 4}px`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: "50%",
            top: 0,
            left: 0,
          }}
        />
      ))}
    </div>
  );
};

// -------------------- Main Component --------------------
const MusicHome = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();

  // Search states / history
  const [query, setQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);

  // Ripple effect state
  const [ripple, setRipple] = useState(null);

  // Confetti effect state
  const [confetti, setConfetti] = useState({ show: false, x: 0, y: 0 });

  // Player context
  const {
    playSong,
    currentSong,
    isPlaying,
    togglePlayPause,
    likedSongs,
    likeSong,
    unlikeSong,
    duration,
    currentTime,
    playPlaylist,
  } = useContext(PlayerContext);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("http://localhost:9999/public/songs");
        setSongs(Array.isArray(data) ? data : []);
        const stored = JSON.parse(localStorage.getItem("searchHistory")) || [];
        setSearchHistory(stored);
      } catch (err) {
        console.error("Failed to fetch songs:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const likedSet = useMemo(() => (likedSongs instanceof Set ? likedSongs : new Set(Array.isArray(likedSongs) ? likedSongs : [])));

  // Group artists/albums for search and carousels
  const grouped = useMemo(() => {
    const artists = {};
    const albums = {};
    songs.forEach((song) => {
      if (song.artist) {
        if (!artists[song.artist]) artists[song.artist] = { songs: [], cover: song.artistPic || song.coverArtPath };
        artists[song.artist].songs.push(song);
      }
      if (song.album) {
        if (!albums[song.album]) albums[song.album] = { songs: [], cover: song.coverArtPath };
        albums[song.album].songs.push(song);
      }
    });
    return { artists, albums };
  }, [songs]);

  // Filter songs by language
  const songsByLanguage = useMemo(() => {
    const languages = {};
    songs.forEach(song => {
      const lang = song.language || "Unknown";
      if (!languages[lang]) languages[lang] = [];
      languages[lang].push(song);
    });
    return languages;
  }, [songs]);

  // Filter songs by mood
  const songsByMood = useMemo(() => {
    const moods = {
      "Travelling": ["upbeat", "adventure", "travel"],
      "Sleeping": ["calm", "soft", "sleep"],
      "Enjoy": ["happy", "joyful", "fun"],
      "Party": ["party", "dance", "celebration"],
      "Workout": ["energetic", "motivational", "workout"],
      "Sad": ["sad", "melancholy", "emotional"],
      "Romance": ["romantic", "love", "passion"],
      "Focus": ["instrumental", "concentration", "focus"],
      "Spirituality": ["spiritual", "devotional", "meditation"]
    };
    
    const result = {};
    Object.keys(moods).forEach(mood => {
      result[mood] = songs.filter(song => 
        moods[mood].some(tag => 
          (song.tags || "").toLowerCase().includes(tag) || 
          (song.genre || "").toLowerCase().includes(tag)
        )
      );
    });
    return result;
  }, [songs]);

  // Filter songs by genre
  const songsByGenre = useMemo(() => {
    const genres = {
      "Lofi": ["lofi", "lo-fi"],
      "Instagram Bits": ["instagram", "reel", "short"],
      "Instrumental": ["instrumental", "karaoke"],
      "Qawali": ["qawali", "sufi"],
      "BGM": ["background", "bgm", "score"]
    };
    
    const result = {};
    Object.keys(genres).forEach(genre => {
      result[genre] = songs.filter(song => 
        genres[genre].some(tag => 
          (song.tags || "").toLowerCase().includes(tag) || 
          (song.genre || "").toLowerCase().includes(tag)
        )
      );
    });
    return result;
  }, [songs]);

  const topArtists = useMemo(() => Object.entries(grouped.artists).slice(0, 12), [grouped.artists]);
  const newReleases = useMemo(() => [...songs].reverse().slice(0, 18), [songs]);
  const topCharts = useMemo(() => [...songs].sort(() => 0.5 - Math.random()).slice(0, 12), [songs]);
  
  // Daily Discovery - mix of liked songs and recommendations
  const dailyDiscovery = useMemo(() => {
    const liked = songs.filter(s => likedSet.has(s._id));
    const recommended = songs.filter(s => !likedSet.has(s._id));
    
    // Mix some liked songs with recommendations
    return [
      ...liked.slice(0, 3),
      ...recommended.sort(() => 0.5 - Math.random()).slice(0, 9)
    ].sort(() => 0.5 - Math.random()).slice(0, 12);
  }, [songs, likedSet]);

  // Search logic returning groups
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { songs: [], artists: {}, albums: {} };

    const songMatches = songs.filter(
      (s) =>
        (s.title || "").toLowerCase().includes(q) ||
        (s.artist || "").toLowerCase().includes(q) ||
        (s.album || "").toLowerCase().includes(q)
    );

    const artistMatches = Object.fromEntries(
      Object.entries(grouped.artists).filter(([name]) => name.toLowerCase().includes(q))
    );
    const albumMatches = Object.fromEntries(
      Object.entries(grouped.albums).filter(([name]) => name.toLowerCase().includes(q))
    );

    return { songs: songMatches, artists: artistMatches, albums: albumMatches };
  }, [query, songs, grouped]);

  const handleAddToHistory = (term) => {
    if (!term || term.trim() === "") return;
    const newHistory = [term, ...searchHistory.filter((i) => i !== term)].slice(0, 6);
    setSearchHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
  };

  const handleRipple = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      key: Date.now()
    });
    setTimeout(() => setRipple(null), 600);
  }, []);

  const handleConfetti = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setConfetti({
      show: true,
      x: e.clientX - rect.left + rect.width / 2,
      y: e.clientY - rect.top + rect.height / 2,
    });
    setTimeout(() => setConfetti({ show: false, x: 0, y: 0 }), 1000);
  }, []);

  // Helper for playing/pausing a song from a card
  const handlePlayAction = useCallback((song, songsList, e) => {
    if (e) e.stopPropagation();
    if (currentSong && currentSong._id === song._id) {
      togglePlayPause();
    } else {
      playSong(song, songsList);
    }
    if (e) handleRipple(e);
  }, [currentSong, isPlaying, playSong, togglePlayPause, handleRipple]);

  // Helper for toggling like
  const handleToggleLike = useCallback((songId, e) => {
    e.stopPropagation();
    const isCurrentlyLiked = likedSet.has(songId);
    if (isCurrentlyLiked) {
      unlikeSong(songId);
    } else {
      likeSong(songId);
      handleConfetti(e);
    }
  }, [likedSet, likeSong, unlikeSong, handleConfetti]);

  if (loading) return <div className="p-10 text-center text-green-500 dark:text-green-400">Loading your universe...</div>;

  return (
    <div className={`min-h-screen p-4 md:p-8 space-y-12 relative font-sans overflow-hidden transition-colors duration-300 ${
      isDarkMode 
        ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white" 
        : "bg-gradient-to-b from-blue-50 via-gray-50 to-gray-100 text-gray-900"
    }`}>
      {/* Header (Search) */}
      <motion.header 
        layout 
        className={`p-6 rounded-2xl shadow-lg relative z-10 border ${
          isDarkMode 
            ? "bg-gray-800/80 border-green-500/30" 
            : "bg-white/80 border-green-400/30"
        }`}
      >
        <h1 className={`text-3xl md:text-4xl font-extrabold ${
          isDarkMode ? "text-green-400" : "text-green-600"
        }`}>Welcome to Dhun</h1>
        <p className={`mt-2 text-lg ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}>Discover, search, and listen to your universe of music.</p>

        <div className="relative mt-8 max-w-3xl">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => handleAddToHistory(query)}
            placeholder="Search for anything..."
            className={`w-full placeholder-gray-500 rounded-full py-3 pl-12 pr-10 text-lg focus:outline-none focus:ring-2 transition-all border ${
              isDarkMode 
                ? "bg-gray-700 border-gray-600 focus:ring-green-500 focus:border-green-500 text-white" 
                : "bg-white border-gray-300 focus:ring-green-500 focus:border-green-500 text-gray-900"
            }`}
          />
          <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${
            isDarkMode ? "text-green-400" : "text-green-500"
          }`} />
          {query && (
            <button onClick={() => setQuery("")} className={`absolute right-4 top-1/2 -translate-y-1/2 ${
              isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"
            }`}>
              <FaTimes />
            </button>
          )}
        </div>

        {/* Search history chips */}
        {searchHistory.length > 0 && (
          <div className="mt-4 flex items-center gap-2 flex-wrap text-sm">
            <FaHistory className={isDarkMode ? "text-purple-400" : "text-purple-500"} />
            {searchHistory.map((h, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1 rounded-full transition-colors border ${
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 hover:bg-green-900/30 text-green-400" 
                    : "bg-gray-200 border-gray-300 hover:bg-green-100 text-green-600"
                }`}
                onClick={() => setQuery(h)}
              >
                {h}
              </motion.button>
            ))}
          </div>
        )}
      </motion.header>

      {/* Main area: when query -> search results, else home content */}
      <AnimatePresence mode="wait">
        {query ? (
          <motion.div key="search" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>
            <SearchResults results={filteredResults} onPlay={(s, q, e) => { playSong(s, q); handleRipple(e); }} onToggleLike={(id, e) => { (likedSet.has(id) ? unlikeSong(id) : likeSong(id)); if (!likedSet.has(id)) handleConfetti(e); }} likedSet={likedSet} />
          </motion.div>
        ) : (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12 relative z-10">
            {/* Vibe today + right-side Recently Liked */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={`lg:col-span-2 p-5 rounded-2xl shadow-lg border ${
                isDarkMode ? "bg-gray-800/60 border-purple-500/20" : "bg-white/80 border-purple-400/20"
              }`}>
                <VibeToday songs={songs} playSong={(s, q, e) => { playSong(s, q); handleRipple(e); }} />
              </div>

              <div className={`p-5 rounded-2xl shadow-lg border ${
                isDarkMode ? "bg-gray-800/60 border-purple-500/20" : "bg-white/80 border-purple-400/20"
              }`}>
                <RecentlyLiked songs={songs} likedSet={likedSet} playSong={(s, q, e) => { playSong(s, q); handleRipple(e); }} toggleLike={(id, e) => { (likedSet.has(id) ? unlikeSong(id) : likeSong(id)); if (!likedSet.has(id)) handleConfetti(e); }} />
              </div>
            </div>

            {/* Daily Discovery Section */}
            <DailyDiscovery 
              songs={dailyDiscovery} 
              playPlaylist={() => playPlaylist(dailyDiscovery)} 
              playSong={(s, e) => { playSong(s, dailyDiscovery); handleRipple(e); }}
              likedSet={likedSet}
              toggleLike={handleToggleLike}
            />

            <LiveListening songs={songs} playSong={playSong} handleRipple={handleRipple} currentSong={currentSong} isPlaying={isPlaying} togglePlayPause={togglePlayPause} />
            
            <SongCarousel
              title="Top Charts"
              songs={topCharts}
              autoPlay={true}
              CardComponent={ChartCard}
              handleRipple={handleRipple}
              handleConfetti={handleConfetti}
              currentSong={currentSong}
              isPlaying={isPlaying}
              togglePlayPause={togglePlayPause}
            />

            {/* NEW RELEASES SECTION - Horizontally scrollable with larger cards */}
            <NewReleasesSection 
              songs={newReleases} 
              playSong={playSong} 
              handleRipple={handleRipple} 
              currentSong={currentSong} 
              isPlaying={isPlaying} 
              togglePlayPause={togglePlayPause}
              likedSet={likedSet}
              handleToggleLike={handleToggleLike}
            />

            <ArtistCarousel title="Artist Spotlight" artists={topArtists} autoPlay={true} />

            {/* Language Section */}
            <LanguageSection 
              songsByLanguage={songsByLanguage} 
              playPlaylist={playPlaylist}
              isDarkMode={isDarkMode}
            />

            {/* Genre Section */}
            <GenreSection 
              songsByGenre={songsByGenre} 
              playPlaylist={playPlaylist}
              isDarkMode={isDarkMode}
            />

            {/* Mood Section */}
            <MoodSection 
              songsByMood={songsByMood} 
              playPlaylist={playPlaylist}
              isDarkMode={isDarkMode}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ripple container */}
      <AnimatePresence>
        {ripple && <RippleEffect key={ripple.key} x={ripple.x} y={ripple.y} />}
      </AnimatePresence>
      {/* Confetti container */}
      <ConfettiBurst show={confetti.show} x={confetti.x} y={confetti.y} />
    </div>
  );
};

// -------------------- New Components --------------------

// Daily Discovery Section
const DailyDiscovery = ({ songs, playPlaylist, playSong, likedSet, toggleLike }) => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  return (
    <section className={`p-6 rounded-2xl shadow-lg border ${
      isDarkMode ? "bg-gray-800/60 border-green-500/20" : "bg-white/80 border-green-400/20"
    }`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl md:text-3xl font-bold ${
          isDarkMode ? "text-green-400" : "text-green-600"
        }`}>Your Daily Discovery</h2>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={playPlaylist}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium ${
            isDarkMode 
              ? "bg-green-600 text-white hover:bg-green-500" 
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          <FaPlay className="text-sm" /> Play All
        </motion.button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {songs.map((song) => (
          <motion.div
            key={song._id}
            className={`p-3 rounded-xl flex flex-col items-start cursor-pointer transition-colors shadow-lg relative overflow-hidden group border ${
              isDarkMode 
                ? "bg-gray-700/50 border-transparent hover:border-purple-500/40 hover:bg-gray-700/70" 
                : "bg-white/50 border-transparent hover:border-purple-400/40 hover:bg-white/70"
            }`}
            whileHover={{ y: -5 }}
            onClick={(e) => playSong(song, e)}
          >
            <img 
              src={buildImageUrl(song.coverArtPath)} 
              alt={song.title} 
              className="w-full h-40 object-cover rounded-lg mb-3 shadow-md" 
            />
            <div className="w-full">
              <div className={`font-semibold text-md leading-tight line-clamp-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>{song.title}</div>
              <div className={`text-sm mt-1 leading-tight line-clamp-1 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}>{song.artist}</div>
            </div>
            
            {/* Like button */}
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={(e) => toggleLike(song._id, e)}
              className={`absolute top-2 right-2 p-2 rounded-full bg-black/40 ${
                isDarkMode 
                  ? "text-white hover:text-red-400" 
                  : "text-white hover:text-red-500"
              }`}
              aria-label="Toggle like"
            >
              {likedSet.has(song._id) ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// New Releases Section with larger cards
const NewReleasesSection = ({ songs, playSong, handleRipple, currentSong, isPlaying, togglePlayPause, likedSet, handleToggleLike }) => {
  const { isDarkMode } = useTheme();

  const handlePlayAction = (song, e) => {
    if (currentSong && currentSong._id === song._id) {
      togglePlayPause();
    } else {
      playSong(song, songs);
    }
    handleRipple(e);
  };

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 relative">
      <h2 className={`text-2xl md:text-3xl font-bold ${
        isDarkMode ? "text-green-400" : "text-green-600"
      }`}>New Releases</h2>
      
      <div className="flex space-x-4 overflow-x-auto pb-4 hide-scrollbar">
        {songs.map((song) => {
          const isThisSongPlaying = currentSong && currentSong._id === song._id && isPlaying;
          const isThisSongPaused = currentSong && currentSong._id === song._id && !isPlaying;
          
          return (
            <motion.div
              key={song._id}
              className={`relative p-4 rounded-xl group flex flex-col items-center justify-center border transition-all overflow-hidden cursor-pointer w-56 flex-shrink-0 ${
                isDarkMode 
                  ? "bg-gray-700/50 border-transparent hover:border-green-500/40" 
                  : "bg-white/50 border-transparent hover:border-green-400/40"
              }`}
              whileHover={{ y: -7 }}
              onClick={(e) => handlePlayAction(song, e)}
            >
              <img 
                src={buildImageUrl(song.coverArtPath)} 
                alt={song.title} 
                className="w-full h-48 object-cover rounded-lg mb-4 shadow-lg transition-transform group-hover:scale-105" 
              />
              <div className="text-center w-full">
                <h3 className={`font-semibold text-lg leading-tight line-clamp-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}>{song.title}</h3>
                <p className={`text-sm line-clamp-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}>{song.artist}</p>
              </div>
              
              {/* Play/Pause indicator */}
              {(isThisSongPlaying || isThisSongPaused) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute bottom-2 right-2 p-2 rounded-full shadow-lg ${
                    isDarkMode ? "bg-purple-600 text-white" : "bg-purple-500 text-white"
                  }`}
                >
                  {isThisSongPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
                </motion.div>
              )}
              
              {/* Like button */}
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={(e) => handleToggleLike(song._id, e)}
                className={`absolute top-2 right-2 p-2 rounded-full bg-black/40 ${
                  isDarkMode 
                    ? "text-white hover:text-red-400" 
                    : "text-white hover:text-red-500"
                }`}
                aria-label="Toggle like"
              >
                {likedSet.has(song._id) ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

// Language Section
const LanguageSection = ({ songsByLanguage, playPlaylist, isDarkMode }) => {
  const languages = [
    { name: "Hindi", color: "bg-red-500" },
    { name: "Odia", color: "bg-blue-500" },
    { name: "Tamil", color: "bg-yellow-500" },
    { name: "Telugu", color: "bg-green-500" },
    { name: "English", color: "bg-purple-500" },
    { name: "Malayalam", color: "bg-pink-500" },
    { name: "Bhojpuri", color: "bg-orange-500" },
    { name: "Marathi", color: "bg-indigo-500" },
    { name: "Haryanvi", color: "bg-teal-500" },
    { name: "Rajasthani", color: "bg-amber-500" },
  ];

  return (
    <section className={`p-6 rounded-2xl shadow-lg border ${
      isDarkMode ? "bg-gray-800/60 border-purple-500/20" : "bg-white/80 border-purple-400/20"
    }`}>
      <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${
        isDarkMode ? "text-purple-400" : "text-purple-600"
      }`}>Browse by Language</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {languages.map((language) => {
          const songs = songsByLanguage[language.name] || [];
          return (
            <motion.div
              key={language.name}
              className={`rounded-xl p-4 cursor-pointer relative overflow-hidden group backdrop-blur-md ${
                isDarkMode 
                  ? "bg-gray-700/40 border border-gray-600/30 hover:border-purple-500/50" 
                  : "bg-white/60 border border-gray-200/50 hover:border-purple-400/50"
              }`}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => songs.length > 0 && playPlaylist(songs)}
            >
              <div className={`w-12 h-12 rounded-full ${language.color} flex items-center justify-center text-white font-bold text-lg mb-3`}>
                {language.name.charAt(0)}
              </div>
              <h3 className={`font-semibold text-lg ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>{language.name}</h3>
              <p className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}>{songs.length} songs</p>
              
              {/* Play button overlay */}
              {songs.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
                  <FaPlay className="text-green-400 text-2xl" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

// Genre Section
const GenreSection = ({ songsByGenre, playPlaylist, isDarkMode }) => {
  const genres = [
    { name: "Lofi", color: "bg-blue-400", icon: "🎵" },
    { name: "Instagram Bits", color: "bg-pink-400", icon: "📱" },
    { name: "Instrumental", color: "bg-purple-400", icon: "🎻" },
    { name: "Qawali", color: "bg-green-400", icon: "🕌" },
    { name: "BGM", color: "bg-orange-400", icon: "🎬" },
  ];

  return (
    <section className={`p-6 rounded-2xl shadow-lg border ${
      isDarkMode ? "bg-gray-800/60 border-green-500/20" : "bg-white/80 border-green-400/20"
    }`}>
      <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${
        isDarkMode ? "text-green-400" : "text-green-600"
      }`}>Popular Genres</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {genres.map((genre) => {
          const songs = songsByGenre[genre.name] || [];
          return (
            <motion.div
              key={genre.name}
              className={`rounded-xl p-4 cursor-pointer relative overflow-hidden group backdrop-blur-md ${
                isDarkMode 
                  ? "bg-gray-700/40 border border-gray-600/30 hover:border-green-500/50" 
                  : "bg-white/60 border border-gray-200/50 hover:border-green-400/50"
              }`}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => songs.length > 0 && playPlaylist(songs)}
            >
              <div className={`w-12 h-12 rounded-full ${genre.color} flex items-center justify-center text-white text-2xl mb-3`}>
                {genre.icon}
              </div>
              <h3 className={`font-semibold text-lg ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>{genre.name}</h3>
              <p className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}>{songs.length} songs</p>
              
              {/* Play button overlay */}
              {songs.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
                  <FaPlay className="text-green-400 text-2xl" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

// Mood Section
const MoodSection = ({ songsByMood, playPlaylist, isDarkMode }) => {
  const moods = [
    { name: "Travelling", color: "bg-yellow-400", icon: "✈️" },
    { name: "Sleeping", color: "bg-indigo-400", icon: "😴" },
    { name: "Enjoy", color: "bg-green-400", icon: "😄" },
    { name: "Party", color: "bg-red-400", icon: "🎉" },
    { name: "Workout", color: "bg-orange-400", icon: "💪" },
    { name: "Sad", color: "bg-blue-400", icon: "😢" },
    { name: "Romance", color: "bg-pink-400", icon: "❤️" },
    { name: "Focus", color: "bg-purple-400", icon: "📚" },
    { name: "Spirituality", color: "bg-teal-400", icon: "🕉️" },
  ];

  return (
    <section className={`p-6 rounded-2xl shadow-lg border ${
      isDarkMode ? "bg-gray-800/60 border-blue-500/20" : "bg-white/80 border-blue-400/20"
    }`}>
      <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${
        isDarkMode ? "text-blue-400" : "text-blue-600"
      }`}>Moods & Activities</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {moods.map((mood) => {
          const songs = songsByMood[mood.name] || [];
          return (
            <motion.div
              key={mood.name}
              className={`rounded-xl p-4 cursor-pointer relative overflow-hidden group backdrop-blur-md ${
                isDarkMode 
                  ? "bg-gray-700/40 border border-gray-600/30 hover:border-blue-500/50" 
                  : "bg-white/60 border border-gray-200/50 hover:border-blue-400/50"
              }`}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => songs.length > 0 && playPlaylist(songs)}
            >
              <div className={`w-12 h-12 rounded-full ${mood.color} flex items-center justify-center text-white text-2xl mb-3`}>
                {mood.icon}
              </div>
              <h3 className={`font-semibold text-lg ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>{mood.name}</h3>
              <p className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}>{songs.length} songs</p>
              
              {/* Play button overlay */}
              {songs.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
                  <FaPlay className="text-green-400 text-2xl" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

// -------------------- Existing Components --------------------

const VibeToday = ({ songs, playSong }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  // pick a "vibe" based on top artist or random
  const groupedByArtist = songs.reduce((acc, s) => {
    if (!s.artist) return acc;
    if (!acc[s.artist]) acc[s.artist] = [];
    acc[s.artist].push(s);
    return acc;
  }, {});
  const topArtist = Object.keys(groupedByArtist)[0];
  const vibeSongs = topArtist ? groupedByArtist[topArtist].slice(0, 6) : songs.slice(0, 6);

  return (
    <div>
      <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>Your Vibe Today</h3>
      <p className={`text-md mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Curated for you based on what moves you{topArtist ? ` — featuring ${topArtist}` : ""}.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {vibeSongs.map((s) => (
          <motion.div
            key={s._id}
            className={`p-4 rounded-xl flex flex-col items-start cursor-pointer transition-colors shadow-lg relative overflow-hidden group border ${
              isDarkMode 
                ? "bg-gray-700/50 border-transparent hover:border-purple-500/40 hover:bg-gray-700/70" 
                : "bg-white/50 border-transparent hover:border-purple-400/40 hover:bg-white/70"
            }`}
            whileHover={{ y: -5 }}
            onClick={(e) => {
              playSong(s, vibeSongs, e);
            }}
          >
            <img src={buildImageUrl(s.coverArtPath)} alt={s.title} className="w-full h-32 object-cover rounded-lg mb-4 shadow-md" />
            <div className="w-full">
              <div className={`font-semibold text-lg leading-tight line-clamp-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>{s.title}</div>
              <div className={`text-sm mt-1 leading-tight line-clamp-1 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}>{s.artist}</div>
              <div className="mt-4 flex items-center justify-between w-full">
                <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                  isDarkMode 
                    ? "bg-green-500 text-white" 
                    : "bg-green-600 text-white"
                }`}>Play</span>
                <div className={`text-xs ${
                  isDarkMode ? "text-gray-500" : "text-gray-500"
                }`}>• {s.duration ? formatDuration(s.duration) : "—"}</div>
              </div>
            </div>
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
              <FaPlay className="text-green-400 text-3xl" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const RecentlyLiked = ({ songs, likedSet, playSong, toggleLike }) => {
  const { isDarkMode } = useTheme();
  const likedSongs = songs.filter((s) => likedSet.has(s._id)).slice(-6).reverse();
  
  return (
    <div>
      <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>Recently Liked</h3>
      {likedSongs.length === 0 ? (
        <p className={`italic ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}>You haven't liked any songs yet. Start exploring!</p>
      ) : (
        <div className="space-y-3">
          {likedSongs.map((s) => (
            <motion.div
              key={s._id}
              className={`flex items-center gap-4 p-3 rounded-md transition-colors cursor-pointer relative group border ${
                isDarkMode 
                  ? "bg-gray-700/50 border-transparent hover:bg-gray-700/70 hover:border-green-500/30" 
                  : "bg-white/50 border-transparent hover:bg-white/70 hover:border-green-400/30"
              }`}
              whileHover={{ x: 5 }}
            >
              <img src={buildImageUrl(s.coverArtPath)} alt={s.title} className="w-14 h-14 rounded object-cover shadow-md" onClick={(e) => playSong(s, likedSongs, e)} />
              <div className="flex-1 min-w-0" onClick={(e) => playSong(s, likedSongs, e)}>
                <div className={`font-semibold leading-tight line-clamp-1 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}>{s.title}</div>
                <div className={`text-sm leading-tight line-clamp-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}>{s.artist}</div>
              </div>
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={(e) => { e.stopPropagation(); toggleLike(s._id, e); }}
                className={`p-2 transition-colors ${
                  isDarkMode 
                    ? "text-green-400 hover:text-red-400" 
                    : "text-green-600 hover:text-red-500"
                }`}
                aria-label="Toggle like"
              >
                {likedSet.has(s._id) ? <FaHeart className="text-xl" /> : <FaRegHeart className="text-xl" />}
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const SearchResults = ({ results, onPlay, onToggleLike, likedSet }) => {
  const { songs: foundSongs, artists: foundArtists, albums: foundAlbums } = results;
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const hasResults =
    (foundSongs && foundSongs.length > 0) ||
    Object.keys(foundArtists).length > 0 ||
    Object.keys(foundAlbums).length > 0;

  if (!hasResults)
    return (
      <p className={`text-center italic text-xl ${
        isDarkMode ? "text-gray-400" : "text-gray-600"
      }`}>No cosmic melodies found for your search.</p>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
      className="space-y-10"
    >
      {/* --- Songs Section --- */}
      {foundSongs && foundSongs.length > 0 && (
        <section>
          <h3 className={`text-2xl font-bold mb-4 ${
            isDarkMode ? "text-green-400" : "text-green-600"
          }`}>Songs</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {foundSongs.map((song) => (
              <motion.div
                key={song._id}
                className={`p-4 rounded-xl transition-all cursor-pointer relative overflow-hidden group border ${
                  isDarkMode 
                    ? "bg-gray-700/50 border-transparent hover:bg-gray-700/70 hover:border-green-500/40" 
                    : "bg-white/50 border-transparent hover:bg-white/70 hover:border-green-400/40"
                }`}
                whileHover={{ y: -5 }}
                onClick={(e) => onPlay(song, foundSongs, e)}
              >
                <img
                  src={buildImageUrl(song.coverArtPath)}
                  alt={song.title}
                  className="w-full h-40 object-cover rounded-lg mb-3 shadow-md"
                />
                <h4 className={`font-semibold text-lg leading-tight line-clamp-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}>{song.title}</h4>
                <p className={`text-sm mt-1 leading-tight line-clamp-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}>{song.artist}</p>
                <div className="mt-4 flex items-center justify-between">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlay(song, foundSongs, e);
                    }}
                    className={`px-4 py-1 rounded-full text-sm font-medium ${
                      isDarkMode 
                        ? "bg-green-500 text-white" 
                        : "bg-green-600 text-white"
                    }`}
                  >
                    Play
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLike(song._id, e);
                    }}
                    className={`transition-colors ${
                      isDarkMode 
                        ? "text-white/90 hover:text-red-400" 
                        : "text-gray-700 hover:text-red-500"
                    }`}
                  >
                    {likedSet.has(song._id) ? (
                      <FaHeart className="text-xl text-red-500" />
                    ) : (
                      <FaRegHeart className="text-xl" />
                    )}
                  </motion.button>
                </div>

                {/* Navigate to Artist Page */}
                {song.artist && (
                  <button
                    className={`mt-2 text-xs ${
                      isDarkMode 
                        ? "text-gray-500 hover:text-purple-400" 
                        : "text-gray-500 hover:text-purple-600"
                    } hover:underline`}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/artist/${encodeURIComponent(song.artist)}`);
                    }}
                  >
                    View {song.artist}
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* --- Artists Section --- */}
      {Object.keys(foundArtists).length > 0 && (
        <section>
          <h3 className={`text-2xl font-bold mb-4 ${
            isDarkMode ? "text-purple-400" : "text-purple-600"
          }`}>Artists</h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries(foundArtists).map(([name, data]) => (
              <motion.div
                key={name}
                className={`text-center w-40 cursor-pointer p-4 rounded-xl shadow-md border ${
                  isDarkMode 
                    ? "bg-gray-700/50 border-transparent hover:border-purple-500/40" 
                    : "bg-white/50 border-transparent hover:border-purple-400/40"
                }`}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/dashboard/artist/${encodeURIComponent(name)}`)}
              >
                <img
                  src={buildImageUrl(data.cover)}
                  alt={name}
                  className="w-32 h-32 rounded-full object-cover shadow-lg mb-3 mx-auto border-2 border-green-500/50"
                />
                <div className={`font-semibold text-lg leading-tight line-clamp-1 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}>{name}</div>
                <div className={`text-sm mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}>{data.songs.length} songs</div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* --- Albums Section --- */}
      {Object.keys(foundAlbums).length > 0 && (
        <section>
          <h3 className={`text-2xl font-bold mb-4 ${
            isDarkMode ? "text-green-400" : "text-green-600"
          }`}>Albums</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Object.entries(foundAlbums).map(([name, data]) => (
              <motion.div
                key={name}
                className={`p-4 rounded-xl transition-all cursor-pointer relative overflow-hidden group border ${
                  isDarkMode 
                    ? "bg-gray-700/50 border-transparent hover:bg-gray-700/70 hover:border-green-500/40" 
                    : "bg-white/50 border-transparent hover:bg-white/70 hover:border-green-400/40"
                }`}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/dashboard/album/${encodeURIComponent(name)}`)}
              >
                <img
                  src={buildImageUrl(data.cover)}
                  alt={name}
                  className="w-full h-40 object-cover rounded-lg mb-3 shadow-md"
                />
                <h4 className={`font-semibold text-lg leading-tight line-clamp-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}>{name}</h4>
                <p className={`text-sm mt-1 leading-tight line-clamp-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}>{data.songs[0]?.artist || "Various"}</p>
                <div className="mt-4 flex items-center justify-between">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlay(data.songs[0], data.songs, e);
                    }}
                    className={`px-4 py-1 rounded-full text-sm font-medium ${
                      isDarkMode 
                        ? "bg-green-500 text-white" 
                        : "bg-green-600 text-white"
                    }`}
                  >
                    Play
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
};

const SongCarousel = ({ title, songs, autoPlay = false, CardComponent, handleRipple, handleConfetti, currentSong, isPlaying, togglePlayPause }) => {
  const { playSong, likedSongs, likeSong, unlikeSong } = useContext(PlayerContext);
  const { isDarkMode } = useTheme();
  const likedSet = useMemo(() => new Set(likedSongs), [likedSongs]);

  const handleToggleLike = (songId, e) => {
    e.stopPropagation();
    const isCurrentlyLiked = likedSet.has(songId);
    if (isCurrentlyLiked) {
      unlikeSong(songId);
    } else {
      likeSong(songId);
      handleConfetti(e);
    }
  };

  const handlePlayAction = (song, songsList, e) => {
    if (e) e.stopPropagation();
    if (currentSong && currentSong._id === song._id) {
      togglePlayPause();
    } else {
      playSong(song, songsList);
    }
    if (e) handleRipple(e);
  };

  if (!songs || songs.length === 0) return null;

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 relative">
      <h2 className={`text-2xl md:text-3xl font-bold ${
        isDarkMode ? "text-green-400" : "text-green-600"
      }`}>{title}</h2>
      <Swiper
        modules={[FreeMode, Autoplay]}
        freeMode
        autoplay={autoPlay ? { delay: 2200, disableOnInteraction: false } : false}
        slidesPerView={"auto"}
        spaceBetween={20}
        className="!pb-4"
      >
        {songs.map((song, i) => (
          <SwiperSlide key={song._id} className="!w-auto">
            <CardComponent
              item={song}
              rank={i + 1}
              songsList={songs}
              playAction={(e) => handlePlayAction(song, songs, e)}
              isLiked={likedSet.has(song._id)}
              onToggleLike={(e) => handleToggleLike(song._id, e)}
              currentSong={currentSong}
              isPlaying={isPlaying}
              togglePlayPause={togglePlayPause}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.section>
  );
};

const ArtistCarousel = ({ title, artists, autoPlay = false }) => {
  const { isDarkMode } = useTheme();
  if (!artists || artists.length === 0) return null;
  
  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h2 className={`text-2xl md:text-3xl font-bold ${
        isDarkMode ? "text-purple-400" : "text-purple-600"
      }`}>{title}</h2>
      <Swiper
        modules={[FreeMode, Autoplay]}
        freeMode
        autoplay={autoPlay ? { delay: 3000, disableOnInteraction: false, reverseDirection: true } : false}
        slidesPerView={"auto"}
        spaceBetween={24}
        className="!pb-4"
      >
        {artists.map(([name, data]) => (
          <SwiperSlide key={name} className="!w-40">
            <ArtistCard artistName={name} artistData={data} />
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.section>
  );
};

const LiveListening = ({ songs, playSong, handleRipple, currentSong, isPlaying, togglePlayPause }) => {
  const { isDarkMode } = useTheme();
  const live = useMemo(() => [...songs].sort(() => 0.5 - Math.random()).slice(0, 6), [songs]);
  if (!live || live.length === 0) return null;

  const handleLivePlayAction = (song, songsList, e) => {
    if (e) e.stopPropagation();
    if (currentSong && currentSong._id === song._id) {
      togglePlayPause();
    } else {
      playSong(song, songsList);
    }
    if (e) handleRipple(e);
  };

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h2 className={`text-2xl md:text-3xl font-bold ${
        isDarkMode ? "text-green-400" : "text-green-600"
      }`}>Live Now</h2>
      <Swiper
        modules={[FreeMode, Autoplay]}
        freeMode
        slidesPerView={"auto"}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        spaceBetween={20}
        className="!pb-4"
      >
        {live.map((song) => (
          <SwiperSlide key={song._id} className="!w-60">
            <LiveListeningCard
              song={song}
              playSong={(e) => handleLivePlayAction(song, live, e)}
              isCurrentSong={currentSong && currentSong._id === song._id}
              isPlaying={isPlaying}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.section>
  );
};

const MusicCard = ({ item: song, playAction, isLiked, onToggleLike, currentSong, isPlaying }) => {
  const { isDarkMode } = useTheme();
  const isThisSongPlaying = currentSong && currentSong._id === song._id && isPlaying;
  const isThisSongPaused = currentSong && currentSong._id === song._id && !isPlaying;

  const getPlayIcon = () => {
    if (isThisSongPlaying) return <FaPause className="text-xl" />;
    return <FaPlay className="text-xl" />;
  };

  return (
    <motion.div
      className={`relative p-4 rounded-xl group flex flex-col items-center justify-center border transition-all overflow-hidden cursor-pointer w-48 ${
        isDarkMode 
          ? "bg-gray-700/50 border-transparent hover:border-green-500/40" 
          : "bg-white/50 border-transparent hover:border-green-400/40"
      }`}
      whileHover={{ y: -7 }}
      onClick={playAction}
    >
      <img src={buildImageUrl(song.coverArtPath)} alt={song.title} className="w-full h-40 object-cover rounded-lg mb-4 shadow-lg transition-transform group-hover:scale-105" />
      <div className="text-center w-full">
        <h3 className={`font-semibold text-lg leading-tight line-clamp-2 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}>{song.title}</h3>
        <p className={`text-sm line-clamp-1 ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        }`}>{song.artist}</p>
      </div>
      {/* The overlay also contains the play button, keep it for explicit control */}
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
        <IconButton title={isThisSongPlaying ? "Pause" : "Play"} onClick={playAction}>
          {getPlayIcon()}
        </IconButton>
        <IconButton title={isLiked ? "Unlike" : "Like"} onClick={onToggleLike} active={isLiked}>
          {isLiked ? <FaHeart className="text-xl" /> : <FaRegHeart className="text-xl" />}
        </IconButton>
      </div>
      {(isThisSongPlaying || isThisSongPaused) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className={`absolute bottom-2 right-2 p-2 rounded-full shadow-lg ${
            isDarkMode ? "bg-purple-600 text-white" : "bg-purple-500 text-white"
          }`}
        >
          {isThisSongPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
        </motion.div>
      )}
    </motion.div>
  );
};

const ChartCard = ({ item: song, rank, playAction, isLiked, onToggleLike, currentSong, isPlaying }) => {
  const { isDarkMode } = useTheme();
  const isThisSongPlaying = currentSong && currentSong._id === song._id && isPlaying;

  const getPlayIcon = () => {
    if (isThisSongPlaying) return <FaPause className="text-lg" />;
    return <FaPlay className="text-lg" />;
  };

  return (
    <motion.div
      key={song._id}
      className={`relative p-4 rounded-xl group flex items-center gap-4 border transition-all overflow-hidden w-72 ${
        isDarkMode 
          ? "bg-gray-700/50 border-transparent hover:border-purple-500/40" 
          : "bg-white/50 border-transparent hover:border-purple-400/40"
      }`}
      whileHover={{ y: -5 }}
    >
      <div className={`absolute -left-2 -top-2 text-6xl font-extrabold z-0 opacity-80 select-none ${
        isDarkMode ? "text-purple-500/30" : "text-purple-400/30"
      }`}>
        #{rank}
      </div>
      <img src={buildImageUrl(song.coverArtPath)} alt={song.title} className="w-20 h-20 object-cover rounded-lg shadow-md z-10" />
      <div className="flex-1 min-w-0 z-10 cursor-pointer" onClick={playAction}>
        <h3 className={`font-semibold text-lg leading-tight line-clamp-1 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}>{song.title}</h3>
        <p className={`text-sm line-clamp-1 ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        }`}>{song.artist}</p>
        <p className={`text-xs mt-1 ${
          isDarkMode ? "text-gray-500" : "text-gray-500"
        }`}>{song.duration ? formatDuration(song.duration) : "—"}</p>
      </div>
      <div className="flex flex-col gap-2 z-10">
        <IconButton title={isThisSongPlaying ? "Pause" : "Play"} onClick={playAction}>
          {getPlayIcon()}
        </IconButton>
        <IconButton title={isLiked ? "Unlike" : "Like"} onClick={onToggleLike} active={isLiked}>
          {isLiked ? <FaHeart className="text-lg" /> : <FaRegHeart className="text-lg" />}
        </IconButton>
      </div>
    </motion.div>
  );
};

const ArtistCard = ({ artistName, artistData }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <Link to={`/dashboard/artist/${encodeURIComponent(artistName)}`}>
      <motion.div
        className={`text-center p-4 rounded-xl shadow-lg border transition-all w-full ${
          isDarkMode 
            ? "bg-gray-700/50 border-transparent hover:border-green-500/40" 
            : "bg-white/50 border-transparent hover:border-green-400/40"
        }`}
        whileHover={{ y: -7 }}
      >
        <img src={buildImageUrl(artistData.cover)} alt={artistName} className="w-28 h-28 rounded-full object-cover shadow-lg mb-3 mx-auto border-2 border-green-500/50 transition-transform group-hover:scale-105" />
        <h3 className={`font-semibold text-lg leading-tight line-clamp-1 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}>{artistName}</h3>
        <p className={`text-sm mt-1 ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        }`}>{artistData.songs.length} songs</p>
      </motion.div>
    </Link>
  );
};

const LiveListeningCard = ({ song, playSong, isCurrentSong, isPlaying }) => {
  const { isDarkMode } = useTheme();
  
  const getPlayPauseIcon = () => {
    if (isCurrentSong && isPlaying) return <FaPause className="text-2xl" />;
    return <FaPlay className="text-2xl" />;
  };

  return (
    <motion.div
      key={song._id}
      className={`relative p-5 rounded-2xl shadow-lg border group flex flex-col items-center justify-center transition-all overflow-hidden w-full ${
        isDarkMode 
          ? "bg-gradient-to-br from-purple-900/40 to-gray-900/50 border-purple-500/50" 
          : "bg-gradient-to-br from-purple-100/40 to-gray-100/50 border-purple-400/50"
      }`}
      whileHover={{ y: -7 }}
      onClick={playSong}
    >
      <div className="absolute inset-0 z-0 bg-cover bg-center opacity-20 blur-md" style={{ backgroundImage: `url(${buildImageUrl(song.coverArtPath)})` }}></div>
      <div className="relative z-10 flex flex-col items-center">
        <img src={buildImageUrl(song.coverArtPath)} alt={song.title} className="w-32 h-32 object-cover rounded-full mb-4 shadow-xl border-2 border-green-500/60 animate-pulse" />
        <h3 className={`font-bold text-xl leading-tight line-clamp-1 mb-1 text-center ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}>{song.title}</h3>
        <p className={`text-md line-clamp-1 mb-3 text-center ${
          isDarkMode ? "text-gray-300" : "text-gray-700"
        }`}>{song.artist}</p>
        <div className="flex items-center gap-2 text-green-500 animate-pulse">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm font-medium">LIVE</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className={`mt-4 px-6 py-2 rounded-full text-lg font-bold flex items-center gap-2 ${
            isDarkMode 
              ? "bg-green-500 text-white" 
              : "bg-green-600 text-white"
          }`}
          onClick={playSong}
        >
          {getPlayPauseIcon()} {isCurrentSong && isPlaying ? "Playing" : "Listen Now"}
        </motion.button>
      </div>
    </motion.div>
  );
};

// -------------------- Utility Functions --------------------
const formatDuration = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export default MusicHome;