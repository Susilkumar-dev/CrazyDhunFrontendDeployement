import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'


const useAuth = () => {
  const user = localStorage.getItem('user')
  
  return user ? true : false
}

const PrivateRoutes = () => {
  const isAuthenticated = useAuth()


  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />
}

export default PrivateRoutes