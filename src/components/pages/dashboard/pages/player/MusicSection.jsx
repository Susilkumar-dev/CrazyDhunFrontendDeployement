import React, { useState, useContext } from 'react';
import { PlayerContext } from '../../../../../context/PlayerContext';
import PlayerHeader from './components/PlayerHeader';
import AlbumArtworkSection from './components/AlbumArtworkSection';
import PlaybackControls from './components/PlaybackControls'; // Import the new component

const MusicSection = ({ onClose }) => { 
    const { duration, currentTime, seek } = useContext(PlayerContext);
    const [showLyrics, setShowLyrics] = useState(false);

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const currentTrack = useContext(PlayerContext).currentSong; // Get currentTrack from context

    if (!currentTrack) return null; // Don't render if there's no song

    return (
        <div className="fixed inset-0 bg-gray-900 text-white z-[100] flex flex-col">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${currentTrack.coverArtPath})`, filter: 'blur(40px)', transform: 'scale(1.2)' }}/>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
            
            <div className="relative z-10 flex flex-col flex-1">
                <PlayerHeader currentTrack={currentTrack} onPlayerClose={onClose} />
                <main className="flex-1 flex items-center justify-center p-6">
                    <AlbumArtworkSection 
                        currentTrack={currentTrack}
                        showLyrics={showLyrics}
                        onLyricsToggle={() => setShowLyrics(!showLyrics)}
                    />
                </main>
                <footer className="px-6 pb-6 space-y-4">
                    {/* Progress Bar */}
                    <div className="flex items-center space-x-3">
                        <span className="text-xs text-white/70 font-mono w-10 text-right">{formatTime(currentTime)}</span>
                        <input type="range" min="0" max={duration || 0} value={currentTime} onChange={(e) => seek(e.target.value)}
                            className="w-full h-2 bg-white/20 rounded-full cursor-pointer group accent-white hover:accent-green-400"
                        />
                        <span className="text-xs text-white/70 font-mono w-10 text-left">{formatTime(duration)}</span>
                    </div>
                    {/* Reusable Playback Controls */}
                    <PlaybackControls />
                </footer>
            </div>
        </div>
    );
};

export default MusicSection;