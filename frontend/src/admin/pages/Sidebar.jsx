import React, { useState } from "react";
import { BsCart3, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from "react-icons/bs";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);

  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    setShowProductsDropdown(!showProductsDropdown);
  };

  return (
    <aside className="w-64 h-full bg-gray-800 text-white p-5 fixed">
      <div className="text-xl font-bold flex items-center mb-5">
        <BsCart3 className="mr-2" /> RENT THE FIT
      </div>
      <ul className="space-y-4">
        <NavLink to='dashboard'>
        <li className="p-2 hover:bg-gray-700 rounded">Dashboard</li>
        </NavLink>
        
        {/* Products with Dropdown */}
        <li className="p-2 hover:bg-gray-700 rounded">
          <div className="flex gap-5">

          <NavLink to='adminproducts'>
          <button className="w-full text-left cursor-pointer">
            Products
          </button>
          </NavLink>

          <FontAwesomeIcon icon={faCaretDown} className=" mr-20 flex justify-center items-center mt-1 cursor-pointer" onClick={toggleDropdown}/>
          </div>
          {showProductsDropdown && (
            <ul className="pl-4 mt-2 space-y-2 bg-gray-600 rounded p-2">
              <NavLink to='addproducts'>
              <li className="p-2 hover:bg-gray-600 rounded">Add Product</li>

              </NavLink>
              <NavLink to='editproducts'>

              <li className="p-2 hover:bg-gray-600 rounded">Update Product</li>
              </NavLink>
            </ul>
          )}
        </li>

        <NavLink to='vieworders'>
        <li className="p-2 hover:bg-gray-700 rounded">Orders</li>
        </NavLink>
        
        <NavLink to='customers'>
        <li className="p-2 hover:bg-gray-700 rounded">Customers</li>
        </NavLink>


        {/* <NavLink to='settings'>
        <li className="p-2 hover:bg-gray-700 rounded">Settings</li>
        </NavLink> */}
      </ul>
    </aside>
  );
};

export default Sidebar;
