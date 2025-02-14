import React, { useContext } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox } from '@fortawesome/free-solid-svg-icons'
import { AdminContext } from '../../../context/AdminContext'

const AdminOrders = () => {
  const { backendUrl, currency, token, isAdmin } = useContext(AdminContext);
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }
    try {
      const response = await axios.get(backendUrl + "/api/order/list",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            isAdmin
          }
        })
        console.log(response)
      if (response.data.error === false) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.response.data.message)
      console.log(error)
    }
  }

  const statusHandler = async (e, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', { orderId, status: e.target.value }, {
        headers: {
          Authorization: `Bearer ${token}`,
          isAdmin
        }
      })
console.log(response);

      if (response.data.error === false) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(response.data.message)
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token])

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Order Pages</h3>
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-4 items-start border border-gray-300 rounded-lg bg-white p-6 shadow-md"
          >
            {/* Order Icon */}
            <FontAwesomeIcon className="w-14 text-gray-600" icon={faBox} />
  
            {/* Order Items & Customer Info */}
            <div>
              {order.items.map((item, index) => (
                <p key={index} className="py-0.5 text-gray-700">
                  {item.name} x {item.quantity} <span className="text-gray-500">{item.size}</span>
                </p>
              ))}
              <p className="mt-3 mb-2 font-medium text-lg text-gray-800">
                {order.address.firstName} {order.address.lastName}
              </p>
              <p className="text-gray-600">{order.address.street}, {order.address.city}, {order.address.state}, {order.address.zipcode}</p>
              <p className="text-gray-700 font-medium">{order.address.phone}</p>
            </div>
  
            {/* Order Details */}
            <div>
              <p className="text-base font-semibold text-gray-800">Items: {order.items.length}</p>
              <p className="mt-2 text-gray-600">Method: {order.paymentMethod}</p>
              <p className={`font-semibold ${order.payment ? 'text-green-600' : 'text-red-500'}`}>
                Payment: {order.payment ? 'Done' : 'Pending'}
              </p>
              <p className="text-gray-700">Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
  
            {/* Order Amount */}
            <p className="text-lg font-semibold text-gray-900">
              {currency}{order.amount}
            </p>
  
            {/* Order Status Dropdown */}
            <select
              onChange={(e) => statusHandler(e, order._id)}
              value={order.status}
              className="p-2 font-semibold border border-gray-400 rounded-md bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}  

export default AdminOrders