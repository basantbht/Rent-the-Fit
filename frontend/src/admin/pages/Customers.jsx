import React, { useContext } from 'react';
import { AdminContext } from '../../../context/AdminContext';

const Customers = () => {
    const { users } = useContext(AdminContext);

    return (
        <div className="p-6 bg-white min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Customer List</h1>
            <table className="min-w-full table-auto text-gray-800">
                <thead>
                    <tr className="bg-gray-800 text-gray-300">
                        <th className="px-4 py-2 border text-left">Username</th>
                        <th className="px-4 py-2 border text-left">Email</th>
                        <th className="px-4 py-2 border text-left">Admin</th>
                        <th className="px-4 py-2 border text-left">Verified</th>
                        <th className="px-4 py-2 border text-left">Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {users && users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-100">
                                <td className="px-4 py-2 border">{user.username}</td>
                                <td className="px-4 py-2 border">{user.email}</td>
                                <td className="px-4 py-2 border">
                                    <span className={user.isAdmin ? 'text-green-400' : 'text-red-400'}>
                                        {user.isAdmin ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td className="px-4 py-2 border">
                                    <span className={user.isVerified ? 'text-green-400' : 'text-red-400'}>
                                        {user.isVerified ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td className="px-4 py-2 border">{new Date(user.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="px-4 py-2 text-center text-gray-500 border">No users found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

    );
};

export default Customers;
