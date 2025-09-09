import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaMusic, FaImage, FaUser, FaSpinner } from 'react-icons/fa';
import { useTheme } from '../../../../../context/ThemeContext';

const AdminUploadSongPage = () => {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [album, setAlbum] = useState('');
    const [songFile, setSongFile] = useState(null);
    const [coverArtFile, setCoverArtFile] = useState(null);
    const [artistPicFile, setArtistPicFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { isDarkMode } = useTheme();

    const handleUpload = async (e) => {
        e.preventDefault();
        setMessage(''); setError('');
        if (!songFile || !coverArtFile || !artistPicFile) {
            setError('Please select all three files.'); return;
        }
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('artist', artist);
        formData.append('album', album);
        formData.append('songFile', songFile);
        formData.append('coverArt', coverArtFile);
        formData.append('artistPic', artistPicFile);

        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } };
            const { data } = await axios.post('http://localhost:9999/admin/songs', formData, config);
            setMessage(`Song '${data.title}' uploaded successfully!`);
            // Reset form
            setTitle('');
            setArtist('');
            setAlbum('');
            setSongFile(null);
            setCoverArtFile(null);
            setArtistPicFile(null);
            e.target.reset();
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed.');
        } finally {
            setLoading(false);
        }
    };

    // File input component
    const FileInput = ({ label, accept, onChange, file, icon: Icon, required = true }) => (
        <div className="mb-6">
            <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <div className={`relative border-2 border-dashed rounded-xl p-6 transition-all ${
                isDarkMode 
                    ? 'border-purple-500/30 bg-purple-900/20 hover:border-purple-500/50' 
                    : 'border-purple-400/40 bg-purple-100/50 hover:border-purple-500/60'
            } ${file ? (isDarkMode ? 'border-green-500/50' : 'border-green-500/50') : ''}`}>
                <input 
                    type="file" 
                    accept={accept} 
                    onChange={onChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    required={required}
                />
                <div className="text-center">
                    <Icon className={`mx-auto text-2xl mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {file ? file.name : `Click to upload or drag and drop`}
                    </p>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {accept.includes('audio') ? 'MP3 files only' : 'JPG, PNG files only'}
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen p-6 md:p-10 relative overflow-hidden ${
            isDarkMode 
                ? 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-white' 
                : 'bg-gradient-to-br from-gray-100 via-purple-100/20 to-gray-100 text-gray-900'
        }`}>
            
            {/* Falling Bubbles Background */}
            <div className="absolute inset-0 overflow-hidden z-0">
                {Array.from({ length: 15 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full opacity-20 animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 40 + 10}px`,
                            height: `${Math.random() * 40 + 10}px`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${Math.random() * 10 + 10}s`,
                            backgroundColor: isDarkMode 
                                ? `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 100}, ${Math.random() * 100 + 200}, 0.3)` 
                                : `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 100}, ${Math.random() * 100 + 200}, 0.2)`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
                        isDarkMode 
                            ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400' 
                            : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600'
                    }`}>
                        Upload New Song
                    </h1>
                    <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Add a new track to your music library
                    </p>
                </motion.div>

                <motion.form
                    onSubmit={handleUpload}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`max-w-2xl mx-auto rounded-2xl p-8 backdrop-blur-xl border ${
                        isDarkMode 
                            ? 'bg-gray-800/40 border-purple-700/30 shadow-2xl shadow-purple-500/10' 
                            : 'bg-white/70 border-purple-200/50 shadow-2xl shadow-purple-400/10'
                    }`}
                >
                    {message && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 mb-6 rounded-xl text-center ${
                                isDarkMode 
                                    ? 'bg-green-900/40 border border-green-700/50 text-green-200' 
                                    : 'bg-green-100/80 border border-green-300 text-green-800'
                            }`}
                        >
                            {message}
                        </motion.div>
                    )}
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 mb-6 rounded-xl text-center ${
                                isDarkMode 
                                    ? 'bg-red-900/40 border border-red-700/50 text-red-200' 
                                    : 'bg-red-100/80 border border-red-300 text-red-800'
                            }`}
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>
                                Title <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className={`w-full p-3 rounded-xl focus:ring-2 focus:outline-none transition-all ${
                                    isDarkMode 
                                        ? 'bg-gray-700/50 border border-gray-600/50 focus:ring-purple-500 text-white' 
                                        : 'bg-white border border-gray-300 focus:ring-purple-400 text-gray-900'
                                }`}
                                required
                            />
                        </div>
                        <div>
                            <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>
                                Artist <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={artist}
                                onChange={(e) => setArtist(e.target.value)}
                                className={`w-full p-3 rounded-xl focus:ring-2 focus:outline-none transition-all ${
                                    isDarkMode 
                                        ? 'bg-gray-700/50 border border-gray-600/50 focus:ring-purple-500 text-white' 
                                        : 'bg-white border border-gray-300 focus:ring-purple-400 text-gray-900'
                                }`}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>
                            Album
                        </label>
                        <input
                            type="text"
                            value={album}
                            onChange={(e) => setAlbum(e.target.value)}
                            className={`w-full p-3 rounded-xl focus:ring-2 focus:outline-none transition-all ${
                                isDarkMode 
                                    ? 'bg-gray-700/50 border border-gray-600/50 focus:ring-purple-500 text-white' 
                                    : 'bg-white border border-gray-300 focus:ring-purple-400 text-gray-900'
                            }`}
                        />
                    </div>

                    <FileInput 
                        label="Song File" 
                        accept="audio/mpeg" 
                        onChange={(e) => setSongFile(e.target.files[0])} 
                        file={songFile}
                        icon={FaMusic}
                    />

                    <FileInput 
                        label="Cover Art" 
                        accept="image/jpeg,image/png" 
                        onChange={(e) => setCoverArtFile(e.target.files[0])} 
                        file={coverArtFile}
                        icon={FaImage}
                    />

                    <FileInput 
                        label="Artist Picture" 
                        accept="image/jpeg,image/png" 
                        onChange={(e) => setArtistPicFile(e.target.files[0])} 
                        file={artistPicFile}
                        icon={FaUser}
                    />

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 px-6 rounded-xl font-semibold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                            isDarkMode 
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50' 
                                : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-400/30 hover:shadow-purple-400/50'
                        } disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <FaCloudUploadAlt className="text-lg" />
                                Upload Song
                            </>
                        )}
                    </motion.button>
                </motion.form>
            </div>

            {/* Bubble Animation CSS */}
            <style>{`
                @keyframes float {
                    0% {
                        transform: translateY(100vh) rotate(0deg);
                    }
                    100% {
                        transform: translateY(-100px) rotate(360deg);
                    }
                }
                .animate-float {
                    animation: float linear infinite;
                }
            `}</style>
        </div>
    );
};

export default AdminUploadSongPage;