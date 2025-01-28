import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../../store/auth/authSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import OtpInput from '../components/OtpInput';


const Signup = () => {
  const [formData, setFormData] = useState({});
  const [showotpfield, setShowOtpField] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [token,setToken] = useState('');
  // const { token } = useSelector((state) => state.token);


  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3000/api/users/', formData);
      console.log(res);

      const {token,message,error} = res.data;

      if (error === false) {
        toast.success(message)
        setToken(localStorage.setItem('token', token))
        // navigate('/login')
        setFormData('')
        setShowOtpField(true)
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
      {!showotpfield ? (
        <form onSubmit={submitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
          <div className='inline-flex items-center gap-2 mb-2 mt-10'>
            <p className='prata-regular text-3xl'>Signup</p>
            <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
          </div>

          <input onChange={onChange} name='username' type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required />

          <input onChange={onChange} name='email' type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />

          <input onChange={onChange} name='password' type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required />

          <div className='w-full flex justify-between text-sm mt-[-8px]'>
            <Link to='/login'> <p className='cursor-pointer'>Already have an account?</p></Link>
          </div>

          <button className='bg-black text-white font-light px-8 py-2 mt-4 rounded-full w-full cursor-pointer'>SignUp</button>
        </form>
      ) : 
      (

        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Enter the verification code we just emailed to you.</h2>
            <div className="flex justify-center">
              <OtpInput email={formData.email}  />
            </div>
          </div>
        </div>)
      }
    </>
  )
}

export default Signup