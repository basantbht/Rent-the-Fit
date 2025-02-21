import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-red-600">Payment Failed!</h1>
      <p className="mt-2">Something went wrong. Please try again.</p>
      <button onClick={() => navigate("/checkout")} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
        Try Again
      </button>
    </div>
  );
};

export default PaymentFailed;
