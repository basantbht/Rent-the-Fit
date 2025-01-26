const jwt = require("jsonwebtoken");
const userModel = require("../Models/User.model");

const validateUser = async (req, res, next) => {
  let cookieToken = req.cookies.token;

  if (!cookieToken) {
    return res
      .status(400)
      .json({ message: "Not authorized,no token", error: true });
  }
  try {
    const signId = jwt.verify(cookieToken, process.env.JWT_SECRET);

    req.user = await userModel.findById(signId.user._id).select("-password");
    next();
  } catch (e) {
    return res.status(400).json({ message: e.message, error: true });
  }
};
const authorizeAdmin = async (req, res) => {
  if (req.user && req.user.isAdmin) {
    res.status(200);
    next();
  } else {
    res
      .status(400)
      .json({ message: "Not authorized as an Admin..", error: true });
  }
};

module.exports = { validateUser, authorizeAdmin };
