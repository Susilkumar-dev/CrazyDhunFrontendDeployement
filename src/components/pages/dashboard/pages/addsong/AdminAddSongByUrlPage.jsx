
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaImage } from 'react-icons/fa';
import { useTheme } from '../../../../../context/ThemeContext';

// --- Reusable Input Component with Theme Support ---
const FormInput = ({ label, type = 'text', placeholder, value, onChange, required = true, isDarkMode }) => (
  <div>
    <label className={`block mb-2 text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
      {label} {required && <span className={isDarkMode ? 'text-pink-400' : 'text-pink-600'}>*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full p-3 rounded-lg focus:ring-2 focus:outline-none placeholder-gray-400 transition-all ${
        isDarkMode 
          ? 'bg-white/5 border border-white/20 focus:ring-purple-500 text-white' 
          : 'bg-white border border-gray-300 focus:ring-purple-400 text-gray-900 shadow-sm'
      }`}
      required={required}
    />
  </div>
);

// --- Fingerprint Ripple Effect Component with Theme Support ---
const RippleEffect = ({ x, y, isDarkMode }) => (
  <motion.div
    className={`absolute rounded-full pointer-events-none border-2 ${
      isDarkMode ? 'border-pink-400' : 'border-pink-500'
    }`}
    initial={{ opacity: 0.7, scale: 0, x: x, y: y, width: 40, height: 40 }}
    animate={{ opacity: 0, scale: 3 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    style={{ transform: 'translate(-50%, -50%)' }}
  />
);

// --- Main Page Component ---
const AdminAddSongByUrlPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [filePath, setFilePath] = useState('');
  const [coverArtPath, setCoverArtPath] = useState('');
  const [artistPic, setArtistPic] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [ripple, setRipple] = useState(null);
  const { isDarkMode } = useTheme();

  const isImageUrl = (url) => /\.(jpeg|jpg|gif|png|webp)$/i.test(url);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage(''); setError('');
    const songData = { title, artist, album, filePath, coverArtPath, artistPic };
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      if (!token) { navigate('/signin'); return; }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/admin/songs/add-by-url`, songData, config);
      setMessage(`✅ Success! '${data.title}' was added.`);
      setTitle(''); setArtist(''); setAlbum(''); setFilePath(''); setCoverArtPath(''); setArtistPic('');
    } catch (err) {
      setError(err.response?.data?.message || '❌ An error occurred.');
    } finally { setLoading(false); }
  };

  const handleRipple = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, key: Date.now() });
    setTimeout(() => setRipple(null), 700);
  }, []);

  return (
    <div 
      className={`min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden ${isDarkMode
        ? 'bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white'
        : 'bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 text-gray-900'
      }`} 
      onClick={handleRipple}
    >
      {/* Animated Bubble Background - Only show in dark mode */}
      {isDarkMode && (
        <div className="absolute inset-0 z-0">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="bubble" style={{
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 80 + 20}px`, height: `${Math.random() * 80 + 20}px`,
                animationDelay: `${Math.random() * 10}s`, animationDuration: `${Math.random() * 10 + 10}s`,
                backgroundColor: `rgba(${139 + Math.random() * 100}, ${92 + Math.random() * 100}, ${246 + Math.random() * 50}, 0.2)`,
                boxShadow: `0 0 20px rgba(${139 + Math.random() * 100}, ${92 + Math.random() * 100}, ${246 + Math.random() * 50}, 0.3)`
            }}/>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-3xl z-10"
      >
        <div className="text-center mb-10">
          <h1 className={`text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${
            isDarkMode 
              ? 'from-pink-400 via-purple-400 to-indigo-400 drop-shadow-lg' 
              : 'from-pink-500 via-purple-500 to-indigo-500'
          }`}>
            Add to the Music Cosmos
          </h1>
          <p className={`mt-3 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Curate the universe of music, one track at a time.
          </p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`rounded-2xl p-8 space-y-6 ${
            isDarkMode 
              ? 'bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl' 
              : 'bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl'
          }`}
        >
          <AnimatePresence>
            {message && (
              <motion.div className={`p-3 text-center rounded-lg ${
                isDarkMode 
                  ? 'bg-green-900/40 border border-green-500 text-green-300' 
                  : 'bg-green-100 border border-green-500 text-green-700'
              }`}>
                {message}
              </motion.div>
            )}
            {error && (
              <motion.div className={`p-3 text-center rounded-lg ${
                isDarkMode 
                  ? 'bg-red-900/40 border border-red-500 text-red-300' 
                  : 'bg-red-100 border border-red-500 text-red-700'
              }`}>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FormInput 
                label="Song Title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                isDarkMode={isDarkMode}
              />
            </div>
            <FormInput 
              label="Artist" 
              value={artist} 
              onChange={(e) => setArtist(e.target.value)} 
              isDarkMode={isDarkMode}
            />
            <FormInput 
              label="Album (Optional)" 
              value={album} 
              onChange={(e) => setAlbum(e.target.value)} 
              required={false} 
              isDarkMode={isDarkMode}
            />
            <div className="md:col-span-2">
              <FormInput 
                label="Song File URL (.mp3)" 
                type="url" 
                placeholder="https://..." 
                value={filePath} 
                onChange={(e) => setFilePath(e.target.value)} 
                isDarkMode={isDarkMode}
              />
            </div>

            <div className="flex items-end gap-4">
              <div className="flex-1">
                <FormInput 
                  label="Cover Art URL" 
                  type="url" 
                  placeholder="https://..." 
                  value={coverArtPath} 
                  onChange={(e) => setCoverArtPath(e.target.value)} 
                  isDarkMode={isDarkMode}
                />
              </div>
              <div className={`w-20 h-20 rounded-lg flex items-center justify-center border shadow-inner ${
                isDarkMode 
                  ? 'bg-white/5 border-white/20' 
                  : 'bg-white border-gray-300'
              }`}>
                <AnimatePresence>
                  {isImageUrl(coverArtPath) ? 
                    <motion.img 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      src={coverArtPath} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-lg"
                    /> : 
                    <FaImage className={`text-2xl ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  }
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-end gap-4">
              <div className="flex-1">
                <FormInput 
                  label="Artist Picture URL" 
                  type="url" 
                  placeholder="https://..." 
                  value={artistPic} 
                  onChange={(e) => setArtistPic(e.target.value)} 
                  isDarkMode={isDarkMode}
                />
              </div>
              <div className={`w-20 h-20 rounded-lg flex items-center justify-center border shadow-inner ${
                isDarkMode 
                  ? 'bg-white/5 border-white/20' 
                  : 'bg-white border-gray-300'
              }`}>
                <AnimatePresence>
                  {isImageUrl(artistPic) ? 
                    <motion.img 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      src={artistPic} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-lg"
                    /> : 
                    <FaImage className={`text-2xl ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  }
                </AnimatePresence>
              </div>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ 
              scale: 1.03, 
              boxShadow: isDarkMode 
                ? "0px 0px 20px rgba(219, 112, 147, 0.5)" 
                : "0px 0px 20px rgba(219, 112, 147, 0.3)" 
            }}
            type="submit"
            disabled={loading}
            className={`w-full mt-6 py-3 px-4 rounded-full font-bold tracking-wide shadow-lg transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white' 
                : 'bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white'
            } disabled:opacity-60`}
          >
            {loading ? 'Adding to Library...' : '🚀 Add Song'}
          </motion.button>
        </motion.form>
      </motion.div>
      <AnimatePresence>
        {ripple && <RippleEffect key={ripple.key} x={ripple.x} y={ripple.y} isDarkMode={isDarkMode} />}
      </AnimatePresence>

      {/* Bubble Animation CSS (only for dark mode) */}
      {isDarkMode && (
        <style>{`
          .bubble {
            position: absolute;
            border-radius: 50%;
            opacity: 0.7;
            animation: float 15s infinite ease-in-out;
          }
          
          @keyframes float {
            0% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(180deg);
            }
            100% {
              transform: translateY(0) rotate(360deg);
            }
          }
        `}</style>
      )}
    </div>
  );
};

export default AdminAddSongByUrlPage;