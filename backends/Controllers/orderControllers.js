const orderModel = require("../Models/orderModel.js");
const userModel = require("../Models/User.model.js");

const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.user._id;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    return res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const placeOrderKhalti = async (req, res) => {
    try {
        const { items, amount, address } = req.body;
        const userId = req.user._id;
    
        const orderData = {
          userId,
          items,
          address,
          amount,
          paymentMethod: "khalti",
          payment: false,
          date: Date.now(),
        };
        const newOrder = new orderModel(orderData);
        await newOrder.save();
    
        await userModel.findByIdAndUpdate(userId, { cartData: {} });
    
        return res.json({ success: true, message: "Order Placed" });
      } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
      }
};


const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ error: false, orders });
  } catch (error) {
    console.log(error);
    res.json({ error: true, message: error.message });
  }
};

const userOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });

    res.json({ error: false, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ error: true, message: error.message });
  }
};

module.exports = {
  placeOrder,
  placeOrderKhalti,
  allOrders,
  userOrders,
  updateStatus,
};
