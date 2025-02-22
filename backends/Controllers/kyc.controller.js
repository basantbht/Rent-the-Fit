const cloudinary = require("../cloudCofig/config");
const kycModel = require("../Models/userkyc.model");

const createKyc = async (req, res) => {
  const { address } = req.body;
  try {
    const image1 = req.files.front[0];
    const image2 = req.files.back[0];

    if (!image1 || !image2) {
      return res.status(400).json({ error: true, message: "No Image Found" });
    }
    let cloudRes1 = await cloudinary.uploader.upload(image1.path, {
      folder: "citizen-photo",
    });

    let cloudRes2 = await cloudinary.uploader.upload(image2.path, {
      folder: "citizen-photo",
    });

    const newkyc = new kycModel({
      citizenshipPhotoFront: cloudRes1.secure_url,
      citizenshipPhotoBack: cloudRes2.secure_url,

      user: user._id,
      Address: address,
    });
    await newkyc.save();
    return res.status(200).json({ error: false, message: "Success" });
  } catch (error) {
    console.log("Error in createkyc", error);
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
    if (!userStatus) {
      return res
        .status(404)
        .json({ error: true, message: "User KYC not found." });
    }
    await userStatus.save();
    return res.status(200).json({ error: false, message: "Updated status." });
  } catch (error) {
    console.log("Error in verification of kyc");
    return res.status(500).json({ error: true, message: "Couldnot verify" });
  }
};

module.exports = { createKyc, getkyc, verifyKyc};
