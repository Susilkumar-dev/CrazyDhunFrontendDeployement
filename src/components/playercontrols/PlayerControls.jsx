import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaRandom, FaStepBackward, FaPlayCircle, FaPauseCircle, FaStepForward, FaRedo, FaVolumeUp } from 'react-icons/fa';

const PlayerControls = () => {
 
  const [isPlaying, setIsPlaying] = useState(false)

  
  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 px-4 py-3 border-t border-gray-700 z-50">
      <div className="flex items-center justify-between">
        
        
        <div className="w-1/4 flex items-center min-w-0">
          <Link to="/player" className="flex items-center group space-x-4">
            <img 
              src="https://picsum.photos/id/102/64/64" 
              alt="Album Art" 
              className="w-14 h-14 rounded hidden sm:block group-hover:opacity-80 transition-opacity" 
            />
            <div className="hidden lg:block">
              <h4 className="font-semibold text-white truncate group-hover:text-green-400 transition-colors">Midnight City</h4>
              <p className="text-sm text-gray-400">M83</p>
            </div>
          </Link>
        </div>
       
        <div className="w-full md:w-2/4 flex flex-col items-center">
          <div className="flex items-center space-x-4 md:space-x-6 mb-2 text-gray-400">
            <button className="hover:text-white transition-colors"><FaRandom /></button>
            <button className="hover:text-white transition-colors"><FaStepBackward size={20} /></button>
            <button onClick={togglePlay} className="text-white hover:scale-105 transition-transform">
              {isPlaying ? <FaPauseCircle size={40} /> : <FaPlayCircle size={40} />}
            </button>
            <button className="hover:text-white transition-colors"><FaStepForward size={20} /></button>
            <button className="hover:text-white transition-colors"><FaRedo /></button>
          </div>
       
          <div className="flex items-center w-full max-w-xl gap-2">
            <span className="text-xs text-gray-400">1:15</span>
            <input 
              type="range" 
              defaultValue="30" 
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white hover:accent-green-400" 
            />
            <span className="text-xs text-gray-400">4:03</span>
          </div>
        </div>
        
       
        <div className="w-1/4 hidden md:flex items-center justify-end space-x-3">
          <FaVolumeUp className="text-gray-400" />
          <input 
            type="range" 
            defaultValue="80" 
            className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white hover:accent-green-400" 
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerControls