



// import React, { useContext,useState } from 'react';
// import {
//     FaPlayCircle, FaPauseCircle, FaStepBackward, FaStepForward,
//     FaVolumeUp, FaVolumeDown, FaVolumeMute,
//     FaHeart, FaRegHeart,FaPlus
// } from 'react-icons/fa';
// import { PlayerContext } from '../../context/PlayerContext';

// const PlayerControls = ({ onPlayerOpen }) => {
//     const {
//         currentSong, isPlaying, togglePlayPause,
//         duration, currentTime, seek, volume, isMuted, changeVolume, toggleMute,
//         playNextSong, playPreviousSong, songQueue, currentSongIndex,
//         likedSongs, likeSong, unlikeSong , userPlaylists, addSongToPlaylist
//     } = useContext(PlayerContext);

//     const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

//     const isLiked = currentSong && likedSongs.has(currentSong._id);

//     const handleLikeToggle = () => {
//         if (!currentSong) return;
//         if (isLiked) unlikeSong(currentSong._id);
//         else likeSong(currentSong._id);
//     };

//     const hasNext = currentSongIndex < songQueue.length - 1;
//     const hasPrev = currentSongIndex > 0;

//     const formatTime = (time) => {
//         if (isNaN(time)) return "0:00";
//         const minutes = Math.floor(time / 60);
//         const seconds = Math.floor(time % 60);
//         return `${minutes}:${seconds.toString().padStart(2, '0')}`;
//     };

//     const VolumeIcon = () => {
//         if (isMuted || volume === 0) return <FaVolumeMute />;
//         if (volume < 0.5) return <FaVolumeDown />;
//         return <FaVolumeUp />;
//     };

//     const buildImageUrl = (path) => {
//         if (!path) return 'https://via.placeholder.com/160';
//         if (path.startsWith('http')) return path;
//         return `http://localhost:9999/${path.replace(/\\/g, '/')}`;
//     };

//     if (!currentSong) return null;

//     return (
//         <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-gray-800 px-4 py-3 border-t border-gray-700 z-50">
//             <div className="flex items-center justify-between">


//                       {/* Playlist Add Modal */}
//             {isPlaylistModalOpen && (
//                 <div className="absolute bottom-24 right-4 bg-gray-700 rounded-lg shadow-lg p-2 w-48">
//                     <h4 className="text-white text-sm font-semibold p-2">Add to Playlist</h4>
//                     {userPlaylists.length > 0 ? (
//                         userPlaylists.map(playlist => (
//                             <button key={playlist._id} onClick={() => { addSongToPlaylist(playlist._id, currentSong._id); setIsPlaylistModalOpen(false); }}
//                                 className="w-full text-left p-2 hover:bg-gray-600 rounded">
//                                 {playlist.name}
//                             </button>
//                         ))
//                     ) : ( <p className="p-2 text-gray-400 text-sm">No playlists.</p> )}
//                 </div>
//             )}
                
//                 {/* Left Side: Album Info */}
//                 <div className="w-1/4 flex items-center min-w-0">
//                     <button onClick={onPlayerOpen} className="flex items-center group space-x-2 md:space-x-4 text-left">
//                         <img src={buildImageUrl(currentSong.coverArtPath)} alt="Album Art" className="w-12 h-12 rounded" />
//                         <div className="hidden sm:block">
//                             <h4 className="font-semibold text-white truncate group-hover:text-green-400">{currentSong.title}</h4>
//                             <p className="text-sm text-gray-400">{currentSong.artist}</p>
//                         </div>
//                     </button>
//                 </div>
               
//                 {/* Center: Main Controls */}
//                 <div className="w-1/2 flex flex-col items-center px-2">
//                     <div className="flex items-center space-x-4 md:space-x-6 mb-2 text-gray-400">
//                         <button onClick={playPreviousSong} disabled={!hasPrev} aria-label="Previous Song"
//                             className="hover:text-white disabled:opacity-50 disabled:cursor-not-allowed">
//                             <FaStepBackward size={20} />
//                         </button>
//                         <button onClick={togglePlayPause} aria-label={isPlaying ? "Pause" : "Play"} className="text-white hover:scale-105">
//                             {isPlaying ? <FaPauseCircle size={40} /> : <FaPlayCircle size={40} />}
//                         </button>
//                         <button onClick={playNextSong} disabled={!hasNext} aria-label="Next Song"
//                             className="hover:text-white disabled:opacity-50 disabled:cursor-not-allowed">
//                             <FaStepForward size={20} />
//                         </button>
//                     </div>
//                     <div className="flex items-center w-full max-w-xl gap-2">
//                         <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
//                         <input
//                             type="range" min="0" max={duration || 0} value={currentTime}
//                             onChange={(e) => seek(e.target.value)}
//                             className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white"
//                         />
//                         <span className="text-xs text-gray-400">{formatTime(duration)}</span>
//                     </div>
//                 </div>
                
//                 {/* Right Side: Like + Volume */}
//                 <div className="w-1/4 flex items-center justify-end space-x-3 sm:space-x-4">
//                     <button onClick={handleLikeToggle}
//                         className={`transition-colors duration-200 ${isLiked ? 'text-green-500' : 'text-gray-400 hover:text-white'}`}>
//                         {isLiked ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
//                     </button>
//                     <button onClick={toggleMute} className="text-gray-400 hover:text-white">
//                         <VolumeIcon />
//                     </button>
//                      {/* NEW Add to Playlist Button */}
//                     <button onClick={() => setIsPlaylistModalOpen(!isPlaylistModalOpen)}
//                         className="text-gray-400 hover:text-white">
//                         <FaPlus size={20} />
//                     </button>
//                     <input
//                         type="range" min="0" max="1" step="0.01"
//                         value={isMuted ? 0 : volume}
//                         onChange={(e) => changeVolume(e.target.value)}
//                         className="hidden sm:inline-block w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white"
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PlayerControls;




import React, { useContext, useState } from 'react';
import {
  FaPlayCircle, FaPauseCircle, FaStepBackward, FaStepForward,
  FaVolumeUp, FaVolumeDown, FaVolumeMute,
  FaHeart, FaRegHeart, FaPlus
} from 'react-icons/fa';
import { PlayerContext } from '../../context/PlayerContext';

const PlayerControls = ({ onPlayerOpen }) => {
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

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-gradient-to-r from-purple-900/80 via-black to-cyan-900/80 backdrop-blur-lg border-t border-purple-700/40 shadow-[0_-2px_20px_rgba(0,0,0,0.8)] px-4 py-3 z-50">
      <div className="flex items-center justify-between">

        {/* Playlist Add Modal */}
        {isPlaylistModalOpen && (
          <div className="absolute bottom-24 right-4 bg-black/80 backdrop-blur-xl border border-purple-600/40 rounded-lg shadow-2xl p-3 w-56 animate-fade-in">
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
          <button onClick={onPlayerOpen} className="flex items-center group space-x-2 md:space-x-4 text-left">
            <img src={buildImageUrl(currentSong.coverArtPath)} alt="Album Art"
              className="w-12 h-12 rounded-lg shadow-[0_0_15px_rgba(0,255,200,0.6)]" />
            <div className="hidden sm:block">
              <h4 className="font-semibold text-white truncate group-hover:text-cyan-400 transition">{currentSong.title}</h4>
              <p className="text-sm text-gray-400">{currentSong.artist}</p>
            </div>
          </button>
        </div>

        {/* Center: Main Controls */}
        <div className="w-1/2 flex flex-col items-center px-2">
          <div className="flex items-center space-x-4 md:space-x-6 mb-2 text-gray-400">
            <button onClick={playPreviousSong} disabled={!hasPrev}
              className="hover:text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition">
              <FaStepBackward size={20} />
            </button>
            <button onClick={togglePlayPause} className="text-white hover:scale-110 transition-transform">
              {isPlaying ? <FaPauseCircle size={42} /> : <FaPlayCircle size={42} />}
            </button>
            <button onClick={playNextSong} disabled={!hasNext}
              className="hover:text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition">
              <FaStepForward size={20} />
            </button>
          </div>
          <div className="flex items-center w-full max-w-xl gap-2">
            <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
            <input
              type="range" min="0" max={duration || 0} value={currentTime}
              onChange={(e) => seek(e.target.value)}
              className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <span className="text-xs text-gray-400">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right Side: Like + Volume + Add */}
        <div className="w-1/4 flex items-center justify-end space-x-3 sm:space-x-4">
          <button onClick={handleLikeToggle}
            className={`transition ${isLiked ? 'text-pink-500 hover:text-pink-400' : 'text-gray-400 hover:text-white'}`}>
            {isLiked ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
          </button>
          <button onClick={toggleMute} className="text-gray-400 hover:text-white transition">
            <VolumeIcon />
          </button>
          <button onClick={() => setIsPlaylistModalOpen(!isPlaylistModalOpen)}
            className="text-gray-400 hover:text-cyan-400 transition">
            <FaPlus size={20} />
          </button>
          <input
            type="range" min="0" max="1" step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => changeVolume(e.target.value)}
            className="hidden sm:inline-block w-20 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;

