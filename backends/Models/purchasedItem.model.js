const mongoose = require("mongoose");

const purchasedItemSchema = new mongoose.Schema(
  {
    item: {
      type:Array,
      ref: "product",
      required: true,
    },
    quantity:{
      type:Number,
      default:0
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      
    },
    totalPrice: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now },
    paymentMethod: { type: String, enum: ["khalti"], required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "refunded"],
      default: "pending",
    },
    startdate:{
      type:Date
    },
    enddate:{
      type:Date
    },
  },
  { timestamps: true }
);

const PurchasedItem = mongoose.model("PurchasedItem", purchasedItemSchema);
module.exports = PurchasedItem;
