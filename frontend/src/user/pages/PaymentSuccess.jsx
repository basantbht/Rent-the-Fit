import React from "react";
import { useNavigate } from "react-router-dom";

// const PaymentSuccess = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//       <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
//       <p className="mt-2">Your order has been placed successfully.</p>
//       <button onClick={() => navigate("/orders")} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
//         View Orders
//       </button>
//     </div>
//   );
// };

// export default PaymentSuccess;

const PaymentSuccess = () => {
     const navigate = useNavigate();

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-full max-w-lg">
          <div className="flex justify-center mb-6">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/190/190411.png" 
              alt="Success Icon" 
              className="w-24 h-24"
            />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Payment Completed</h2>
          <p className="text-gray-600 mt-2">
            Thank you for purchasing via Khalti Payment Gateway! Your payment has been confirmed successfully.
          </p>
        </div>
        <button onClick={() => navigate("/orders")} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
         View Orders
       </button>
      </div>
    );
  };
  
  export default PaymentSuccess;
  
