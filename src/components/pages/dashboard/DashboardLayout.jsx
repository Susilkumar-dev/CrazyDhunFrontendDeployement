


import React, { useState } from 'react';
import { Outlet } from "react-router-dom";
import DashBoard from "./DashBoard";
import PlayerControls from "../../playercontrols/PlayerControls";
import MobileFooter from './MobileFooter';
import MusicSection from './pages/player/MusicSection';

const DashboardLayout = () => {
  const [isPlayerOpen, setPlayerOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen text-white transition-colors duration-300">
      <DashBoard 
        isMobileMenuOpen={isMobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      
      <main className="ml-0 md:ml-64 p-6 pt-24 md:pt-6 pb-48 md:pb-28 relative z-10">
        <Outlet />
      </main>
      
      <PlayerControls 
        onPlayerOpen={() => setPlayerOpen(true)} 
        isMobileMenuOpen={isMobileMenuOpen}
      />
      <MobileFooter />

      {isPlayerOpen && <MusicSection onClose={() => setPlayerOpen(false)} />}
    </div>
  )
}

export default DashboardLayout;