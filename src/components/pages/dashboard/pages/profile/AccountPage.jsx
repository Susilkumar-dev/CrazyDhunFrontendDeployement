


import React, { useState, useEffect, useContext } from "react";
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
  return `http://localhost:9999/${path.replace(/\\/g, "/")}${version ? `?v=${version}` : ''}`;
};

// --- Main Account Page Component ---
const AccountPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [likedSongs, setLikedSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [isPicModalOpen, setIsPicModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [imageVersion, setImageVersion] = useState(0); // To force image reload
  const { playSong } = useContext(PlayerContext);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
        if (!token) { navigate("/signin"); return; }
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [profileRes, likedRes, playlistsRes] = await Promise.all([
          axios.get("http://localhost:9999/user/profile", config),
          axios.get("http://localhost:9999/user/liked-songs", config),
          axios.get("http://localhost:9999/user/playlists", config),
        ]);
        setProfile(profileRes.data);
        setLikedSongs(likedRes.data);
        setPlaylists(playlistsRes.data);
      } catch (error) {
        console.error("Failed to get profile data:", error);
        localStorage.removeItem("userInfo"); navigate("/signin");
      }
    };
    fetchData();
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem("userInfo");
    navigate("/signin");
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    // Force image reload by updating the version
    setImageVersion(prev => prev + 1);
  };

  if (!profile) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className={`animate-pulse rounded-full p-4 ${isDarkMode ? 'bg-gray-800 text-cyan-400' : 'bg-white text-cyan-600'}`}>
          Loading Your Profile...
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDarkMode 
      ? 'bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 text-white' 
      : 'bg-gradient-to-br from-gray-100 via-purple-100/30 to-gray-100 text-gray-900'}`}>
      
      {/* Background pattern */}
      <div className={`absolute inset-0 ${isDarkMode 
        ? 'bg-[radial-gradient(circle_at_top_left,_rgba(0,255,255,0.1),transparent_40%),_radial-gradient(circle_at_bottom_right,_rgba(255,0,255,0.1),transparent_40%)]' 
        : 'bg-[radial-gradient(circle_at_top_left,_rgba(0,200,200,0.1),transparent_40%),_radial-gradient(circle_at_bottom_right,_rgba(200,0,200,0.1),transparent_40%)]'}`} />

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <span
            key={i}
            className={`absolute text-xl ${isDarkMode ? 'text-pink-400/30' : 'text-pink-600/30'} animate-fall`}
            style={{
              top: `-${Math.random() * 20}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${10 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          >
            {['','🎵','🎶','🎼','🎹','🎸'][Math.floor(Math.random() * 6)]}
          </span>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
        className="relative z-10 max-w-6xl mx-auto p-6 md:p-10"
      >
        {/* Profile Header */}
        <header className={`flex flex-col md:flex-row items-center gap-8 mb-12 p-6 rounded-2xl shadow-lg ${
          isDarkMode 
            ? 'bg-gray-800/70 backdrop-blur-lg border border-cyan-500/30 shadow-cyan-500/10' 
            : 'bg-white/80 backdrop-blur-lg border border-cyan-400/30 shadow-cyan-400/10'
        }`}>
          <ProfilePicture 
            profile={profile} 
            onPictureChange={() => setIsPicModalOpen(true)} 
            isDarkMode={isDarkMode}
            imageVersion={imageVersion}
          />
          <div className="flex-1 text-center md:text-left space-y-3">
            <h2 className={`text-4xl md:text-5xl font-extrabold ${
              isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
            }`}>{profile.username}</h2>
            <p className={`text-md italic ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {profile.bio || "No bio yet. Add one to personalize your profile!"}
            </p>
          </div>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className={`font-semibold py-2 px-5 rounded-full flex items-center gap-2 transition-all ${
              isDarkMode 
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-purple-600 hover:to-pink-500 text-white' 
                : 'bg-gradient-to-r from-pink-400 to-purple-500 hover:from-purple-500 hover:to-pink-400 text-white'
            }`}
          >
            <FaEdit /> <span>Edit</span>
          </button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-12">
          <Stat value={likedSongs.length} label="Liked Songs" isDarkMode={isDarkMode} icon={<FaHeart />} />
          <Stat value={playlists.length} label="Playlists" isDarkMode={isDarkMode} icon={<FaList />} />
          <Stat value={0} label="Following" isDarkMode={isDarkMode} icon={<FaUser />} />
        </div>

        {/* Liked Songs */}
        <div className="mb-12">
          <h3 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-pink-400' : 'text-pink-500'}`}>
            ❤ Liked Songs
          </h3>
          {likedSongs.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {likedSongs.slice(0, 10).map((song) => (
                <LikedSongCard 
                  key={song._id} 
                  song={song} 
                  onPlay={() => playSong(song, likedSongs)} 
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
          ) : (
            <div className={`text-center py-10 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-800/50 border border-cyan-500/30 text-cyan-300' 
                : 'bg-white/80 border border-cyan-400/30 text-cyan-600'
            }`}>
              No liked songs yet.
            </div>
          )}
        </div>

        {/* Playlists */}
        <div className="mb-12">
          <h3 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
            Your Playlists
          </h3>
          {playlists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
            <div className={`text-center py-10 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-800/50 border border-cyan-500/30 text-cyan-300' 
                : 'bg-white/80 border border-cyan-400/30 text-cyan-600'
            }`}>
              No playlists yet.
            </div>
          )}
        </div>

        <div className="flex justify-center mt-12">
          <button 
            onClick={handleSignOut} 
            className={`flex items-center justify-center p-3 px-6 rounded-full font-medium transition-all ${
              isDarkMode 
                ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-pink-600 hover:to-red-600 text-white' 
                : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500 text-white'
            }`}
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

      {/* Flower Falling Animation */}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};

// --- Sub-Components ---

const ProfilePicture = ({ profile, onPictureChange, isDarkMode, imageVersion }) => (
  <div className="relative group w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
    {profile.profilePicture ? (
      <img 
        src={buildImageUrl(profile.profilePicture, imageVersion)} 
        alt="Profile" 
        className="w-full h-full rounded-full object-cover border-4 shadow-lg" 
        style={{
          borderColor: isDarkMode ? 'rgb(34 211 238)' : 'rgb(8 145 178)',
          boxShadow: isDarkMode ? '0 0 20px rgba(34, 211, 238, 0.6)' : '0 0 20px rgba(8, 145, 178, 0.4)'
        }}
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
        <span className="text-5xl font-bold text-white">{profile.username.charAt(0).toUpperCase()}</span>
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

const Stat = ({ value, label, isDarkMode, icon }) => (
  <div className={`p-6 rounded-xl border ${
    isDarkMode 
      ? 'bg-gray-800/50 border-cyan-500/30 shadow-cyan-500/10' 
      : 'bg-white/80 border-cyan-400/30 shadow-cyan-400/10'
  }`}>
    <div className={`text-3xl font-bold mb-2 ${
      isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
    }`}>
      {value}
    </div>
    <div className="flex items-center justify-center gap-2">
      <span className={`${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
        {icon}
      </span>
      <span className={`text-sm uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {label}
      </span>
    </div>
  </div>
);

const LikedSongCard = ({ song, onPlay, isDarkMode }) => (
  <motion.div 
    whileHover={{ y: -6, scale: 1.05 }} 
    className="group relative cursor-pointer"
    onClick={onPlay}
  >
    <img 
      src={buildImageUrl(song.coverArtPath)} 
      className="w-full aspect-square object-cover rounded-lg shadow-lg transition-all duration-300" 
      alt={song.title} 
      style={{
        boxShadow: isDarkMode 
          ? '0 0 0 rgba(34, 211, 238, 0)' 
          : '0 0 0 rgba(8, 145, 178, 0)'
      }}
    />
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg ${
      isDarkMode ? 'bg-black/60' : 'bg-black/40'
    }`}>
      <FaPlay className="text-cyan-400 text-5xl drop-shadow-lg" />
    </div>
    <p className={`font-semibold mt-2 truncate ${isDarkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
      {song.title}
    </p>
    <p className={`text-sm truncate ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
      {song.artist}
    </p>
  </motion.div>
);

const PlaylistCard = ({ playlist, isDarkMode, onClick }) => (
  <motion.div 
    whileHover={{ y: -4 }} 
    className={`p-4 rounded-xl cursor-pointer ${
      isDarkMode 
        ? 'bg-gray-800/50 hover:bg-gray-700/50 border border-cyan-500/20' 
        : 'bg-white/80 hover:bg-white border border-cyan-400/20'
    }`}
    onClick={onClick}
  >
    <div className="relative">
      {playlist.coverArt ? (
        <img 
          src={buildImageUrl(playlist.coverArt)} 
          alt={playlist.name} 
          className="w-full h-40 object-cover rounded-lg mb-3"
        />
      ) : (
        <div className={`w-full h-40 rounded-lg mb-3 flex items-center justify-center ${
          isDarkMode ? 'bg-gradient-to-br from-cyan-700 to-purple-800' : 'bg-gradient-to-br from-cyan-500 to-purple-400'
        }`}>
          <FaList className="text-3xl text-white" />
        </div>
      )}
    </div>
    <h4 className={`font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      {playlist.name}
    </h4>
    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
      {playlist.songs?.length || 0} songs
    </p>
  </motion.div>
);

// --- Upload Modal ---
const UploadModal = ({ closeModal, setProfile, isDarkMode }) => {
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
      const { data } = await axios.put("http://localhost:9999/user/profile/picture", { imageUrl }, config);
      setProfile(data);
      closeModal();
    } catch (err) {
      setError(err.response?.data?.error?.message || "Upload failed.");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className={`p-8 rounded-lg shadow-lg w-full max-w-sm ${
          isDarkMode 
            ? 'bg-gray-800 border border-cyan-500/40' 
            : 'bg-white border border-cyan-400/40'
        }`}
      >
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
          Update Profile Picture
        </h2>
        {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}
        <input 
          type="file" 
          accept="image/jpeg,image/png" 
          onChange={(e) => setFile(e.target.files[0])} 
          className={`w-full mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold ${
            isDarkMode 
              ? 'file:bg-cyan-600 file:text-white hover:file:bg-cyan-500' 
              : 'file:bg-cyan-500 file:text-white hover:file:bg-cyan-400'
          }`} 
        />
        <div className="flex justify-end space-x-4 mt-4">
          <button 
            onClick={closeModal} 
            className={`px-6 py-2 rounded-full font-semibold ${
              isDarkMode 
                ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                : 'bg-gray-300 hover:bg-gray-400 text-gray-900'
            }`}
          >
            Cancel
          </button>
          <button 
            onClick={handleUpload} 
            disabled={loading || !file} 
            className={`px-6 py-2 rounded-full font-semibold ${
              isDarkMode 
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white disabled:bg-gray-600' 
                : 'bg-cyan-500 hover:bg-cyan-400 text-white disabled:bg-gray-300'
            }`}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Edit Profile Modal ---
const EditProfileModal = ({ closeModal, currentProfile, setProfile, isDarkMode }) => {
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
      const { data } = await axios.put("http://localhost:9999/user/profile/update", { username, bio }, config);
      setProfile(data);
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className={`p-8 rounded-lg shadow-lg w-full max-w-md ${
          isDarkMode 
            ? 'bg-gray-800 border border-purple-500/40' 
            : 'bg-white border border-purple-400/40'
        }`}
      >
        <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
          Edit Profile
        </h2>
        {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}
        <div className="mb-4">
          <label className={`block mb-2 text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Username
          </label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className={`w-full p-3 rounded focus:outline-none focus:ring-2 ${
              isDarkMode 
                ? 'bg-gray-700 text-white focus:ring-purple-500' 
                : 'bg-gray-100 text-gray-900 focus:ring-purple-400'
            }`} 
          />
        </div>
        <div className="mb-6">
          <label className={`block mb-2 text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Bio
          </label>
          <textarea 
            value={bio} 
            onChange={(e) => setBio(e.target.value)} 
            className={`w-full p-3 rounded h-24 resize-none focus:outline-none focus:ring-2 ${
              isDarkMode 
                ? 'bg-gray-700 text-white focus:ring-purple-500' 
                : 'bg-gray-100 text-gray-900 focus:ring-purple-400'
            }`} 
            placeholder="Tell everyone a little about yourself..." 
          />
        </div>
        <div className="flex justify-end space-x-4 mt-4">
          <button 
            onClick={closeModal} 
            className={`px-6 py-2 rounded-full font-semibold ${
              isDarkMode 
                ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                : 'bg-gray-300 hover:bg-gray-400 text-gray-900'
            }`}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={loading} 
            className={`px-6 py-2 rounded-full font-semibold ${
              isDarkMode 
                ? 'bg-purple-600 hover:bg-purple-500 text-white disabled:bg-gray-600' 
                : 'bg-purple-500 hover:bg-purple-400 text-white disabled:bg-gray-300'
            }`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AccountPage;