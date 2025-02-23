import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import axios from 'axios';
import Cookies from "js-cookie";
import { RentContext } from '../../../context/RentContext';

const Login = () => {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const { setToken,setIsVerified,setIsAdmin,isVerified } = useContext(RentContext);

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3000/api/users/login', formData);

      console.log(res);

      const { token, email, error, isAdmin, isVerified,username,profileImage } = res.data;
      if (res.data.error === false) {

        if(isAdmin === true){
          return toast.error("Go to admin login");
        }

        setToken(token)
        setIsVerified(isVerified);
        setIsAdmin(isAdmin)

        localStorage.setItem('userDetails', JSON.stringify(res.data));
        localStorage.setItem('token', token)
        localStorage.setItem('isAdmin', isAdmin)
        localStorage.setItem('isVerified',isVerified)
        localStorage.setItem('username',username)
        Cookies.set("token", token, { expires: 5, path: "/" });
        toast.success(res.data.message)
        navigate('/');
      }

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  }
  return (
    <>
      {/* {!showotpfield ? ( */}
      <form onSubmit={submitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
        <div className='inline-flex items-center gap-2 mb-2 mt-10'>
          <p className='prata-regular text-3xl'>Login</p>
          <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
        </div>
        <input onChange={onChange} name='email' type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />

        <input onChange={onChange} name='password' type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required />

        <div className='w-full flex justify-between text-sm mt-[-8px]'>
          <Link to='/signup'> <p className='cursor-pointer'>Don't have an account?</p></Link>
          <Link to='/forgotpassword'> <p className='cursor-pointer'>Forgot password</p></Link>

        </div>

        <button className='bg-black text-white font-light px-8 py-2 mt-4 rounded-full w-full cursor-pointer'>Login</button>
      </form>

    </>
  )
}

export default Login