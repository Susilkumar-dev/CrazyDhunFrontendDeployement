import React, { useContext } from 'react';
import { FaChevronDown, FaList, FaEllipsisH, FaShare, FaPlus } from 'react-icons/fa';
import { PlayerContext } from '../../../../../../context/PlayerContext';

const PlayerHeader = ({ currentTrack, onPlayerClose, onQueueToggle }) => {
    const { queueContext } = useContext(PlayerContext);

    const getContextText = () => {
        if (!queueContext || !queueContext.type) return "Playing from Library";
        if (queueContext.name) return `Playing from ${queueContext.type}: ${queueContext.name}`;
        return `Playing from ${queueContext.type}`;
    };

    return (
        <header className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm border-b border-white/10">
            <div className="flex items-center space-x-3">
                <button onClick={onPlayerClose} className="text-white/80 hover:text-white p-2 rounded-full">
                    <FaChevronDown size={20} />
                </button>
                <div className="text-center">
                    <p className="text-xs text-white/60 uppercase tracking-wider">{getContextText()}</p>
                    <p className="text-sm text-white font-medium truncate">{currentTrack?.title}</p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <button className="text-white/80 hover:text-white p-2 rounded-full lg:hidden" onClick={onQueueToggle}><FaList size={18} /></button>
                <button className="text-white/80 hover:text-white p-2 rounded-full"><FaEllipsisH size={18} /></button>
            </div>
        </header>
    );
};
export default PlayerHeader;