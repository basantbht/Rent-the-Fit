const { Resend } = require("resend");

const resend = new Resend(process.env.API_KEY);

const sendMail = async (verftoken, email) => {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],

      subject: `verify`,
      html: `Your verification code is ${verftoken}.`,
    });
    
  } catch (error) {
    console.log("Error in sendingMail", error);
    throw new Error("Error sending verification email");
  }
};
module.exports = sendMail;
