import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import upload_area from '../../assets/upload_area.png'
import { AdminContext } from '../../../context/AdminContext'

const AddProducts = () => {
  const {backendUrl, token, isAdmin} = useContext(AdminContext);
  
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [brand, setBrand] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("Men");
  const [description, setDescription] = useState("");
  // const [reviews, setReviews] = useState(null);
  // const [ratings, setRatings] = useState('');
  const [sizes, setSizes] = useState([]);
  const [bestseller, setBestSeller] = useState(false);
  const [price, setPrice] = useState("");
  const [countinstock, setCountInStock] = useState("");


  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("name", name)
      formData.append("image", image)
      formData.append("brand", brand)
      formData.append("quantity", quantity)
      formData.append("category", category)
      formData.append("description", description)
      // formData.append("reviews", reviews)
      // formData.append("ratings", ratings)
      formData.append("sizes", JSON.stringify(sizes))
      formData.append("bestseller", bestseller)
      formData.append("price", price)

      const response = await axios.post('http://localhost:3000/api/product/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          isAdmin,
        }

      })

      if (response.data.error === false) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setBrand('')
        setImage(false)
        setPrice('')
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-4 p-6 bg-white shadow-md rounded-lg'>
      <div>
        <p className='mb-2 font-medium'>Upload Image</p>
        <label htmlFor='image4' className='cursor-pointer'>
          <img className='w-24 h-24 object-cover rounded-md border' src={!image ? upload_area : URL.createObjectURL(image)} alt='' />
          <input onChange={(e) => setImage(e.target.files[0])} type='file' id='image4' hidden />
        </label>
      </div>

      <div className='w-full'>
        <p className='mb-2 font-medium'>Product Name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-md px-4 py-2 border rounded-md' type='text' placeholder='Type here' required />
      </div>

      <div className='w-full'>
        <p className='mb-2 font-medium'>Product Brand</p>
        <input onChange={(e) => setBrand(e.target.value)} value={brand} className='w-full max-w-md px-4 py-2 border rounded-md' type='text' placeholder='Type here' required />
      </div>

      <div className='w-full'>
        <p className='mb-2 font-medium'>Product Description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-md px-4 py-2 border rounded-md' placeholder='Write content here' required />
      </div>

      <div className='flex flex-col sm:flex-row gap-4 w-full'>
        <div>
          <p className='mb-2 font-medium'>Product Category</p>
          <select onChange={(e) => setCategory(e.target.value)} className='px-4 py-2 border rounded-md'>
            <option value='Men'>Men</option>
            <option value='Women'>Women</option>
            <option value='Kids'>Kids</option>
          </select>
        </div>

        <div>
          <p className='mb-2 font-medium'>Product Price</p>
          <input onChange={(e) => setPrice(e.target.value)} className='px-4 py-2 border rounded-md' type='number' placeholder='25' />
        </div>

        <div>
          <p className='mb-2 font-medium'>Product Quantity</p>
          <input onChange={(e) => setQuantity(e.target.value)} className='px-4 py-2 border rounded-md' type='number' placeholder='5' />
        </div>
      </div>

      <div className='mb-2'>
        <p className='font-medium'>Product Sizes</p>
        <div className='flex gap-3'>
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div key={size} onClick={() => setSizes((prev) => prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size])}>
              <p className={`${sizes.includes(size) ? 'bg-pink-300 text-white' : 'bg-gray-200'} px-4 py-2 rounded-md cursor-pointer transition duration-300`}>{size}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='flex gap-2 mt-2'>
        <input onChange={() => setBestSeller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' />
        <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
      </div>

      <button type='submit' className='w-28 mt-4 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition duration-300'>ADD</button>
    </form>
  );
};

export default AddProducts;
