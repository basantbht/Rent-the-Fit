import React, { useContext, useEffect, useState } from 'react'
import Title from './Title';
import { RentContext } from '../../../context/RentContext';
import ProductItem from '../components/ProductItem'
import Fuse from 'fuse.js'

const RelatedProducts = ({ category, currentProductId }) => {
  const { products } = useContext(RentContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let filteredProducts = products.filter(
        (product) => product.category === category && product._id !== currentProductId
      );

      const fuseOptions = {
        includeScore: true,
        threshold: 0.2,
        keys: ['name', 'category'],
      };

      const fuse = new Fuse(filteredProducts, fuseOptions);

      const result = fuse.search(category).map(result => result.item);

      setRelated(result.slice(0, 5));
    }
  }, [products, category, currentProductId]);

  return (
    <div className='my-24'>
      <div className='text-center text-3xl py-2'>
        <Title text1={'RELATED'} text2={'PRODUCTS'} />
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {related.map((item, index) => (
          <ProductItem key={index} id={item._id} name={item.name} price={item.price} image={item.image} />
        ))}
      </div>
    </div>
  );
}

export default RelatedProducts;
