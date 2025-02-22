const twilio = require("twilio");


const accountSid = process.env.SID;
const authToken = process.env.authToken;
const client = new twilio(accountSid, authToken);

const sendOTP = async (otp, phone,res) => {
  const message = `Your OTP is ${otp}`;
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER, 
      to: `+977${phone}`,
    });
    console.log('OTP sent');
  } catch (error) {
    console.log('error in sending otp');
    return res.status(500).json({error:true,message:'Couldnot sent otp.'})
  }
};
module.exports=sendOTP;
