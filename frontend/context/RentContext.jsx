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

  const getProductsData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/product/');
      console.log(response);
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

  useEffect(() => {
    getProductsData();
  }, []);



  const value = { currency, delivery_fee, backendUrl, token, setToken, isAdmin, setIsAdmin, navigate }

  return (
    <RentContext.Provider value={value}>
      {props.children}
    </RentContext.Provider>
  )
}

export default RentContextProvider;