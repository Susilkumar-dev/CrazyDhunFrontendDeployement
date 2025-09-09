// import React, { useState } from "react";
// import {
//   FaFileAlt,
//   FaHeart,
//   FaShare,
//   FaTimes,
//   FaRegHeart,
// } from "react-icons/fa";


// import { PlayerContext } from '../../../../../../context/PlayerContext'; // Import the context

// const AlbumArtworkSection = ({ currentTrack, showLyrics, onLyricsToggle }) => {
//   const [isLiked, setIsLiked] = useState(false);

  
//   const handleLike = () => {
//     setIsLiked(!isLiked);
//   };

//   const lyrics = [
//     { text: "In the silence of the night" },
//     { text: "Dreams are dancing in the light" },
//     { text: "Whispers of a distant song" },
//     { text: "Guide me where I belong" },
//     { text: "Midnight dreams, they call my name" },
//     { text: "In this endless, cosmic game" },
//   ];

//   return (
//     <div className="w-full max-w-lg mx-auto">
//       {!showLyrics ? (
//         <div className="text-center space-y-6">
//           <div className="relative group w-64 h-64 md:w-80 md:h-80 mx-auto">
//             <img
//               src={currentTrack?.artwork}
//               alt={`${currentTrack?.album} cover`}
//               className="w-full h-full object-cover rounded-xl shadow-2xl group-hover:scale-105 transition-transform duration-300"
//             />
//           </div>
//           <div className="space-y-2">
//             <h1 className="text-3xl font-bold text-white truncate px-4">
//               {currentTrack?.title}
//             </h1>
//             <h2 className="text-lg text-white/80 truncate px-4">
//               {currentTrack?.artist}
//             </h2>
//             <p className="text-sm text-white/60">{currentTrack?.album}</p>
//           </div>
//           <div className="flex items-center justify-center space-x-6 pt-4">
           
//             <button
//               onClick={handleLike}
//               className={`p-2 transition-colors duration-200 ${
//                 isLiked ? "text-green-500" : "text-white/70 hover:text-white"
//               }`}
//             >
//               {isLiked ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
//             </button>
//             <button
//               className="text-white/70 hover:text-white p-2"
//               onClick={onLyricsToggle}
//             >
//               <FaFileAlt size={24} />
//             </button>
//             <button className="text-white/70 hover:text-white p-2">
//               <FaShare size={24} />
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="w-full space-y-4">
//           <div className="flex items-center justify-between mb-6 px-2">
//             <button
//               className="text-white/70 hover:text-white p-2"
//               onClick={onLyricsToggle}
//             >
//               <FaTimes size={20} />
//             </button>
//             <div>
//               <h3 className="text-lg font-semibold text-white">Lyrics</h3>
//               <p className="text-sm text-white/60 truncate">
//                 {currentTrack?.title}
//               </p>
//             </div>
//             <div className="w-10" />
//           </div>
//           <div className="bg-black/20 rounded-xl p-6 backdrop-blur-sm max-h-80 overflow-y-auto text-center space-y-4">
//             {lyrics.map((line, index) => (
//               <p
//                 key={index}
//                 className="text-xl md:text-2xl text-white/90 leading-relaxed"
//               >
//                 {line.text}
//               </p>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AlbumArtworkSection;





// import React, { useState, useContext } from 'react'; // Import useContext
// import { FaFileAlt, FaHeart, FaShare, FaTimes, FaRegHeart } from 'react-icons/fa';
// import { PlayerContext } from '../../../../../../context/PlayerContext'; // Import the context

// const AlbumArtworkSection = ({ currentTrack, showLyrics, onLyricsToggle }) => {
//     // Get liked song info from the context
//     const { likedSongs, likeSong, unlikeSong } = useContext(PlayerContext);
    
//     // Determine if the current song is liked by checking if its ID is in our Set
//     const isLiked = currentTrack && likedSongs.has(currentTrack._id);

//     const handleLikeToggle = () => {
//         if (!currentTrack) return;
//         if (isLiked) {
//             unlikeSong(currentTrack._id);
//         } else {
//             likeSong(currentTrack._id);
//         }
//     };
    
//   // ... (lyrics array is the same)
  
//   const lyrics = [
//     { text: "In the silence of the night" },
//     { text: "Dreams are dancing in the light" },
//     { text: "Whispers of a distant song" },
//     { text: "Guide me where I belong" },
//     { text: "Midnight dreams, they call my name" },
//     { text: "In this endless, cosmic game" },
//   ];

//     return (
//         <div className="w-full max-w-lg mx-auto">
//             {!showLyrics ? (
//                 <div className="text-center space-y-6">
//             {/* ... (image and song title are the same) ... */}
//                       <img
//               src={currentTrack?.artwork}
//               alt={`${currentTrack?.album} cover`}
//               className="w-full h-full object-cover rounded-xl shadow-2xl group-hover:scale-105 transition-transform duration-300"
//             />
//                     <div className="flex items-center justify-center space-x-6 pt-4">
//                         <button
//                             onClick={handleLikeToggle}
//                             className={`p-2 transition-colors duration-200 ${isLiked ? 'text-green-500' : 'text-white/70 hover:text-white'}`}
//                         >
//                             {isLiked ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
//                         </button>
//                         <button className="text-white/70 hover:text-white p-2" onClick={onLyricsToggle}><FaFileAlt size={24} /></button>
//                         <button className="text-white/70 hover:text-white p-2"><FaShare size={24} /></button>
//                     </div>
//                 </div>
//             ) : (
//             // ... (lyrics view is the same) ...
//              <div className="w-full space-y-4">
//           <div className="flex items-center justify-between mb-6 px-2">
//              <button
//               className="text-white/70 hover:text-white p-2"
//               onClick={onLyricsToggle}
//             >
//               <FaTimes size={20} />
//             </button>
//             <div>
//               <h3 className="text-lg font-semibold text-white">Lyrics</h3>
//               <p className="text-sm text-white/60 truncate">
//                 {currentTrack?.title}
//               </p>
//             </div>
//             <div className="w-10" />
//           </div>
//           <div className="bg-black/20 rounded-xl p-6 backdrop-blur-sm max-h-80 overflow-y-auto text-center space-y-4">
//             {lyrics.map((line, index) => (
//               <p
//                 key={index}
//                 className="text-xl md:text-2xl text-white/90 leading-relaxed"
//               >
//                 {line.text}
//               </p>
//             ))}
//           </div>
//         </div>
            
//             )}
//         </div>
//     );
// };

// export default AlbumArtworkSection;


import React, { useContext } from 'react';
import { FaChevronDown, FaList, FaEllipsisH, FaShare, FaPlus } from 'react-icons/fa';
import { PlayerContext } from '../../../../../../context/PlayerContext';

const PlayerHeader = ({ currentTrack, onPlayerClose, onQueueToggle }) => {
    const { queueContext } = useContext(PlayerContext);

    const getContextText = () => {
        if (!queueContext || !queueContext.type) return "Playing from Library";
        if (queueContext.name) return `Playing from ${queueContext.type}: ${queueContext.name}`;
        return `Playing from ${queueContext.type}`;
    };

    return (
        <header className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm border-b border-white/10">
            <div className="flex items-center space-x-3">
                <button onClick={onPlayerClose} className="text-white/80 hover:text-white p-2 rounded-full">
                    <FaChevronDown size={20} />
                </button>
                <div className="text-center">
                    <p className="text-xs text-white/60 uppercase tracking-wider">{getContextText()}</p>
                    <p className="text-sm text-white font-medium truncate">{currentTrack?.title}</p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <button className="text-white/80 hover:text-white p-2 rounded-full lg:hidden" onClick={onQueueToggle}><FaList size={18} /></button>
                <button className="text-white/80 hover:text-white p-2 rounded-full"><FaEllipsisH size={18} /></button>
            </div>
        </header>
    );
};
export default PlayerHeader;