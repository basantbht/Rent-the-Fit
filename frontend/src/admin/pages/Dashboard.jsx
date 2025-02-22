import React, { useContext, useDebugValue, useEffect } from 'react';
import { AdminContext } from '../../../context/AdminContext';
import { Link, useNavigate } from 'react-router-dom';
import { RentContext } from '../../../context/RentContext';

const Dashboard = () => {
  const { userCount ,getUsersCount,token} = useContext(AdminContext);
  const { getTotalProductsCount } = useContext(RentContext);
  const navigate = useNavigate();

  const redirectToCustomers = () => {
    navigate('/admin/customers');
  };

  useEffect(()=> {
    getUsersCount();
  },[getUsersCount])

  return (
    <main className="ml-10 p-6 max-w-full overflow-hidden">
      <h1 className="text-3xl font-bold mb-5 text-white">Dashboard</h1>
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-green-500 p-5 rounded text-white">
          {/* <Link to='customers'> */}
            <h3 className="text-lg cursor-pointer" onClick={redirectToCustomers} >CUSTOMERS</h3>
          {/* </Link> */}
          <h1 className="text-2xl font-bold">{userCount}</h1>
        </div>
        <div className="bg-blue-500 p-5 rounded text-white">
          <h3 className="text-lg">PRODUCTS</h3>
          <h1 className="text-2xl font-bold">{getTotalProductsCount()}</h1>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
