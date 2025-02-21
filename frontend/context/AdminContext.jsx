import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const currency = 'Rs.';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
    const [isVerified, setIsVerified] = useState(localStorage.getItem('isVerified') === 'true');
    const [userCount, setUserCount] = useState(0);
    const[users,setUsers] = useState([]);

    const getUsersCount = async () => {
        if(!token || !isAdmin){
            return;
        }
        try {
            const response = await axios.get(backendUrl + '/api/users/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    isAdmin,
                },
            });
            if (!response.data.error) {
                const verifiedUsers = response.data.message.filter(
                    (user) => user.isVerified === true
                );

                setUserCount(verifiedUsers.length);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const getAllUsers = async () => {
        if(!token || !isAdmin)return;
        
        try {
            const response = await axios.get(backendUrl + '/api/users/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    isAdmin,
                },
            });
            if (!response.data.error) {
                setUsers(response.data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setToken(localStorage.getItem('token'));
        setIsAdmin(localStorage.getItem('isAdmin'));
    }, []);

    useEffect(() => {
        if (token && isAdmin) {
            getUsersCount();
            getAllUsers();
        }
    }, [token, isAdmin]); 

    const value = { currency, delivery_fee, backendUrl, token, isAdmin,setToken,setIsAdmin,isVerified,setIsVerified, userCount ,users,getUsersCount};

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
