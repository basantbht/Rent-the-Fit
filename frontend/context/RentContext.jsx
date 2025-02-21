import { createContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

export const RentContext = createContext();

const RentContextProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isVerified, setIsVerified] = useState(localStorage.getItem('isVerified') === 'true');
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');

  const currency = 'Rs.';
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [userDetails, setUserDetails] = useState(() => {
    const storedUser = localStorage.getItem("userDetails");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const addToCart = async (productId, size) => {

    if (!token) {
      alert('login first');
      return;
    }

    if (!size) {
      toast.error('Select Product Size');
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[productId]) {
      if (cartData[productId][size]) {
        cartData[productId][size] += 1;
      }
      else {
        cartData[productId][size] = 1;
      }
    }
    else {
      cartData[productId] = {};
      cartData[productId][size] = 1;
    }
    setCartItems(cartData);
    console.log(cartData);

    if (token) {
      try {
        const res = await axios.post('http://localhost:3000/api/cart/', { productId, size },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message)

      }
    }
  }

  const getProductsData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/product/');
      if (response.data.error === false) {
        setProducts(response.data.allProduct);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {

        }
      }
    }
    return totalCount;
  }

  const updateQuantity = async (productId, size, quantity) => {

    let cartData = structuredClone(cartItems);
    cartData[productId][size] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        const res = await axios.put('http://localhost:3000/api/cart/', { productId, size, quantity },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          })
        console.log(res);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message)

      }
    }
  }

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item]
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
    return totalAmount;
  }

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (userDetails) {
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
    }
  }, [userDetails]);

  useEffect(() => {
    setIsVerified(localStorage.getItem('isVerified') === 'true');
    setIsAdmin(localStorage.getItem('isAdmin') === 'true');
  }, [token]); 



  const value = { currency, search, setSearch, showSearch, setShowSearch, delivery_fee, backendUrl, token, setToken, isAdmin, setIsAdmin, isVerified, setIsVerified, navigate, products, setProducts, addToCart, getCartCount, updateQuantity, cartItems, setCartItems, getCartAmount, setUserDetails, userDetails,}

  return (
    <RentContext.Provider value={value}>
      {props.children}
    </RentContext.Provider>
  )
}

export default RentContextProvider;