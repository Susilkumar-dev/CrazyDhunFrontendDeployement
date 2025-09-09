// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios'; // Import axios directly

// const SongUploadPage = () => {
//     const navigate = useNavigate();
//     const [title, setTitle] = useState('');
//     const [artist, setArtist] = useState('');
//     const [album, setAlbum] = useState('');
//     const [songFile, setSongFile] = useState(null);
//     const [coverArtFile, setCoverArtFile] = useState(null);
//     const [message, setMessage] = useState('');
//     const [error, setError] = useState('');

//     const handleSongUpload = async (e) => {
//         e.preventDefault();
//         setMessage('');
//         setError('');

//         const userInfo = JSON.parse(localStorage.getItem('userInfo'));
//         const token = userInfo ? userInfo.token : null;

//         if (!token) {
//             navigate('/signin');
//             return;
//         }

//         const formData = new FormData();
//         formData.append('title', title);
//         formData.append('artist', artist);
//         formData.append('album', album);
//         formData.append('songFile', songFile);
//         formData.append('coverArt', coverArtFile);

//         try {
//             // Manually create the authorization header
//             const config = {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                     Authorization: `Bearer ${token}`,
//                 },
//             };
//             const { data } = await axios.post('http://localhost:9999/admin/songs', formData, config);
//             setMessage(`Song '${data.title}' uploaded successfully!`);
//         } catch (err) {
//             setError(err.response?.data?.message || 'Upload failed.');
//         }
//     };

//     return (
//         <div className="p-6 md:p-10 text-white">
//             <h1 className="text-4xl font-bold mb-8">Upload New Song (Admin)</h1>
//             {message && <p className="text-green-400 text-center mb-4">{message}</p>}
//             {error && <p className="text-red-400 text-center mb-4">{error}</p>}
//             <form onSubmit={handleSongUpload} className="max-w-xl mx-auto bg-gray-800 p-8 rounded-lg">
//                 <div className="mb-4">
//                     <label className="block mb-1">Title</label>
//                     <input type="text" onChange={(e) => setTitle(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white" required />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block mb-1">Artist</label>
//                     <input type="text" onChange={(e) => setArtist(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white" required />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block mb-1">Album</label>
//                     <input type="text" onChange={(e) => setAlbum(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white" required />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block mb-1">Song File (.mp3)</label>
//                     <input type="file" accept="audio/mpeg" onChange={(e) => setSongFile(e.target.files[0])} className="w-full" required />
//                 </div>
//                 <div className="mb-6">
//                     <label className="block mb-1">Cover Art (.jpg, .png)</label>
//                     <input type="file" accept="image/jpeg,image/png" onChange={(e) => setCoverArtFile(e.target.files[0])} className="w-full" required />
//                 </div>
//                 <button type="submit" className="w-full bg-green-500 hover:bg-green-600 font-bold py-2 px-4 rounded-full">
//                     Upload Song
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default SongUploadPage;