



import React, { useState, useEffect, useContext } from 'react';
import { FaPlay, FaPause, FaSearch, FaHeadphonesAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PlayerContext } from '../../../../../context/PlayerContext';
import { useTheme } from '../../../../../context/ThemeContext';

// --- Helper to build image URLs ---
const buildImageUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/160';
  if (path.startsWith('http')) return path;
  return `http://localhost:9999/${path.replace(/\\/g, '/')}`;
};

// --- Music Card Component ---
const MusicCard = ({ item, playAction, showPlays = false, showLikes = false }) => {
  const { isDarkMode } = useTheme();
  const { likedSongs, currentSong, isPlaying } = useContext(PlayerContext);
  const isLiked = likedSongs.has(item._id);
  const isCurrentlyPlaying = currentSong && currentSong._id === item._id;

  return (
    <div className="flex-shrink-0 w-48 mb-4">
      <div className={`p-3 rounded-xl relative cursor-pointer ${
        isDarkMode ? 'bg-gray-800/60' : 'bg-white/90'
      } ${isCurrentlyPlaying ? 'ring-2 ring-green-500' : ''}`}>
        <div className="relative">
          <img
            src={buildImageUrl(item.coverArtPath)}
            alt={item.title}
            className="w-full h-44 object-cover rounded-lg shadow-lg"
            onClick={playAction}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
            <button
              onClick={(e) => {
                e.stopPropagation();
                playAction();
              }}
              className="bg-green-500 text-white p-3 rounded-full shadow-xl"
            >
              {isCurrentlyPlaying && isPlaying ? <FaPause size={14} /> : <FaPlay size={14} className="ml-0.5" />}
            </button>
          </div>
          {(showPlays || showLikes) && (
            <div className="absolute bottom-2 left-2 right-2 flex justify-between text-xs">
              {showPlays && item.playCount && (
                <span className={`px-2 py-1 rounded-full ${
                  isDarkMode ? 'bg-gray-900/80 text-gray-300' : 'bg-white/90 text-gray-700'
                }`}>
                  🔥 {Math.floor(item.playCount / 1000)}K
                </span>
              )}
              {showLikes && isLiked && (
                <span className={`px-2 py-1 rounded-full ${
                  isDarkMode ? 'bg-pink-900/80 text-pink-300' : 'bg-pink-100 text-pink-700'
                }`}>
                  ❤️
                </span>
              )}
            </div>
          )}
        </div>
        <div className="mt-3" onClick={playAction}>
          <h3 className={`font-semibold text-md truncate ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {item.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1 truncate">{item.artist}</p>
        </div>
      </div>
    </div>
  );
};

// --- Album Card Component ---
const AlbumCard = ({ albumName, albumData, onClick }) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-48 mb-4 cursor-pointer"
    >
      <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-800/60' : 'bg-white/90'}`}>
        <div className="relative">
          <img
            src={buildImageUrl(albumData.cover)}
            alt={albumName}
            className="w-full h-44 object-cover rounded-lg shadow-lg"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
            <FaPlay className="text-white text-xl" />
          </div>
        </div>
        <div className="mt-3">
          <h3 className={`font-semibold text-md truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {albumName}
          </h3>
          <p className="text-sm text-gray-500 truncate">{albumData.songs.length} songs</p>
        </div>
      </div>
    </div>
  );
};

// --- Category Card Component ---
const CategoryCard = ({ title, icon, gradient, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`${gradient} rounded-2xl p-6 h-32 flex flex-col items-center justify-center shadow-lg cursor-pointer text-white`}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="text-lg font-semibold text-center">{title}</h3>
    </div>
  );
};

// --- Artist Card Component ---
const ArtistCard = ({ artistName, artistData, onClick }) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-40 text-center cursor-pointer"
    >
      <div className="relative">
        <img
          src={buildImageUrl(artistData.cover)}
          alt={artistName}
          className="w-32 h-32 object-cover rounded-full mx-auto shadow-lg border-2 border-green-500/50"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
          <FaPlay className="text-white text-xl" />
        </div>
      </div>
      <h3 className={`font-semibold mt-3 truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {artistName}
      </h3>
      <p className="text-sm text-gray-500">{artistData.songs.length} songs</p>
    </div>
  );
};

// --- Main Explore Page ---
const Exp = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const { playSong, likedSongs, currentSong, isPlaying } = useContext(PlayerContext);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const { data } = await axios.get('http://localhost:9999/public/songs');
        // Add mock playCount for demonstration
        const songsWithPlayCount = data.map(song => ({
          ...song,
          playCount: Math.floor(Math.random() * 1000000) // Random play count for demo
        }));
        setSongs(songsWithPlayCount);
        setFilteredSongs(songsWithPlayCount);
      } catch (error) {
        console.error("Failed to fetch songs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  // Filter songs based on category
  const filterSongsByCategory = (category) => {
    setActiveFilter(category);
    
    if (category === 'all') {
      setFilteredSongs(songs);
      return;
    }

    const filtered = songs.filter(song => {
      const songTitle = song.title?.toLowerCase() || '';
      const songArtist = song.artist?.toLowerCase() || '';
      const songAlbum = song.album?.toLowerCase() || '';
      
      switch (category) {
        case 'devotional':
          return songTitle.includes('devotional') || songTitle.includes('bhajan') || 
                 songArtist.includes('devotional') || songAlbum.includes('devotional');
        case 'romance':
          return songTitle.includes('love') || songTitle.includes('romance') || 
                 songTitle.includes('pyaar') || songTitle.includes('ishq');
        case 'monsoon':
          return songTitle.includes('rain') || songTitle.includes('monsoon') || 
                 songTitle.includes('baarish') || songTitle.includes('sawan');
        case 'workout':
          return songTitle.includes('workout') || songTitle.includes('gym') || 
                 songTitle.includes('exercise') || songTitle.includes('pump');
        case 'chill':
          return songTitle.includes('chill') || songTitle.includes('relax') || 
                 songTitle.includes('calm') || songTitle.includes('peace');
        case 'sleep':
          return songTitle.includes('sleep') || songTitle.includes('lullaby') || 
                 songTitle.includes('bedtime') || songTitle.includes('calm');
        default:
          return true;
      }
    });
    
    setFilteredSongs(filtered);
  };

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="text-center">
        <FaHeadphonesAlt className="text-4xl text-green-500 mx-auto mb-4" />
        <p>Exploring new music...</p>
      </div>
    </div>
  );

  // --- Data processing ---
  const newReleases = [...songs].reverse().slice(0, 12);
  const topCharts = [...songs]
    .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
    .slice(0, 10);
  
  const likedSongsList = songs.filter(song => likedSongs.has(song._id));

  // Group songs by album
  const albums = songs.reduce((acc, song) => {
    if (song.album) {
      if (!acc[song.album]) {
        acc[song.album] = {
          songs: [],
          cover: song.coverArtPath,
          artist: song.artist
        };
      }
      acc[song.album].songs.push(song);
    }
    return acc;
  }, {});

  const popularAlbums = Object.entries(albums)
    .sort(([, a], [, b]) => b.songs.length - a.songs.length)
    .slice(0, 8);

  const topArtists = Object.entries(
    songs.reduce((acc, song) => {
      if (song.artist) {
        if (!acc[song.artist]) acc[song.artist] = { songs: [], cover: song.artistPic || song.coverArtPath };
        acc[song.artist].songs.push(song);
      }
      return acc;
    }, {})
  ).slice(0, 8);

  // --- Genre categories ---
  const genres = [
    { name: "Devotional", icon: "🕉️", gradient: "bg-gradient-to-br from-yellow-600 to-orange-500", key: "devotional" },
    { name: "Romance", icon: "💖", gradient: "bg-gradient-to-br from-pink-500 to-red-500", key: "romance" },
    { name: "Monsoon", icon: "🌧️", gradient: "bg-gradient-to-br from-blue-500 to-purple-600", key: "monsoon" },
    { name: "Workout", icon: "💪", gradient: "bg-gradient-to-br from-green-500 to-teal-600", key: "workout" },
    { name: "Indian Pop 90s", icon: "🎸", gradient: "bg-gradient-to-br from-purple-500 to-indigo-600", key: "90s" },
    { name: "Indian Pop 2000s", icon: "🎤", gradient: "bg-gradient-to-br from-indigo-500 to-blue-600", key: "2000s" },
    { name: "Chill", icon: "😌", gradient: "bg-gradient-to-br from-teal-500 to-green-600", key: "chill" },
    { name: "80s", icon: "📻", gradient: "bg-gradient-to-br from-orange-500 to-red-500", key: "80s" },
    { name: "Sleep", icon: "😴", gradient: "bg-gradient-to-br from-indigo-600 to-purple-700", key: "sleep" },
    { name: "Feel Good", icon: "😊", gradient: "bg-gradient-to-br from-yellow-400 to-orange-400", key: "feelgood" },
  ];

  return (
    <div className={`min-h-screen pb-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      {/* <header className={`sticky top-0 z-10 p-4 ${isDarkMode ? 'bg-gray-900 border-b border-gray-800' : 'bg-white border-b border-gray-200'}`}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/dashboard" className="flex items-center">
            <FaHeadphonesAlt className={`text-2xl mr-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
            <span className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              dhun
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/dashboard/search')}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <FaSearch size={18} />
            </button>
          </div>
        </div>
      </header> */}

      <main className="p-6 max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Explore {activeFilter !== 'all' && `- ${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}`}
        </h1>

        {/* Quick Access Categories */}
        <section className="mb-12">
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Browse by Mood & Genre
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <CategoryCard
              title="All Songs"
              icon="🎵"
              gradient="bg-gradient-to-br from-gray-600 to-gray-800"
              onClick={() => filterSongsByCategory('all')}
            />
            {genres.map((genre) => (
              <CategoryCard
                key={genre.key}
                title={genre.name}
                icon={genre.icon}
                gradient={genre.gradient}
                onClick={() => filterSongsByCategory(genre.key)}
              />
            ))}
          </div>
        </section>

        {/* Filtered Songs */}
        {activeFilter !== 'all' && (
          <section className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Songs
              <span className="text-sm text-gray-500 ml-2">({filteredSongs.length} songs)</span>
            </h2>
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {filteredSongs.map((song) => (
                <MusicCard
                  key={song._id}
                  item={song}
                  playAction={() => playSong(song, filteredSongs)}
                  showPlays={true}
                  showLikes={true}
                />
              ))}
            </div>
          </section>
        )}

        {/* Popular Albums */}
        <section className="mb-12">
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Popular Albums
          </h2>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {popularAlbums.map(([albumName, albumData]) => (
              <AlbumCard
                key={albumName}
                albumName={albumName}
                albumData={albumData}
                onClick={() => navigate(`/dashboard/album/${encodeURIComponent(albumName)}`)}
              />
            ))}
          </div>
        </section>

        {/* New Releases */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              New Releases
            </h2>
            <button className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              See all
            </button>
          </div>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {newReleases.map((song) => (
              <MusicCard
                key={song._id}
                item={song}
                playAction={() => playSong(song, newReleases)}
                showPlays={true}
              />
            ))}
          </div>
        </section>

        {/* Top Artists */}
        <section className="mb-12">
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Popular Artists
          </h2>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {topArtists.map(([artistName, artistData]) => (
              <ArtistCard
                key={artistName}
                artistName={artistName}
                artistData={artistData}
                onClick={() => navigate(`/dashboard/artist/${encodeURIComponent(artistName)}`)}
              />
            ))}
          </div>
        </section>

        {/* Top Charts - STABLE VERSION */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Top Charts
            </h2>
            <button className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              See all
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {topCharts.map((song, index) => (
              <div 
                key={song._id} 
                className={`flex items-center p-3 rounded-lg cursor-pointer ${
                  isDarkMode 
                    ? 'bg-gray-800/60 hover:bg-gray-700/80' 
                    : 'bg-white/90 hover:bg-white'
                } ${currentSong && currentSong._id === song._id ? 'ring-2 ring-green-500' : ''}`}
                onClick={() => playSong(song, topCharts)}
              >
                <span className={`text-xl font-bold mr-4 w-8 text-center ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {index + 1}
                </span>
                <img
                  src={buildImageUrl(song.coverArtPath)}
                  alt={song.title}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="ml-3 flex-1 min-w-0">
                  <h3 className={`font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {song.title}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">{song.artist}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {Math.floor(song.playCount / 1000)}K
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playSong(song, topCharts);
                    }}
                    className="p-2 text-green-500 hover:text-green-600"
                  >
                    {currentSong && currentSong._id === song._id && isPlaying ? <FaPause /> : <FaPlay />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Liked Songs */}
        {likedSongsList.length > 0 && (
          <section className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Your Liked Songs
            </h2>
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {likedSongsList.slice(0, 8).map((song) => (
                <MusicCard
                  key={song._id}
                  item={song}
                  playAction={() => playSong(song, likedSongsList)}
                  showLikes={true}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Exp;

