const express = require("express");

const kycRouter = express.Router();

const { createKyc } = require("../Controllers/kyc.controller");

kycRouter.route("/", createKyc);

module.exports = kycRouter;
