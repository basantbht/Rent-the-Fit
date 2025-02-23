import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Coupons = () => {
  const [discountPer, setDiscountPer] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [generatedCoupon, setGeneratedCoupon] = useState(null);
  const token = localStorage.getItem("token");

  const handleGenerateCoupon = async (e) => {
    e.preventDefault();

    if (!discountPer || !expirationDate) {
      toast.error("All fields are required");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/coupon",
        {
          code: `COUPON${Math.floor(100000 + Math.random() * 900000)}`, 
          discountPer,
          expirationDate,
          
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res)

      if (res.data.error === false) {
        setGeneratedCoupon(res.data.coupon.code);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.data.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Generate Coupon</h2>
      <form onSubmit={handleGenerateCoupon} className="space-y-4">
        <div>
          <label className="block text-gray-700">Discount Percentage (%)</label>
          <input
            type="number"
            min="1"
            max="100"
            value={discountPer}
            onChange={(e) => setDiscountPer(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-gray-300"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Expiration Date</label>
          <input
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-gray-300"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition"
        >
          Generate Coupon
        </button>
      </form>

      {generatedCoupon && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg text-center">
          <p className="font-semibold">Generated Coupon:</p>
          <p className="text-lg font-bold">{generatedCoupon}</p>
        </div>
      )}
    </div>
  );
};

export default Coupons;
