const transporter = require("../Mail/mail.config");
require("dotenv").config();

const sendMail = async (verftoken, email,res) => {
  try {
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Verify Your Email.",
      text: `Your verification code is ${verftoken}.`,
    });
    console.log("Email Sent");
  } catch (e) {
    console.log("Error in SendMail", e);

    return res.status(500).json({ message: "Couldnot Sent Email" });
  }
}

module.exports = sendMail;
