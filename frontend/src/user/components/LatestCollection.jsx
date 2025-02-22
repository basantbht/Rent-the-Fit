import React, { useContext, useEffect, useState } from 'react'
import Title from './Title';
import ProductItem from './ProductItem';
import { RentContext } from '../../../context/RentContext';

const LatestCollection = () => {
  const { products } = useContext(RentContext);
  const [latestProducts,setLastestProducts] = useState([]);

  useEffect(()=>{
    setLastestProducts(products.slice(0,5));
  },[products])


  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'LATEST'} text2={'COLLECTION'}/>
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
        🌟 Stay Ahead of Trends with Our Newest Arrivals! 🌟

</p>
      </div>

      {/* Render products */}

      <div className='grid grid-cols-2 sm:grid-col-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {
          latestProducts.map((item,index)=>(
            <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
          ))
        }
      </div>
    </div>
  )
}

export default LatestCollection