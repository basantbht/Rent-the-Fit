import React from 'react'
import { BsFillBellFill } from 'react-icons/bs'

const AdminHeader = () => {
  return (
    <header className="w-full bg-gray-900 text-white p-4 flex justify-end pr-10 shadow-md custom-bg">
      <p>Welcome to Admin Dashboard</p>
      <BsFillBellFill className="mx-3 text-lg" />
    </header>
  )
}

export default AdminHeader