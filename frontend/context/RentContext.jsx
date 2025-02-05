import { createContext } from 'react'

export const RentContext = createContext();

const RentContextProvider = (props) => {
  const currency = 'Rs.';
  const delivery_fee = 10;
  const backendUrl = import.meta.env.BACKEND_URL

  const value = {backendUrl}

  return(
    <RentContext.Provider value={value}>
      {props.children}
    </RentContext.Provider>
  )
}

export default RentContextProvider;