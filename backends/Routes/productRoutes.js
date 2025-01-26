const express = require("express");

const productRouter = express.Router();

const { validateUser, authorizeAdmin } = require("../middlewares/auth");

const {
  productDetail,
  ReadDetail,
  editDetail,
  deleteDetail,
  searchProduct,
} = require("../Controllers/Product");

userRouter.get("/search", searchProduct);
userRouter.post("/abc", validateUser, authorizeAdmin, productDetail);
userRouter.get("/abc", validateUser, authorizeAdmin, ReadDetail);
userRouter.put("/abcd/:id", validateUser, authorizeAdmin, editDetail);
userRouter.delete("/cd/:id", validateUser, authorizeAdmin, deleteDetail);
module.exports = productRouter;
