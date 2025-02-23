const transporter = require("../Mail/mail.config");
require("dotenv").config();

const orderMail = async (email) => {
  try {
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Alert Mail",
      text: `OOPS Date has been expired.Our team will reach will soon`,
    });
    console.log("Email Sent");
  } catch (e) {
    console.log("Error in SendMail", e);

    return res.status(500).json({ message: "Couldnot Sent Email" });
  }
};

module.exports = orderMail;
