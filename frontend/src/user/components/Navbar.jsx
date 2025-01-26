import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import {faCartShopping} from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {
    return (
        <div className='flex items-center justify-between py-5 font-medium'>

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
<Link to='/login'>
                <button className='bg-black text-white px-4 py-2 text-sm active:bg-gray-700 rounded-full cursor-pointer'>login</button>
                </Link>

<Link to='/signup'>
                <button className='bg-black text-white cursor-pointer px-4 py-2 text-sm active:bg-gray-700 ml-2 rounded-full mr-3'>signup</button>
                </Link>

                <FontAwesomeIcon className='w-5 mr-3' icon={faUser} />

                <FontAwesomeIcon icon={faCartShopping} />
                
             
            </div>


        </div>
    )
}

export default Navbar