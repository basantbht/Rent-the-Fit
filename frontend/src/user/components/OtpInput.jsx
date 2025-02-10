import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { RentContext } from "../../../context/RentContext";

const OtpInput = ({ length = 6, onOtpSubmit = () => { }, email }) => {
  const { token, setToken, backendUrl } = useContext(RentContext);
  const [otp, setOtp] = useState(new Array(length).fill("")); // This is the state for OTP
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp); // Update the OTP state

    // Submit trigger
    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === length)
      {
       onOtpSubmit(combinedOtp);        
      }
        


    // Move to next input if the current field is filled
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleClick = (index) => {
    inputRefs.current[index].setSelectionRange(1, 1);

    // Optional: Focus the previous empty field
    if (index > 0 && !otp[index - 1]) {
      inputRefs.current[otp.indexOf("")]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      // Move focus to the previous input field on backspace
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(token)
    try {
      const combinedOtp = otp.join("");
      console.log(combinedOtp)
      const res = await axios.post('http://localhost:3000/api/users/verifyemail', { userverifycode: combinedOtp },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      console.log(res);

      if (res.data.error === false) {
        toast.success(res.data.message)
        navigate('/')
      }

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        console.log(error)
        toast.error(error.response.data.message);
      } else {
        console.log(error)
        toast.error(error.message);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
     <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-md">
  <h2 className="text-xl font-semibold mb-4 text-center">
    Enter the verification code we just emailed to you.
  </h2>
  <div className="flex flex-col items-center justify-center">
    <div className="flex mb-4">
      <p>{email}</p>
      {otp.map((value, index) => (
        <input
          key={index}
          type="text"
          ref={(input) => (inputRefs.current[index] = input)}
          value={value}
          onChange={(e) => handleChange(index, e)}
          onClick={() => handleClick(index)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-[40px] h-[40px] mx-[5px] text-center text-[1.2em] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ))}
    </div>
    <button className="px-4 py-2 bg-black text-white rounded hover:bg-gray-600 cursor-pointer">
      Submit
    </button>
  </div>
</div>


    </form >
  );
};

export default OtpInput;
