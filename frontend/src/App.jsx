import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './user/pages/Home'
import Products from './user/pages/Products'
import About from './user/pages/About'
import Contact from './user/pages/Contact'
import Navbar from './user/components/Navbar'
import Login from './user/pages/Login'
import Signup from './user/pages/Signup'
import AdminLayout from './admin/components/AdminLayout'
import Dashboard from './admin/pages/Dashboard'
import { ToastContainer, toast } from 'react-toastify';
import OtpInput from './user/components/OtpInput'


const App = () => {
 
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/otp' element={<OtpInput />} />

        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />

    

        {/* <Route path='/admin' element={<AdminLayout />}>
          <Route path='dashboard' element={<Dashboard />} />
        </Route> */}
      </Routes>
      <ToastContainer />


    </div>
  )
}

export default App