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
import AdminLayout from './admin/pages/AdminLayout'
import AdminProducts from './admin/pages/AdminProducts'
import AddProducts from './admin/pages/AddProducts'
import DeleteProducts from './admin/pages/EditProduct'
import Dashboard from './admin/pages/Dashboard'
import UpdateProduct from './admin/pages/EditProduct'
import Footer from './user/components/Footer'
import Product from './user/pages/Product'
import ScrollToTop from './user/components/ScrollTop'
import Cart from './user/pages/Cart'
import PlaceOrder from './user/pages/PlaceOrder'
import Orders from './user/pages/Orders'
import AdminOrders from './admin/pages/AdminOrders'
import EditProduct from './admin/pages/EditProduct'
import Customers from './admin/pages/Customers'
import CheckAuth from '../common/CheckAuth'
import Settings from './admin/pages/Settings'
import Notifications from './admin/pages/Notifications'

const App = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const isOtp = location.pathname.startsWith("/otp");

  return (
    <>
      <ScrollToTop />

      {!isAdminPage && <Navbar />}
      {!isAdminPage ? (

        <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>

          <Routes>

            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
              <Route path='/otp' element={<OtpInput />} />

            {/* ProtectedRoute */}
            <Route element={<CheckAuth />}>
              <Route path='/product/:productId' element={<Product />} />
              <Route path='/profile' element={<Profile />} />

              <Route path='/cart' element={<Cart />} />
              <Route path='/placeorder' element={<PlaceOrder />} />
              <Route path='/orders' element={<Orders />} />
              <Route path='/about' element={<About />} />
              <Route path='/contact' element={<Contact />} />
            </Route>

            <Route path='/' element={<Home />} />
            <Route path='/products' element={<Products />} />


          </Routes>
        </div>
      ) : (

        <Routes>
            <Route path='/admin' element={<AdminLayout />}>
              <Route path='dashboard' element={<Dashboard />} />
              <Route path='adminproducts' element={<AdminProducts />} />
              <Route path='addproducts' element={<AddProducts />} />
              <Route path='editproducts' element={<EditProduct />} />
              <Route path='vieworders' element={<AdminOrders />} />
              <Route path='customers' element={<Customers />} />
              <Route path='settings' element={<Settings />} />
              <Route path='notifications' element={<Notifications />} />
          </Route>
        </Routes>

      )}
      <ToastContainer />

      {!isAdminPage && !<Footer /> && !isOtp }
    </>
  )
}

export default App