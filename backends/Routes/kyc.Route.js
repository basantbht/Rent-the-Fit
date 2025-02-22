const express = require("express");

const kycRouter = express.Router();
const {
  createKyc,
  verifyKyc,
  getkyc,
} = require("../Controllers/kyc.controller");
const upload = require("../middlewares/multer");
const { validateUser, authorizeAdmin } = require("../middlewares/auth");

kycRouter.post(
  "/",
  validateUser,
  upload.fields([
    { name: "front", maxCount: 1 },
    { name: "back", maxCount: 1 },
  ]),
  createKyc
);
kycRouter.get("/", validateUser, authorizeAdmin, getkyc);
kycRouter.post("/", validateUser, authorizeAdmin, verifyKyc);

module.exports = kycRouter;
