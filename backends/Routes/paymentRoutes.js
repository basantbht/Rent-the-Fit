const express = require("express");
const payRouter = express.Router();

const {
  initializeKhaltiPayment,
  verifyKhaltiPayment,
} = require("../utils/khalti");
const productModel = require("../Models/Product.model");
const PurchasedItem = require("../Models/purchasedItem.model");
const payment = require("../Models/payment.model");

payRouter.post("/", async (req, res) => {
  try {
    const { itemId, totalPrice, website_url } = req.body;

    const itemData = await productModel.findOne({
      _id: itemId,
      price: Number(totalPrice),
    });
   // console.log('inside item data',itemData);
    if (!itemData) {
      return res.status(400).send({
        success: false,
        message: "item not found",
      });
    }
    const purchasedItemData = await PurchasedItem.create({
      item: itemId,
      paymentMethod: "khalti",
      totalPrice: totalPrice * 100,
    });
   // console.log('inside purchased item data',purchasedItemData);
    const paymentInitate = await initializeKhaltiPayment({
      amount: totalPrice * 100,
      purchase_order_id: purchasedItemData._id, //
      purchase_order_name: itemData.name,
      return_url: `${process.env.BACKEND_URI}/complete-khalti-payment`,
      website_url,
    });

    return res.status(200).json({
      success: true,
      purchasedItemData,
      payment: paymentInitate,
    });
  } catch (error) {
    console.log("Error in initializekhalti", error);
    return res
      .status(500)
      .json({ error: true, message: "Couldnot initialize payment" });
  }
});
payRouter.get("/complete-khalti-payment", async (req, res) => {
  const {
    pidx,
    txnId,
    amount,
    mobile,
    purchase_order_id,
    purchase_order_name,
    transaction_id,
  } = req.query;

  try {
    const paymentInfo = await verifyKhaltiPayment(pidx);

    if (
      paymentInfo?.status !== "Completed" ||
      paymentInfo.transaction_id !== transaction_id ||
      Number(paymentInfo.total_amount) !== Number(amount)
    ) {
      return res.status(400).json({
        success: false,
        message: "Incomplete information",
        paymentInfo,
      });
    }

    const purchasedItemData = await PurchasedItem.find({
      _id: purchase_order_id,
      totalPrice: amount,
    });

    if (!purchasedItemData) {
      return res.status(400).send({
        success: false,
        message: "Purchased data not found",
      });
    }

    await PurchasedItem.findByIdAndUpdate(
      purchase_order_id,

      {
        $set: {
          status: "completed",
        },
      }
    );

    const paymentData = await payment.create({
      pidx,
      transactionId: transaction_id,
      productId: purchase_order_id,
      amount,
      dataFromVerificationReq: paymentInfo,
      apiQueryFromUser: req.query,
      paymentGateway: "khalti",
      status: "success",
    });

    return res.status(200).json({
      success: true,
      message: "Payment Successful",
      paymentData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred",
      error,
    });
  }
});

module.exports=payRouter;
