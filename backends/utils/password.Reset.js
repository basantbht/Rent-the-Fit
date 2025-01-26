const { Resend } = require("resend");

const resend = new Resend(process.env.API_KEY);

const sendRestPasswordMail = async (email,url) => {
  try {
    await resend.emails.send({
      from: "Leaderritesh@gmail.com",
      to: email,

      subject: `Reset Your password`,
      html: `Click <a href="${url}">here </a> to reset your password`,
    });
    console.log("Mail sent Successfully");
  } catch (error) {
    console.log("Error in sendingMail", error);
    throw new Error("Error sending verification email");
  }
};
module.exports = sendRestPasswordMail;
