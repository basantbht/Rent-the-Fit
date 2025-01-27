const express = require("express");

const userRouter = express.Router();

const {
  createUser,
  loginUser,
  logoutUser,
  forgotpass,
  updateCurrentProfile,
  getCurrentUserProfile,
  deleteUser,
  getUserById,
  updateUserById,
  verifyUseremail,
  resetpass,
  getAllUser,
} = require("../Controllers/User.Controller.js");

const { validateUser, authorizeAdmin } = require("../middlewares/auth");

userRouter
  .route("/")
  .post(createUser)
  .get(validateUser, authorizeAdmin, getAllUser);

userRouter.post("/login", loginUser);

userRouter.post("/logout", logoutUser);

userRouter.put("/profile", validateUser, updateCurrentProfile);

userRouter.get("/profile", validateUser, getCurrentUserProfile);

userRouter.post("/verifyemail", validateUser, verifyUseremail);

userRouter.post("/forget-password", forgotpass);

userRouter.post("/resetpass/:token", resetpass);


userRouter
  .route("/:id")
  .delete(validateUser, authorizeAdmin, deleteUser)
  .get(validateUser, authorizeAdmin, getUserById)
  .put(validateUser, authorizeAdmin, updateUserById);

module.exports = userRouter;
