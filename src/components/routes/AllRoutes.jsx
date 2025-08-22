

import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"
import DashboardLayout from "../pages/dashboard/DashboardLayout"
import PrivateRoutes from "../privateRoutes/PrivateRoutes"
import Navbar from "../navbar/Navbar"
import LandingPage from "../pages/landing/LandingPage"
import SignInPage from "../pages/signin/SignInPage"
import SignUpPage from "../pages/signup/SignUpPage"
import Def from "../pages/dashboard/pages/defaultDashBoard/Def"
import Exp from "../pages/dashboard/pages/explore/Exp"
import Pla from "../pages/dashboard/pages/playlist/Pla"
import MusicSection from "../pages/dashboard/pages/player/MusicSection"

const MainLayout = () => (
  <>
    <Navbar />
    <div className="pt-16">
      <Outlet />
    </div>
  </>
)

const AllRoutes = () => {
  const myRoutes = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <LandingPage /> },
      ],
    },
    { path: "/signup", element: <SignUpPage /> },
    { path: "/signin", element: <SignInPage /> },
    {
      element: <PrivateRoutes />,
      children: [
        {
          path: "/dashboard",
          element: <DashboardLayout />,
          children: [
            { index: true, element: <Def /> },
            { path: "explore", element: <Exp /> },
            { path: "playlist", element: <Pla /> },
          ],
        },
      ],
    },
  ])

  return <RouterProvider router={myRoutes} />
}

export default AllRoutes