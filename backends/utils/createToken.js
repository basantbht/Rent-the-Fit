const jwt = require("jsonwebtoken");

const generateToken = (res, userId) => {
  const jwtToken = jwt.sign({ userId }, process.env.SECRET, {
    expiresIn: "5d",
  });
  res.cookie("token", jwtToken, {
    // cookie cannot be accessed through scripts
    httpOnly: true,
    maxAge: 5 * 24 * 60 * 60 * 1000,
    // will sent only to https connection
  });

  return jwtToken;
};
module.exports = generateToken;
