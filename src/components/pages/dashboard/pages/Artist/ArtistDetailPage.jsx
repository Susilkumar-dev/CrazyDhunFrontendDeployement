


// import React, { useState, useEffect, useContext } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { PlayerContext } from '../../../../../context/PlayerContext';
// import { FaPlay, FaHeart, FaRegHeart } from 'react-icons/fa';

// // Reusable helper function
// const buildImageUrl = (path) => {
//     if (!path) return 'https://via.placeholder.com/160';
//     if (path.startsWith('http')) return path;
//     return `http://localhost:9999/${path.replace(/\\/g, '/')}`;
// };

// const ArtistDetailPage = () => {
//     const { artistName } = useParams(); // Get the artist's name from the URL
//     const [artistSongs, setArtistSongs] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const { playSong, likedSongs, likeSong, unlikeSong } = useContext(PlayerContext);
//     const likedSet = new Set(likedSongs);

//     useEffect(() => {
//         const fetchArtistSongs = async () => {
//             try {
//                 // Use the public route to get all songs by this artist
//                 const { data } = await axios.get(`http://localhost:9999/public/songs/artist/${encodeURIComponent(artistName)}`);
//                 setArtistSongs(data);
//             } catch (error) {
//                 console.error("Failed to fetch artist songs:", error);
//                 setArtistSongs([]); // Set to empty array on error
//             }
//             finally { setLoading(false); }
//         };
//         fetchArtistSongs();
//     }, [artistName]); // Re-fetch if the artistName in the URL changes

//     const toggleLike = (songId) => {
//         if (likedSet.has(songId)) unlikeSong(songId);
//         else likeSong(songId);
//     };

//     if (loading) return <p className="text-white p-10 text-center">Loading Artist...</p>;
//     if (artistSongs.length === 0) return <p className="text-white p-10 text-center">Artist "{artistName}" not found or has no songs.</p>;

//     return (
//         <div className="p-6 md:p-10 text-white">
//             {/* Immersive Header */}
//             <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
//                 <img
//                     src={buildImageUrl(artistSongs[0]?.artistPic || artistSongs[0]?.coverArtPath)}
//                     alt={artistName}
//                     className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover shadow-2xl"
//                 />
//                 <div>
//                     <h2 className="text-sm uppercase tracking-wider">Artist</h2>
//                     <h1 className="text-5xl md:text-7xl font-extrabold">{artistName}</h1>
//                     <p className="text-gray-400 mt-2">{artistSongs.length} song{artistSongs.length !== 1 ? 's' : ''}</p>
//                 </div>
//             </div>

//             {/* Song List */}
//             <div className="space-y-2">
//                 {artistSongs.map((song) => (
//                     <div
//                         key={song._id}
//                         className="flex items-center p-3 rounded-lg hover:bg-gray-800/70 transition-colors cursor-pointer group"
//                         onClick={() => playSong(song, artistSongs)}
//                     >
//                         <img src={buildImageUrl(song.coverArtPath)} alt={song.title} className="w-12 h-12 rounded object-cover mr-4" />
//                         <div className="flex-1 min-w-0">
//                             <h3 className="text-lg font-semibold text-white truncate">{song.title}</h3>
//                             <p className="text-sm text-gray-400 truncate">{song.album || 'Single'}</p>
//                         </div>
//                         <button onClick={(e) => { e.stopPropagation(); toggleLike(song._id); }} className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                             {likedSet.has(song._id) ? <FaHeart className="text-green-500" /> : <FaRegHeart className="text-white/80" />}
//                         </button>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default ArtistDetailPage;




import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { PlayerContext } from '../../../../../context/PlayerContext';
import { useTheme } from '../../../../../context/ThemeContext';
import { FaPlay, FaHeart, FaRegHeart, FaRandom, FaClock, FaArrowLeft, FaMusic, FaCompactDisc, FaUser } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Reusable helper function
const buildImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/160';
    if (path.startsWith('http')) return path;
    return `${import.meta.env.VITE_API_URL}/${path.replace(/\\/g, '/')}`;
};

const ArtistDetailPage = () => {
    const { artistName } = useParams();
    const navigate = useNavigate();
    const [artistSongs, setArtistSongs] = useState([]);
    const [albums, setAlbums] = useState({});
    const [topSongs, setTopSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('songs');
    const { playSong, likedSongs, likeSong, unlikeSong, currentSong, isPlaying } = useContext(PlayerContext);
    const { isDarkMode } = useTheme();

    useEffect(() => {
        const fetchArtistSongs = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/public/songs/artist/${encodeURIComponent(artistName)}`);
                setArtistSongs(data);
                
                // Group songs by album
                const albumMap = {};
                data.forEach(song => {
                    if (!albumMap[song.album]) {
                        albumMap[song.album] = {
                            songs: [],
                            cover: song.coverArtPath,
                            artistPic: song.artistPic
                        };
                    }
                    albumMap[song.album].songs.push(song);
                });
                setAlbums(albumMap);
                
                // Get top 5 songs (by play count or just first 5)
                setTopSongs(data.slice(0, 5));
            } catch (error) { 
                console.error("Failed to fetch artist songs:", error);
                setArtistSongs([]);
            } finally { 
                setLoading(false); 
            }
        };
        fetchArtistSongs();
    }, [artistName]);

    const toggleLike = (songId) => {
        if (likedSongs?.has(songId)) {
            unlikeSong(songId);
        } else {
            likeSong(songId);
        }
    };

    const handlePlayAll = () => {
        if (artistSongs.length > 0) {
            playSong(artistSongs[0], artistSongs);
        }
    };

    const handleShufflePlay = () => {
        if (artistSongs.length > 0) {
            const shuffledSongs = [...artistSongs].sort(() => Math.random() - 0.5);
            playSong(shuffledSongs[0], shuffledSongs);
        }
    };

    const formatDuration = (seconds) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const totalDuration = artistSongs.reduce((total, song) => total + (song.duration || 0), 0);
    const totalMinutes = Math.floor(totalDuration / 60);

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                <div className="animate-pulse text-center">
                    <div className={`w-32 h-32 rounded-full mx-auto mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
                    <div className={`h-8 w-48 rounded mx-auto mb-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
                    <div className={`h-4 w-32 rounded mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
                </div>
            </div>
        );
    }

    if (artistSongs.length === 0) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                <div className="text-center">
                    <FaUser className={`text-5xl mx-auto mb-4 ${isDarkMode ? 'text-gray-700' : 'text-gray-400'}`} />
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Artist Not Found</h2>
                    <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        The artist "{artistName}" doesn't exist or has no songs.
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

    const artistImage = artistSongs[0]?.artistPic || artistSongs[0]?.coverArtPath;

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
                <h1 className="ml-4 font-semibold truncate">{artistName}</h1>
            </div>

            {/* Artist Hero Section */}
            <div className={`p-6 md:p-10 ${isDarkMode ? 'bg-gradient-to-t from-gray-900 to-gray-800/50' : 'bg-gradient-to-t from-white to-gray-100/50'}`}>
                <div className="flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group"
                    >
                        <img
                            src={buildImageUrl(artistImage)}
                            alt={artistName}
                            className="w-48 h-48 md:w-60 md:h-60 object-cover rounded-full shadow-2xl"
                        />
                        <div className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center transition-opacity ${isDarkMode ? 'bg-black/40' : 'bg-white/40'}`}>
                            <button
                                onClick={handlePlayAll}
                                className="p-4 rounded-full bg-green-500 hover:bg-green-400 transition-colors"
                            >
                                <FaPlay className="text-white" />
                            </button>
                        </div>
                    </motion.div>

                    <div className="flex-1 text-center md:text-left">
                        <p className="text-sm uppercase tracking-wider opacity-70">Artist</p>
                        <h1 className="text-4xl md:text-5xl font-bold mt-1 mb-4">{artistName}</h1>
                        <div className="flex items-center justify-center md:justify-start space-x-4 text-sm opacity-80">
                            <span className="flex items-center">
                                <FaMusic className="mr-1" /> {artistSongs.length} songs
                            </span>
                            <span>•</span>
                            <span className="flex items-center">
                                <FaCompactDisc className="mr-1" /> {Object.keys(albums).length} albums
                            </span>
                            <span>•</span>
                            <span>{totalMinutes} min</span>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
                            <button
                                onClick={handlePlayAll}
                                className="px-6 py-3 rounded-full bg-green-500 hover:bg-green-400 text-white font-medium flex items-center transition-colors"
                            >
                                <FaPlay className="mr-2" /> Play All
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

            {/* Navigation Tabs */}
            <div className="px-6 md:px-10 border-b" style={{ borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}>
                <div className="flex space-x-6">
                    <button
                        onClick={() => setActiveTab('songs')}
                        className={`py-3 font-medium relative ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                        Songs
                        {activeTab === 'songs' && (
                            <motion.div 
                                className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 rounded-t-lg"
                                layoutId="activeTab"
                            />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('albums')}
                        className={`py-3 font-medium relative ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                        Albums
                        {activeTab === 'albums' && (
                            <motion.div 
                                className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 rounded-t-lg"
                                layoutId="activeTab"
                            />
                        )}
                    </button>
                </div>
            </div>

            {/* Content based on active tab */}
            <div className="p-6 md:p-10">
                <AnimatePresence mode="wait">
                    {activeTab === 'songs' && (
                        <motion.div
                            key="songs"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-2xl font-bold mb-6">Popular</h2>
                            
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
                                    {artistSongs.map((song, index) => (
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
                                                    onClick={() => playSong(song, artistSongs)}
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
                                                {song.album || 'Single'}
                                            </div>
                                            
                                            <div className="col-span-2 flex justify-end items-center space-x-3">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleLike(song._id); }}
                                                    className={`p-1 rounded-full transition-colors ${
                                                        likedSongs?.has(song._id) 
                                                            ? 'text-red-500 hover:text-red-400' 
                                                            : 'text-gray-400 hover:text-gray-300'
                                                    }`}
                                                >
                                                    {likedSongs?.has(song._id) ? <FaHeart /> : <FaRegHeart />}
                                                </button>
                                                <span className="text-sm opacity-70">
                                                    {formatDuration(song.duration)}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'albums' && (
                        <motion.div
                            key="albums"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
                        >
                            {Object.entries(albums).map(([albumName, albumData]) => (
                                <motion.div
                                    key={albumName}
                                    whileHover={{ y: -5 }}
                                    className="group cursor-pointer"
                                    onClick={() => navigate(`/dashboard/album/${encodeURIComponent(albumName)}`)}
                                >
                                    <div className="relative mb-3">
                                        <img
                                            src={buildImageUrl(albumData.cover)}
                                            alt={albumName}
                                            className="w-full aspect-square object-cover rounded-xl shadow-lg"
                                        />
                                        <div className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center transition-opacity ${isDarkMode ? 'bg-black/40' : 'bg-white/40'}`}>
                                            <button className="p-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors">
                                                <FaPlay className="text-white" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="font-semibold truncate">{albumName}</p>
                                    <p className="text-sm opacity-70">{albumData.songs.length} songs</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ArtistDetailPage;
