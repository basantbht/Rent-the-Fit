const mongoose = require("mongoose");

// const reviewSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     rating: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//     comment: {
//       type: String,
//       required: String,
//       trim: true,
//     },
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "UserModel",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      //required: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    // reviews: {
    //   type: [reviewSchema],
    // },
    // rating: {
    //   type: Number,
    //   default: 0,
    //   required: true,
    // },
    sizes: {
      type: Array,
      required: true,
    },
    bestseller: { type: Boolean },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);
const productModel = mongoose.model("product", productSchema);
module.exports = productModel;
