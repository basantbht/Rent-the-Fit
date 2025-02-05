import React, { useState } from 'react';
import Sidebar from './Sidebar';
import AdminHeader from '../components/AdminHeader';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Cookies from "js-cookie";

const AdminLayout = () => {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  console.log(formData);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3000/api/users/login', formData);

      console.log(res);

      const { token, message, error, isAdmin } = res.data;

      console.log(isAdmin);
      if (res.data.error === false) {
        localStorage.setItem('token', token)
        localStorage.setItem('isAdmin', isAdmin)
        Cookies.set("token", token, { expires: 5, path: "/" });
        toast.success(res.data.message)
        navigate('dashboard');
      }

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      { localStorage.getItem('isAdmin') === 'true'?

        <>
          <div className="flex h-screen overflow-x-hidden bg-gray-700">
            <Sidebar />
            <div className="ml-64 w-full overflow-x-hidden">
              <AdminHeader />
              <Outlet />
            </div>
          </div>
          </> : (
          <div className="min-h-screen bg-gradient-to-r flex justify-center items-center bg-gray-200">
            <form
              onSubmit={submitHandler}
              className="p-8 rounded-xl shadow-2xl w-full max-w-md space-y-6 bg-white">

              <div className="text-center">
                <h1 className="text-3xl font-semibold">Admin Login</h1>
                <div className="mt-2 h-1 w-16mx-auto rounded"></div>
              </div>

              {/* Email Input */}
              <input
                onChange={onChange}
                name="email"
                type="email"
                className="w-full px-4 py-3 border border-gray-700 rounded-lg shadow-sm "
                placeholder="Email"
                required
              />

              {/* Password Input */}
              <input
                onChange={onChange}
                name="password"
                type="password"
                className="w-full px-4 py-3 border border-gray-700 rounded-lg shadow-sm"
                placeholder="Password"
                required
              />

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full cursor-pointer py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700 transition duration-300"
              >
                Login
              </button>
            </form>
          </div>
        )
      }
      </>
      );
};

      export default AdminLayout;
