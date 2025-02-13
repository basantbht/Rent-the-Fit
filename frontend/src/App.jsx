import React, { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './user/pages/Home'
import Products from './user/pages/Products'
import About from './user/pages/About'
import Contact from './user/pages/Contact'
import Navbar from './user/components/Navbar'
import Login from './user/pages/Login'
import Signup from './user/pages/Signup'
import { ToastContainer, toast } from 'react-toastify';
import OtpInput from './user/components/OtpInput'
import Profile from './user/pages/Profile'
import PrivateRoute from './user/components/PrivateRoute'
import AdminLayout from './admin/pages/AdminLayout'
import AdminProducts from './admin/pages/AdminProducts'
import AddProducts from './admin/pages/AddProducts'
import DeleteProducts from './admin/pages/UpdateProduct'
import Orders from './admin/pages/Orders'
import Dashboard from './admin/pages/Dashboard'
import UpdateProduct from './admin/pages/UpdateProduct'
import Footer from './user/components/Footer'
import Product from './user/pages/Product'
import ScrollToTop from './user/components/ScrollTop'
import Cart from './user/pages/Cart'

const App = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
          <ScrollToTop />

      {!isAdminPage && <Navbar />}

        {!isAdminPage ? (
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<Products />} />
          <Route path='/product/:productId' element={<Product />} />
          <Route path='/otp' element={<OtpInput />} />
          
          {/* <Route element={<PrivateRoute />}> */}
          <Route path='/contact' element={<Contact />} />
          <Route path='/about' element={<About />} />
          <Route path='/profile' element={<Profile />} />
          {/* </Route> */}

          <Route path='/signup' element={<Signup />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </div>
        ) : (

      <Routes>
        <Route path='/admin' element={<AdminLayout />}>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='adminproducts' element={<AdminProducts />} />
          <Route path='addproducts' element={<AddProducts />} />
          <Route path='updateproducts' element={<UpdateProduct />} />
          <Route path='orders' element={<Orders />} />
        </Route>

      </Routes>
        )}
      <ToastContainer />

      {!isAdminPage && <Footer />}
    </>
  )
}

export default App