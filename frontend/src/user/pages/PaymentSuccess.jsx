import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center w-full max-w-lg">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <img
            src={assets.checked}
            alt="Success Icon"
            className="w-24 h-24 animate-bounce"
          />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-800">Payment Completed</h2>

        {/* Message */}
        <p className="text-gray-600 mt-3 text-lg">
          Thank you for purchasing via Khalti Payment Gateway! Your payment has been confirmed successfully.
        </p>

        {/* View Orders Button */}
        <button
          onClick={() => navigate("/orders")}
          className="mt-6 px-6 py-3 bg-purple-600 text-white text-lg font-medium rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
        >
          View Orders
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
