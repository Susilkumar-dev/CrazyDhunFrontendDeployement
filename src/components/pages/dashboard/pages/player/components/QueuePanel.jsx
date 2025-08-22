import React from 'react';
import { FaVolumeUp, FaTimes, FaEllipsisH } from 'react-icons/fa';

const QueuePanel = ({ queue, currentTrack, isOpen, onClose, className = '' }) => {
  const formatTime = (seconds) => {
    const s = Math.floor(seconds);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  };

  if (!isOpen) return null

  const QueueContent = () => (
    <div className="space-y-4 p-4">
      <div>
        <h4 className="text-sm font-medium text-gray-400 mb-3">Now Playing</h4>
        <div className="flex items-center space-x-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
          <img src={currentTrack?.artwork} alt="cover" className="w-12 h-12 rounded-lg object-cover" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{currentTrack?.title}</p>
            <p className="text-xs text-gray-400 truncate">{currentTrack?.artist}</p>
          </div>
          <FaVolumeUp size={14} className="text-green-500" />
        </div>
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-400 mb-3">Up Next</h4>
        <div className="space-y-1">
          {queue?.map((track, index) => (
            <div key={track.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 group cursor-pointer">
              <span className="text-xs text-gray-400 w-6 text-center">{index + 1}</span>
              <img src={track.artwork} alt="cover" className="w-10 h-10 rounded object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{track.title}</p>
                <p className="text-xs text-gray-400 truncate">{track.artist}</p>
              </div>
              <span className="text-xs text-gray-400 font-mono">{formatTime(track.duration)}</span>
              <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white p-1"><FaEllipsisH size={14} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className={`flex flex-col h-full bg-gray-800/50 backdrop-blur-sm ${className}`}>
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white">Queue</h3>
        {onClose && <button onClick={onClose} className="p-2 text-gray-400 hover:text-white lg:hidden"><FaTimes size={18} /></button>}
      </div>
      <div className="flex-1 overflow-y-auto">
        <QueueContent />
      </div>
    </div>
  )
}

export default QueuePanel