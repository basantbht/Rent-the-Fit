import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'
import { BrowserRouter } from 'react-router-dom'
import RentContextProvider from '../context/RentContext.jsx'
import AdminContextProvider from '../context/AdminContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <RentContextProvider>
    <AdminContextProvider>
 
    <App />

    </AdminContextProvider>
    </RentContextProvider>
  </BrowserRouter>
)
