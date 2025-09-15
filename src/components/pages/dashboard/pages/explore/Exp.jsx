



// import React, { useState, useEffect, useContext } from 'react';
// import { FaPlay, FaPause, FaSearch, FaHeadphonesAlt } from 'react-icons/fa';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { PlayerContext } from '../../../../../context/PlayerContext';
// import { useTheme } from '../../../../../context/ThemeContext';

// // --- Helper to build image URLs ---
// const buildImageUrl = (path) => {
//   if (!path) return 'https://via.placeholder.com/160';
//   if (path.startsWith('http')) return path;
//   return `http://localhost:9999/${path.replace(/\\/g, '/')}`;
// };

// // --- Music Card Component ---
// const MusicCard = ({ item, playAction, showPlays = false, showLikes = false }) => {
//   const { isDarkMode } = useTheme();
//   const { likedSongs, currentSong, isPlaying } = useContext(PlayerContext);
//   const isLiked = likedSongs.has(item._id);
//   const isCurrentlyPlaying = currentSong && currentSong._id === item._id;

//   return (
//     <div className="flex-shrink-0 w-48 mb-4">
//       <div className={`p-3 rounded-xl relative cursor-pointer ${
//         isDarkMode ? 'bg-gray-800/60' : 'bg-white/90'
//       } ${isCurrentlyPlaying ? 'ring-2 ring-green-500' : ''}`}>
//         <div className="relative">
//           <img
//             src={buildImageUrl(item.coverArtPath)}
//             alt={item.title}
//             className="w-full h-44 object-cover rounded-lg shadow-lg"
//             onClick={playAction}
//           />
//           <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 playAction();
//               }}
//               className="bg-green-500 text-white p-3 rounded-full shadow-xl"
//             >
//               {isCurrentlyPlaying && isPlaying ? <FaPause size={14} /> : <FaPlay size={14} className="ml-0.5" />}
//             </button>
//           </div>
//           {(showPlays || showLikes) && (
//             <div className="absolute bottom-2 left-2 right-2 flex justify-between text-xs">
//               {showPlays && item.playCount && (
//                 <span className={`px-2 py-1 rounded-full ${
//                   isDarkMode ? 'bg-gray-900/80 text-gray-300' : 'bg-white/90 text-gray-700'
//                 }`}>
//                   🔥 {Math.floor(item.playCount / 1000)}K
//                 </span>
//               )}
//               {showLikes && isLiked && (
//                 <span className={`px-2 py-1 rounded-full ${
//                   isDarkMode ? 'bg-pink-900/80 text-pink-300' : 'bg-pink-100 text-pink-700'
//                 }`}>
//                   ❤️
//                 </span>
//               )}
//             </div>
//           )}
//         </div>
//         <div className="mt-3" onClick={playAction}>
//           <h3 className={`font-semibold text-md truncate ${
//             isDarkMode ? 'text-white' : 'text-gray-900'
//           }`}>
//             {item.title}
//           </h3>
//           <p className="text-sm text-gray-500 mt-1 truncate">{item.artist}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Album Card Component ---
// const AlbumCard = ({ albumName, albumData, onClick }) => {
//   const { isDarkMode } = useTheme();

//   return (
//     <div
//       onClick={onClick}
//       className="flex-shrink-0 w-48 mb-4 cursor-pointer"
//     >
//       <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-800/60' : 'bg-white/90'}`}>
//         <div className="relative">
//           <img
//             src={buildImageUrl(albumData.cover)}
//             alt={albumName}
//             className="w-full h-44 object-cover rounded-lg shadow-lg"
//           />
//           <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
//             <FaPlay className="text-white text-xl" />
//           </div>
//         </div>
//         <div className="mt-3">
//           <h3 className={`font-semibold text-md truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//             {albumName}
//           </h3>
//           <p className="text-sm text-gray-500 truncate">{albumData.songs.length} songs</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Category Card Component ---
// const CategoryCard = ({ title, icon, gradient, onClick }) => {
//   return (
//     <div
//       onClick={onClick}
//       className={`${gradient} rounded-2xl p-6 h-32 flex flex-col items-center justify-center shadow-lg cursor-pointer text-white`}
//     >
//       <div className="text-2xl mb-2">{icon}</div>
//       <h3 className="text-lg font-semibold text-center">{title}</h3>
//     </div>
//   );
// };

// // --- Artist Card Component ---
// const ArtistCard = ({ artistName, artistData, onClick }) => {
//   const { isDarkMode } = useTheme();

//   return (
//     <div
//       onClick={onClick}
//       className="flex-shrink-0 w-40 text-center cursor-pointer"
//     >
//       <div className="relative">
//         <img
//           src={buildImageUrl(artistData.cover)}
//           alt={artistName}
//           className="w-32 h-32 object-cover rounded-full mx-auto shadow-lg border-2 border-green-500/50"
//         />
//         <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
//           <FaPlay className="text-white text-xl" />
//         </div>
//       </div>
//       <h3 className={`font-semibold mt-3 truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//         {artistName}
//       </h3>
//       <p className="text-sm text-gray-500">{artistData.songs.length} songs</p>
//     </div>
//   );
// };

// // --- Main Explore Page ---
// const Exp = () => {
//   const [songs, setSongs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filteredSongs, setFilteredSongs] = useState([]);
//   const [activeFilter, setActiveFilter] = useState('all');
//   const { playSong, likedSongs, currentSong, isPlaying } = useContext(PlayerContext);
//   const { isDarkMode } = useTheme();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchSongs = async () => {
//       try {
//         const { data } = await axios.get('http://localhost:9999/public/songs');
//         // Add mock playCount for demonstration
//         const songsWithPlayCount = data.map(song => ({
//           ...song,
//           playCount: Math.floor(Math.random() * 1000000) // Random play count for demo
//         }));
//         setSongs(songsWithPlayCount);
//         setFilteredSongs(songsWithPlayCount);
//       } catch (error) {
//         console.error("Failed to fetch songs:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSongs();
//   }, []);

//   // Filter songs based on category
//   const filterSongsByCategory = (category) => {
//     setActiveFilter(category);
    
//     if (category === 'all') {
//       setFilteredSongs(songs);
//       return;
//     }

//     const filtered = songs.filter(song => {
//       const songTitle = song.title?.toLowerCase() || '';
//       const songArtist = song.artist?.toLowerCase() || '';
//       const songAlbum = song.album?.toLowerCase() || '';
      
//       switch (category) {
//         case 'devotional':
//           return songTitle.includes('devotional') || songTitle.includes('bhajan') ||
//                  songArtist.includes('devotional') || songAlbum.includes('devotional');
//         case 'romance':
//           return songTitle.includes('love') || songTitle.includes('romance') ||
//                  songTitle.includes('pyaar') || songTitle.includes('ishq');
//         case 'monsoon':
//           return songTitle.includes('rain') || songTitle.includes('monsoon') ||
//                  songTitle.includes('baarish') || songTitle.includes('sawan');
//         case 'workout':
//           return songTitle.includes('workout') || songTitle.includes('gym') ||
//                  songTitle.includes('exercise') || songTitle.includes('pump');
//         case 'chill':
//           return songTitle.includes('chill') || songTitle.includes('relax') ||
//                  songTitle.includes('calm') || songTitle.includes('peace');
//         case 'sleep':
//           return songTitle.includes('sleep') || songTitle.includes('lullaby') ||
//                  songTitle.includes('bedtime') || songTitle.includes('calm');
//         default:
//           return true;
//       }
//     });
    
//     setFilteredSongs(filtered);
//   };

//   if (loading) return (
//     <div className={`min-h-screen flex items-center justify-center ${
//       isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
//     }`}>
//       <div className="text-center">
//         <FaHeadphonesAlt className="text-4xl text-green-500 mx-auto mb-4" />
//         <p>Exploring new music...</p>
//       </div>
//     </div>
//   );

//   // --- Data processing ---
//   const newReleases = [...songs].reverse().slice(0, 12);
//   const topCharts = [...songs]
//     .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
//     .slice(0, 10);
  
//   const likedSongsList = songs.filter(song => likedSongs.has(song._id));

//   // Group songs by album
//   const albums = songs.reduce((acc, song) => {
//     if (song.album) {
//       if (!acc[song.album]) {
//         acc[song.album] = {
//           songs: [],
//           cover: song.coverArtPath,
//           artist: song.artist
//         };
//       }
//       acc[song.album].songs.push(song);
//     }
//     return acc;
//   }, {});

//   const popularAlbums = Object.entries(albums)
//     .sort(([, a], [, b]) => b.songs.length - a.songs.length)
//     .slice(0, 8);

//   const topArtists = Object.entries(
//     songs.reduce((acc, song) => {
//       if (song.artist) {
//         if (!acc[song.artist]) acc[song.artist] = { songs: [], cover: song.artistPic || song.coverArtPath };
//         acc[song.artist].songs.push(song);
//       }
//       return acc;
//     }, {})
//   ).slice(0, 8);

//   // --- Genre categories ---
//   const genres = [
//     { name: "Devotional", icon: "🕉️", gradient: "bg-gradient-to-br from-yellow-600 to-orange-500", key: "devotional" },
//     { name: "Romance", icon: "💖", gradient: "bg-gradient-to-br from-pink-500 to-red-500", key: "romance" },
//     { name: "Monsoon", icon: "🌧️", gradient: "bg-gradient-to-br from-blue-500 to-purple-600", key: "monsoon" },
//     { name: "Workout", icon: "💪", gradient: "bg-gradient-to-br from-green-500 to-teal-600", key: "workout" },
//     { name: "Indian Pop 90s", icon: "🎸", gradient: "bg-gradient-to-br from-purple-500 to-indigo-600", key: "90s" },
//     { name: "Indian Pop 2000s", icon: "🎤", gradient: "bg-gradient-to-br from-indigo-500 to-blue-600", key: "2000s" },
//     { name: "Chill", icon: "😌", gradient: "bg-gradient-to-br from-teal-500 to-green-600", key: "chill" },
//     { name: "80s", icon: "📻", gradient: "bg-gradient-to-br from-orange-500 to-red-500", key: "80s" },
//     { name: "Sleep", icon: "😴", gradient: "bg-gradient-to-br from-indigo-600 to-purple-700", key: "sleep" },
//     { name: "Feel Good", icon: "😊", gradient: "bg-gradient-to-br from-yellow-400 to-orange-400", key: "feelgood" },
//   ];

//   return (
//     <div className={`min-h-screen pb-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
//       {/* Header */}
//       {/* <header className={`sticky top-0 z-10 p-4 ${isDarkMode ? 'bg-gray-900 border-b border-gray-800' : 'bg-white border-b border-gray-200'}`}>
//         <div className="flex items-center justify-between max-w-7xl mx-auto">
//           <Link to="/dashboard" className="flex items-center">
//             <FaHeadphonesAlt className={`text-2xl mr-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
//             <span className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//               dhun
//             </span>
//           </Link>
          
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => navigate('/dashboard/search')}
//               className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
//             >
//               <FaSearch size={18} />
//             </button>
//           </div>
//         </div>
//       </header> */}

//       <main className="p-6 max-w-7xl mx-auto">
//         <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//           Explore {activeFilter !== 'all' && `- ${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}`}
//         </h1>

//         {/* Quick Access Categories */}
//         <section className="mb-12">
//           <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//             Browse by Mood & Genre
//           </h2>
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//             <CategoryCard
//               title="All Songs"
//               icon="🎵"
//               gradient="bg-gradient-to-br from-gray-600 to-gray-800"
//               onClick={() => filterSongsByCategory('all')}
//             />
//             {genres.map((genre) => (
//               <CategoryCard
//                 key={genre.key}
//                 title={genre.name}
//                 icon={genre.icon}
//                 gradient={genre.gradient}
//                 onClick={() => filterSongsByCategory(genre.key)}
//               />
//             ))}
//           </div>
//         </section>

//         {/* Filtered Songs */}
//         {activeFilter !== 'all' && (
//           <section className="mb-12">
//             <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//               {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Songs
//               <span className="text-sm text-gray-500 ml-2">({filteredSongs.length} songs)</span>
//             </h2>
//             <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
//               {filteredSongs.map((song) => (
//                 <MusicCard
//                   key={song._id}
//                   item={song}
//                   playAction={() => playSong(song, filteredSongs)}
//                   showPlays={true}
//                   showLikes={true}
//                 />
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Popular Albums */}
//         <section className="mb-12">
//           <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//             Popular Albums
//           </h2>
//           <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
//             {popularAlbums.map(([albumName, albumData]) => (
//               <AlbumCard
//                 key={albumName}
//                 albumName={albumName}
//                 albumData={albumData}
//                 onClick={() => navigate(`/dashboard/album/${encodeURIComponent(albumName)}`)}
//               />
//             ))}
//           </div>
//         </section>

//         {/* New Releases */}
//         <section className="mb-12">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//               New Releases
//             </h2>
//             <button className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
//               See all
//             </button>
//           </div>
//           <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
//             {newReleases.map((song) => (
//               <MusicCard
//                 key={song._id}
//                 item={song}
//                 playAction={() => playSong(song, newReleases)}
//                 showPlays={true}
//               />
//             ))}
//           </div>
//         </section>

//         {/* Top Artists */}
//         <section className="mb-12">
//           <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//             Popular Artists
//           </h2>
//           <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
//             {topArtists.map(([artistName, artistData]) => (
//               <ArtistCard
//                 key={artistName}
//                 artistName={artistName}
//                 artistData={artistData}
//                 onClick={() => navigate(`/dashboard/artist/${encodeURIComponent(artistName)}`)}
//               />
//             ))}
//           </div>
//         </section>

//         {/* Top Charts - STABLE VERSION */}
//         <section className="mb-12">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//               Top Charts
//             </h2>
//             <button className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
//               See all
//             </button>
//           </div>
//           <div className="grid grid-cols-1 gap-2">
//             {topCharts.map((song, index) => (
//               <div
//                 key={song._id}
//                 className={`flex items-center p-3 rounded-lg cursor-pointer ${
//                   isDarkMode
//                     ? 'bg-gray-800/60 hover:bg-gray-700/80'
//                     : 'bg-white/90 hover:bg-white'
//                 } ${currentSong && currentSong._id === song._id ? 'ring-2 ring-green-500' : ''}`}
//                 onClick={() => playSong(song, topCharts)}
//               >
//                 <span className={`text-xl font-bold mr-4 w-8 text-center ${
//                   isDarkMode ? 'text-gray-400' : 'text-gray-500'
//                 }`}>
//                   {index + 1}
//                 </span>
//                 <img
//                   src={buildImageUrl(song.coverArtPath)}
//                   alt={song.title}
//                   className="w-12 h-12 object-cover rounded"
//                 />
//                 <div className="ml-3 flex-1 min-w-0">
//                   <h3 className={`font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//                     {song.title}
//                   </h3>
//                   <p className="text-sm text-gray-500 truncate">{song.artist}</p>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                     {Math.floor(song.playCount / 1000)}K
//                   </span>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       playSong(song, topCharts);
//                     }}
//                     className="p-2 text-green-500 hover:text-green-600"
//                   >
//                     {currentSong && currentSong._id === song._id && isPlaying ? <FaPause /> : <FaPlay />}
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Liked Songs */}
//         {likedSongsList.length > 0 && (
//           <section className="mb-12">
//             <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//               Your Liked Songs
//             </h2>
//             <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
//               {likedSongsList.slice(0, 8).map((song) => (
//                 <MusicCard
//                   key={song._id}
//                   item={song}
//                   playAction={() => playSong(song, likedSongsList)}
//                   showLikes={true}
//                 />
//               ))}
//             </div>
//           </section>
//         )}
//       </main>
//     </div>
//   );
// };

// export default Exp;




















// import React, { useState, useEffect, useContext } from 'react';
// import { FaPlay, FaPause, FaSearch, FaHeadphonesAlt, FaHeart, FaRegHeart } from 'react-icons/fa';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { PlayerContext } from '../../../../../context/PlayerContext';
// import { useTheme } from '../../../../../context/ThemeContext';
// // import Confetti from 'react-dom-confetti';
// // import 'index.css'; // We'll create this for custom styles

// // --- Helper to build image URLs ---
// const buildImageUrl = (path) => {
//   if (!path) return 'https://via.placeholder.com/160';
//   if (path.startsWith('http')) return path;
//   return `http://localhost:9999/${path.replace(/\\/g, '/')}`;
// };

// // --- Ripple Effect Button ---
// const RippleButton = ({ children, onClick, className = '' }) => {
//   const [ripple, setRipple] = useState({ x: 0, y: 0, active: false });

//   const handleClick = (e) => {
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
//     <button className={`ripple-button ${className}`} onClick={handleClick}>
//       {children}
//       <span
//         className="ripple"
//         style={{
//           left: ripple.x,
//           top: ripple.y,
//           animation: ripple.active ? 'ripple-effect 0.6s linear' : 'none'
//         }}
//       />
//     </button>
//   );
// };

// // --- Music Card Component ---
// const MusicCard = ({ item, playAction, showPlays = false, showLikes = false, index }) => {
//   const { isDarkMode } = useTheme();
//   const { likedSongs, currentSong, isPlaying, toggleLike } = useContext(PlayerContext);
//   const isLiked = likedSongs.has(item._id);
//   const isCurrentlyPlaying = currentSong && currentSong._id === item._id;

//   const handleLike = (e) => {
//     e.stopPropagation();
//     toggleLike(item._id);
//   };

//   return (
//     <div className="flex-shrink-0 w-48 mb-4">
//       <div className={`p-3 rounded-xl relative cursor-pointer explore-card ${
//         isDarkMode ? 'bg-gray-800/60' : 'bg-white/90'
//       } ${isCurrentlyPlaying ? 'ring-2 ring-green-500' : ''}`}>
//         <div className="relative">
//           <img
//             src={buildImageUrl(item.coverArtPath)}
//             alt={item.title}
//             className="w-full h-44 object-cover rounded-lg shadow-lg"
//             onClick={playAction}
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
//           {(showPlays || showLikes) && (
//             <div className="absolute bottom-2 left-2 right-2 flex justify-between text-xs">
//               {showPlays && item.playCount && (
//                 <span className={`px-2 py-1 rounded-full ${
//                   isDarkMode ? 'bg-gray-900/80 text-gray-300' : 'bg-white/90 text-gray-700'
//                 }`}>
//                   🔥 {Math.floor(item.playCount / 1000)}K
//                 </span>
//               )}
//               <RippleButton
//                 onClick={handleLike}
//                 className={`p-1 rounded-full ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
//               >
//                 {isLiked ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
//               </RippleButton>
//             </div>
//           )}
//         </div>
//         <div className="mt-3" onClick={playAction}>
//           <h3 className={`font-semibold text-md truncate ${
//             isDarkMode ? 'text-white' : 'text-gray-900'
//           }`}>
//             {item.title}
//           </h3>
//           <p className="text-sm text-gray-500 mt-1 truncate">{item.artist}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Album Card Component ---
// const AlbumCard = ({ albumName, albumData, onClick }) => {
//   const { isDarkMode } = useTheme();

//   return (
//     <div
//       onClick={onClick}
//       className="flex-shrink-0 w-48 mb-4 cursor-pointer"
//     >
//       <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-800/60' : 'bg-white/90'}`}>
//         <div className="relative">
//           <img
//             src={buildImageUrl(albumData.cover)}
//             alt={albumName}
//             className="w-full h-44 object-cover rounded-lg shadow-lg"
//           />
//           <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
//             <FaPlay className="text-white text-xl" />
//           </div>
//         </div>
//         <div className="mt-3">
//           <h3 className={`font-semibold text-md truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//             {albumName}
//           </h3>
//           <p className="text-sm text-gray-500 truncate">{albumData.songs.length} songs</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Category Card Component ---
// const CategoryCard = ({ title, icon, gradient, onClick }) => {
//   return (
//     <RippleButton
//       onClick={onClick}
//       className={`${gradient} rounded-2xl p-6 h-32 flex flex-col items-center justify-center shadow-lg cursor-pointer text-white category-card`}
//     >
//       <div className="text-2xl mb-2">{icon}</div>
//       <h3 className="text-lg font-semibold text-center">{title}</h3>
//     </RippleButton>
//   );
// };

// // --- Artist Card Component ---
// const ArtistCard = ({ artistName, artistData, onClick }) => {
//   const { isDarkMode } = useTheme();

//   return (
//     <div
//       onClick={onClick}
//       className="flex-shrink-0 w-40 text-center cursor-pointer"
//     >
//       <div className="relative">
//         <img
//           src={buildImageUrl(artistData.cover)}
//           alt={artistName}
//           className="w-32 h-32 object-cover rounded-full mx-auto shadow-lg border-2 border-green-500/50"
//         />
//         <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
//           <FaPlay className="text-white text-xl" />
//         </div>
//       </div>
//       <h3 className={`font-semibold mt-3 truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//         {artistName}
//       </h3>
//       <p className="text-sm text-gray-500">{artistData.songs.length} songs</p>
//     </div>
//   );
// };

// // --- Trending Song Item Component ---
// const TrendingSongItem = ({ song, index, playAction }) => {
//   const { isDarkMode } = useTheme();
//   const { currentSong, isPlaying, likedSongs, toggleLike } = useContext(PlayerContext);
//   const isLiked = likedSongs.has(song._id);
//   const isCurrentlyPlaying = currentSong && currentSong._id === song._id;

//   const handleLike = (e) => {
//     e.stopPropagation();
//     toggleLike(song._id);
//   };

//   return (
//     <div
//       className={`flex items-center p-3 rounded-lg cursor-pointer trending-item ${
//         isDarkMode
//           ? 'bg-gray-800/60 hover:bg-gray-700/80'
//           : 'bg-white/90 hover:bg-white'
//       } ${isCurrentlyPlaying ? 'ring-2 ring-green-500' : ''}`}
//       onClick={playAction}
//     >
//       <span className={`text-xl font-bold mr-4 w-8 text-center ${
//         isDarkMode ? 'text-gray-400' : 'text-gray-500'
//       }`}>
//         {index + 1}
//       </span>
//       <img
//         src={buildImageUrl(song.coverArtPath)}
//         alt={song.title}
//         className="w-12 h-12 object-cover rounded"
//       />
//       <div className="ml-3 flex-1 min-w-0">
//         <h3 className={`font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//           {song.title}
//         </h3>
//         <p className="text-sm text-gray-500 truncate">{song.artist}</p>
//       </div>
//       <div className="flex items-center space-x-3">
//         <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//           {Math.floor(song.playCount / 1000)}K
//         </span>
//         <RippleButton
//           onClick={(e) => {
//             e.stopPropagation();
//             handleLike(e);
//           }}
//           className={`p-2 ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
//         >
//           {isLiked ? <FaHeart /> : <FaRegHeart />}
//         </RippleButton>
//         <RippleButton
//           onClick={(e) => {
//             e.stopPropagation();
//             playAction();
//           }}
//           className="p-2 text-green-500 hover:text-green-600"
//         >
//           {isCurrentlyPlaying && isPlaying ? <FaPause /> : <FaPlay />}
//         </RippleButton>
//       </div>
//     </div>
//   );
// };

// // --- Main Explore Page ---
// const Exp = () => {
//   const [songs, setSongs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filteredSongs, setFilteredSongs] = useState([]);
//   const [activeFilter, setActiveFilter] = useState('all');
//   const { playSong, likedSongs, currentSong, isPlaying } = useContext(PlayerContext);
//   const { isDarkMode } = useTheme();
//   const navigate = useNavigate();
//   const [showConfetti, setShowConfetti] = useState(false);

//   useEffect(() => {
//     const fetchSongs = async () => {
//       try {
//         const { data } = await axios.get('http://localhost:9999/public/songs');
//         // Add mock playCount for demonstration
//         const songsWithPlayCount = data.map(song => ({
//           ...song,
//           playCount: Math.floor(Math.random() * 1000000) // Random play count for demo
//         }));
//         setSongs(songsWithPlayCount);
//         setFilteredSongs(songsWithPlayCount);
//       } catch (error) {
//         console.error("Failed to fetch songs:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSongs();
//   }, []);

//   // Filter songs based on category
//   const filterSongsByCategory = (category) => {
//     setActiveFilter(category);
    
//     if (category === 'all') {
//       setFilteredSongs(songs);
//       return;
//     }

//     const filtered = songs.filter(song => {
//       const songTitle = song.title?.toLowerCase() || '';
//       const songArtist = song.artist?.toLowerCase() || '';
//       const songAlbum = song.album?.toLowerCase() || '';
//       const songLanguage = song.language?.toLowerCase() || '';
//       const songGenre = song.genre?.toLowerCase() || '';
//       const songTags = song.tags?.toLowerCase() || '';
      
//       switch (category) {
//         case '1990s':
//           return songTitle.includes('90s') || songAlbum.includes('90s') ||
//                  songTags.includes('90s') || songYearInRange(song, 1990, 1999);
//         case 'reggae':
//           return songGenre.includes('reggae') || songTags.includes('reggae') ||
//                  songArtist.includes('reggae') || songTitle.includes('reggae');
//         case 'romance':
//           return songTitle.includes('love') || songTitle.includes('romance') ||
//                  songTitle.includes('pyaar') || songTitle.includes('ishq') ||
//                  songGenre.includes('romance') || songTags.includes('romance');
//         case 'african':
//           return songLanguage.includes('african') || songGenre.includes('african') ||
//                  songArtist.includes('african') || songTags.includes('african');
//         case 'hindi':
//           return songLanguage.includes('hindi') || songLanguage.includes('hindustani');
//         case 'classical':
//           return songGenre.includes('classical') || songTags.includes('classical') ||
//                  songArtist.includes('classical');
//         default:
//           return true;
//       }
//     });
    
//     setFilteredSongs(filtered);
//   };

//   const songYearInRange = (song, start, end) => {
//     // Extract year from createdAt or other date field if available
//     if (song.createdAt) {
//       const year = new Date(song.createdAt).getFullYear();
//       return year >= start && year <= end;
//     }
//     return false;
//   };

//   if (loading) return (
//     <div className={`min-h-screen flex items-center justify-center ${
//       isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
//     }`}>
//       <div className="text-center">
//         <FaHeadphonesAlt className="text-4xl text-green-500 mx-auto mb-4" />
//         <p>Exploring new music...</p>
//       </div>
//     </div>
//   );

//   // --- Data processing ---
//   const newReleases = [...songs].reverse().slice(0, 12);
//   const topCharts = [...songs]
//     .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
//     .slice(0, 10);
  
//   const likedSongsList = songs.filter(song => likedSongs.has(song._id));

//   // Group songs by album
//   const albums = songs.reduce((acc, song) => {
//     if (song.album) {
//       if (!acc[song.album]) {
//         acc[song.album] = {
//           songs: [],
//           cover: song.coverArtPath,
//           artist: song.artist
//         };
//       }
//       acc[song.album].songs.push(song);
//     }
//     return acc;
//   }, {});

//   const popularAlbums = Object.entries(albums)
//     .sort(([, a], [, b]) => b.songs.length - a.songs.length)
//     .slice(0, 8);

//   const topArtists = Object.entries(
//     songs.reduce((acc, song) => {
//       if (song.artist) {
//         if (!acc[song.artist]) acc[song.artist] = { songs: [], cover: song.artistPic || song.coverArtPath };
//         acc[song.artist].songs.push(song);
//       }
//       return acc;
//     }, {})
//   ).slice(0, 8);

//   // --- Genre categories ---
//   const genres = [
//     { name: "1990s", icon: "🎸", gradient: "bg-gradient-to-br from-purple-500 to-indigo-600", key: "1990s" },
//     { name: "Reggae and Caribbean", icon: "🎶", gradient: "bg-gradient-to-br from-yellow-500 to-orange-500", key: "reggae" },
//     { name: "Romance", icon: "💖", gradient: "bg-gradient-to-br from-pink-500 to-red-500", key: "romance" },
//     { name: "African", icon: "🌍", gradient: "bg-gradient-to-br from-yellow-600 to-brown-600", key: "african" },
//     { name: "Hindi", icon: "🇮🇳", gradient: "bg-gradient-to-br from-orange-500 to-red-500", key: "hindi" },
//     { name: "Hindustani Classical", icon: "🎵", gradient: "bg-gradient-to-br from-teal-500 to-blue-600", key: "classical" },
//   ];

//   // Mock data for podcasts (replace with real data if available)
//   const popularEpisodes = [
//     {
//       id: 1,
//       title: "acqarri shr aqkamn hanai sh aqdh snaich #EP2...",
//       description: "Political Analysis",
//       date: "1 day ago"
//     }
//   ];

//   return (
//     <div className={`min-h-screen pb-20 explore-container ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
//       {/* <Confetti active={showConfetti} config={{ spread: 90, elementCount: 100 }} /> */}

//       <main className="p-6 max-w-7xl mx-auto">
//         <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//           Explore
//         </h1>

//         {/* Navigation Tabs */}
//         <div className="flex flex-wrap mb-8 border-b border-gray-300">
//           <button className={`tab-button ${activeFilter === 'all' ? 'active' : ''}`}
//                   onClick={() => filterSongsByCategory('all')}>
//             New releases
//           </button>
//           <button className={`tab-button ${activeFilter === 'charts' ? 'active' : ''}`}
//                   onClick={() => filterSongsByCategory('charts')}>
//             Charts
//           </button>
//           <button className={`tab-button ${activeFilter === 'moods' ? 'active' : ''}`}
//                   onClick={() => filterSongsByCategory('moods')}>
//             Moods and genres
//           </button>
//           <button className={`tab-button ${activeFilter === 'podcasts' ? 'active' : ''}`}
//                   onClick={() => filterSongsByCategory('podcasts')}>
//             Podcasts
//           </button>
//           <button className={`tab-button ${activeFilter === 'new-albums' ? 'active' : ''}`}
//                   onClick={() => filterSongsByCategory('new-albums')}>
//             New albums and singles
//           </button>
//         </div>

//         {/* New Albums and Singles Section */}
//         <section className="mb-12">
//           <h2 className={`section-heading ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//             New albums and singles
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {/* Sample album items - replace with actual data */}
//             <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
//               <div className="flex items-center">
//                 <img src="https://via.placeholder.com/60" alt="Album" className="w-16 h-16 rounded mr-4" />
//                 <div>
//                   <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Aaj Tai Cha Laagin H...</h3>
//                   <p className="text-sm text-gray-500">Album - Udit Narayan, Shailendra Jadhav &...</p>
//                 </div>
//               </div>
//             </div>
//             <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
//               <div className="flex items-center">
//                 <img src="https://via.placeholder.com/60" alt="Single" className="w-16 h-16 rounded mr-4" />
//                 <div>
//                   <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dil Ka Khuda</h3>
//                   <p className="text-sm text-gray-500">Single - Udit Narayan & Vaishnav Deva</p>
//                 </div>
//               </div>
//             </div>
//             <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
//               <div className="flex items-center">
//                 <img src="https://via.placeholder.com/60" alt="Single" className="w-16 h-16 rounded mr-4" />
//                 <div>
//                   <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Kei</h3>
//                   <p className="text-sm text-gray-500">Single - Various Artists</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Moods and genres Section */}
//         <section className="mb-12">
//           <h2 className={`section-heading ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//             Moods and genres
//           </h2>
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
//             {genres.map((genre) => (
//               <CategoryCard
//                 key={genre.key}
//                 title={genre.name}
//                 icon={genre.icon}
//                 gradient={genre.gradient}
//                 onClick={() => filterSongsByCategory(genre.key)}
//               />
//             ))}
//           </div>
//         </section>

//         {/* Popular Episodes Section */}
//         <section className="mb-12">
//           <h2 className={`section-heading ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//             Popular episodes
//           </h2>
//           <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
//             {popularEpisodes.map(episode => (
//               <div key={episode.id}>
//                 <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//                   {episode.title}
//                 </h3>
//                 <p className="text-sm text-gray-500">{episode.date} - {episode.description}</p>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Trending Section */}
//         <section className="mb-12">
//           <h2 className={`section-heading ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//             Trending
//           </h2>
//           <div className="grid grid-cols-1 gap-2">
//             {topCharts.map((song, index) => (
//               <TrendingSongItem
//                 key={song._id}
//                 song={song}
//                 index={index}
//                 playAction={() => playSong(song, topCharts)}
//               />
//             ))}
//           </div>
//         </section>

//         {/* New Releases Section */}
//         <section className="mb-12">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className={`section-heading ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//               New Releases
//             </h2>
//             <button className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
//               See all
//             </button>
//           </div>
//           <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
//             {newReleases.map((song) => (
//               <MusicCard
//                 key={song._id}
//                 item={song}
//                 playAction={() => playSong(song, newReleases)}
//                 showPlays={true}
//               />
//             ))}
//           </div>
//         </section>

//         {/* Popular Artists Section (Replacing Popular Videos) */}
//         <section className="mb-12">
//           <h2 className={`section-heading ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//             Popular Artists
//           </h2>
//           <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
//             {topArtists.map(([artistName, artistData]) => (
//               <ArtistCard
//                 key={artistName}
//                 artistName={artistName}
//                 artistData={artistData}
//                 onClick={() => navigate(`/dashboard/artist/${encodeURIComponent(artistName)}`)}
//               />
//             ))}
//           </div>
//         </section>

//         {/* Liked Songs */}
//         {likedSongsList.length > 0 && (
//           <section className="mb-12">
//             <h2 className={`section-heading ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//               Your Liked Songs
//             </h2>
//             <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
//               {likedSongsList.slice(0, 8).map((song) => (
//                 <MusicCard
//                   key={song._id}
//                   item={song}
//                   playAction={() => playSong(song, likedSongsList)}
//                   showLikes={true}
//                 />
//               ))}
//             </div>
//           </section>
//         )}
//       </main>
//     </div>
//   );
// };

// export default Exp;





import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { FaPlay, FaPause, FaSearch, FaHeadphonesAlt, FaHeart, FaRegHeart, FaFilter, FaTimes, FaMusic, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
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
const MusicCard = ({ item, playAction }) => {
  const { isDarkMode } = useTheme();
  const { currentSong, isPlaying, likedSongs = [], likeSong, unlikeSong } = useContext(PlayerContext);
  const isCurrentlyPlaying = currentSong && currentSong._id === item._id;
  const isLiked = Array.isArray(likedSongs) && likedSongs.includes(item._id);

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (isLiked) {
      unlikeSong(item._id);
    } else {
      likeSong(item._id);
    }
  };

  const handleCardClick = () => {
    playAction();
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
    navigate(`/artist/${encodeURIComponent(artist.name)}`);
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
  const { currentSong, isPlaying, likedSongs = [], likeSong, unlikeSong } = useContext(PlayerContext);
  const isCurrentlyPlaying = currentSong && currentSong._id === song._id;
  const isLiked = Array.isArray(likedSongs) && likedSongs.includes(song._id);

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
  const [activeFilter, setActiveFilter] = useState(null);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({ language: '', genre: '', mood: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const { playSong } = useContext(PlayerContext);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [songsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/public/songs`)
        ]);
        
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
        const genreCounts = {};
        
        songsRes.data.forEach(song => {
          if (song.genre) {
            genreCounts[song.genre] = (genreCounts[song.genre] || 0) + 1;
          }
        });
        
        const songsByGenre = Object.entries(genreCounts).map(([genre, count]) => ({
          _id: genre,
          count
        }));
        
        setStats({
          totalSongs: songsRes.data.length,
          languages,
          songsByGenre
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
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
      
    const topCharts = [...songs]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 5);

    return { newReleases, topCharts };
  }, [songs]);

  // Filter songs by category
  const filterSongs = useCallback((category) => {
    setActiveFilter(category);
    if (category === 'all') {
      setFilteredSongs(songs);
    } else {
      const filtered = songs.filter(song => 
        song.genre?.toLowerCase().includes(category.toLowerCase()) || 
        song.tags?.toLowerCase().includes(category.toLowerCase())
      );
      setFilteredSongs(filtered);
    }
  }, [songs]);

  // Apply filters from modal
  const applyFilters = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.language) params.append('language', filters.language);
      if (filters.genre) params.append('genre', filters.genre);
      if (filters.mood) params.append('mood', filters.mood);
      
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/public/songs?${params.toString()}`);
      setFilteredSongs(data);
      setActiveFilter('filtered');
      setIsFilterModalOpen(false);
    } catch (error) {
      console.error("Failed to fetch filtered songs:", error);
    }
  }, [filters]);

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
    setActiveFilter('search');
  }, [searchQuery, songs]);

  // --- Category Card Data (with gradients) ---
  const topCategories = [
    { name: "New releases", icon: "💿", gradient: "bg-gradient-to-br from-blue-500 to-indigo-600", key: "new_releases" },
    { name: "Charts", icon: "📈", gradient: "bg-gradient-to-br from-red-500 to-pink-600", key: "charts" },
    { name: "Moods and genres", icon: "😄", gradient: "bg-gradient-to-br from-purple-500 to-deep-purple-600", key: "moods_genres" },
    { name: "Discover", icon: "🔍", gradient: "bg-gradient-to-br from-teal-500 to-green-600", key: "discover" },
  ];

  // --- Genre categories (with gradients and counts) ---
  const genres = useMemo(() => {
    if (!stats?.songsByGenre) return [];
    
    return stats.songsByGenre.slice(0, 6).map(genre => ({
      name: genre._id,
      gradient: "bg-gradient-to-br from-purple-500 to-indigo-600",
      key: genre._id.toLowerCase(),
      count: genre.count
    }));
  }, [stats]);

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
          <div className="relative">
            <input
              type="text"
              placeholder="Search for songs, artists, or albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className={`w-full py-2 pl-10 pr-4 rounded-full focus:outline-none focus:ring-2 ${
                isDarkMode 
                  ? 'bg-gray-700 text-white focus:ring-green-500' 
                  : 'bg-white text-gray-900 focus:ring-green-500'
              }`}
            />
            <FaSearch className={`absolute left-3 top-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            {searchQuery && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter(null);
                }}
                className="absolute right-3 top-3 text-gray-500"
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
                {activeFilter === 'search' ? `Search Results for "${searchQuery}"` : 
                 activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Music
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
                  onClick={() => {
                    if (cat.key === 'moods_genres') {
                      setIsFilterModalOpen(true);
                    } else if (cat.key === 'new_releases') {
                      filterSongs('all');
                    } else {
                      console.log(`Navigate to ${cat.key}`);
                    }
                  }}
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
                    />
                  ))}
                </div>
              ) : (
                <div className={`text-center py-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  No new releases available.
                </div>
              )}
            </motion.section>

            {/* Moods and genres Section */}
            <motion.section 
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Moods and genres
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
                      onClick={() => filterSongs(genre.key)}
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