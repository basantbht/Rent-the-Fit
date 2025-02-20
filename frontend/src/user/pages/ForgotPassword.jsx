import React, { useState } from 'react'
import { ArrowLeft } from "lucide-react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({});

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(formData)
    
    try {
      const response = await axios.post('http://localhost:3000/api/users/forget-password',formData);
      console.log(response);

      if(!response.data.error){
        alert(response.data.message);
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md mb-40">
        <h2 className="text-2xl font-bold text-gray-900">Reset Your Password</h2>
        <p className="mt-2 text-sm text-gray-600">
          Please provide the email address you use to sign in. If we find an associated account, we will send you instructions to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Email address</label>
          <input
            type="email"
            name='email'
            className="mt-1 block w-full rounded-lg border border-gray-300 p-2 focus:border-gray-500 focus:ring focus:ring-indigo-200"
            placeholder="Enter your email"
            onChange={onChange}
            required
          />


            <div className="mt-4 flex items-center justify-between">
          <Link to='/login'>
              <button
                type="button"
                className="flex items-center text-sm text-gray-600 hover:underline"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </button>
          </Link>


          <button
            type="submit"
            className="rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            Send reset instructions
          </button>
      </div>
    </form>
      </div >
    </div >
  );
}

export default ForgotPassword