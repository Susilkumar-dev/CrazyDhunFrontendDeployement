
import React, { createContext, useState, useRef, useEffect } from "react";
import axios from "axios";


// 🎶 Create Context
export const PlayerContext = createContext();



// 🎶 Build Song URL (Handles local / cloud paths)
const buildSongUrl = (path) => {
  if (!path) return null; // Return null instead of empty string
  if (path.startsWith("http")) return path;
  return `${import.meta.env.VITE_API_URL}/${path.replace(/\\/g, "/")}`;
};

// Helper function to manage recently played songs
const useRecentlyPlayed = () => {
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  
  // Load recently played from localStorage on component mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('recentlyPlayed');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check if data has expired (24 hours)
        if (parsed.expiry && Date.now() > parsed.expiry) {
          localStorage.removeItem('recentlyPlayed');
        } else {
          setRecentlyPlayed(parsed.value || parsed);
        }
      }
    } catch (error) {
      console.error('Error reading recently played from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever recentlyPlayed changes
  useEffect(() => {
    try {
      const item = {
        value: recentlyPlayed,
        expiry: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };
      localStorage.setItem('recentlyPlayed', JSON.stringify(item));
    } catch (error) {
      console.error('Error saving recently played to localStorage:', error);
    }
  }, [recentlyPlayed]);

  const addToRecentlyPlayed = (song) => {
    setRecentlyPlayed(prev => {
      // Remove duplicates and limit to 50 songs
      const filtered = prev.filter(item => item.songId !== song._id);
      const newList = [{ songId: song._id, timestamp: Date.now() }, ...filtered];
      return newList.slice(0, 50);
    });
  };

  return { recentlyPlayed, addToRecentlyPlayed };
};

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(null);

  // 🎶 Player States
  const [songQueue, setSongQueue] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const [likedSongs, setLikedSongs] = useState(new Set());
  const [userPlaylists, setUserPlaylists] = useState([]);

  const [queueContext, setQueueContext] = useState({ type: "", name: "" });
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off"); // off | all | one

  // Add recently played functionality
  const { recentlyPlayed, addToRecentlyPlayed } = useRecentlyPlayed();

  // 🎶 Fetch initial liked songs & playlists
  const fetchInitialData = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      if (!token) return;

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [likedRes, playlistsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/user/liked-songs`, config),
        axios.get(`${import.meta.env.VITE_API_URL}/user/playlists`, config),
      ]);

      setLikedSongs(new Set(likedRes.data.map((song) => song._id)));
      setUserPlaylists(playlistsRes.data);
    } catch (error) {
      console.error("❌ Could not fetch user data", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // 🎶 Like / Unlike songs
  const likeSong = async (songId) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      if (!token) throw new Error("User not logged in");

      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(
        `${import.meta.env.VITE_API_URL}/user/like-song/${songId}`,
        {},
        config
      );

      setLikedSongs((prev) => new Set(prev).add(songId));
    } catch (error) {
      console.error(
        "❌ Failed to like song:",
        error.response?.data?.message || error.message
      );
    }
  };

  const unlikeSong = async (songId) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      if (!token) throw new Error("User not logged in");

      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/user/unlike-song/${songId}`,
        config
      );

      setLikedSongs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(songId);
        return newSet;
      });
    } catch (error) {
      console.error(
        "❌ Failed to unlike song:",
        error.response?.data?.message || error.message
      );
    }
  };

  // 🎶 Add Song to Playlist
  const addSongToPlaylist = async (playlistId, songId) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.post(
        `${import.meta.env.VITE_API_URL}/user/playlists/add-song`,
        { playlistId, songId },
        config
      );

      alert("✅ Song added to playlist!");
    } catch (error) {
      alert(error.response?.data?.message || "❌ Failed to add song.");
    }
  };

  // 🎶 Playback Side Effects
  useEffect(() => {
    if (isPlaying && audioRef.current && currentSong) {
      audioRef.current
        .play()
        .catch((e) => console.error("❌ Play error:", e));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // 🎶 Fetch Recommendations
  const fetchRecommendations = async (songId) => {
    try {
      const { data: recommendations } = await axios.get(
        `${import.meta.env.VITE_API_URL}/public/songs/recommend/${songId}`
      );

      setSongQueue((prevQueue) => {
        const existingIds = new Set(prevQueue.map((s) => s._id));
        const newSongs = recommendations.filter((rec) => !existingIds.has(rec._id));
        return [...prevQueue, ...newSongs];
      });
    } catch (error) {
      console.error("❌ Failed to fetch recommendations", error);
    }
  };

  // 🎶 Main Playback Controls
  const playSong = (
    song,
    queue = [],
    context = { type: "Song", name: "" }
  ) => {
    if (currentSong && currentSong._id === song._id) {
      togglePlayPause();
      return;
    }

    const initialQueue = isShuffled
      ? [...queue].sort(() => 0.5 - Math.random())
      : queue;

    const finalQueue = initialQueue.length > 0 ? initialQueue : [song];

    setSongQueue(finalQueue);
    setCurrentSongIndex(finalQueue.findIndex((s) => s._id === song._id));
    setCurrentSong(song);
    setIsPlaying(true);
    setQueueContext(context);

    // Add to recently played
    addToRecentlyPlayed(song);

    fetchRecommendations(song._id);
  };

  const togglePlayPause = () => {
    if (!currentSong) return;
    setIsPlaying((prev) => !prev);
  };

  const playNextSong = () => {
    if (songQueue.length === 0) return;

    if (repeatMode === "one") {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }

    let nextIndex = currentSongIndex;

    if (isShuffled) {
      while (nextIndex === currentSongIndex) {
        nextIndex = Math.floor(Math.random() * songQueue.length);
      }
    } else {
      nextIndex = currentSongIndex + 1;
    }

    if (nextIndex >= songQueue.length) {
      if (repeatMode === "all") {
        nextIndex = 0;
      } else {
        setIsPlaying(false);
        return;
      }
    }

    setCurrentSongIndex(nextIndex);
    setCurrentSong(songQueue[nextIndex]);
    setIsPlaying(true);
    
    // Add to recently played when playing next song
    if (songQueue[nextIndex]) {
      addToRecentlyPlayed(songQueue[nextIndex]);
    }
  };

  const playPreviousSong = () => {
    if (songQueue.length === 0 || currentSongIndex <= 0) return;
    const prevIndex = currentSongIndex - 1;
    setCurrentSong(songQueue[prevIndex]);
    setCurrentSongIndex(prevIndex);
    setIsPlaying(true);
    
    // Add to recently played when playing previous song
    if (songQueue[prevIndex]) {
      addToRecentlyPlayed(songQueue[prevIndex]);
    }
  };

  // 🎶 Utility Toggles
  const toggleShuffle = () => setIsShuffled((prev) => !prev);

  const toggleRepeat = () =>
    setRepeatMode((prev) =>
      prev === "off" ? "all" : prev === "all" ? "one" : "off"
    );

  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const changeVolume = (newVolume) => {
    setIsMuted(false);
    setVolume(parseFloat(newVolume));
  };

  const toggleMute = () => setIsMuted((prev) => !prev);

  // 🎶 Audio Handlers
  const onTimeUpdate = () => setCurrentTime(audioRef.current.currentTime);
  const onLoadedMetadata = () => setDuration(audioRef.current.duration);
  const onEnded = () => playNextSong();

  // 🎶 Context Value
  const value = {
    currentSong,
    isPlaying,
    duration,
    currentTime,
    volume,
    isMuted,
    songQueue,
    currentSongIndex,
    recentlyPlayed, // Add recently played to context

    playSong,
    togglePlayPause,
    playNextSong,
    playPreviousSong,

    seek,
    changeVolume,
    toggleMute,

    likedSongs,
    likeSong,
    unlikeSong,

    userPlaylists,
    fetchUserPlaylists: fetchInitialData,
    addSongToPlaylist,

    queueContext,
    isShuffled,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
  };

  return (
    <PlayerContext.Provider value={value}>
      {/* 🎶 Hidden Audio TAG - Only render when currentSong exists */}
      {currentSong && (
        <audio
          ref={audioRef}
          src={buildSongUrl(currentSong.filePath)}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onEnded={onEnded}
          crossOrigin="anonymous"
        />
      )}
      {children}
    </PlayerContext.Provider>
  );
};





