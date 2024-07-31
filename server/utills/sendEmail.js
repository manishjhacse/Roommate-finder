const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: process.env.EMAILID,
        pass: process.env.EMAILPASSWORD,
      },
    });
    
    await transporter.sendMail({
      from: process.env.EMAILID,
      to: email,
      subject: subject,
      text: text,
    });
    return {
      success: true,
      message: "OTP Sent",
    };
  } catch (err) {
    return {
      success: false,
      message: "OTP can't be sent, try again",
      error: err.message,
    };
  }
};
