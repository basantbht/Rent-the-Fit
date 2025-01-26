const { Resend } = require("resend");

const resend = new Resend(process.env.API_KEY);

const welcomeMail = async (email) => {
  try {
    await resend.emails.send({
      from: "Leaderritesh@gmail.com",
      to: email,

      subject: `Welcome`,
      html: `A Warm welcome to our world.`,
    });
    console.log("Mail sent Successfully");
  } catch (error) {
    console.log("Error in sendingMail", error);
    throw new Error("Error sending verification email");
  }
};
module.exports = welcomeMail;
