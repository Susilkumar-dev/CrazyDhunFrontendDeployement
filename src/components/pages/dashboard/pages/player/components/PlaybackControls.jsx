import React, { useRef } from 'react';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaRandom, FaRedo } from 'react-icons/fa';

const PlaybackControls = ({ isPlaying, onPlayPause, onPrevious, onNext, currentTime, duration, onProgressChange, isShuffled, onShuffle, repeatMode, onRepeat }) => {
  const progressRef = useRef(null)
  
  const formatTime = (seconds) => {
    const s = Math.floor(seconds)
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  }
  
  const handleProgressClick = (e) => {
    if (!progressRef.current) return
    const rect = progressRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration
    onProgressChange(newTime)
  }


  const getRepeatIcon = () => {
    return <FaRedo size={20} />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <span className="text-xs text-white/70 font-mono w-10 text-right">{formatTime(currentTime)}</span>
        <div ref={progressRef} className="flex-1 h-2 bg-white/20 rounded-full cursor-pointer group" onClick={handleProgressClick}>
          <div 
            className="h-full bg-white rounded-full relative group-hover:bg-green-400 transition-colors" 
            style={{ width: `${(currentTime / duration) * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <span className="text-xs text-white/70 font-mono w-10 text-left">{formatTime(duration)}</span>
      </div>
      <div className="flex items-center justify-center space-x-6">
        <button onClick={onShuffle} className={`${isShuffled ? 'text-green-500' : 'text-white/60'} hover:text-white p-2`}><FaRandom size={20} /></button>
        <button onClick={onPrevious} className="text-white/80 hover:text-white p-2"><FaStepBackward size={24} /></button>
        <button onClick={onPlayPause} className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
            {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} className="ml-1" />}
        </button>
        <button onClick={onNext} className="text-white/80 hover:text-white p-2"><FaStepForward size={24} /></button>
        <button onClick={onRepeat} className={`${repeatMode !== 'off' ? 'text-green-500' : 'text-white/60'} hover:text-white p-2`}>
          {getRepeatIcon()}
        </button>
      </div>
    </div>
  )
}

export default PlaybackControls