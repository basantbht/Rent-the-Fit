const userModel = require("../Models/User.model");
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    const cartData = await user.cartData;

    return res.json({ error: false, message: cartData });
  } catch (error) {
    console.log("Error in getuserCart", error);
    return res
      .status(500)
      .json({ error: true, message: "Couldnot get cart product." });
  }
};
const addToCart = async (req, res) => {
  try {
    const { userId, productId, size } = req.body;
    const user = await userModel.findById(userId);
    let cartData = await user.cartData;

    if (cartData[productId]) {
      if (cartData[productId][size]) {
        cartData[productId][size] += 1;
      } else {
        cartData[productId][size] = 1;
      }
    } else {
      cartData[productId] = {};
      cartData[productId][size] = 1;
    }
    await userModel.findByIdAndUpdate(userId, { cartData });
    return res.status(200).json({ error: false, message: "Added to cart." });
  } catch (error) {
    console.log("Error in addToCart", error);
    return res
      .status(500)
      .json({ error: true, message: "Couldnot add product to cart." });
  }
};
const updateCart = async (req, res) => {
  try {
    const { userId, productId, size, quantity } = req.body;
    const user = await userModel.findById(userId);
    let cartData = await user.cartData;

    cartData[productId][size] = quantity;
    await userModel.findByIdAndUpdate(userId, { cartData });
    return res.status(200).json({ error: false, message: "Cart Updated" });
  } catch (error) {
    console.log("Error in updateCart,", error);
    return res
      .status(500)
      .json({ error: false, message: "Couldnot update Cart." });
  }
};
module.exports = { getUserCart, addToCart, updateCart };
