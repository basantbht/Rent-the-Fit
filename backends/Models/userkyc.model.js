const mongoose = require("mongoose");

const kycSchmea = new mongoose.Schema({
  dob: {
    type: Date,
    required: true,
  },
  citizenshipPhoto: {
    type: String,
    requied: true,
    default: "",
  },
  Adress: {
    type: String,
    required: true,
  },
});
const kycModel=mongoose.model('KYC',kycSchmea);
module.exports=kycModel;