const cloudinary = require("../cloudCofig/config");
const kycModel = require("../Models/userkyc.model");
const phoneOtp = require("../utils/phoneOtp");
const sendOTP = require("../utils/sendOTP");

const createKyc = async (req, res) => {
  const { address, phone } = req.body;
  try {
    const user = req.user;
    const image1 = req.files.front[0];
    const image2 = req.files.back[0];

    if (!image1 && !image2) {
      return res.status(400).json({ error: true, message: "No Image Found" });
    }
    let cloudRes1 = await cloudinary.uploader.upload(image1.path, {
      folder: "citizen-photo",
    });

    let cloudRes2 = await cloudinary.uploader.upload(image2.path, {
      folder: "citizen-photo",
    });

    const phoneOTP = phoneOtp();

    const newkyc = new kycModel({
      citizenshipPhotoFront: cloudRes1.secure_url,
      citizenshipPhotoBack: cloudRes2.secure_url,
      phone,
      user: user._id,
      Adress: address,
      otp: phoneOTP,
      otpExpiresAt: Date.now() + 24 * 60 * 60 * 60 * 1000,
    });
    await newkyc.save();
    sendOTP(phoneOTP, phone, res);
    return res.status(200).json({ error: false, message: "Success" });
  } catch (error) {
    console.log("Error in createkyc");
    return res
      .status(500)
      .json({ error: true, message: "Couldnot verify Something went wrong." });
  }
};
const getkyc = async (req, res) => {
  try {
    const allKyc = await kycModel.find({});
    if (allKyc.length === 0) {
      return res.status(500).json({ error: true, message: "couldnot found." });
    }
    return res.status(200).json({ error: false, allKyc });
  } catch (error) {
    console.log("Error in getkyc");
    return res.status(400).json({ error: true, message: "Couldnot get kyc" });
  }
};
const verifyKyc = async (req, res) => {
  try {
    const { userId, statusUser } = req.body;
    const userStatus = await kycModel.findByIdAndUpdate(
      userId,
      {
        status: statusUser,
      },
      { new: true }
    );
    await userStatus.save();
    return res.status(200).josn({ error: false, message: "Updated status." });
  } catch (error) {
    console.log("Error in verification of kyc");
    return res.status(500).json({ error: true, message: "Couldnot verify" });
  }
};
const verifyPhone = async (req, res) => {
  try {
    const { phoneOtp } = req.body;
    const user = await kycModel.findById(req.user._id);
    if (user.otp === phoneOtp && user.otpExpiresAt > new Date()) {
      user.otp = null;
      user.otpExpiresAt = null;
      await user.save();
      return res
        .status(200)
        .json({ error: false, message: "Phone Number Verified." });
    }
  } catch (error) {
    console.log("Error in Verify-Phone");
    return res
      .status(500)
      .josn({ error: true, message: "Couldnot verify your Number." });
  }
};
module.exports = { createKyc, getkyc, verifyKyc, verifyPhone };
