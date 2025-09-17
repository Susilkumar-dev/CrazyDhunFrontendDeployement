

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaMusic, FaImage, FaUser, FaSpinner, FaCheck, FaExclamationTriangle, FaGlobe, FaTags, FaHeadphones } from 'react-icons/fa';
import { useTheme } from '../../../../../context/ThemeContext';

const AdminUploadSongPage = () => {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [album, setAlbum] = useState('');
    const [language, setLanguage] = useState('');
    const [genre, setGenre] = useState('');
    const [tags, setTags] = useState('');
    const [songFile, setSongFile] = useState(null);
    const [coverArtFile, setCoverArtFile] = useState(null);
    const [artistPicFile, setArtistPicFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { isDarkMode } = useTheme();

    // Create refs for file inputs
    const songFileRef = useRef(null);
    const coverArtRef = useRef(null);
    const artistPicRef = useRef(null);

    // Language options
    const languageOptions = [
        'Telugu', 'Hindi', 'English','odia', 'Tamil', 'Kannada',
        'Malayalam', 'Bengali', 'Punjabi', 'bhajan', 'Marathi', 'Other',
    ];

    // Genre options
    const genreOptions = [
        'Pop', 'Rock', 'spiritual','bhajan','Hip Hop', 'R&B', 'Jazz', 'Classical', 'Electronic',
        'Folk', 'Country', 'Reggae', 'Blues', 'Metal', 'Indie', 'Other'
    ];

    // File validation function
    const validateFiles = () => {
        const audioTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav'];
        const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        
        // Check if all files are selected
        if (!songFile || !coverArtFile || !artistPicFile) {
            setError('Please select all three files.');
            return false;
        }
        
        // Check file types
        if (!audioTypes.includes(songFile.type)) {
            setError('Invalid audio file type. Only MP3 and WAV are allowed.');
            return false;
        }
        
        if (!imageTypes.includes(coverArtFile.type)) {
            setError('Invalid image file type for cover art. Only JPG, PNG, and WEBP are allowed.');
            return false;
        }
        
        if (!imageTypes.includes(artistPicFile.type)) {
            setError('Invalid image file type for artist picture. Only JPG, PNG, and WEBP are allowed.');
            return false;
        }
        
        // Check file sizes (20MB for audio, 5MB for images)
        if (songFile.size > 20 * 1024 * 1024) {
            setError('Song file is too large. Maximum size is 20MB.');
            return false;
        }
        
        if (coverArtFile.size > 5 * 1024 * 1024) {
            setError('Cover art is too large. Maximum size is 5MB.');
            return false;
        }
        
        if (artistPicFile.size > 5 * 1024 * 1024) {
            setError('Artist picture is too large. Maximum size is 5MB.');
            return false;
        }
        
        return true;
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        
        // Validate files before upload
        if (!validateFiles()) {
            return;
        }
        
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('artist', artist);
        formData.append('album', album);
        formData.append('language', language);
        formData.append('genre', genre);
        formData.append('tags', tags);
        formData.append('songFile', songFile);
        formData.append('coverArt', coverArtFile);
        formData.append('artistPic', artistPicFile);

        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            if (!token) {
                setError('Authentication token not found. Please log in again.');
                setLoading(false);
                return;
            }
            
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            };
            
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/admin/songs`,
                formData,
                config
            );
            
            setMessage(`Song '${data.title}' uploaded successfully!`);
            
            // Reset form
            setTitle('');
            setArtist('');
            setAlbum('');
            setLanguage('');
            setGenre('');
            setTags('');
            setSongFile(null);
            setCoverArtFile(null);
            setArtistPicFile(null);
            
            // Reset file inputs using refs
            if (songFileRef.current) songFileRef.current.value = '';
            if (coverArtRef.current) coverArtRef.current.value = '';
            if (artistPicRef.current) artistPicRef.current.value = '';
        } catch (err) {
            console.error('Upload error:', err);
            if (err.response?.status === 413) {
                setError('File too large. Please check the file size limits.');
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.message === 'Network Error') {
                setError('Network error. Please check your connection and try again.');
            } else {
                setError('Upload failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Format file size for display
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // File input component
    const FileInput = ({ id, label, accept, onChange, file, icon: Icon, required = true, maxSize, inputRef }) => (
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
                    id={id}
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    onChange={onChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center">
                    <Icon className={`mx-auto text-2xl mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {file ? file.name : `Click to upload or drag and drop`}
                    </p>
                    {file && (
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Size: {formatFileSize(file.size)}
                        </p>
                    )}
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {accept.includes('audio') ? 'MP3, WAV files only (max 20MB)' : 'JPG, PNG, WEBP files only (max 5MB)'}
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
                            <div className="flex items-center justify-center">
                                <FaCheck className="mr-2" /> {message}
                            </div>
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
                            <div className="flex items-center justify-center">
                                <FaExclamationTriangle className="mr-2" /> {error}
                            </div>
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
                                disabled={loading}
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
                                disabled={loading}
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
                            disabled={loading}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>
                                Language <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <FaGlobe className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                </div>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className={`w-full p-3 pl-10 rounded-xl focus:ring-2 focus:outline-none transition-all ${
                                        isDarkMode
                                            ? 'bg-gray-700/50 border border-gray-600/50 focus:ring-purple-500 text-white'
                                            : 'bg-white border border-gray-300 focus:ring-purple-400 text-gray-900'
                                    }`}
                                    required
                                    disabled={loading}
                                >
                                    <option value="">Select Language</option>
                                    {languageOptions.map((lang) => (
                                        <option key={lang} value={lang}>{lang}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>
                                Genre <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <FaHeadphones className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                </div>
                                <select
                                    value={genre}
                                    onChange={(e) => setGenre(e.target.value)}
                                    className={`w-full p-3 pl-10 rounded-xl focus:ring-2 focus:outline-none transition-all ${
                                        isDarkMode
                                            ? 'bg-gray-700/50 border border-gray-600/50 focus:ring-purple-500 text-white'
                                            : 'bg-white border border-gray-300 focus:ring-purple-400 text-gray-900'
                                    }`}
                                    required
                                    disabled={loading}
                                >
                                    <option value="">Select Genre</option>
                                    {genreOptions.map((g) => (
                                        <option key={g} value={g}>{g}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className={`block mb-2 text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>
                            Tags
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FaTags className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            </div>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="Separate tags with commas (e.g., romantic,melody,chill)"
                                className={`w-full p-3 pl-10 rounded-xl focus:ring-2 focus:outline-none transition-all ${
                                    isDarkMode
                                        ? 'bg-gray-700/50 border border-gray-600/50 focus:ring-purple-500 text-white'
                                        : 'bg-white border border-gray-300 focus:ring-purple-400 text-gray-900'
                                }`}
                                disabled={loading}
                            />
                        </div>
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Add relevant tags separated by commas (e.g., romantic,melody,chill)
                        </p>
                    </div>

                    <FileInput
                        id="songFile"
                        label="Song File"
                        accept="audio/mpeg,audio/mp3,audio/wav,audio/x-wav"
                        onChange={(e) => setSongFile(e.target.files[0])}
                        file={songFile}
                        icon={FaMusic}
                        maxSize={20}
                        inputRef={songFileRef}
                    />

                    <FileInput
                        id="coverArt"
                        label="Cover Art"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={(e) => setCoverArtFile(e.target.files[0])}
                        file={coverArtFile}
                        icon={FaImage}
                        maxSize={5}
                        inputRef={coverArtRef}
                    />

                    <FileInput
                        id="artistPic"
                        label="Artist Picture"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={(e) => setArtistPicFile(e.target.files[0])}
                        file={artistPicFile}
                        icon={FaUser}
                        maxSize={5}
                        inputRef={artistPicRef}
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



