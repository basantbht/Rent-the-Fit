import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Home from './user/pages/Home'
import Products from './user/pages/Products'
import About from './user/pages/About'
import Contact from './user/pages/Contact'
import Navbar from './user/components/Navbar'
import Login from './user/pages/Login'
import Signup from './user/pages/Signup'

const App = () => {
  return (
    <div>
      <Navbar />

    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/products' element={<Products />} />
      <Route path='/about' element={<About />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
    </Routes>

    </div>
  )
}

export default App