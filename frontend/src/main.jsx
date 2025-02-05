import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import RentContextProvider from '../context/RentContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <RentContextProvider>
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
    <App />
    </PersistGate>
    </Provider>
    </RentContextProvider>
  </BrowserRouter>
)
