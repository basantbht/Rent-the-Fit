const express = require("express");
const payRouter = express.Router();

const {
  initializeKhaltiPayment,
  verifyKhaltiPayment,
} = require("../utils/khalti");

const productModel = require("../Models/Product.model");
const PurchasedItem = require("../Models/purchasedItem.model");
const Payment = require("../Models/payment.model");

payRouter.post("/", async (req, res) => {
  try {
    const { items, totalPrice, website_url, userId } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid items array" });
    }

    const purchasedItems = [];
    for (const { itemId, quantity } of items) {
      const itemData = await productModel.findById(itemId);
      if (!itemData) {
        return res
          .status(400)
          .json({ success: false, message: `Item not found: ${itemId}` });
      }

      if (itemData.quantity < quantity) {
        return res
          .status(400)
          .json({
            success: false,
            message: `Insufficient stock for item: ${itemId}`,
          });
      }

      const purchasedItem = await PurchasedItem.create({
        item: itemId,
        user: userId,
        paymentMethod: "khalti",
        totalPrice: totalPrice * 100,
        quantity,
      });

      purchasedItems.push(purchasedItem);
    }

    const paymentInitiate = await initializeKhaltiPayment({
      amount: totalPrice * 100,
      purchase_order_id: purchasedItems.map((p) => p._id).join(","),
      purchase_order_name: "Multiple Items Purchase",
      return_url: `${process.env.BACKEND_URI}/complete-khalti-payment`,
      website_url,
    });

    return res.status(200).json({
      success: true,
      purchasedItems,
      payment: paymentInitiate,
    });
  } catch (error) {
    console.log("Error in initializekhalti", error);
    return res
      .status(500)
      .json({ error: true, message: "Could not initialize payment" });
  }
});

payRouter.get("/complete-khalti-payment", async (req, res) => {
  const { pidx, transaction_id, amount, purchase_order_id } = req.query;

  try {
    const paymentInfo = await verifyKhaltiPayment(pidx);

    if (
      paymentInfo?.status !== "Completed" ||
      paymentInfo.transaction_id !== transaction_id
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Payment verification failed",
          paymentInfo,
        });
    }

    const purchasedItems = await PurchasedItem.find({
      _id: { $in: purchase_order_id.split(",") },
    });

    if (!purchasedItems || purchasedItems.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Purchased data not found" });
    }

    for (const purchasedItem of purchasedItems) {
      await PurchasedItem.findByIdAndUpdate(purchasedItem._id, {
        $set: { status: "completed" },
      });
      const product = await productModel.findById(purchasedItem.item);
      if (product) {
        const newQuantity = product.quantity - purchasedItem.quantity;
        if (newQuantity < 0) {
          return res
            .status(400)
            .json({ success: false, message: "Insufficient stock" });
        }
        await productModel.findByIdAndUpdate(product._id, {
          $set: { quantity: newQuantity },
        });
      }
    }

    const paymentData = await Payment.create({
      pidx,
      transactionId: transaction_id,
      productIds: purchasedItems.map((p) => p.item),
      user: purchasedItems[0].user,
      amount,
      dataFromVerificationReq: paymentInfo,
      apiQueryFromUser: req.query,
      paymentGateway: "khalti",
      status: "success",
    });

    // return res.status(200).json({
    //   success: true,
    //   message: "Payment Successful",
    //   paymentData,
    // });

    // return res.redirect(`https://test-pay.khalti.com/wallet?pidx=${pidx}`);

    return res.redirect("http://localhost:5173/payment-success");

    // return res.status(200).json({ success: true, message: "Payment Successful", paymentData });
  } catch (error) {
    console.error("Error in completing payment", error);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred", error });
  }
});

module.exports = payRouter;
