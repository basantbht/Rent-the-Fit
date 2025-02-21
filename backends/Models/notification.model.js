const mongoose = require("mongoose");

const notiSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'user'
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'user'
    },
    type: {
      type: String,
      enum: ["like"],
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const notiModel = new mongoose.model("Noti", notiSchema);
module.exports = notiModel;
