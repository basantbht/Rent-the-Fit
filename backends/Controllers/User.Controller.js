// Model
const userModel = require("../Models/User.model");
// Module
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const joi = require("joi");
// Local
const generateVerificationToken = require("../utils/verification.Token");
const sendMail = require("../Mail/mail.Send");
const generateToken = require("../utils/createToken");
const welcomeMail = require("../Mail/welcome.Mail");
const passResetMail = require("../Mail/password.Reset");

const userCreatingSchema = joi.object({
  username: joi
    .string()
    .min(5)
    .max(20)
    .required()
    .alphanum()
    .pattern(new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])"))
    // ^ -> start of string,
    // [..]-> find any betn bracket
    .messages({
      // this are all the type of error
      "string.base": "Username must be a string.",
      "string.empty": "Username is required.",
      "string.min": "Username must be at least 5 characters long.",
      "string.max": "Username cannot exceed 20 characters.",
      "string.alphanum": "Username must contain only letters and numbers.",
      "string.pattern.base":
        "Username must contain at least one lowercase letter, one uppercase letter, and one number.",
    }),
  email: joi.string().required().email({ minDomainSegments: 2 }).messages({
    "string.email": "Please provide a valid email address.",
    "string.empty": "Email address is required.",
    "any.required": "Email is a mandatory field.",
  }),
  password: joi
    .string()
    .min(8)
    .required()
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^?&])\\S*$")
    )
    .max(20)
    .messages({
      "string.base": "Password must be a string.",
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 8 characters long.",
      "string.max": "Password cannot exceed 30 characters.",
      "string.pattern.base":
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character no space.",
    }),
});

const userLogInSchema = joi.object({
  email: joi.string().required().email({ minDomainSegments: 2 }).messages({
    "string.email": "Please provide a valid email address.",
    "string.empty": "Email address is required.",
    "any.required": "Email is a mandatory field.",
  }),
  password: joi
    .string()
    .min(8)
    .required()
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^?&])\\S*$")
    )
    .max(20)
    .messages({
      "string.base": "Password must be a string.",
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 8 characters long.",
      "string.max": "Password cannot exceed 30 characters.",
      "string.pattern.base":
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character no space.",
    }),
});
const userUpdateSchema = joi.object({
  username: joi
    .string()
    .min(5)
    .max(20)
    .required()
    .alphanum()
    .pattern(new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])"))
    // ^ -> start of string,
    // [..]-> find any betn bracket
    .messages({
      // this are all the type of error
      "string.base": "Username must be a string.",
      "string.empty": "Username is required.",
      "string.min": "Username must be at least 5 characters long.",
      "string.max": "Username cannot exceed 20 characters.",
      "string.alphanum": "Username must contain only letters and numbers.",
      "string.pattern.base":
        "Username must contain at least one lowercase letter, one uppercase letter, and one number.",
    }),
});
const emailScheamforPassword = joi.object({
  email: joi.string().required().email({ minDomainSegments: 2 }).messages({
    "string.email": "Please provide a valid email address.",
    "string.empty": "Email address is required.",
    "any.required": "Email is a mandatory field.",
  }),
});
const resetPasswordSchema = joi.object({
  password: joi
    .string()
    .min(8)
    .required()
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^?&])\\S*$")
    )
    .max(20)
    .messages({
      "string.base": "Password must be a string.",
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 8 characters long.",
      "string.max": "Password cannot exceed 30 characters.",
      "string.pattern.base":
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character no space.",
    }),
});

const createUser = async (req, res) => {
  const { username, email, password } = req.body;

  // validation using joi
  const { error } = userCreatingSchema.validate(req.body);

  if (error) {
    return res.status(401).json({ error: true, message: error.message });
  }
  try {
    // findOne gives only one document
    const userExisted = await userModel.findOne({ email });
    const userNameExisted = await userModel.findOne({ username });

    if (userNameExisted) {
      return res
        .status(403)
        .json({ error: true, message: "UserName Already Exists" });
    }
    // console.log(userExisted);
    if (userExisted) {
      return res
        .status(403)
        .json({ error: true, message: "Account Already Exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const verificationToken = generateVerificationToken();

    const newUser = new userModel({
      username,
      email,
      password: hashedPass,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 60 * 1000,
    });

    await newUser.save();

    sendMail(verificationToken, newUser.email, res);

    const token = generateToken(res, newUser._id);

    return res.status(201).json({
      error: false,
      message: "OTP SEND SUCCESSFULLY.",
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      token: token,
    });
  } catch (e) {
    console.log("Error in create user.", e);
    return res
      .status(404)
      .json({ error: true, message: "Account creation failed." });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { error } = userLogInSchema.validate(req.body);

  if (error) {
    //console.log(error);
    return res.status(401).json({ error: true, message: error.message });
  }
  try {
    const userExisted = await userModel.findOne({ email });

    if (!userExisted) {
      return res
        .status(404)
        .json({ error: true, message: " OOPS !.. Invalid credentials" });
    }

    if (userExisted) {
      const isPasswordValid = await bcrypt.compare(
        password,
        userExisted.password
      );
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ error: true, message: "Invalid credentials" });
      }
      if (userExisted.isVerified === true) {
        const token = generateToken(res, userExisted._id);
        return res.status(200).json({
          message: "LogIn Success.",
          _id: userExisted._id,
          username: userExisted.username,
          email: userExisted.email,

          isAdmin: userExisted.isAdmin,
          error: false,
          token: token,
        });
      } else {
        return res
          .status(401)
          .json({ error: true, message: "Verify First through code" });
      }
    }
  } catch (e) {
    console.log("Error in login", e);
    return res
      .status(401)
      .json({ error: true, message: "Invalid credentials" });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", { httOnly: true });
    return res.status(200).json({ message: "Logged Out Sucessfully." });
  } catch (e) {
    console.log("Error in lOgoutuser", e);
    res.status(500).json({ message: "Couldnot logout." });
  }
};

const getAllUser = async (req, res) => {
  try {
    const allUser = await userModel.find({}).sort({ name: 1 });
    return res.status(200).json({ error: false, message: allUser });
  } catch (e) {
    console.log("Error in getalluser", e);
    return res
      .status(404)
      .json({ error: true, message: "Couldnot Find your request." });
  }
};

const getCurrentUserProfile = async (req, res) => {
  const user = await userModel
    .findById({ _id: req.user._id })
    .select("-password");

  if (user) {
    res
      .status(200)
      .json({ username: user.username, email: user.email, error: false });
  } else {
    res.status(400).json({ error: true, mesage: "User Not Found..." });
  }
};

const updateCurrentProfile = async (req, res) => {
  const { error } = userUpdateSchema.validate(req.body);
  if (error) {
    return res.status(401).json({ error: true, message: error.message });
  }
  const { username } = req.body;
  const image = req.file;
  if (!image) {
    return res.status(400).json({ error: true, message: "No Image Found" });
  }
  let cloudRes = await cloudinary.uploader.upload(image.path, {
    folder: "profile-image",
  });

  try {
    const user = await userModel.findById(req.user._id).select("-password");
    //console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User Not Valid." });
    }

    if (user.updatedAt.getDate() === new Date().getDate()) {
      return res.status(500).json({
        error: true,
        message:
          "OOPS :)Looks like you changed your name recently,it Can be Change after 24hr",
      });
    }
    user.username = username || user.username;
    user.profileImage = cloudRes.secure_url;
    const updatedUsername = await user.save();
    return res.status(200).json({ message: updatedUsername, error: false });
  } catch (e) {
    console.log("Error in updateCurrent Profile", e);
    return res.status(500).json({
      error: true,
      message: "Couldnot Update Profile.Something Went Wrong.",
    });
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;

  const User = await userModel.findById(id);

  if (User) {
    if (User.isAdmin) {
      return res
        .status(400)
        .json({ message: "OOPS .. Couldnot Delelte Admin...", error: true });
    }
    await userModel.findByIdAndDelete({ _id: User._id });
    return res.status(200).json({ message: "User Deleted..." });
  } else {
    return res
      .status(400)
      .json({ message: "COuldnot FInd the user", error: true });
  }
};

const getUserById = async (req, res) => {
  const id = req.params.id;
  const User = await userModel.findById(id).select("-password");
  // console.log(User);
  if (User) {
    return res.status(200).json({ message: User });
  } else {
    return res.status(400).json({ message: "Couldnot Find User..." });
  }
};

const updateUserById = async (req, res) => {
  const { error } = userUpdateSchema.validate(req.body);
  if (error) {
    return res.status(401).json({ error: true, message: error.message });
  }
  const { username } = req.body;
  const id = req.params.id;

  try {
    const user = await userModel.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ error: true, message: "User Not Found." });
    }
    if (user.updatedAt.getDate() === new Date().getDate()) {
      return res.status(500).json({
        error: true,
        message:
          "OOPS :)Looks like you changed your name recently,it Can be Change after 24hr",
      });
    }
    user.username = username || user.username;
    await user.save();
    return res.status(200).json({ error: false, message: user });
  } catch (error) {
    console.log("Error in updateuserbyid", error);
    return res.status(404).json({ error: true, message: "Updation Failed." });
  }
};
const verifyUseremail = async (req, res) => {
  const { userverifycode } = req.body;
  console.log(userverifycode);

  try {
    //console.log(req.user);
    const user = await userModel.findById(req.user._id);
    console.log(typeof user.verificationToken, typeof userverifycode);

    if (
      user.verificationToken === userverifycode &&
      user.verificationTokenExpiresAt > new Date()
    ) {
      user.isVerified = true;
      user.verificationToken = null;
      user.verificationTokenExpiresAt = null;
      await user.save();
      welcomeMail(user.email);

      return res.status(200).json({ error: false, message: "User Verified." });
    } else {
      return res.status(400).json({ error: true, message: "Couldnt verify." });
    }
  } catch (error) {
    console.log("Error in verifyUseremail", error);
    return res
      .status(500)
      .json({ error: true, message: "Couldnot verify email" });
  }
};

const forgotpass = async (req, res) => {
  const { error } = emailScheamforPassword.validate(req.body);
  if (error) {
    return res.status(401).json({ error: true, message: error.message });
  }
  try {
    const { email } = req.body;

    const user = await userModel.findOne(email);
    if (!user) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid Credentials" });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");

    const tokenexpiry = Date.now() + 1 * 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = tokenexpiry;

    await user.save();
    passResetMail(
      user.email,
      `${process.env.CLIENT_URL}/reset-passwod/${resetPasswordToken}`
    );
  } catch (error) {
    console.log("Error in forgot pass", error);
    return res.status({ error: false, message: "Could not recover password." });
  }
};

const resetpass = async (req, res) => {
  const { error } = resetPasswordSchema.validate(req.body);
  if (error)
    return res.status(401).json({ error: true, message: error.message });
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await userModel.findOne({
      resetPasswordToken: token,
    });
    if (user.resetPasswordExpiresAt > Date.now()) {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt);

      user.password = hashedPass;
      user.resetPasswordToken = null;
      user.resetPasswordExpiresAt = null;
      await user.save();
      return res
        .status(200)
        .json({ error: false, message: "Password Reset Success." });
    } else {
      return res.status(400).json({ error: true, message: "Invalid token" });
    }
  } catch (error) {
    console.log("Error in RestPassword", error);
    return res
      .status(400)
      .json({ error: true, message: "Couldnot reset Password" });
  }
};

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  forgotpass,
  updateCurrentProfile,
  getCurrentUserProfile,
  getUserById,
  deleteUser,
  getAllUser,
  updateUserById,
  verifyUseremail,
  resetpass,
};
