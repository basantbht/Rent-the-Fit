import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RelatedProducts from '../components/RelatedProducts';
import { RentContext } from '../../../context/RentContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // Import the icons

const Product = () => {
  const { backendUrl, token, userId } = useContext(RentContext); // Added userId from context
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(RentContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 1, comment: '' });
  const [activeTab, setActiveTab] = useState('description');
  const [likes, setLikes] = useState(0); // Track the number of likes
  const [isLiked, setIsLiked] = useState(false); // Track the like status

  const fetchProductData = async () => {
    setReviews([]);

    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image);
      setLikes(product.likes.length); // Set initial like count
      // Check if the current user has already liked the product
      setIsLiked(product.likes.some(like => like.user.toString() === userId.toString())); // Use `userId` from context

      try {
        const response = await axios.get(`${backendUrl}/api/product/${productId}/reviews`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.data.error) {
          setReviews(response.data.reviews);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleLikeToggle = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/like/${productId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (!response.data.error) {
        toast.success(response.data.message);
  
        // Correct state update to ensure likes count is accurate
        setIsLiked(!isLiked); 
        setLikes(isLiked ? likes - 1 : likes + 1);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };
  

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!newReview.comment) {
      toast.error('Please write a review.');
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/product/${productId}/reviews`,
        { ...newReview, productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data.error) {
        const addedReview = response.data.message;
        setReviews((prevReviews) => [...prevReviews, addedReview]);
        setNewReview({ rating: 1, comment: '' });

        toast.success('Review submitted successfully!');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products, userId]);  // Adding `userId` as a dependency

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100 px-4 md:px-10">
      {/* Product Data */}
      <div className="flex flex-col sm:flex-row gap-12">
        {/* Product Images */}
        <div className="flex-1 flex flex-col items-center">
          <img className="w-full max-w-[400px] sm:max-w-[500px] rounded-lg shadow-lg" src={image} alt="" />
          <p className="mt-4 text-lg font-semibold text-red-500">{`Remaining: ${productData.quantity === 0 ? "Out of stock" : productData.quantity}`}</p>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="font-semibold text-2xl">{productData.name}</h1>
          <p className="mt-5 text-3xl font-bold">{currency}{productData.price}</p>
          <p className="mt-5 text-gray-600 md:w-4/5">{productData.description}</p>

          {/* Love Icon and Likes Count */}
          <div className="flex items-center mt-5 gap-3">
            <div
              onClick={handleLikeToggle}
              className={`cursor-pointer text-2xl ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
            >
              {isLiked ? <FaHeart /> : <FaRegHeart />}
            </div>
            <p className="text-gray-600">{likes} {likes === 1 ? 'Like' : 'Likes'}</p>
          </div>

          <div className="flex flex-col gap-4 my-8">
            <p className="font-medium text-lg">Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 rounded-lg transition-all ${item === size ? 'border-orange-500 bg-orange-100' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => addToCart(productData._id, size, productData.quantity)}
            className="bg-black text-white px-10 py-4 text-sm rounded-lg shadow-md hover:bg-gray-800 transition-all"
          >
            ADD TO CART
          </button>

          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-600 mt-5 flex flex-col gap-1">
            <p>✅ Original Product</p>
            <p>💰 Cash on Delivery Available</p>
          </div>
        </div>
      </div>

      {/* Description and Review Section */}
      <div className="mt-20">
        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            className={`px-5 py-3 text-sm border-r ${activeTab === 'description' ? 'font-bold text-orange-500 border-b-2 border-orange-500' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button
            className={`px-5 py-3 text-sm ${activeTab === 'reviews' ? 'font-bold text-orange-500 border-b-2 border-orange-500' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({reviews.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="border px-6 py-6 text-sm text-gray-600">
          {activeTab === 'description' && (
            <div>
              <h3 className="text-lg font-medium mb-3">Product Details</h3>
              <p>{productData.description}</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3 className="text-lg font-medium mb-3">Customer Reviews</h3>
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
                    <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Review Submission Form */}
        {activeTab === 'reviews' && (
          <div className="mt-8">
            <h2 className="text-xl font-medium">Write a Review</h2>
            <form onSubmit={submitReview} className="mt-4">
              <select
                name="rating"
                value={newReview.rating}
                onChange={handleReviewChange}
                className="border p-2 rounded-md"
                required
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} Star{rating > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
              <textarea
                name="comment"
                value={newReview.comment}
                onChange={handleReviewChange}
                placeholder="Your Review"
                className="border p-2 rounded-md w-full mt-4"
                required
              />
              <button type="submit" className="bg-black text-white py-2 px-6 mt-4 rounded-md shadow-md hover:bg-gray-800 transition-all">
                Submit Review
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Related Products */}
      <div className="mt-20">
        <RelatedProducts />
      </div>
    </div>
  ) : (
    <div className="h-screen flex justify-center items-center">Loading...</div>
  );
};

export default Product;
