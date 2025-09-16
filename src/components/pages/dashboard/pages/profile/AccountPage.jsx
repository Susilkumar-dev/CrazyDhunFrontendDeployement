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
  return `${import.meta.env.VITE_API_URL}/${path.replace(/\\/g, "/")}${version ? `?v=${version}` : ''}`;
};

// --- Main Account Page Component ---
const AccountPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [likedSongs, setLikedSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [isPicModalOpen, setIsPicModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [imageVersion, setImageVersion] = useState(0);
  const { playSong } = useContext(PlayerContext);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
        if (!token) { navigate("/signin"); return; }
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [likedRes, playlistsRes, profileRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/user/liked-songs`, config),
          axios.get(`${import.meta.env.VITE_API_URL}/user/playlists`, config),
          axios.get(`${import.meta.env.VITE_API_URL}/user/profile`, config),
        ]);
        setProfile(profileRes.data);
        setLikedSongs(likedRes.data);
        setPlaylists(playlistsRes.data);
      } catch (error) {
        console.error("Failed to get profile data:", error);
        localStorage.removeItem("userInfo");
        navigate("/signin");
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
            <h2 className={`text-4xl md:text-5xl font-extrabold ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
              {profile.username}
            </h2>
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
              {likedSongs.slice(0, 10).map((song, index) => (
                <LikedSongCard 
                  key={song._id || index} 
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
              {playlists.slice(0, 3).map((playlist, index) => (
                <PlaylistCard 
                  key={playlist._id || index} 
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
        <span className="text-5xl font-bold text-white">{profile?.username?.charAt(0).toUpperCase()}</span>
      </div>
    )}
    <button 
      onClick={onPictureChange} 
      className="absolute bottom-0 right-0 bg-cyan-500 hover:bg-cyan-600 p-2 rounded-full text-white text-lg"
    >
      <FaCamera />
    </button>
  </div>
);

const Stat = ({ value, label, isDarkMode, icon }) => (
  <div className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 ${
    isDarkMode 
      ? 'border-cyan-500/40 bg-gray-800/50' 
      : 'border-cyan-400/40 bg-white/80'
  }`}>
    <div className="text-2xl">{icon}</div>
    <div className="text-xl font-bold">{value}</div>
    <div className="text-sm">{label}</div>
  </div>
);

// --- Liked Song Card ---
const LikedSongCard = ({ song, onPlay, isDarkMode }) => (
  <div className={`p-4 rounded-lg cursor-pointer transition-transform hover:scale-105 ${
    isDarkMode ? 'bg-gray-800/50 border border-cyan-500/20' : 'bg-white/80 border border-cyan-400/20'
  }`} onClick={onPlay}>
    <img src={song.cover || 'https://via.placeholder.com/150'} alt={song.title} className="w-full h-32 object-cover rounded-md mb-2" />
    <p className="font-semibold">{song.title}</p>
    <p className="text-sm text-gray-400">{song.artist}</p>
  </div>
);

// --- Playlist Card ---
const PlaylistCard = ({ playlist, isDarkMode, onClick }) => (
  <div onClick={onClick} className={`p-4 rounded-lg cursor-pointer transition-transform hover:scale-105 ${
    isDarkMode ? 'bg-gray-800/50 border border-cyan-500/20' : 'bg-white/80 border border-cyan-400/20'
  }`}>
    <h4 className="font-bold mb-2">{playlist.name}</h4>
    <p className="text-sm text-gray-400">{playlist.songs?.length || 0} songs</p>
  </div>
);

// --- Edit Profile Modal ---
const EditProfileModal = ({ closeModal, currentProfile, setProfile, isDarkMode }) => {
  const [username, setUsername] = useState(currentProfile.username);
  const [bio, setBio] = useState(currentProfile.bio || "");

  const handleSave = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/user/profile/update`,
        { username, bio },
        config
      );
      setProfile(data);
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className={`bg-white p-6 rounded-xl w-96 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="w-full p-2 rounded mb-2 text-black"/>
        <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Bio" className="w-full p-2 rounded mb-4 text-black"/>
        <div className="flex justify-end gap-3">
          <button onClick={closeModal} className="px-4 py-2 rounded bg-gray-500 text-white">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded bg-cyan-500 text-white">Save</button>
        </div>
      </div>
    </div>
  );
};

// --- Upload Modal Placeholder ---
const UploadModal = ({ closeModal, setProfile, isDarkMode }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className={`bg-white p-6 rounded-xl w-96 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <h3 className="text-xl font-bold mb-4">Upload Profile Picture</h3>
      <p>Upload logic goes here...</p>
      <div className="flex justify-end mt-4">
        <button onClick={closeModal} className="px-4 py-2 rounded bg-cyan-500 text-white">Close</button>
      </div>
    </div>
  </div>
);

export default AccountPage;
