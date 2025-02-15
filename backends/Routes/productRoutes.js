const express = require("express");

const productRouter = express.Router();

const { validateUser, authorizeAdmin } = require("../middlewares/auth");

const upload = require("../middlewares/multer");

const {checkId}=require('../middlewares/checkId')

const {
  createProduct,
  ReadProduct,
  editProduct,
  deleteProduct,
  searchProduct,
  productReview,
} = require("../Controllers/Product.Controller");

productRouter.get("/search", searchProduct);

productRouter.post(
  "/",
  validateUser,
  authorizeAdmin,
  upload.single("image"),
  createProduct
);

productRouter.get("/", ReadProduct);

productRouter.put("/:id", validateUser, authorizeAdmin, editProduct);

productRouter.delete("/", validateUser, authorizeAdmin, deleteProduct);

productRouter.post('/:id/reviews',validateUser,checkId,productReview)

module.exports = productRouter;
