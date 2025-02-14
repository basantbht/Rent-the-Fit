import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const currency = 'Rs.';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [token, setToken] = useState('');
    const [isAdmin, setIsAdmin] = useState('');
    const [userCount, setUserCount] = useState(0);
    const[users,setUsers] = useState([]);

    const getUsersCount = async () => {
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

    const value = { currency, delivery_fee, backendUrl, token, isAdmin, userCount ,users};

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
