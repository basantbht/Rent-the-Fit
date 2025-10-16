const transporter = require("../Mail/mail.config");
require("dotenv").config();

const welcomeMail = async (email) => {
  try {
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to our world",
      text: `Welcome to the Cloth Renting system.
      Being a first customer to our website .You can apply discount.Your code is COUPON227208 `,
    });
    console.log("Email Sent");
  } catch (e) {
    console.log("Error in SendMail", e);
    return resizeBy.status(500).json({ message: "Couldnot Sent Email" });
  }
};
module.exports = welcomeMail;
