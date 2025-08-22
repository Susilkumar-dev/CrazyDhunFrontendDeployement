import React from 'react';

const AudioVisualization = ({ audioData, isPlaying }) => {
  return (
    <div className="flex items-center justify-center space-x-1 h-16 bg-black/20 rounded-lg backdrop-blur-sm px-4">
      {audioData?.map((value, index) => (
        <div
          key={index}
          className={`bg-gradient-to-t from-white/40 to-white/80 w-1 rounded-full transition-all duration-100`}
          style={{
            height: isPlaying ? `${Math.max(4, value * 50)}px` : '4px',
          }}
        />
      ))}
    </div>
  )
}
export default AudioVisualization