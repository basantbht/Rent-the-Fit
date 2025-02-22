import React, { useContext, useEffect, useState } from 'react';
import Title from '../components/Title';
import axios from 'axios';
import { RentContext } from '../../../context/RentContext';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(RentContext);
  const [orderData, setOrderData] = useState([]);

  // Fetch both COD and Khalti orders
  const loadOrders = async () => {
    if (!token) return;
  
    try {
      const [userOrdersRes, khaltiOrdersRes] = await Promise.all([
        axios.post(`${backendUrl}/api/order/userorders`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${backendUrl}/api/order/khaltiorders`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
  
      let allOrderItems = [];
  
console.log(userOrdersRes.data)
      if (!userOrdersRes.data.error) {
        userOrdersRes.data.orders.forEach(order => {
          order.items.forEach(item => {
            allOrderItems.push({
              _id: order._id,
              name: item.name,
              image: item.image,
              price: item.price*item.quantity,
              quantity: item.quantity,
              size: item.size || "N/A",
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: new Date(order.date).toDateString(),
              startdate: new Date(order.startdate).toDateString(),
              enddate: new Date(order.enddate).toDateString()
            });
          });
        });
      }
  
      // Process Khalti Orders (using itemsdata)
      if (!khaltiOrdersRes.data.error) {
        khaltiOrdersRes.data.orders.forEach(order => {
          order.itemsdata.forEach(item => {
            allOrderItems.push({
              _id: order._id,
              name: item.name,
              image: item.image,
              price: (order.totalPrice)/100-10,
              quantity: order.quantity,
              size: item.size,
              status: order.status,
              payment: true,
              paymentMethod: "khalti",
              date: new Date(order.purchaseDate).toDateString(),
              startdate: new Date(order.startdate).toDateString(),
              enddate: new Date(order.enddate).toDateString()
            });
          });
        });
      }
  
      setOrderData(allOrderItems.reverse());
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  

  useEffect(() => {
    if (token) {
      loadOrders();
    }
  }, [token]);

  return (
    <div className='border-t pt-16'>
    <div className='text-2xl'>
      <Title text1={'MY'} text2={'ORDERS'} />
    </div>
  
    <div>
      {orderData.length > 0 ? (
        orderData.map((item, index) => (
          <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div className='flex items-start gap-6 text-sm'>
              <img className='w-16 sm:w-20' src={item.image} alt={item.name} />
              <div>
                <p className='sm:text-base font-medium'>{item.name}</p>
                <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                  <p>{currency}{item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Size: {item.size}</p>
                </div>
                <p className='mt-1'>Date: <span className='text-gray-400'>{item.date}</span></p>
                <p className='mt-1'>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>
                <p className='mt-1'>Start Date: <span className='text-gray-400'>{item.startdate}</span></p>
                <p className='mt-1'>End Date: <span className='text-gray-400'>{item.enddate}</span></p>
              </div>
            </div>
            <div className='md:w-1/2 flex justify-between'>
              <div className='flex items-center gap-2'>
                <p className={`min-w-2 h-2 rounded-full ${item.status === "Completed" ? "bg-green-500" : "bg-yellow-500"}`}></p>
                <p className='text-sm md:text-base'>{item.status}</p>
              </div>
              <button onClick={loadOrders} className='border px-4 py-2 text-sm font-medium rounded'>Track Order</button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No orders found.</p>
      )}
    </div>
  </div>
  

  );
};

export default Orders;
