import { useState } from "react";
import { useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom";

const CheckAuth = ({isAuthenticated,isAdmin,children}) => {

  const location = useLocation();
  const navigate = useNavigate();

  if (
    !isAuthenticated &&
    !(
      location.pathname.includes('/login') ||
      location.pathname.includes('/register')
    )
  ){
    return navigate('/login')
  }

  if (isAuthenticated && (
    location.pathname.includes('/login') ||
    location.pathname.includes('/register')
  )
){

// if (user?.role === "admin"){
//   return navigate('/admin/dashboard')
// }else{
//   return navigate('/')
// }
}

    return (
      <div>checkAuth</div>
    )
}

export default CheckAuth