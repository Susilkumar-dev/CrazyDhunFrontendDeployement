


import React, { useContext, useState } from 'react';
import {
  FaPlayCircle, FaPauseCircle, FaStepBackward, FaStepForward,
  FaVolumeUp, FaVolumeDown, FaVolumeMute,
  FaHeart, FaRegHeart, FaPlus
} from 'react-icons/fa';
import { PlayerContext } from '../../context/PlayerContext';

const PlayerControls = ({ onPlayerOpen, isMobileMenuOpen }) => {
  const {
    currentSong, isPlaying, togglePlayPause,
    duration, currentTime, seek, volume, isMuted, changeVolume, toggleMute,
    playNextSong, playPreviousSong, songQueue, currentSongIndex,
    likedSongs, likeSong, unlikeSong, userPlaylists, addSongToPlaylist
  } = useContext(PlayerContext);

  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

  const isLiked = currentSong && likedSongs.has(currentSong._id);

  const handleLikeToggle = () => {
    if (!currentSong) return;
    if (isLiked) unlikeSong(currentSong._id);
    else likeSong(currentSong._id);
  };

  const hasNext = currentSongIndex < songQueue.length - 1;
  const hasPrev = currentSongIndex > 0;

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <FaVolumeMute />;
    if (volume < 0.5) return <FaVolumeDown />;
    return <FaVolumeUp />;
  };

  const buildImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/160';
    if (path.startsWith('http')) return path;
    return `${import.meta.env.VITE_API_URL}/${path.replace(/\\/g, '/')}`;
  };

  if (!currentSong) return null;

  const playerZIndex = isMobileMenuOpen ? 40 : 50;

  return (
    <div 
      className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-gradient-to-r from-purple-900/80 via-black to-cyan-900/80 backdrop-blur-lg border-t border-purple-700/40 shadow-[0_-2px_20px_rgba(0,0,0,0.8)]"
      style={{ zIndex: playerZIndex }}
    >
      {/* 🔴 YouTube-like Slim Progress Bar (top of controls) */}
      <div className="h-1 bg-gray-700 relative w-full">
        <div
          className="h-1 bg-red-500 transition-all duration-150 ease-linear"
          style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
        />
      </div>

      <div className="px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
        {/* Playlist Add Modal */}
        {isPlaylistModalOpen && (
          <div className="absolute bottom-20 right-4 bg-black/90 backdrop-blur-xl border border-purple-600/40 rounded-lg shadow-2xl p-3 w-56 animate-fade-in">
            <h4 className="text-white text-sm font-semibold p-2 border-b border-gray-700/50">
              Add to Playlist
            </h4>
            {userPlaylists.length > 0 ? (
              userPlaylists.map(playlist => (
                <button
                  key={playlist._id}
                  onClick={() => { addSongToPlaylist(playlist._id, currentSong._id); setIsPlaylistModalOpen(false); }}
                  className="w-full text-left p-2 text-gray-300 hover:bg-purple-700/40 hover:text-white rounded transition"
                >
                  {playlist.name}
                </button>
              ))
            ) : (
              <p className="p-2 text-gray-400 text-sm">No playlists.</p>
            )}
          </div>
        )}

        {/* Left Side: Album Info */}
        <div className="w-1/4 flex items-center min-w-0">
          <button onClick={onPlayerOpen} className="flex items-center group space-x-2 sm:space-x-3 text-left">
            <img src={buildImageUrl(currentSong.coverArtPath)} alt="Album Art"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-md shadow-[0_0_10px_rgba(0,255,200,0.5)]" />
            <div className="hidden sm:block">
              <h4 className="font-semibold text-white truncate group-hover:text-cyan-400 transition text-sm sm:text-base">
                {currentSong.title}
              </h4>
              <p className="text-xs text-gray-400">{currentSong.artist}</p>
            </div>
          </button>
        </div>

        {/* Center: Main Controls */}
        <div className="w-1/2 flex flex-col items-center px-1 sm:px-2">
          <div className="flex items-center space-x-3 sm:space-x-5 mb-1 sm:mb-2 text-gray-400">
            <button onClick={playPreviousSong} disabled={!hasPrev}
              className="hover:text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition">
              <FaStepBackward size={18} />
            </button>
            <button onClick={togglePlayPause} className="text-white hover:scale-110 transition-transform">
              {isPlaying ? <FaPauseCircle size={36} /> : <FaPlayCircle size={36} />}
            </button>
            <button onClick={playNextSong} disabled={!hasNext}
              className="hover:text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition">
              <FaStepForward size={18} />
            </button>
          </div>

          {/* Existing Progress Bar (keep it) */}
          <div className="flex items-center w-full max-w-lg gap-2">
            <span className="text-[10px] sm:text-xs text-gray-400">{formatTime(currentTime)}</span>
            <input
              type="range" min="0" max={duration || 0} value={currentTime}
              onChange={(e) => seek(e.target.value)}
              className="w-full h-1.5 sm:h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <span className="text-[10px] sm:text-xs text-gray-400">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right Side: Like + Volume + Add */}
        <div className="w-1/4 flex items-center justify-end space-x-2 sm:space-x-3">
          <button onClick={handleLikeToggle}
            className={`transition ${isLiked ? 'text-pink-500 hover:text-pink-400' : 'text-gray-400 hover:text-white'}`}>
            {isLiked ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
          </button>
          <button onClick={toggleMute} className="text-gray-400 hover:text-white transition">
            <VolumeIcon />
          </button>
          <button onClick={() => setIsPlaylistModalOpen(!isPlaylistModalOpen)}
            className="text-gray-400 hover:text-cyan-400 transition">
            <FaPlus size={18} />
          </button>
          <input
            type="range" min="0" max="1" step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => changeVolume(e.target.value)}
            className="hidden sm:inline-block w-16 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;