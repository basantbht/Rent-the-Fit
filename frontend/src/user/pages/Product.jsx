import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import RelatedProducts from '../components/RelatedProducts';
import { RentContext } from '../../../context/RentContext';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Product = () => {
  const { backendUrl, token } = useContext(RentContext);
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(RentContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')
  const [reviews, setReviews] = useState([]); // State to store reviews
  const [newReview, setNewReview] = useState({
    rating: 1,
    comment: '',
  });


  const fetchProductData = async () => {
    setReviews([]); // Reset reviews to prevent stale data

    const product = products.find(item => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image);

      try {
        const response = await axios.get(`${backendUrl}/api/product/${productId}/reviews`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log(response)
        if (!response.data.error) {
          setReviews(response.data.reviews);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };


  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!newReview.comment) {
      toast.error("Please write a review.");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/product/${productId}/reviews`, newReview, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.data.error) {
        const addedReview = response.data.message; // The new review from backend

        // Update only the current product's review list
        setReviews(prevReviews => [...prevReviews, addedReview]);
        setNewReview({ rating: 1, comment: '' }); // Reset form

        toast.success("Review submitted successfully!");
      } else {
        console.log(response.data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    fetchProductData();
  }, [productId]);

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* Product Data */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* Product Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='w-full sm:w-[70%] ml-40'>
            <img className='w-full h-auto' src={image} alt="" />
          </div>
        </div>

        {/* Product Info */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className='pl-2'>(122)</p>
          </div>

          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>

          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>

          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {productData.sizes.map((item, index) => (
                <button onClick={() => setSize(item)} className={`border py-2 px-4 bg-gray-200 ${item === size ? 'border-orange-500' : ''}`} key={index}> {item} </button>
              ))}
            </div>
          </div>

          <button onClick={() => addToCart(productData._id, size)} className='bg-black text-white px-10 py-4 text-sm active:bg-gray-700'>ADD TO CART</button>
          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>Original Product</p>
            <p>Cash on delivery available</p>
            <p>Easy return and exchange policies</p>
          </div>
        </div>
      </div>

      {/* Description and Review Section */}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm'>Reviews({reviews ? reviews.length : 0})</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          {/* Display existing reviews */}

          {reviews.length === 0 ? (
            <p>No reviews yet. Be the first to write a review!</p>
          ) : (
            reviews.map((review, index) => (
              <div key={index} className="border-b py-3">
                <p className="font-medium">{review.name}</p>
                <p className="text-yellow-500">
                  {Array(review.rating).fill('⭐').join('')} ({review.rating} Stars)
                </p>
                <p>{review.comment}</p>
                <p className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}


        </div>

        {/* Review Submission Form */}
        <div className='mt-8'>
          <h2 className='text-xl font-medium'>Write a Review</h2>
          <form onSubmit={submitReview} className='mt-4'>
            <div className='flex gap-4'>

              <select
                name="rating"
                value={newReview.rating}
                onChange={handleReviewChange}
                className="border p-2 rounded"
                required
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <textarea
              name="comment"
              value={newReview.comment}
              onChange={handleReviewChange}
              placeholder="Your Review"
              className="border p-2 rounded w-full mt-4"
              required
            />
            <button type="submit" className="bg-black text-white py-2 px-6 mt-4 rounded">Submit Review</button>
          </form>
        </div>
      </div>

      {/* Show Related Products */}
      <RelatedProducts category={productData.category} />
    </div>
  ) : <div className='opacity-0'></div>;
};

export default Product;
