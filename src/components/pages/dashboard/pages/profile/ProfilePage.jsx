import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const ProfilePage = () => {
  const user = {
    name: "John Doe",
    bio: "Music lover, creator of playlists, and weekend DJ. Exploring the world one track at a time.",
    imageUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80"
  };

  return (
    <div className="p-6 md:p-10 text-white">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-2xl shadow-lg p-8 backdrop-blur-md bg-opacity-60">
        <div className="flex flex-col items-center md:flex-row md:space-x-8">
          <div className="relative mb-6 md:mb-0">
            {user.imageUrl ? (
              <img 
                src={user.imageUrl} 
                alt="User Profile" 
                className="w-40 h-40 rounded-full object-cover shadow-2xl border-4 border-green-500"
              />
            ) : (
              <FaUserCircle className="w-40 h-40 text-gray-500" />
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-white mb-2">{user.name}</h1>
            <p className="text-lg text-gray-300 leading-relaxed">{user.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;