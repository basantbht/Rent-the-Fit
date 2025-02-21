const mongoose = require("mongoose");

const kycSchmea = new mongoose.Schema({
  citizenshipPhotoFront: {
    type: String,
    requied: true,
    default: "",
  },
  phone:{
    type:Number,
    required:true,
    maxLength:10
  },
  citizenshipPhotoBack: {
    type: String,
    requied: true,
    default: "",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  Address: {
    type: String,
    required: true,
  },
  status:{
    type:String,
    enum:['pending','approved','rejected']
  },
  otp:String,
  otpExpiresAt:Date,
});
const kycModel = mongoose.model("KYC", kycSchmea);
module.exports = kycModel;
