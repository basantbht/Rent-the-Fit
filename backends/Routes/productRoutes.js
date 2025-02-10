const express = require("express");

const productRouter = express.Router();

const { validateUser, authorizeAdmin } = require("../middlewares/auth");

const upload = require("../middlewares/multer");

const {
  createProduct,
  ReadProduct,
  editProduct,
  deleteProduct,
  searchProduct,
} = require("../Controllers/Product.Controller");

productRouter.get("/search", searchProduct);

productRouter.post(
  "/",
  validateUser,
  authorizeAdmin,
  upload.single("image"),
  createProduct
);

productRouter.get("/", validateUser, authorizeAdmin, ReadProduct);

productRouter.put("/:id", validateUser, authorizeAdmin, editProduct);

productRouter.delete("/", validateUser, authorizeAdmin, deleteProduct);

module.exports = productRouter;
