const express = require("express");
const { validateUser } = require("../middlewares/auth");
const {
  getUserCart,
  addToCart,
  updateCart,
} = require("../Controllers/cart.controller");

const cartRouter = express.Router();

cartRouter
  .route("/")
  .get(validateUser, getUserCart)
  .post(validateUser, addToCart)
  .put(validateUser, updateCart);

module.exports = cartRouter;
