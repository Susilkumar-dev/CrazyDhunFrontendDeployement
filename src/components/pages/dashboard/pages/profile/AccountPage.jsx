




import React, { useState, useEffect, useContext, useCallback } from "react";
import { FaSignOutAlt, FaCamera, FaPlay, FaEdit, FaUser, FaHeart, FaList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PlayerContext } from "../../../../../context/PlayerContext";
import { useTheme } from "../../../../../context/ThemeContext";
import { motion } from "framer-motion";


// --- Helper: Build image URL ---
const buildImageUrl = (path, version = null) => {
  if (!path) return "https://via.placeholder.com/200";
  if (path.startsWith("http")) return version ? `${path}?v=${version}` : path;
  return `${import.meta.env.VITE_API_URL}/${path.replace(/\\/g, "/")}${version ? `?v=${version}` : ''}`;
};

// --- Sub-Components ---
const ProfilePicture = React.memo(({ profile, onPictureChange, isDarkMode, imageVersion }) => {
  const initialLetter = (profile && profile.username) 
                        ? profile.username.charAt(0).toUpperCase() 
                        : '?'; 

  return (
    <div className="relative group w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
      {profile && profile.profilePicture ? ( 
        <img 
          src={buildImageUrl(profile.profilePicture, imageVersion)} 
          alt="Profile" 
          className="w-full h-full rounded-full object-cover border-4 shadow-lg" 
          style={{
            borderColor: isDarkMode ? 'rgb(34 211 238)' : 'rgb(8 145 178)',
            boxShadow: isDarkMode ? '0 0 20px rgba(34, 211, 238, 0.6)' : '0 0 20px rgba(8, 145, 178, 0.4)'
          }}
          loading="lazy"
        />
      ) : (
        <div 
          className="w-full h-full rounded-full flex items-center justify-center border-4 shadow-lg" 
          style={{
            background: isDarkMode 
              ? 'linear-gradient(to right, rgb(34, 211, 238), rgb(6, 182, 212))' 
              : 'linear-gradient(to right, rgb(8, 145, 178), rgb(14, 116, 144))',
            borderColor: isDarkMode ? 'rgb(34 211 238)' : 'rgb(8 145 178)',
            boxShadow: isDarkMode ? '0 0 20px rgba(34, 211, 238, 0.6)' : '0 0 20px rgba(8, 145, 178, 0.4)'
          }}
        >
          <span className="text-5xl font-bold text-white">{initialLetter}</span>
        </div>
      )}
      <button 
        onClick={onPictureChange} 
        className={`absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${
          isDarkMode ? 'bg-black/70' : 'bg-black/50'
        }`}
      >
        <FaCamera 
          size={32} 
          className="text-cyan-400 drop-shadow-lg" 
        />
      </button>
    </div>
  );
});

const Stat = React.memo(({ value, label, isDarkMode, icon }) => (
  <div className={`stat-card ${isDarkMode ? 'stat-card-dark' : 'stat-card-light'}`}>
    <div className={`stat-value ${isDarkMode ? 'stat-value-dark' : 'stat-value-light'}`}>
      {value}
    </div>
    <div className="flex items-center justify-center gap-2">
      <span className={`${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
        {icon}
      </span>
      <span className={`stat-label ${isDarkMode ? 'stat-label-dark' : 'stat-label-light'}`}>
        {label}
      </span>
    </div>
  </div>
));

const LikedSongCard = React.memo(({ song, onPlay, isDarkMode, isPlaying, currentSong }) => {
  const isCurrentlyPlaying = currentSong && currentSong._id === song._id;
  
  return (
    <motion.div 
      whileHover={{ y: -6, scale: 1.05 }} 
      className="group relative cursor-pointer"
      onClick={() => onPlay(song)}
    >
      <img 
        src={buildImageUrl(song.coverArtPath)} 
        className="w-full aspect-square object-cover rounded-lg shadow-lg transition-all duration-300" 
        alt={song.title} 
        style={{
          boxShadow: isDarkMode 
            ? (isCurrentlyPlaying ? '0 0 15px rgba(34, 211, 238, 0.8)' : '0 0 0 rgba(34, 211, 238, 0)') 
            : (isCurrentlyPlaying ? '0 0 15px rgba(8, 145, 178, 0.8)' : '0 0 0 rgba(8, 145, 178, 0)')
        }}
        loading="lazy"
      />
      <div className={`song-overlay ${isDarkMode ? 'song-overlay-dark' : 'song-overlay-light'}`}>
        {isCurrentlyPlaying && isPlaying ? (
          <div className="playing-animation">
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          <FaPlay className="play-icon" />
        )}
      </div>
      <p className={`song-title ${isDarkMode ? 'song-title-dark' : 'song-title-light'}`}>
        {song.title}
      </p>
      <p className={`song-artist ${isDarkMode ? 'song-artist-dark' : 'song-artist-light'}`}>
        {song.artist}
      </p>
    </motion.div>
  );
});

const PlaylistCard = React.memo(({ playlist, isDarkMode, onClick }) => (
  <motion.div 
    whileHover={{ y: -4 }} 
    className={`playlist-card ${isDarkMode ? 'playlist-card-dark' : 'playlist-card-light'}`}
    onClick={onClick}
  >
    <div className="relative">
      {playlist.coverArt ? (
        <img 
          src={buildImageUrl(playlist.coverArt)} 
          alt={playlist.name} 
          className="w-full h-40 object-cover rounded-lg mb-3"
          loading="lazy"
        />
      ) : (
        <div className={`playlist-placeholder ${isDarkMode ? 'playlist-placeholder-dark' : 'playlist-placeholder-light'}`}>
          <FaList className="text-3xl text-white" />
        </div>
      )}
    </div>
    <h4 className={`playlist-name ${isDarkMode ? 'playlist-name-dark' : 'playlist-name-light'}`}>
      {playlist.name}
    </h4>
    <p className={`playlist-count ${isDarkMode ? 'playlist-count-dark' : 'playlist-count-light'}`}>
      {playlist.songs?.length || 0} songs
    </p>
  </motion.div>
));

// --- Upload Modal ---
const UploadModal = React.memo(({ closeModal, setProfile, isDarkMode }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleUpload = async () => {
    if (!file) return;
    if (!cloudName || !uploadPreset) { setError("Cloudinary config missing"); return; }
    setLoading(true); setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      const cloudinaryEndpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const cloudinaryRes = await axios.post(cloudinaryEndpoint, formData);
      const imageUrl = cloudinaryRes.data.secure_url;
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/user/profile/picture`, { imageUrl }, config);
      setProfile(data);
      closeModal();
    } catch (err) {
      setError(err.response?.data?.error?.message || "Upload failed.");
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className={`upload-modal ${isDarkMode ? 'upload-modal-dark' : 'upload-modal-light'}`}
      >
        <h2 className={`modal-title ${isDarkMode ? 'modal-title-dark' : 'modal-title-light'}`}>
          Update Profile Picture
        </h2>
        {error && <p className="error-message">{error}</p>}
        <input 
          type="file" 
          accept="image/jpeg,image/png" 
          onChange={(e) => setFile(e.target.files[0])} 
          className={`file-input ${isDarkMode ? 'file-input-dark' : 'file-input-light'}`} 
        />
        <div className="modal-buttons">
          <button 
            onClick={closeModal} 
            className={`cancel-button ${isDarkMode ? 'cancel-button-dark' : 'cancel-button-light'}`}
          >
            Cancel
          </button>
          <button 
            onClick={handleUpload} 
            disabled={loading || !file} 
            className={`upload-button ${isDarkMode ? 'upload-button-dark' : 'upload-button-light'}`}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </motion.div>
    </div>
  );
});

// --- Edit Profile Modal ---
const EditProfileModal = React.memo(({ closeModal, currentProfile, setProfile, isDarkMode }) => {
  const [username, setUsername] = useState(currentProfile.username);
  const [bio, setBio] = useState(currentProfile.bio || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/user/profile/update`, { username, bio }, config);
      setProfile(data);
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className={`edit-modal ${isDarkMode ? 'edit-modal-dark' : 'edit-modal-light'}`}
      >
        <h2 className={`modal-title ${isDarkMode ? 'modal-title-dark' : 'modal-title-light'}`}>
          Edit Profile
        </h2>
        {error && <p className="error-message">{error}</p>}
        <div className="input-group">
          <label className={`input-label ${isDarkMode ? 'input-label-dark' : 'input-label-light'}`}>
            Username
          </label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className={`text-input ${isDarkMode ? 'text-input-dark' : 'text-input-light'}`} 
          />
        </div>
        <div className="input-group">
          <label className={`input-label ${isDarkMode ? 'input-label-dark' : 'input-label-light'}`}>
            Bio
          </label>
          <textarea 
            value={bio} 
            onChange={(e) => setBio(e.target.value)} 
            className={`bio-textarea ${isDarkMode ? 'bio-textarea-dark' : 'bio-textarea-light'}`} 
            placeholder="Tell everyone a little about yourself..." 
          />
        </div>
        <div className="modal-buttons">
          <button 
            onClick={closeModal} 
            className={`cancel-button ${isDarkMode ? 'cancel-button-dark' : 'cancel-button-light'}`}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={loading} 
            className={`save-button ${isDarkMode ? 'save-button-dark' : 'save-button-light'}`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </div>
  );
});

// --- Main Account Page Component ---
const AccountPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [likedSongs, setLikedSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [isPicModalOpen, setIsPicModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [imageVersion, setImageVersion] = useState(0);
  const { playSong, currentSong, isPlaying } = useContext(PlayerContext);
  const { isDarkMode } = useTheme();

  // Fetch profile data
  const fetchProfileData = useCallback(async () => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      if (!token) { navigate("/signin"); return; }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Fetch data sequentially to avoid overloading
      const profileRes = await axios.get(`${import.meta.env.VITE_API_URL}/user/profile`, config);
      setProfile(profileRes.data);
      
      const likedRes = await axios.get(`${import.meta.env.VITE_API_URL}/user/liked-songs`, config);
      setLikedSongs(likedRes.data);
      
      const playlistsRes = await axios.get(`${import.meta.env.VITE_API_URL}/user/playlists`, config);
      setPlaylists(playlistsRes.data);
    } catch (error) {
      console.error("Failed to get profile data:", error);
      localStorage.removeItem("userInfo"); 
      navigate("/signin");
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleSignOut = () => {
    localStorage.removeItem("userInfo");
    navigate("/signin");
  };

  const handleProfileUpdate = useCallback((updatedProfile) => {
    setProfile(updatedProfile);
    setImageVersion(prev => prev + 1);
  }, []);

  const handlePlaySong = (song) => {
    playSong(song, likedSongs);
  };

  if (!profile) {
    return (
      <div className="loading-container">
        <div className="music-loader">
          <div className="music-bar"></div>
          <div className="music-bar"></div>
          <div className="music-bar"></div>
          <div className="music-bar"></div>
          <div className="music-bar"></div>
        </div>
        <p className="loading-text">Loading Your Profile...</p>
      </div>
    );
  }

  return (
    <div className={`account-container ${isDarkMode ? 'account-container-dark' : 'account-container-light'}`}>
      {/* Background effects */}
      <div className="background-effects">
        <div className="music-notes">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="music-note"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${15 + Math.random() * 10}s`,
              }}
            >
              {['♩', '♪', '♫', '♬'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
        
        <div className="rain-effect">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="rain-drop"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1 }}
        className="account-content"
      >
        {/* Profile Header */}
        <header className={`profile-header ${isDarkMode ? 'profile-header-dark' : 'profile-header-light'}`}>
          <ProfilePicture 
            profile={profile} 
            onPictureChange={() => setIsPicModalOpen(true)} 
            isDarkMode={isDarkMode}
            imageVersion={imageVersion}
          />
          <div className="profile-info">
            <h2 className={`profile-name ${isDarkMode ? 'profile-name-dark' : 'profile-name-light'}`}>
              {profile.username}
            </h2>
            <p className={`profile-bio ${isDarkMode ? 'profile-bio-dark' : 'profile-bio-light'}`}>
              {profile.bio || "No bio yet. Add one to personalize your profile!"}
            </p>
          </div>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className={`edit-button ${isDarkMode ? 'edit-button-dark' : 'edit-button-light'}`}
          >
            <FaEdit /> <span>Edit</span>
          </button>
        </header>

        {/* Stats */}
        <div className="stats-grid">
          <Stat value={likedSongs.length} label="Liked Songs" isDarkMode={isDarkMode} icon={<FaHeart />} />
          <Stat value={playlists.length} label="Playlists" isDarkMode={isDarkMode} icon={<FaList />} />
          <Stat value={0} label="Following" isDarkMode={isDarkMode} icon={<FaUser />} />
        </div>

        {/* Liked Songs */}
        <div className="section-container">
          <h3 className={`section-title ${isDarkMode ? 'section-title-dark' : 'section-title-light'}`}>
            ❤ Liked Songs
          </h3>
          {likedSongs.length > 0 ? (
            <div className="songs-grid">
              {likedSongs.slice(0, 10).map((song) => (
                <LikedSongCard 
                  key={song._id} 
                  song={song} 
                  onPlay={handlePlaySong} 
                  isDarkMode={isDarkMode}
                  isPlaying={isPlaying}
                  currentSong={currentSong}
                />
              ))}
            </div>
          ) : (
            <div className={`empty-state ${isDarkMode ? 'empty-state-dark' : 'empty-state-light'}`}>
              No liked songs yet.
            </div>
          )}
        </div>

        {/* Playlists */}
        <div className="section-container">
          <h3 className={`section-title ${isDarkMode ? 'section-title-dark' : 'section-title-light'}`}>
            Your Playlists
          </h3>
          {playlists.length > 0 ? (
            <div className="playlists-grid">
              {playlists.slice(0, 3).map((playlist) => (
                <PlaylistCard 
                  key={playlist._id} 
                  playlist={playlist} 
                  isDarkMode={isDarkMode}
                  onClick={() => navigate(`/dashboard/playlist/${playlist._id}`)}
                />
              ))}
            </div>
          ) : (
            <div className={`empty-state ${isDarkMode ? 'empty-state-dark' : 'empty-state-light'}`}>
              No playlists yet.
            </div>
          )}
        </div>

        <div className="signout-container">
          <button 
            onClick={handleSignOut} 
            className={`signout-button ${isDarkMode ? 'signout-button-dark' : 'signout-button-light'}`}
          >
            <FaSignOutAlt className="mr-3" /> Sign Out
          </button>
        </div>
      </motion.div>

      {isPicModalOpen && (
        <UploadModal 
          closeModal={() => setIsPicModalOpen(false)} 
          setProfile={handleProfileUpdate} 
          isDarkMode={isDarkMode}
        />
      )}
      {isEditModalOpen && (
        <EditProfileModal 
          closeModal={() => setIsEditModalOpen(false)} 
          currentProfile={profile} 
          setProfile={handleProfileUpdate} 
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default AccountPage;