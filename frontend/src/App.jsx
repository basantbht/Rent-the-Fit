import React, { useContext } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './user/pages/Home';
import Products from './user/pages/Products';
import About from './user/pages/About';
import Contact from './user/pages/Contact';
import Navbar from './user/components/Navbar';
import Login from './user/pages/Login';
import Signup from './user/pages/Signup';
import { ToastContainer } from 'react-toastify';
import OtpInput from './user/components/OtpInput';
import Profile from './user/pages/Profile';
import AdminLayout from './admin/pages/AdminLayout';
import AdminProducts from './admin/pages/AdminProducts';
import AddProducts from './admin/pages/AddProducts';
import Dashboard from './admin/pages/Dashboard';
import EditProduct from './admin/pages/EditProduct';
import Footer from './user/components/Footer';
import Product from './user/pages/Product';
import ScrollToTop from './user/components/ScrollTop';
import Cart from './user/pages/Cart';
import PlaceOrder from './user/pages/PlaceOrder';
import Orders from './user/pages/Orders';
import AdminOrders from './admin/pages/AdminOrders';
import Customers from './admin/pages/Customers';
import Settings from './admin/pages/Settings';
import Notifications from './admin/pages/Notifications';
import { RentContext } from '../context/RentContext';
import SearchBar from './user/components/SearchBar';
import PaymentSuccess from './user/pages/PaymentSuccess';
import PaymentFailed from './user/pages/PaymentFailed';
import ForgotPassword from './user/pages/ForgotPassword';
import ResetPassword from './user/pages/ResetPassword';

const App = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const paymentsuccess = location.pathname.startsWith('/payment-success');
  const isOtp = location.pathname.startsWith('/otp');
  const forgotpassword = location.pathname.startsWith('/forgotpassword');
  const resetpassword = location.pathname.startsWith('/reset-password');
  const { isVerified, isAdmin } = useContext(RentContext);

  return (
    <>
      <ScrollToTop />

      {!isAdminPage &&  !paymentsuccess && <Navbar /> }
      <SearchBar />

      {/* Apply div properties only for user routes, not admin */}
      {!isAdmin && (
  <div className={isAdminPage ? "" : "px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]"}>
          <Routes>
            {!isVerified ? (
              <>
                <Route path='/signup' element={<Signup />} />
                <Route path='/login' element={<Login />} />
                <Route path='/otp' element={<OtpInput />} />
                <Route path='/' element={<Home />} />
                <Route path='/products' element={<Products />} />
                <Route path='/forgotpassword' element={<ForgotPassword />} />
                <Route path='/reset-password/:token' element={<ResetPassword />} />
 
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

                <Route path='*' element={<Navigate to="/login" />} />
              </>
            ) : (
              <>
                {/* Redirect logged-in users away from login/signup/otp */}
                <Route path='/signup' element={<Navigate to="/" />} />
                <Route path='/login' element={<Navigate to="/" />} />
                <Route path='/otp' element={<Navigate to="/" />} />

                {!isAdmin && isVerified && (
                  <>
                    <Route path='/' element={<Home />} />
                    <Route path='/products' element={<Products />} />
                    <Route path='/product/:productId' element={<Product />} />
                    <Route path='/profile' element={<Profile />} />
                    <Route path='/cart' element={<Cart />} />
                    <Route path='/placeorder' element={<PlaceOrder />} />
                    <Route path='/orders' element={<Orders />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/contact' element={<Contact />} />
                    <Route path='/admin' element={<Navigate to="/" />} />

                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="/payment-failed" element={<PaymentFailed />} />

                  </>
                )}

                {isAdmin && isVerified && (
                  <>
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

                    <Route path='*' element={<Navigate to="/admin/dashboard" />} />
                  </>
                )}
              </>
            )}
          </Routes>
        </div>
      )}

      {/* Always render the Admin Layout with its own structure */}
      {isAdmin && (
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

          <Route path='*' element={<Navigate to="/admin/dashboard" />} />
        </Routes>
      )}

      <ToastContainer />
      {!isAdminPage && !isOtp && !paymentsuccess && !forgotpassword && !resetpassword && <Footer />}
    </>
  );
};

export default App;
