import React from 'react';
import { Outlet } from "react-router-dom"
import DashBoard from "./DashBoard"


import PlayerControls from "../../playercontrols/PlayerControls"

const DashboardLayout = () => {
  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
     
      <DashBoard /> 
      
      
      <main className="ml-0 md:ml-64 p-6 pb-28">
        <Outlet /> 
      </main>
      
      
      <PlayerControls />
    </div>
  )
}

export default DashboardLayout