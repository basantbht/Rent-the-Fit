// Global module
const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");

// Local Module
const userRouter = require("../Routes/userRoutes");
const productRouter = require("../Routes/productRoutes");

// middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes

app.use("/api/users", userRouter);
app.use("/api/product", productRouter);

// database and server
const connection = require("../DB/connectDB");
const DATABASE_URI = process.env.MONGO_URI;
connection(DATABASE_URI);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server Running!:)");
});
