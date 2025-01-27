const transporter = require("../Mail/mail.config");
require("dotenv").config();
const sendRestPasswordMail = async (email, url) => {
  try {
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Verify Your Email.",
      html: `Click <a href="${url}">here </a> to reset your password`,
    });
    console.log("Email Sent");
  } catch (e) {
    console.log("Error in SendMail", e);
    return resizeBy.status(500).json({ message: "Couldnot Sent Email" });
  }
};
module.exports = sendRestPasswordMail;
