import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faCartShopping, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../redux/User/userSlice'
import { toast } from 'react-toastify'
import axios from 'axios'
import Cookies from "js-cookie";

const Navbar = () => {
    const { currentUser } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            const res = await axios.post('http://localhost:3000/api/users/logout',{withCredentials: true});
            console.log(res)
            dispatch(logout());
            localStorage.removeItem('token');
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
        '>

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




                <FontAwesomeIcon className='w-8 cursor-pointer' icon={faCartShopping} />
                <FontAwesomeIcon onClick={handleLogout} className='w-8 cursor-pointer' icon={faRightFromBracket} />





            </div>


        </div>
    )
}

export default Navbar