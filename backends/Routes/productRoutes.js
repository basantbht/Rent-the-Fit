const express = require("express");

const productRouter = express.Router();

const { validateUser, authorizeAdmin } = require("../middlewares/auth");

const upload = require("../middlewares/multer");

const { checkId } = require("../middlewares/checkId");

const {
  createProduct,
  ReadProduct,
  editProduct,
  deleteProduct,
  searchProduct,
  productReview,
  getProductReview,

  recommendProduct,
  likeUnlikeProduct,
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
98573894;

productRouter.get("/recommend", recommendProduct);

productRouter.put(
  "/:id",
  validateUser,
  authorizeAdmin,
  upload.single("image"),
  editProduct
);

productRouter.delete("/:id", validateUser, authorizeAdmin, deleteProduct);

productRouter.post("/:id/reviews", validateUser, checkId, productReview);

productRouter.post("/like/:id", likeUnlikeProduct);
productRouter.get("/:id/reviews", validateUser, checkId, getProductReview);

module.exports = productRouter;
