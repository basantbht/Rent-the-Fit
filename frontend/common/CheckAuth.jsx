import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const CheckAuth = () => {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin');
  const isVerified = localStorage.getItem('isVerified');

  return isVerified === "true" && isAdmin === "false" && token ? <Outlet /> : <Navigate to="/login" />;
};

export default CheckAuth;