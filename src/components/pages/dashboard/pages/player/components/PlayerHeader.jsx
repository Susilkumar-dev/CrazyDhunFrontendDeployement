import React from 'react';
import { FaChevronDown, FaShare, FaList, FaEllipsisH } from 'react-icons/fa';
import { Link } from 'react-router-dom';
const PlayerHeader = ({ currentTrack, onQueueToggle }) => {
return (
<header className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm border-b border-white/10">
<div className="flex items-center space-x-3">
<Link to="/dashboard" className="text-white/80 hover:text-white p-2 rounded-full transition-colors hover:bg-white/10">
<FaChevronDown size={20} />
</Link>
<div className="text-center">
<p className="text-xs text-white/60 uppercase tracking-wider">Playing from Album</p>
<p className="text-sm text-white font-medium truncate">{currentTrack?.album}</p>
</div>
</div>
<div className="flex items-center space-x-2">
<button className="text-white/80 hover:text-white p-2 rounded-full transition-colors hover:bg-white/10"><FaShare size={18} /></button>
<button className="text-white/80 hover:text-white p-2 rounded-full transition-colors hover:bg-white/10 lg:hidden" onClick={onQueueToggle}><FaList size={18} /></button>
<button className="text-white/80 hover:text-white p-2 rounded-full transition-colors hover:bg-white/10"><FaEllipsisH size={18} /></button>
</div>
</header>
)
}
export default PlayerHeader