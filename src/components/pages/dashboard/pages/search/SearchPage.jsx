

import React, { useState, useEffect, useContext } from 'react';
import { FaSearch, FaTimes, FaHistory, FaMusic, FaUser, FaCompactDisc, FaPlay } from 'react-icons/fa';
import axios from 'axios';
import { PlayerContext } from '../../../../../context/PlayerContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Helper function to build correct image URLs
const buildImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/160';
    if (path.startsWith('http')) return path;
    return `http://localhost:9999/${path.replace(/\\/g, '/')}`;
};

// --- Main Search Page Component ---
const SearchPage = () => {
    const [allSongs, setAllSongs] = useState([]);
    const [query, setQuery] = useState('');
    const [filteredResults, setFilteredResults] = useState({ songs: [], artists: {}, albums: {} });
    const [searchHistory, setSearchHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const { playSong } = useContext(PlayerContext);

    // Fetch all songs on initial load to enable client-side searching
    useEffect(() => {
        const initialLoad = async () => {
            try {
                const { data } = await axios.get('http://localhost:9999/public/songs');
                setAllSongs(data);
                const storedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
                setSearchHistory(storedHistory);
            } catch (error) {
                console.error("Failed to load initial data for search:", error);
            } finally {
                setLoading(false);
            }
        };
        initialLoad();
    }, []);

    // Perform search whenever the query changes
    useEffect(() => {
        if (query.trim() === '') {
            setFilteredResults({ songs: [], artists: {}, albums: {} });
            return;
        }
        const lowercaseQuery = query.toLowerCase();
        const results = allSongs.filter(song =>
            (song.title || '').toLowerCase().includes(lowercaseQuery) ||
            (song.artist || '').toLowerCase().includes(lowercaseQuery) ||
            (song.album || '').toLowerCase().includes(lowercaseQuery)
        );
        const artists = results.reduce((acc, song) => {
            if (song.artist) {
                if (!acc[song.artist]) acc[song.artist] = { songs: [], cover: song.artistPic || song.coverArtPath };
                acc[song.artist].songs.push(song);
            }
            return acc;
        }, {});
        const albums = results.reduce((acc, song) => {
            if (song.album) {
                if (!acc[song.album]) acc[song.album] = { songs: [], cover: song.coverArtPath };
                acc[song.album].songs.push(song);
            }
            return acc;
        }, {});
        setFilteredResults({ songs: results, artists, albums });
    }, [query, allSongs]);

    // Handle search history
    const handleAddToHistory = (term) => {
        if (!term || term.trim() === '') return;
        const newHistory = [term, ...searchHistory.filter(item => item !== term)].slice(0, 5);
        setSearchHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    };

    const handleClearSearch = () => {
        setQuery('');
    };

    if (loading) {
        return <p className="p-10 text-center text-white">Loading search engine...</p>;
    }

    return (
        <div className="p-4 md:p-8 min-h-screen text-white">
            {/* Sticky Search Bar */}
            <motion.div
                className="sticky top-0 z-10 bg-gray-900 pt-4 mb-8"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="flex items-center bg-gray-800 rounded-full px-4 py-3 shadow-lg">
                    <FaSearch className="text-gray-400 mr-3" />
                    <input
                        type="text"
                        placeholder="What do you want to listen to?"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onBlur={() => handleAddToHistory(query)}
                        className="w-full bg-transparent focus:outline-none text-lg"
                    />
                    {query && (
                        <button onClick={handleClearSearch} className="text-gray-400 hover:text-white">
                            <FaTimes />
                        </button>
                    )}
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {query ? (
                    <SearchResults key="results" results={filteredResults} playSong={playSong} />
                ) : (
                    <SearchHistory key="history" history={searchHistory} setQuery={setQuery} />
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Sub-Component for Displaying Search Results ---
const SearchResults = ({ results, playSong }) => {
    const { songs, artists, albums } = results;
    const hasResults = songs.length > 0 || Object.keys(artists).length > 0 || Object.keys(albums).length > 0;
    
    if (!hasResults) {
        return <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-400">No results found for "{results.query}".</motion.p>;
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {songs.length > 0 && (
                <SearchResultCategory title="Songs" icon={<FaMusic />}>
                    {songs.slice(0, 5).map(song => (
                        <SongItem key={song._id} item={song} onPlay={() => playSong(song, songs)} />
                    ))}
                </SearchResultCategory>
            )}
            
            {Object.keys(artists).length > 0 && (
                <SearchResultCategory title="Artists" icon={<FaUser />}>
                    {Object.entries(artists).map(([name, data]) => (
                        <AlbumArtistItem key={name} name={name} data={data} onPlay={() => playSong(data.songs[0], data.songs)} type="artist" />
                    ))}
                </SearchResultCategory>
            )}

            {Object.keys(albums).length > 0 && (
                <SearchResultCategory title="Albums" icon={<FaCompactDisc />}>
                    {Object.entries(albums).map(([name, data]) => (
                        <AlbumArtistItem key={name} name={name} data={data} onPlay={() => playSong(data.songs[0], data.songs)} type="album" />
                    ))}
                </SearchResultCategory>
            )}
        </motion.div>
    );
};

// --- Sub-Component for Displaying Search History ---
const SearchHistory = ({ history, setQuery }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-2xl font-bold mb-4">Recent Searches</h2>
        {history.length > 0 ? (
            history.map((term, index) => (
                <motion.div
                    key={index}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-800 cursor-pointer"
                    onClick={() => setQuery(term)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <FaHistory className="text-gray-500 mr-4" />
                    <span className="flex-1 text-lg">{term}</span>
                </motion.div>
            ))
        ) : (
            <p className="text-gray-400">Search for your favorite songs, artists, or albums.</p>
        )}
    </motion.div>
);

// --- Reusable UI Components ---
const SearchResultCategory = ({ title, icon, children }) => (
    <div className="mb-10">
        <div className="flex items-center mb-4">
            <span className="text-green-500 mr-3">{icon}</span>
            <h3 className="text-2xl font-bold">{title}</h3>
        </div>
        <div className="space-y-2">{children}</div>
    </div>
);

const SongItem = ({ item, onPlay }) => (
    <div className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer group" onClick={onPlay}>
        <img src={buildImageUrl(item.coverArtPath)} alt={item.title} className="w-12 h-12 rounded object-cover mr-4" />
        <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white truncate">{item.title}</h4>
            <p className="text-sm text-gray-400 truncate">{item.artist}</p>
        </div>
        <FaPlay className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
);

const AlbumArtistItem = ({ name, data, onPlay, type }) => (
    <div className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors group">
        <Link to={`/dashboard/${type}/${encodeURIComponent(name)}`} className="flex items-center flex-1 min-w-0">
            <img src={buildImageUrl(data.cover)} alt={name} className="w-12 h-12 rounded-full object-cover mr-4" />
            <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white truncate">{name}</h4>
                <p className="text-sm text-gray-400 truncate">{data.songs.length} song{data.songs.length !== 1 ? 's' : ''}</p>
            </div>
        </Link>
        <button 
            onClick={(e) => { e.stopPropagation(); onPlay(); }} 
            className="p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={`Play songs by ${name}`}
        >
            <FaPlay />
        </button>
    </div>
);

export default SearchPage;