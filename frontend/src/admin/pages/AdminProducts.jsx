import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { RentContext } from '../../../context/RentContext';

const AdminProducts = () => {
  const { currency } = useContext(RentContext);
  const [token, setToken] = useState('');
  const [isAdmin, setIsAdmin] = useState('');
  const [list, setList] = useState([]);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setIsAdmin(localStorage.getItem('isAdmin'));
  });

  const fetchList = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/product/', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          isAdmin,
        }
      });

      console.log(response);

      if (response.data.error === false) {
        setList(response.data.allProduct);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token && isAdmin) {
      fetchList();
    }
  }, [token, isAdmin]);

  const removeProduct = async (id) => {
    // Functionality remains unchanged
  };

  return (
    <div className='p-6 bg-gradient-to-r from-gray-100 to-gray-200 min-h-screen rounded-lg shadow-md'>
      <p className='mb-6 text-2xl font-extrabold text-gray-900 text-center'>All Product List</p>
      
      <div className='flex flex-col gap-4'>

        {/* Table Header */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-3 px-6 border border-gray-300 bg-gray-800 text-white text-sm font-semibold rounded-lg shadow-lg'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Quantity</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {/* Product List */}
        {list.map((item, index) => (
          <div
            className={`grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-4 py-3 px-6 border border-gray-200 text-sm rounded-lg shadow-md transition duration-200 
            ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-200 hover:shadow-lg`}
            key={index}
          >
            <img className='w-16 h-16 object-cover rounded-lg border border-gray-400' src={item.image} alt="" />
            <p className='text-gray-900 font-semibold'>{item.name}</p>
            <p className='text-gray-700'>{item.category}</p>
            <p className='text-gray-700'>{item.quantity}</p>
            <p className='text-gray-900 font-bold'>{currency}{item.price}</p>
            <p
              onClick={() => removeProduct(item._id)}
              className='text-center cursor-pointe text-lg font-bold text-red-900 px-3 py-1 rounded-lg transition duration-200'
            >
              X
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
