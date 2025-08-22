import React from 'react';
import { FaPlay } from 'react-icons/fa';

const MusicCard = ({ title, description, imageUrl }) => (
  <div className="bg-gray-800 p-4 rounded-lg shadow-lg group relative transform transition-all duration-300 hover:bg-gray-700 hover:-translate-y-1">
    <div className="relative">
      <img src={imageUrl} alt={title} className="w-full h-40 object-cover rounded-md mb-4 shadow-md" />
      <div className="absolute bottom-6 right-2 opacity-0 group-hover:opacity-100 group-hover:bottom-8 transition-all duration-300">
        <button className="bg-green-500 text-white p-4 rounded-full shadow-lg transform hover:scale-110 transition-transform">
          <FaPlay size={20} className="ml-1" />
        </button>
      </div>
    </div>
    <h3 className="font-bold text-white text-lg truncate">{title}</h3>
    <p className="text-sm text-gray-400 mt-1 truncate">{description}</p>
  </div>
)
const CategoryCard = ({ title, gradientClass }) => (
  <div className={`rounded-lg p-4 h-40 flex items-end justify-start font-extrabold text-3xl text-white shadow-lg transform transition-transform hover:scale-105 cursor-pointer ${gradientClass}`}>
    <h3>{title}</h3>
  </div>
)



const Exp = () => {
  const categories = [
    { title: 'New Releases', gradientClass: 'bg-gradient-to-br from-purple-600 to-blue-500' },
    { title: 'Charts', gradientClass: 'bg-gradient-to-br from-red-500 to-yellow-500' },
    { title: 'Moods', gradientClass: 'bg-gradient-to-br from-green-500 to-teal-500' },
    { title: 'Podcasts', gradientClass: 'bg-gradient-to-br from-indigo-500 to-purple-600' },
  ];

  const featuredCharts = [
    { title: 'Top 50 - Global', description: 'The most played tracks in the world right now.', imageUrl: '  https://a10.gaanacdn.com/gn_pl_img/playlists/NOXWVRgWkq/XWVVvo10Wk/size_l_1754662539.jpg' },
    { title: 'Viral Hits', description: 'The tracks that are currently trending.', imageUrl: 'https://i.ytimg.com/vi/uweW2GruVFQ/maxresdefault.jpg' },
    { title: 'Top Dance Tracks', description: 'The best of electronic music.', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3PnT2nFiQfDKGikDxPYvNO-kWI6r7pWtW1Q&s' },
    { title: 'RapCaviar', description: 'The hottest tracks in hip-hop.', imageUrl: 'https://c.saavncdn.com/editorial/NowTrending_20250703050157.jpg' },
  ];
  
  const newReleases = [
    { title: 'Latest Album', description: 'By Popular Artist', imageUrl: 'https://a10.gaanacdn.com/gn_img/albums/a7LWBzWzXA/LWBL205dKz/size_m.jpg' },
    { title: 'Fresh Singles', description: 'The newest tracks from a variety of artists.', imageUrl: 'https://i.ytimg.com/vi/atdasMymfbU/maxresdefault.jpg' },
    { title: 'Indie Arrivals', description: 'Emerging artists and new sounds.', imageUrl: 'https://a10.gaanacdn.com/gn_img/albums/Rz4W8evbxD/4W8LlZd0Wx/size_m_1755600484.jpg' },
    { title: 'Rock Anthems', description: 'The latest headbangers and rock hits.', imageUrl: 'https://a10.gaanacdn.com/gn_img/albums/a7LWBaz3zX/LWBLNjYJKz/size_m.jpg' },
  ];

  return (
    <div className="space-y-12">
      <h1 className="text-4xl font-bold text-white">Explore</h1>
      <div>
        <h2 className="text-2xl font-bold mb-6 text-white">Browse All</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>
      </div>

    
      <div>
        <h2 className="text-2xl font-bold mb-6 text-white">Featured Charts</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredCharts.map((chart) => (
            <MusicCard key={chart.title} {...chart} />
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-6 text-white">New Releases</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {newReleases.map((release) => (
            <MusicCard key={release.title} {...release} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Exp