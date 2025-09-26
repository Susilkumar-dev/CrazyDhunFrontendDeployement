

// import React from "react";
// // import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
// import { createHashRouter, RouterProvider, Outlet } from "react-router-dom";
// import DashboardLayout from "../pages/dashboard/DashboardLayout";
// import PrivateRoutes from "../privateRoutes/PrivateRoutes";
// import AdminRoute from "../privateRoutes/AdminRouts";
// import Navbar from "../navbar/Navbar";
// import LandingPage from "../pages/landing/LandingPage";
// import SignInPage from "../pages/signin/SignInPage";
// import SignUpPage from "../pages/signup/SignUpPage";
// import VerifyOtpPage from "../pages/signup/VerifyOtpPage";
// import MusicHome from "../pages/dashboard/pages/defaultDashBoard/MusicHome";
// import AddSongPage from "../pages/dashboard/pages/addsong/AddSongPage";
// import AdminApprovalPage from "../pages/dashboard/pages/admin/AdminApprovalPage";
// import AdminUploadSongPage from "../pages/dashboard/pages/admin/AdminUploadSongPage";
// import Exp from "../pages/dashboard/pages/explore/Exp";
// import Pla from "../pages/dashboard/pages/playlist/Pla";
// import SearchPage from "../pages/dashboard/pages/search/SearchPage";
// import LibraryPage from "../pages/dashboard/pages/library/LibraryPage";
// import ProfilePage from "../pages/dashboard/pages/profile/ProfilePage";
// import AccountPage from "../pages/dashboard/pages/profile/AccountPage";
// import PlaylistDetailPage from "../pages/dashboard/pages/playlist/PlaylistDetailPage";
// import ArtistDetailPage from "../pages/dashboard/pages/Artist/ArtistDetailPage";
// import AlbumDetailPage from "../pages/Album/AlbumDetailPage";
// // import AdminAlbumManager from "../pages/dashboard/pages/admin/AdminAlbumManager";
// import AdminAddSongByUrlPage from "../pages/dashboard/pages/addsong/AdminAddSongByUrlPage";
// import AdminManageSongs from "../pages/dashboard/pages/admin/AdminManageSongs";
// import ForgotPasswordPage from "../pages/forgotPassword/ForgotPasswordPage"
// import ResetPasswordPage from "../pages/forgotPassword/ResetPasswordPage"

// // import AdminAddSongByUrlPage from "../pages/dashboard/pages/addsong/AdminAddSongByUrlPage";

// const MainLayout = () => (
//     <>
//         <Navbar />
//         <div className="pt-16">
//             <Outlet />
//         </div>
//     </>
// );

// // Error Boundary Component
// const ErrorBoundary = ({ error }) => {
//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100">
//             <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
//                 <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
//                 <p className="text-gray-700 mb-4">{error?.message || "An unexpected error occurred"}</p>
//                 <button
//                     onClick={() => window.location.reload()}
//                     className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                 >
//                     Reload Page
//                 </button>
//             </div>
//         </div>
//     );
// };

// const AllRoutes = () => {
//     const myRoutes = createHashRouter([
//         {
//             path: "/",
//             element: <MainLayout />,
//             errorElement: <ErrorBoundary />,
//             children: [{
//                 index: true,
//                 element: <LandingPage />
//             }],
//         },
//         {
//             path: "/signup",
//             element: <SignUpPage />
//         },
//         {
//             path: "/verify-otp",
//             element: <VerifyOtpPage />
//         },
//         {
//             path: "/signin",
//             element: <SignInPage />
//         },
//         {
//          path: "/forgot-password",
//           element: <ForgotPasswordPage />
//           },
//         {
//         path: "/reset-password",
//             element: <ResetPasswordPage />
//         },
        
       
        

//         {
//             element: <PrivateRoutes />,
//             errorElement: <ErrorBoundary />,
//             children: [
//                 {
//                     path: "/dashboard",
//                     element: <DashboardLayout />,
//                     errorElement: <ErrorBoundary />,
//                     children: [
//                         {
//                             index: true,
//                             element: <MusicHome />
//                         },
//                         {
//                             path: "account",
//                             element: <AccountPage />
//                         },
//                         {
//                             path: "explore",
//                             element: <Exp />
//                         },
//                         {
//                             path: "playlist",
//                             element: <Pla />
//                         },
//                         {
//                             path: "search",
//                             element: <SearchPage />
//                         },
//                         {
//                             path: "library",
//                             element: <LibraryPage />
//                         },
//                         {
//                             path: "profile",
//                             element: <ProfilePage />
//                         },
//                         {
//                             path: "playlist/:id",
//                             element: <PlaylistDetailPage />
//                         },
//                         {
//                             path: "add-song",
//                             element: <AddSongPage />
//                         },
//                         {
//                             path: "artist/:artistName",
//                             element: <ArtistDetailPage />
//                         },
//                         {
//                             path: "album/:albumName",
//                             element: <AlbumDetailPage />
//                         },
//                         {
//                             element: <AdminRoute />,
//                             errorElement: <ErrorBoundary />,
//                             children: [
//                                 {
//                                     path: "upload-song",
//                                     element: <AdminUploadSongPage />
//                                 },
//                                 {
//                                     path: "add-song-url",
//                                     element: <AdminAddSongByUrlPage />
//                                 },
//                                 {
//                                     path: "approvals",
//                                     element: <AdminApprovalPage />
//                                 },
//                                 // {
//                                 //  path: "Edit-songs",
//                                 //  element: <AdminAlbumManager />
//                                 // },
//                                 {
//                                  path: "manage-songs",
//                                  element: <AdminManageSongs />
//                                 }
                                
                                
//                             ]
//                         }
//                     ],
//                 },
//             ],
//         },
//     ]);
    
//     return <RouterProvider router={myRoutes} />;
// };

// export default AllRoutes;







import React from "react";
// import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";  
import { createHashRouter, RouterProvider, Outlet } from "react-router-dom";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import PrivateRoutes from "../privateRoutes/PrivateRoutes";
import AdminRoute from "../privateRoutes/AdminRouts";
import Navbar from "../navbar/Navbar";
import LandingPage from "../pages/landing/LandingPage";
import SignInPage from "../pages/signin/SignInPage";
import SignUpPage from "../pages/signup/SignUpPage";
import VerifyOtpPage from "../pages/signup/VerifyOtpPage";
import MusicHome from "../pages/dashboard/pages/defaultDashBoard/MusicHome";
import AddSongPage from "../pages/dashboard/pages/addsong/AddSongPage";
import AdminApprovalPage from "../pages/dashboard/pages/admin/AdminApprovalPage";
import AdminUploadSongPage from "../pages/dashboard/pages/admin/AdminUploadSongPage";
import Exp from "../pages/dashboard/pages/explore/Exp";
import Pla from "../pages/dashboard/pages/playlist/Pla";
import SearchPage from "../pages/dashboard/pages/search/SearchPage";
import LibraryPage from "../pages/dashboard/pages/library/LibraryPage";
import ProfilePage from "../pages/dashboard/pages/profile/ProfilePage";
import AccountPage from "../pages/dashboard/pages/profile/AccountPage";
import PlaylistDetailPage from "../pages/dashboard/pages/playlist/PlaylistDetailPage";
import ArtistDetailPage from "../pages/dashboard/pages/Artist/ArtistDetailPage";
import AlbumDetailPage from "../pages/Album/AlbumDetailPage";
// import AdminAlbumManager from "../pages/dashboard/pages/admin/AdminAlbumManager";
import AdminAddSongByUrlPage from "../pages/dashboard/pages/addsong/AdminAddSongByUrlPage";
import AdminManageSongs from "../pages/dashboard/pages/admin/AdminManageSongs";
import ForgotPasswordPage from "../pages/forgotPassword/ForgotPasswordPage"
import ResetPasswordPage from "../pages/forgotPassword/ResetPasswordPage"

// import AdminAddSongByUrlPage from "../pages/dashboard/pages/addsong/AdminAddSongByUrlPage";

const MainLayout = () => (
    <>
        <Navbar />
        <div className="pt-16">
            <Outlet />
        </div>
    </>
);

// Error Boundary Component
const ErrorBoundary = ({ error }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
                <p className="text-gray-700 mb-4">{error?.message || "An unexpected error occurred"}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Reload Page
                </button>
            </div>
        </div>
    );
};

const AllRoutes = () => {
    const myRoutes = createHashRouter([
        {
            path: "/",
            element: <MainLayout />,
            errorElement: <ErrorBoundary />,
            children: [{ 
                index: true, 
                element: <LandingPage /> 
            }],
        },
        { 
            path: "/signup", 
            element: <SignUpPage /> 
        },
        { 
            path: "/verify-otp", 
            element: <VerifyOtpPage /> 
        },
        { 
            path: "/signin", 
            element: <SignInPage /> 
        },
        { 
         path: "/forgot-password", 
          element: <ForgotPasswordPage /> 
          },
        { 
        path: "/reset-password", 
            element: <ResetPasswordPage /> 
        },
        
       
        

        {
            element: <PrivateRoutes />,
            errorElement: <ErrorBoundary />,
            children: [
                {
                    path: "/dashboard",
                    element: <DashboardLayout />,
                    errorElement: <ErrorBoundary />,
                    children: [
                        { 
                            index: true, 
                            element: <MusicHome /> 
                        },
                        { 
                            path: "account", 
                            element: <AccountPage /> 
                        },
                        { 
                            path: "explore", 
                            element: <Exp /> 
                        },
                        { 
                            path: "playlist", 
                            element: <Pla /> 
                        },
                        { 
                            path: "search", 
                            element: <SearchPage /> 
                        },
                        { 
                            path: "library", 
                            element: <LibraryPage /> 
                        },
                        { 
                            path: "profile", 
                            element: <ProfilePage /> 
                        },
                        { 
                            path: "playlist/:id", 
                            element: <PlaylistDetailPage /> 
                        },
                        { 
                            path: "add-song", 
                            element: <AddSongPage /> 
                        },
                        { 
                            path: "artist/:artistName", 
                            element: <ArtistDetailPage /> 
                        },
                        { 
                            path: "album/:albumName", 
                            element: <AlbumDetailPage /> 
                        },
                        {
                            element: <AdminRoute />,
                            errorElement: <ErrorBoundary />,
                            children: [
                                { 
                                    path: "upload-song", 
                                    element: <AdminUploadSongPage /> 
                                },
                                { 
                                    path: "add-song-url", 
                                    element: <AdminAddSongByUrlPage /> 
                                },
                                { 
                                    path: "approvals", 
                                    element: <AdminApprovalPage /> 
                                },
                                // { 
                                //  path: "Edit-songs", 
                                //  element: <AdminAlbumManager /> 
                                // },
                                { 
                                 path: "manage-songs", 
                                 element: <AdminManageSongs /> 
                                }
                                
                                
                            ]
                        }
                    ],
                },
            ],
        },
    ]);
    
    return <RouterProvider router={myRoutes} />;
};

export default AllRoutes;