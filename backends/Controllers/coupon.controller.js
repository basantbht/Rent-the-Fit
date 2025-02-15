const Coupon = require("../models/coupon.model");

const createCoupon = async (req, res) => {
  try {
    const { code, discountPer, expirationDate } = req.body;

    if (!code || !discountPer || !expirationDate) {
      return res
        .status(400)
        .json({ error: true, message: "All fields are required" });
    }

    const existingCoupon = await Coupon.findOne({ code });

    if (existingCoupon) {
      return res
        .status(400)
        .json({ error: true, message: "Coupon code already exists" });
    }

    const newCoupon = new Coupon({
      code,
      discountPer,
      expirationDate,
      isActive: true,
    });

    await newCoupon.save();

    return res.status(201).json({
      error: false,
      message: "Coupon created successfully",
      coupon: newCoupon,
    });
  } catch (error) {
    console.error("Error in createCoupon", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

const validateCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;

    if (!couponCode) {
      return res
        .status(400)
        .json({ error: true, message: "Coupon code is required" });
    }

    const coupon = await Coupon.findOne({
      code: couponCode,

      isActive: true,
    });
    if (!coupon) {
      return res.status(500).json({ error: true, message: "not found" });
    }
    if (coupon.expirationDate < new Date()) {

       coupon.isActive = false,
       await coupon.save();
      return res.status(500).json({ error: true, message: "expired" });
    }
    return res.status(200).json({ error: false, discount: coupon.discountPer });
  } catch (error) {
    console.log("Error in validatecoupon", error);
    return res.status(500).json({ error: true, message: "not valid" });
  }
};
module.exports = { createCoupon, validateCoupon };
