

import React, { useState, useEffect, useContext, useMemo } from 'react';
import { FaSearch, FaTimes, FaHistory, FaMusic, FaUser, FaCompactDisc, FaPlay, FaFilter, FaChevronDown, FaGlobe, FaHeadphones, FaSmile, FaTag } from 'react-icons/fa';
import axios from 'axios';
import { PlayerContext } from '../../../../../context/PlayerContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Helper function to build correct image URLs
const buildImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/160';
    if (path.startsWith('http')) return path;
    return `${import.meta.env.VITE_API_URL}/${path.replace(/\\/g, '/')}`;
};

// Main Search Page Component
const SearchPage = () => {
    const [allSongs, setAllSongs] = useState([]);
    const [query, setQuery] = useState('');
    const [filteredResults, setFilteredResults] = useState({ songs: [], artists: {}, albums: {} });
    const [searchHistory, setSearchHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        language: '',
        genre: '',
        mood: '',
        tags: ''
    });
    const [availableFilters, setAvailableFilters] = useState({
        languages: new Set(),
        genres: new Set(),
        moods: new Set(),
        tags: new Set()
    });
    const { playSong } = useContext(PlayerContext);

    // Fetch all songs on initial load to enable client-side searching
    useEffect(() => {
        const initialLoad = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/public/songs`);
                setAllSongs(data);
                
                // Extract available filter options
                const languages = new Set();
                const genres = new Set();
                const moods = new Set();
                const tags = new Set();
                
                data.forEach(song => {
                    if (song.language) languages.add(song.language);
                    if (song.genre) genres.add(song.genre);
                    if (song.mood) moods.add(song.mood);
                    
                    // Extract tags from comma-separated string
                    if (song.tags) {
                        const tagList = song.tags.split(',').map(tag => tag.trim());
                        tagList.forEach(tag => {
                            if (tag) tags.add(tag);
                        });
                    }
                });
                
                setAvailableFilters({
                    languages: Array.from(languages).sort(),
                    genres: Array.from(genres).sort(),
                    moods: Array.from(moods).sort(),
                    tags: Array.from(tags).sort()
                });
                
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

    // Perform search whenever the query or filters change
    useEffect(() => {
        if (query.trim() === '' && !filters.language && !filters.genre && !filters.mood && !filters.tags) {
            setFilteredResults({ songs: [], artists: {}, albums: {} });
            return;
        }
        
        const lowercaseQuery = query.toLowerCase();
        const results = allSongs.filter(song => {
            // Text search across multiple fields
            const textMatch = 
                (song.title || '').toLowerCase().includes(lowercaseQuery) ||
                (song.artist || '').toLowerCase().includes(lowercaseQuery) ||
                (song.album || '').toLowerCase().includes(lowercaseQuery) ||
                (song.tags || '').toLowerCase().includes(lowercaseQuery);
            
            // Filter matching
            const languageMatch = !filters.language || 
                (song.language || '').toLowerCase() === filters.language.toLowerCase();
            const genreMatch = !filters.genre || 
                (song.genre || '').toLowerCase() === filters.genre.toLowerCase();
            const moodMatch = !filters.mood || 
                (song.mood || '').toLowerCase() === filters.mood.toLowerCase();
            
            // Tag filter matching
            const tagMatch = !filters.tags || 
                (song.tags || '').toLowerCase().includes(filters.tags.toLowerCase());
            
            return (textMatch || (filters.tags && tagMatch)) && languageMatch && genreMatch && moodMatch;
        });
        
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
    }, [query, filters, allSongs]);

    // Handle search history
    const handleAddToHistory = (term) => {
        if (!term || term.trim() === '') return;
        const newHistory = [term, ...searchHistory.filter(item => item !== term)].slice(0, 5);
        setSearchHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    };

    const handleClearSearch = () => {
        setQuery('');
        setFilters({ language: '', genre: '', mood: '', tags: '' });
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const clearFilters = () => {
        setFilters({ language: '', genre: '', mood: '', tags: '' });
    };

    const hasActiveFilters = filters.language || filters.genre || filters.mood || filters.tags;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
            {/* Sticky Search Bar */}
            <motion.div
                className="sticky top-0 z-10 bg-gradient-to-b from-gray-900 to-transparent pt-4 pb-2 mb-6"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="flex items-center bg-gray-800 rounded-full px-4 py-3 shadow-lg mb-4">
                    <FaSearch className="text-gray-400 mr-3" />
                    <input
                        type="text"
                        placeholder="Search songs, artists, albums, languages, genres, moods, or tags..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onBlur={() => handleAddToHistory(query)}
                        className="w-full bg-transparent focus:outline-none text-lg"
                    />
                    {(query || hasActiveFilters) && (
                        <button onClick={handleClearSearch} className="text-gray-400 hover:text-white ml-2">
                            <FaTimes />
                        </button>
                    )}
                </div>

                {/* Filter Toggle */}
                <div className="flex justify-between items-center mb-2">
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        <FaFilter className="mr-2" />
                        Advanced Filters
                        <FaChevronDown className={`ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {hasActiveFilters && (
                        <button 
                            onClick={clearFilters}
                            className="text-xs text-green-500 hover:text-green-400 transition-colors"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>

                {/* Filter Options */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-3 bg-gray-800 rounded-lg mt-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">
                                        <FaGlobe className="inline mr-1" /> Language
                                    </label>
                                    <select
                                        value={filters.language}
                                        onChange={(e) => handleFilterChange('language', e.target.value)}
                                        className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="">All Languages</option>
                                        {availableFilters.languages.map(lang => (
                                            <option key={lang} value={lang}>{lang}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">
                                        <FaHeadphones className="inline mr-1" /> Genre
                                    </label>
                                    <select
                                        value={filters.genre}
                                        onChange={(e) => handleFilterChange('genre', e.target.value)}
                                        className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="">All Genres</option>
                                        {availableFilters.genres.map(genre => (
                                            <option key={genre} value={genre}>{genre}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">
                                        <FaSmile className="inline mr-1" /> Mood
                                    </label>
                                    <select
                                        value={filters.mood}
                                        onChange={(e) => handleFilterChange('mood', e.target.value)}
                                        className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="">All Moods</option>
                                        {availableFilters.moods.map(mood => (
                                            <option key={mood} value={mood}>{mood}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">
                                        <FaTag className="inline mr-1" /> Tags
                                    </label>
                                    <select
                                        value={filters.tags}
                                        onChange={(e) => handleFilterChange('tags', e.target.value)}
                                        className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="">All Tags</option>
                                        {availableFilters.tags.map(tag => (
                                            <option key={tag} value={tag}>{tag}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <AnimatePresence mode="wait">
                {query || hasActiveFilters ? (
                    <SearchResults key="results" results={filteredResults} playSong={playSong} filters={filters} />
                ) : (
                    <SearchHistory key="history" history={searchHistory} setQuery={setQuery} />
                )}
            </AnimatePresence>
        </div>
    );
};

// Sub-Component for Displaying Search Results
const SearchResults = ({ results, playSong, filters }) => {
    const { songs, artists, albums } = results;
    const hasResults = songs.length > 0 || Object.keys(artists).length > 0 || Object.keys(albums).length > 0;
    
    if (!hasResults) {
        return (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center py-12"
            >
                <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
                    <FaSearch className="text-4xl text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No results found</h3>
                    <p className="text-gray-400">
                        Try different keywords or adjust your filters
                    </p>
                    <div className="mt-4 text-sm text-gray-500">
                        <p>Try searching by:</p>
                        <ul className="list-disc list-inside mt-2">
                            <li>Song title</li>
                            <li>Artist name</li>
                            <li>Album name</li>
                            <li>Language (Hindi, English, etc.)</li>
                            <li>Genre (Pop, Rock, etc.)</li>
                            <li>Mood (Happy, Chill, etc.)</li>
                            <li>Tags (romantic, travel, etc.)</li>
                        </ul>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="space-y-8"
        >
            {/* Active Filters Indicator */}
            {(filters.language || filters.genre || filters.mood || filters.tags) && (
                <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">ACTIVE FILTERS</h3>
                    <div className="flex flex-wrap gap-2">
                        {filters.language && (
                            <span className="bg-green-900 text-green-300 text-xs px-3 py-1 rounded-full">
                                <FaGlobe className="inline mr-1" /> Language: {filters.language}
                            </span>
                        )}
                        {filters.genre && (
                            <span className="bg-purple-900 text-purple-300 text-xs px-3 py-1 rounded-full">
                                <FaHeadphones className="inline mr-1" /> Genre: {filters.genre}
                            </span>
                        )}
                        {filters.mood && (
                            <span className="bg-blue-900 text-blue-300 text-xs px-3 py-1 rounded-full">
                                <FaSmile className="inline mr-1" /> Mood: {filters.mood}
                            </span>
                        )}
                        {filters.tags && (
                            <span className="bg-yellow-900 text-yellow-300 text-xs px-3 py-1 rounded-full">
                                <FaTag className="inline mr-1" /> Tag: {filters.tags}
                            </span>
                        )}
                    </div>
                </div>
            )}
            
            {songs.length > 0 && (
                <SearchResultCategory title="Songs" icon={<FaMusic />} count={songs.length}>
                    {songs.slice(0, 5).map(song => (
                        <SongItem key={song._id} item={song} onPlay={() => playSong(song, songs)} />
                    ))}
                    {songs.length > 5 && (
                        <div className="mt-4 text-center">
                            <button className="text-green-500 hover:text-green-400 text-sm font-medium">
                                View all {songs.length} songs
                            </button>
                        </div>
                    )}
                </SearchResultCategory>
            )}
            
            {Object.keys(artists).length > 0 && (
                <SearchResultCategory title="Artists" icon={<FaUser />} count={Object.keys(artists).length}>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {Object.entries(artists).map(([name, data]) => (
                            <AlbumArtistItem key={name} name={name} data={data} onPlay={() => playSong(data.songs[0], data.songs)} type="artist" />
                        ))}
                    </div>
                </SearchResultCategory>
            )}

            {Object.keys(albums).length > 0 && (
                <SearchResultCategory title="Albums" icon={<FaCompactDisc />} count={Object.keys(albums).length}>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {Object.entries(albums).map(([name, data]) => (
                            <AlbumArtistItem key={name} name={name} data={data} onPlay={() => playSong(data.songs[0], data.songs)} type="album" />
                        ))}
                    </div>
                </SearchResultCategory>
            )}
        </motion.div>
    );
};

// Sub-Component for Displaying Search History
const SearchHistory = ({ history, setQuery }) => (
    <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="space-y-6"
    >
        <div>
            <h2 className="text-2xl font-bold mb-4">Recent Searches</h2>
            {history.length > 0 ? (
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                    {history.map((term, index) => (
                        <motion.div
                            key={index}
                            className="flex items-center p-4 hover:bg-gray-700 cursor-pointer transition-colors"
                            onClick={() => setQuery(term)}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <FaHistory className="text-gray-500 mr-4" />
                            <span className="flex-1 text-lg">{term}</span>
                            <FaChevronDown className="text-gray-500 transform rotate-270" />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <FaSearch className="text-4xl text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Search for your favorite songs, artists, or albums.</p>
                </div>
            )}
        </div>

        {/* Quick Suggestions */}
        <div>
            <h3 className="text-xl font-bold mb-4">Try Searching For</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Hindi', 'Rock', 'Pop', 'Chill', 'Happy', 'Travel', 'Romantic', 'Bhajan'].map((suggestion) => (
                    <motion.button
                        key={suggestion}
                        onClick={() => setQuery(suggestion)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-gray-800 hover:bg-gray-700 text-white rounded-lg py-2 px-3 text-sm transition-colors"
                    >
                        {suggestion}
                    </motion.button>
                ))}
            </div>
        </div>

        {/* Search Tips */}
        <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Search Tips</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Search by language: <span className="text-green-400">Hindi</span>, <span className="text-green-400">English</span>, etc.</li>
                <li>Search by genre: <span className="text-green-400">Rock</span>, <span className="text-green-400">Pop</span>, <span className="text-green-400">Bhajan</span>, etc.</li>
                <li>Search by mood: <span className="text-green-400">Happy</span>, <span className="text-green-400">Chill</span>, etc.</li>
                <li>Search by tags: <span className="text-green-400">Travel</span>, <span className="text-green-400">Romantic</span>, etc.</li>
                <li>Use the advanced filters for more precise results</li>
            </ul>
        </div>
    </motion.div>
);

// Reusable UI Components
const SearchResultCategory = ({ title, icon, count, children }) => (
    <div>
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
                <span className="text-green-500 mr-3 text-lg">{icon}</span>
                <h3 className="text-2xl font-bold">{title}</h3>
            </div>
            {count !== undefined && (
                <span className="text-gray-400 text-sm">{count} results</span>
            )}
        </div>
        {children}
    </div>
);

const SongItem = ({ item, onPlay }) => (
    <motion.div 
        whileHover={{ scale: 1.01 }}
        className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition-all cursor-pointer group"
        onClick={onPlay}
    >
        <div className="relative">
            <img src={buildImageUrl(item.coverArtPath)} alt={item.title} className="w-12 h-12 rounded object-cover mr-4" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center rounded transition-all">
                <FaPlay className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        </div>
        <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white truncate">{item.title}</h4>
            <div className="flex items-center text-sm text-gray-400 flex-wrap">
                <span className="truncate">{item.artist}</span>
                {(item.language || item.genre || item.mood || item.tags) && (
                    <>
                        <span className="mx-2">•</span>
                        <div className="flex space-x-2">
                            {item.language && <span>{item.language}</span>}
                            {item.genre && <span>{item.genre}</span>}
                            {item.mood && <span>{item.mood}</span>}
                            {item.tags && <span className="truncate max-w-xs">{item.tags}</span>}
                        </div>
                    </>
                )}
            </div>
        </div>
        <div className="text-xs text-gray-500 ml-2">
            {item.duration ? (
                `${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}`
            ) : '--:--'}
        </div>
    </motion.div>
);

const AlbumArtistItem = ({ name, data, onPlay, type }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-all group relative"
    >
        <Link to={`/dashboard/${type}/${encodeURIComponent(name)}`} className="block">
            <div className="relative mb-3">
                <img 
                    src={buildImageUrl(data.cover)} 
                    alt={name} 
                    className="w-full aspect-square object-cover rounded"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center rounded transition-all">
                    <button 
                        onClick={(e) => { e.preventDefault(); onPlay(); }} 
                        className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Play ${type} ${name}`}
                    >
                        <FaPlay className="text-white ml-1" />
                    </button>
                </div>
            </div>
            <h4 className="font-semibold text-white truncate mb-1">{name}</h4>
            <p className="text-sm text-gray-400">{data.songs.length} song{data.songs.length !== 1 ? 's' : ''}</p>
        </Link>
    </motion.div>
);

export default SearchPage;