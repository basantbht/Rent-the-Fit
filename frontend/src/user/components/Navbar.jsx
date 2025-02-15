import React, { useContext, useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faCartShopping, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import axios from 'axios'
import Cookies from "js-cookie";
import { RentContext } from '../../../context/RentContext'

const Navbar = () => {
    const username = localStorage.getItem('username');
    const { getCartCount,isVerified,isAdmin,token,setToken,setIsVerified,setIsAdmin } = useContext(RentContext);
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

            setToken(null);
            setIsVerified(false);
            setIsAdmin(false);


            navigate('/login');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
        }
    }

    useEffect(() => {
        setToken(localStorage.getItem('token'));
        setIsVerified(localStorage.getItem('isVerified') === 'true');
        setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    }, [token])

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

            <div className='mr-5 flex items-center gap-3'>
                {isVerified && !isAdmin ? (<>

                    <Link to='/profile'>
                        <div className='w-8 h-8 flex items-center justify-center bg-black text-white rounded-full text-sm font-semibold cursor-pointer'>
                            {username ? username.charAt(0).toUpperCase() : ''}
                        </div>
                    </Link>

                    <Link to='/cart' className='relative'>
                        <FontAwesomeIcon className='w-6 min-w-6 ml-2' icon={faCartShopping} />
                        <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
                            {getCartCount()}
                        </p>
                    </Link>

                    <FontAwesomeIcon onClick={handleLogout} className='w-8 ml-2 cursor-pointer' icon={faRightFromBracket} />

                </>

                ) : (
                    <>
                        <Link to='/login'>
                            <button className='bg-black text-white cursor-pointer px-4 py-2 text-sm active:bg-gray-700 ml-2 rounded-full mr-1'>
                                Login
                            </button>
                        </Link>

                        <Link to='/signup'>
                            <button className='bg-black text-white px-4 py-2 text-sm active:bg-gray-700 rounded-full cursor-pointer'>
                                Sign Up
                            </button>
                        </Link>
                    </>
                )}

            </div>

        </div>
    )
}

export default Navbar
