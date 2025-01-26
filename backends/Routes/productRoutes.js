const express = require("express");

const productRouter = express.Router();

const { validateUser, authorizeAdmin } = require("../middlewares/auth");

const {
  productDetail,
  ReadDetail,
  editDetail,
  deleteDetail,
  searchProduct,
} = require("../Controllers/Product.Controller");

productRouter.get("/search", searchProduct);
productRouter.post("/abc", validateUser, authorizeAdmin, productDetail);
productRouter.get("/abc", validateUser, authorizeAdmin, ReadDetail);
productRouter.put("/abcd/:id", validateUser, authorizeAdmin, editDetail);
productRouter.delete("/cd/:id", validateUser, authorizeAdmin, deleteDetail);
module.exports = productRouter;
