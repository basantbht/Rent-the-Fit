import React, { useState } from 'react';
import Sidebar from './Sidebar';
import AdminHeader from '../components/AdminHeader';
import { Link, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const [formData, setFormData] = useState({});

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r flex justify-center items-center bg-gray-200">
      <form
        onSubmit={submitHandler}
        className="p-8 rounded-xl shadow-2xl w-full max-w-md space-y-6 bg-white"
      >
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


 // <div className="flex h-screen overflow-x-hidden bg-gray-700">
    //   <Sidebar />
    //   <div className="ml-64 w-full overflow-x-hidden">
    //     <AdminHeader />
    //     <Outlet />
    //   </div>
    // </div>
  );
};

export default AdminLayout;
