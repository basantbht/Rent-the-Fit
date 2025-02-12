import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faCartShopping, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import axios from 'axios'
import Cookies from "js-cookie";

const Navbar = () => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            const res = await axios.post('http://localhost:3000/api/users/logout', { withCredentials: true });
            console.log(res)
            localStorage.removeItem('token');
            localStorage.removeItem('isAdmin');
            Cookies.remove('token');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
        }
    }

    return (
        <div className='flex items-center justify-between py-5 font-medium bg-gray-50
        px-4 sm:px-[5vw] md:px-[7vw] lg:px-[7vw]'>

            <Link to='/'><img src={logo} className='w-36' alt="" /></Link>

            <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>

                <NavLink to='/' className='flex flex-col items-center gap-1'>
                    <p>HOME</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>

                <NavLink to='/products' className='flex flex-col items-center gap-1'>
                    <p>PRODUCTS</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>

                <NavLink to='/about' className='flex flex-col items-center gap-1'>
                    <p>ABOUT</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>

                <NavLink to='/contact' className='flex flex-col items-center gap-1'>
                    <p>CONTACT US</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>

            </ul>
            <div className='mr-5'>
                {/* <img className='h-7 w-7 rounded-full object-cover' src={currentUser.profilePicture} alt='profile' />
                        <FontAwesomeIcon className='w-8 mr-4 ml-4' icon={faUser} /> */}
                <Link to='/login'>
                    <button className='bg-black text-white cursor-pointer px-4 py-2 text-sm active:bg-gray-700 ml-2 rounded-full mr-3'>
                        Login
                    </button>
                </Link>

                <Link to='/signup'>
                    <button className='bg-black text-white px-4 py-2 text-sm active:bg-gray-700 rounded-full cursor-pointer'>Sign Up</button>
                </Link>

                <Link to='/cart' className='relative'>
                    <FontAwesomeIcon className='w-5 min-w-5' icon={faCartShopping} />
                    <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>0</p>

                </Link>

                <FontAwesomeIcon onClick={handleLogout} className='w-8 cursor-pointer' icon={faRightFromBracket} />





            </div>


        </div>
    )
}

export default Navbar