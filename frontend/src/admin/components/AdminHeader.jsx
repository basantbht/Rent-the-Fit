import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React from 'react'
import { BsFillBellFill } from 'react-icons/bs'
import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import { Link, useNavigate } from 'react-router-dom';


const AdminHeader = () => {
const navigate = useNavigate();
  const handleLogout = async () => {
    try {
        const res = await axios.post('http://localhost:3000/api/users/logout', { withCredentials: true });
        console.log(res)
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('isVerified');
        localStorage.removeItem('username');
        localStorage.removeItem('userDetails');
        Cookies.remove('token');
        navigate('/admin/dashboard');
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            toast.error(error.response.data.message);
        } else {
            toast.error(error.message);
        }
    }
}
  return (
    <header className="w-full bg-gray-900 text-white p-4 flex justify-end pr-10 shadow-md custom-bg">
      <p>Welcome to Admin Dashboard</p>
      <FontAwesomeIcon onClick={handleLogout} className='w-8 ml-2 cursor-pointer' icon={faRightFromBracket} />

      <Link to='/admin/notifications'>
      <BsFillBellFill className="mx-3 text-lg" />

      </Link>
    </header>
  )
}

export default AdminHeader