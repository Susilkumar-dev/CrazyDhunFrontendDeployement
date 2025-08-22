import React from 'react';
import { Link } from 'react-router-dom';

const PlaylistCard = ({ image, title, description }) => (
  <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-lg shadow-lg overflow-hidden group transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
    <img src={image} alt={title} className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110" />
    <div className="p-4">
      <h3 className="font-bold text-white text-lg truncate">{title}</h3>
      <p className="text-sm text-gray-300 mt-1">{description}</p>
    </div>
  </div>
);


const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-green-900 to-black text-white">
      
    
      <header className="absolute top-0 left-0 right-0 p-6 z-10">
        
      </header>
      
      <div className="container mx-auto px-6 py-24">
       
        <section className="text-center pt-16 pb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            Discover Your Next Favorite Song
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
            Your ultimate destination for an endless library of music. Create playlists, discover new artists, and enjoy your favorite tracks, all in one place.
          </p>
          <Link 
            to="/signup" 
            className="bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 inline-block"
          >
            Get Started for Free
          </Link>
        </section>

        
        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Playlists</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            <PlaylistCard 
              image="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" 
              title="Top Global Hits" 
              description="The biggest tracks from around the world." 
            />
            <PlaylistCard 
              image="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" 
              title="Party Anthems" 
              description="Get the party started with these bangers." 
            />
            <PlaylistCard 
              image="https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" 
              title="Chill & Relax" 
              description="Unwind and relax with calming beats." 
            />
            <PlaylistCard 
              image="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" 
              title="Workout Energy" 
              description="High-energy tracks to fuel your workout." 
            />
            <PlaylistCard 
              image="https://images.unsplash.com/photo-1487180144351-b8472da7d491?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=872&q=80" 
              title="Rock Classics" 
              description="Legendary tracks from the greatest bands." 
            />
          </div>
        </section>
      </div>

      
      <footer className="text-center py-8 mt-16 border-t border-gray-800">
        <p className="text-gray-400">&copy; 2024 MightyMusic. All Rights Reserved.</p>
      </footer>
    </div>
  )
}

export default LandingPage