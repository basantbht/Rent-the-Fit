import React, { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
import { RentContext } from '../../../context/RentContext';

const SearchBar = () => {
    const { search ,setSearch ,showSearch,setShowSearch } = useContext(RentContext);
    const[visible,setVisible] = useState(false);
    const location = useLocation();

    useEffect(()=>{
        if (location.pathname.includes('products')) {
            setVisible(true);
        }
        else{
            setVisible(false)
        }
    },[location]);

  return showSearch && visible ? (
    <div className='border-t border-b bg-gray-50 text-center'>
        <div className='inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3
        rounded-full w-3/4 sm:w-1/2'>
            <input value={search} onChange={(e)=>{setSearch(e.target.value)}} className='flex-1 outline-none bg-inherit text-sm' type="text" placeholder='Search' />
            <FontAwesomeIcon className='w-4' icon={faMagnifyingGlass} />
        </div>
        <FontAwesomeIcon onClick={()=>setShowSearch(false)} className='inline w-5 cursor-pointer' icon={faCircleXmark} />
    </div>
  ) : null
}

export default SearchBar