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
    const signId = jwt.verify(cookieToken, process.env.SECRET);

    req.user = await userModel.findById(signId.userId).select("-password");
    // console.log(req.user);

    next();
  } catch (e) {
    return res
      .status(400)
      .json({ message: "Couldnot verify User", error: true });
  }
};
const authorizeAdmin = async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res
      .status(400)
      .json({ message: "Not authorized as an Admin..", error: true });
  }
};

module.exports = { validateUser, authorizeAdmin };
