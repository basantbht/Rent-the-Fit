import { createContext, useEffect, useState } from 'react'

export const AdminContext = createContext();

const AdminContextProvider = (props) => {

    const currency = 'Rs.';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.BACKEND_URL
    const [token, setToken] = useState('');
    const [isAdmin, setIsAdmin] = useState('');

    
    useEffect(() => {
        setToken(localStorage.getItem('token'));
        setIsAdmin(localStorage.getItem('isAdmin'));
      },[])

    const value = { currency, delivery_fee, backendUrl , token, isAdmin}

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}
export default AdminContextProvider;