import React from 'react'

const Dashboard = () => {

  return (
    <main className="ml-10 p-6 max-w-full overflow-hidden ">
    <h1 className="text-3xl font-bold mb-5">Dashboard</h1>
    <div className="grid grid-cols-4 gap-6">
    <div className="bg-green-500 p-5 rounded text-white">
        <h3 className="text-lg">CUSTOMERS</h3>
        <h1 className="text-2xl font-bold">33</h1>
      </div>
      <div className="bg-blue-500 p-5 rounded text-white">
        <h3 className="text-lg">PRODUCTS</h3>
        <h1 className="text-2xl font-bold">300</h1>
      </div>
      {/* <div className="bg-orange-500 p-5 rounded text-white">
        <h3 className="text-lg">CATEGORIES</h3>
        <h1 className="text-2xl font-bold">12</h1>
      </div> */}
      
      {/* <div className="bg-red-500 p-5 rounded text-white">
        <h3 className="text-lg">ALERTS</h3>
        <h1 className="text-2xl font-bold">42</h1>
      </div> */}
    </div>
  </main>
  )
}

export default Dashboard