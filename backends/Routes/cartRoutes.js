const express = require("express");
const { validateUser } = require("../middlewares/auth");
const {
  allItems,
  addToCart,
  updateCart,
  removeAllFromCart,
} = require("../Controllers/cart.controller");

const cartRouter = express.Router();

cartRouter
  .route("/")
  .get(validateUser, allItems)
  .post(validateUser, addToCart)
  .delete(validateUser, removeAllFromCart);

cartRouter.put("/:id", validateUser, updateCart);

module.exports = cartRouter;
