


import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const useAuth = () => {
  const userInfo = localStorage.getItem('userInfo');
  return !!userInfo;
};

const PrivateRoutes = () => {
  const isAuthenticated = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default PrivateRoutes;