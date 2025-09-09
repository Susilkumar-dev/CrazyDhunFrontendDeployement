

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const useAdminAuth = () => {
    const userInfoString = localStorage.getItem('userInfo');
    if (!userInfoString) {
        return { isAuthenticated: false, isAdmin: false };
    }
    
    try {
        const userInfo = JSON.parse(userInfoString);
        const isAuthenticated = userInfo && userInfo.token;
        const isAdmin = userInfo && userInfo.role === 'admin';
        return { isAuthenticated, isAdmin };
    } catch (error) {
        console.error("Error parsing userInfo:", error);
        return { isAuthenticated: false, isAdmin: false };
    }
};

const AdminRoute = () => {
    const { isAuthenticated, isAdmin } = useAdminAuth();

    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }
    
    return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default AdminRoute;