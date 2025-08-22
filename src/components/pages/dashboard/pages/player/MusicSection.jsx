

import React, { useState, useEffect } from 'react'
import PlayerHeader from './components/PlayerHeader'
import AlbumArtworkSection from './components/AlbumArtworkSection'
import PlaybackControls from './components/PlaybackControls'
import QueuePanel from './components/QueuePanel'
import AudioVisualization from './components/AudioVisualization'
import VolumeControl from './components/VolumeControl'

const MusicSection = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(45)
  const [duration, setDuration] = useState(243) 
  const [volume, setVolume] = useState(0.75)
  const [isMuted, setIsMuted] = useState(false)
  const [isQueueOpen, setIsQueueOpen] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState('off')
  const [showLyrics, setShowLyrics] = useState(false)

  const currentTrack = {
    id: 1,
    title: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    artwork: "https://picsum.photos/id/102/500/500",
    duration: 243,
  };

  const queue = [
    { id: 2, title: "Starlight", artist: "Muse", duration: 240, artwork: "https://picsum.photos/id/1015/200/200" },
    { id: 3, title: "Kids", artist: "MGMT", duration: 302, artwork: "https://picsum.photos/id/103/200/200" },
    { id: 4, title: "Genesis", artist: "Grimes", duration: 255, artwork: "https://picsum.photos/id/1025/200/200" },
  ];

  const [audioData, setAudioData] = useState(Array.from({ length: 48 }, () => Math.random()));


  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => (prev >= duration ? 0 : prev + 1));
        setAudioData(Array.from({ length: 48 }, () => Math.random()));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);
  
 
  const handleRepeat = () => {
    const modes = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      
     
      <title>{`${currentTrack.title} - ${currentTrack.artist} | Mighty Music`}</title>
      <meta name="description" content={`Now playing ${currentTrack.title} by ${currentTrack.artist}`} />

      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${currentTrack.artwork})`, filter: 'blur(40px)', transform: 'scale(1.2)' }}
      />
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <PlayerHeader currentTrack={currentTrack} onQueueToggle={() => setIsQueueOpen(!isQueueOpen)} />

        <main className="flex-1 flex flex-col lg:flex-row items-center">
          <div className="flex-1 flex flex-col items-center justify-center p-6 w-full">
            <AlbumArtworkSection 
              currentTrack={currentTrack}
              showLyrics={showLyrics}
              onLyricsToggle={() => setShowLyrics(!showLyrics)}
            />
          </div>
          <aside className="hidden lg:block w-96 border-l border-white/10 h-full max-h-[calc(100vh-180px)]">
            <QueuePanel queue={queue} currentTrack={currentTrack} isOpen={true} />
          </aside>
        </main>

        <footer className="px-6 pb-6 space-y-4">
            <AudioVisualization audioData={audioData} isPlaying={isPlaying} />
            <PlaybackControls 
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onNext={() => setCurrentTime(0)}
                onPrevious={() => setCurrentTime(0)}
                currentTime={currentTime}
                duration={duration}
                onProgressChange={setCurrentTime}
                isShuffled={isShuffled}
                onShuffle={() => setIsShuffled(!isShuffled)}
                repeatMode={repeatMode}
                onRepeat={handleRepeat}
            />
            <div className="flex items-center justify-between pt-2">
                <VolumeControl 
                    volume={volume}
                    isMuted={isMuted}
                    onVolumeChange={setVolume}
                    onMute={() => setIsMuted(!isMuted)}
                />
            </div>
        </footer>
      </div>
      
      <QueuePanel 
        queue={queue}
        currentTrack={currentTrack}
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        className="lg:hidden"
      />
    </div>
  )
}

export default MusicSection