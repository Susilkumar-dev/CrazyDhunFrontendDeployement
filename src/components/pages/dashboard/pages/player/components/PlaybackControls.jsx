import React, { useContext } from 'react';
import { 
    FaPlayCircle, FaPauseCircle, FaStepBackward, FaStepForward, 
    FaRandom, FaRedo 
} from 'react-icons/fa';
import { PlayerContext } from '../../../../../../context/PlayerContext';

const PlaybackControls = () => {
    const {
        isPlaying, togglePlayPause, isShuffled, toggleShuffle,
        playNextSong, playPreviousSong, songQueue, currentSongIndex
    } = useContext(PlayerContext);

    const hasNext = currentSongIndex < songQueue.length - 1;
    const hasPrev = currentSongIndex > 0;

    return (
        <div className="flex items-center justify-center space-x-6">
            <button 
                onClick={toggleShuffle} 
                className={`p-2 ${isShuffled ? 'text-green-500' : 'text-white/60'} hover:text-white`}
                aria-label="Shuffle"
            >
                <FaRandom size={20} />
            </button>
            <button onClick={playPreviousSong} disabled={!hasPrev} className="text-white/80 hover:text-white p-2 disabled:opacity-50">
                <FaStepBackward size={24} />
            </button>
            <button onClick={togglePlayPause} className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
                {isPlaying ? <FaPauseCircle size={28} /> : <FaPlayCircle size={28} />}
            </button>
            <button onClick={playNextSong} disabled={!hasNext} className="text-white/80 hover:text-white p-2 disabled:opacity-50">
                <FaStepForward size={24} />
            </button>
            <button className="text-white/60 hover:text-white p-2" aria-label="Repeat">
                <FaRedo size={20} />
            </button>
        </div>
    );
};

export default PlaybackControls;