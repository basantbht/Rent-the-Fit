const express = require("express");
const { validateUser } = require("../middlewares/auth");
const {
  allItems,
  addToCart,
  updateCart,

} = require("../Controllers/cart.controller");

const cartRouter = express.Router();

cartRouter
  .route("/")
  .get(validateUser, allItems)
  .post(validateUser, addToCart)


cartRouter.put("/", validateUser, updateCart);

module.exports = cartRouter;
