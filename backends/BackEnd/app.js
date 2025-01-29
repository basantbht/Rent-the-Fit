// Global module
const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors")

// Local Module
const userRouter = require("../Routes/userRoutes");
const productRouter = require("../Routes/productRoutes");
const cartRouter=require('../Routes/cartRoutes')

// middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173',
credentials: true}))

// Routes

app.use("/api/users", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);

// database and server
const connection = require("../DB/connectDB");
const DATABASE_URI = process.env.MONGO_URI;
connection(DATABASE_URI);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server Running!:)");
});
