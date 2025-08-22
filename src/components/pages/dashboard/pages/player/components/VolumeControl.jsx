import React from 'react';
import { FaVolumeUp, FaVolumeMute, FaVolumeDown } from 'react-icons/fa';

const VolumeControl = ({ volume, isMuted, onVolumeChange, onMute }) => {
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <FaVolumeMute />;
    if (volume > 0.5) return <FaVolumeUp />;
    return <FaVolumeDown />;
  };

  return (
    <div className="flex items-center space-x-3 w-32">
      <button onClick={onMute} className="text-white/70 hover:text-white p-2">
        {getVolumeIcon()}
      </button>
      <input 
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={isMuted ? 0 : volume}
        onChange={(e) => {
          onVolumeChange(Number(e.target.value));
          if (isMuted) onMute()
        }}
        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white hover:accent-green-400"
      />
    </div>
  )
}

export default VolumeControl