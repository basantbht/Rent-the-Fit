import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { toast } from 'react-toastify'
import axios from 'axios'
import { RentContext } from '../../../context/RentContext'
import { assets } from '../../assets/assets'

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const { navigate, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(RentContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    phone: '',
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value
    setFormData(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let orderItems = []
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items))
            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }
      
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      }

      console.log(orderItems)

      let khaltiData = {
        items: orderItems.map(item => ({
          itemId: item._id,
          quantity: item.quantity
        })),
        totalPrice: getCartAmount(),
        website_url: "http://localhost:5173/orders"
      };

      console.log(khaltiData);
      
      switch (method) {

        // api calls for cod
        case 'cod':
          const res = await axios.post('http://localhost:3000/api/order/place', orderData,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
          console.log(res)
          if (res.data.success) {
            setCartItems({})
            navigate('/orders')
          } else {
            toast.error(res.data.message)
          }
          break;
          //api call for khalti
          case 'khalti':
            console.log(method);
            console.log(khaltiData)
          const kres = await axios.post('http://localhost:3000/api/pay/', khaltiData,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
          console.log(kres);
          if(kres.data.success){
            window.location.href = kres.data.payment.payment_url;
            
            // navigate(kres.data.payment.payment_url);
            // const sres = await axios.get('http://localhost:3000/api/pay/complete-khalti-payment');
            // console.log(sres);
            // console.log("you can pay here")
            // navigate('/orders')
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* Left side */}

      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        {/* <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={FormData.firstName} className='border border-gray-500 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />

          <input required onChange={onChangeHandler} name='lastName' value={FormData.lastName} className='border border-gray-500 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
        </div>

        <input required onChange={onChangeHandler} name='email' value={FormData.email} className='border border-gray-500 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />

        <input required onChange={onChangeHandler} name='street' value={FormData.street} className='border border-gray-500 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />

        <div className='flex gap-3'>
          <input onChange={onChangeHandler} name='city' value={FormData.city} required className='border border-gray-500 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />

          <input required onChange={onChangeHandler} name='state' value={FormData.state} className='border border-gray-500 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
        </div>

        <div className='flex gap-3'>
          <input onChange={onChangeHandler} name='zipcode' value={FormData.zipcode} required className='border border-gray-500 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' />
        </div> */}

        <input required onChange={onChangeHandler} name='phone' value={FormData.phone} className='border border-gray-500 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />
      </div>

      {/* Right Side */}
      <div className='mt-8'>
        <div className='mt-8 min-w-96'>

          <CartTotal />

        </div>

        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />

          {/* Payment method selection */}
          <div className='flex gap-3 flex-xol lg:flex-row'>
            <div onClick={() => setMethod('khalti')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'khalti' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.khalti} alt="Khalti" />
            </div>

            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>

          </div>
        </div>

      </div>

    </form>
  )
}

export default PlaceOrder