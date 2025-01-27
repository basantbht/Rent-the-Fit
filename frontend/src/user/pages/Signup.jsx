import React, { useState } from 'react'
import axios from 'axios'

const Signup = () => {

  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const[showotpfield,setShowOtpField] = useState(false);
  console.log(username,email,password)

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      // create user
      const response = await axios.post('http://localhost:3000/api/users/',{username,email,password})
      // console.log(response)
      console.log(response)


      // showotpfield
      setShowOtpField(true);

      
    } catch (error) {
      console.log(error.response.data.message)
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
     
      <input onChange={(e)=>setName(e.target.value)} name='username' type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required/>

      <input onChange={(e)=>setEmail(e.target.value)} name='email' type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required/>

      <input onChange={(e)=>setPassword(e.target.value)} name='password' type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required/>

      <div className='w-full flex justify-between text-sm mt-[-8px]'>
          <p className='cursor-pointer'>Login Here</p>
      </div>

      <button className='bg-black text-white font-light px-8 py-2 mt-4 rounded-full'>Signup</button>
    </form> 
    ): (

    <div>
    Enter the otp send to {email}
    </div>
    )
    }
    </>
  )
}

export default Signup