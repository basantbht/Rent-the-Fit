// Global module
const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors")

// Local Module
const userRouter = require("../Routes/userRoutes");
const productRouter = require("../Routes/productRoutes");
const cartRouter = require("../Routes/cartRoutes");
const payRouter = require("../Routes/paymentRoutes");
const kycRouter = require("../Routes/kyc.Route");
const orderRouter = require("../Routes/orderRoutes");
const couponRouter=require('../Routes/coupon.route');
// middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors())

// Routes

app.use("/api/users", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/kyc", kycRouter);
app.use("/api/pay", payRouter);
app.use("/api/order",orderRouter);
app.use("/api/coupon",couponRouter);

// database and server
const connection = require("../DB/connectDB");

const DATABASE_URI = process.env.MONGO_URI;
connection(DATABASE_URI);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server Running!");
});
