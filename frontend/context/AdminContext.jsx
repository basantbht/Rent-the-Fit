import { faInfinity } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { createContext, useEffect, useState } from 'react'

export const AdminContext = createContext();

const AdminContextProvider = (props) => {

    const currency = 'Rs.';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [token, setToken] = useState('');
    const [isAdmin, setIsAdmin] = useState('');
    const [userCount,setUserCount] = useState()

    const getUsersCount = async () => {
        if(!token){
            return "no token"
        }
        try {
            const response = await axios.get(backendUrl + '/api/users/',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        isAdmin
                    }
                }
            )
            if(!response.data.error){
                setUserCount(response.data.message.length);
            
            }
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        setToken(localStorage.getItem('token'));
        setIsAdmin(localStorage.getItem('isAdmin'));
    }, [])

    useEffect(() => {
        if(token && isAdmin){
            getUsersCount();
        }
       
    },[token,isAdmin])

    const value = { currency, delivery_fee, backendUrl, token, isAdmin, userCount }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}
export default AdminContextProvider;