import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { RentContext } from "../../../context/RentContext";

const KycForm = () => {
  const { userDetails, token } = useContext(RentContext);

  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    otp: "",
    citizenshipPhotoFront: null,
    citizenshipPhotoBack: null,
  });

  const [previewFront, setPreviewFront] = useState(null);
  const [previewBack, setPreviewBack] = useState(null);
  const [otpSent, setOtpSent] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle File Upload
  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, [field]: file });
      if (field === "citizenshipPhotoFront") setPreviewFront(URL.createObjectURL(file));
      if (field === "citizenshipPhotoBack") setPreviewBack(URL.createObjectURL(file));
    }
  };

  // Request OTP
  const requestOtp = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/kyc/verify", 
        {
            headers: { 
                Authorization: `Bearer ${token}`
            }
        }, 
      
      { phone: formData.phone, });

      console.log(response)

      if (!response.data.error) {
        toast.success("OTP sent to your phone!");
        setOtpSent(true);
      } else {
        toast.error("Failed to send OTP");
      }
    } catch (error) {
      toast.error("Error sending OTP");
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.citizenshipPhotoFront || !formData.citizenshipPhotoBack) {
      toast.error("Please upload both citizenship images!");
      return;
    }

    const form = new FormData();
    form.append("phone", formData.phone);
    form.append("address", formData.address);
    form.append("otp", formData.otp);
    form.append("user", userDetails._id);
    form.append("front", formData.citizenshipPhotoFront);
    form.append("back", formData.citizenshipPhotoBack);

    try {
      const response = await axios.post("http://localhost:3000/api/kyc/", form, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      console.log(response)

      if (!response.data.error) {
        toast.success("KYC submitted successfully!");
      } else {
        toast.error("KYC submission failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-10">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg border border-gray-200">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">KYC Verification</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Phone Number */}
          <div>
            <label className="block text-gray-700 font-medium">Phone Number</label>
            <input
              type="text"
              name="phone"
              maxLength="10"
              value={formData.phone}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:ring focus:ring-gray-300"
              placeholder="Enter your phone number"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:ring focus:ring-gray-300"
              placeholder="Enter your address"
              required
            />
          </div>

          {/* Citizenship Front Upload */}
          <div>
            <label className="block text-gray-700 font-medium">Citizenship Front</label>
            <input type="file" onChange={(e) => handleFileUpload(e, "citizenshipPhotoFront")} accept="image/*" required />
            {previewFront && <img src={previewFront} alt="Front Preview" className="mt-2 h-32 w-full object-cover rounded-md border" />}
          </div>

          {/* Citizenship Back Upload */}
          <div>
            <label className="block text-gray-700 font-medium">Citizenship Back</label>
            <input type="file" onChange={(e) => handleFileUpload(e, "citizenshipPhotoBack")} accept="image/*" required />
            {previewBack && <img src={previewBack} alt="Back Preview" className="mt-2 h-32 w-full object-cover rounded-md border" />}
          </div>

          {/* OTP Request and Input */}
          <div>
            <label className="block text-gray-700 font-medium">OTP Verification</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="otp"
                maxLength="6"
                value={formData.otp}
                onChange={handleChange}
                className="flex-1 p-3 border rounded-lg focus:ring focus:ring-gray-300"
                placeholder="Enter OTP"
                required
                disabled={!otpSent}
              />
              <button
                type="button"
                onClick={requestOtp}
                className={`py-3 px-5 text-white rounded-lg ${otpSent ? "bg-gray-400 cursor-not-allowed" : "bg-gray-700 hover:bg-gray-800"}`}
                disabled={otpSent}
              >
                {otpSent ? "OTP Sent" : "Get OTP"}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 text-white bg-gray-700 rounded-lg hover:bg-gray-800"
          >
            Submit KYC
          </button>
        </form>
      </div>
    </div>
  );
};

export default KycForm;
