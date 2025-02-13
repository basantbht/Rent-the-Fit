import { createContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

export const RentContext = createContext();

const RentContextProvider = (props) => {
  const currency = 'Rs.';
  const delivery_fee = 10;
  const backendUrl = import.meta.env.BACKEND_URL
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState('');
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});

  const addToCart = async (productId, size) => {

    if (!size) {
      toast.error("Select product size");
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
    console.log(cartItems);
    console.log(token)
    if (token) {
      try {
        const res = await axios.post('http://localhost:3000/api/cart/', { productId, size },
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

  const getProductsData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/product/');
      console.log(response);
      if (response.data.error === false) {
        setProducts(response.data.allProduct);
        console.log(response.data.allProduct);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };


  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'))
      // getUserCart(localStorage.getItem('token'))
    }
  }, [])

  useEffect(()=> {
    console.log(cartItems)
  })

  const value = { currency, search, setSearch, showSearch, setShowSearch, delivery_fee, backendUrl, token, setToken, isAdmin, setIsAdmin, navigate, products, addToCart }

  return (
    <RentContext.Provider value={value}>
      {props.children}
    </RentContext.Provider>
  )
}

export default RentContextProvider;