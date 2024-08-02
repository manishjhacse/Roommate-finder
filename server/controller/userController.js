const { User } = require("../model/userModel");
const sendMail = require("../utills/sendEmail");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.signup = async (req, res) => {
  try {
    const { name, email, password, mobile, otp } = req.body;
    email.toLowerCase();
    const existingUser = await User.findOne({ email });
    if (existingUser.password) {
      return res.status(400).json({
        success: false,
        message: "User already exist with this email id",
      });
    }
    if (existingUser.otp.code != otp) {
      return res.status(400).json({
        success: false,
        message: "wrong OTP",
      });
    }
    if (new Date(Date.now()) > existingUser.otp.validTime) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error in hashing password",
        error: err.message,
      });
    }
    const user = await User.findOneAndUpdate(
      { email },
      { name, password: hashedPassword, mobile },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "User created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "User can't created, Try again",
      error: err,
    });
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    email.toLowerCase();
    const code = Math.floor(1000 + Math.random() * 9000);
    otp = {
      code,
      validTime: new Date(Date.now() + 10 * 60 * 1000),
    };
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.password) {
      return res.status(400).json({
        success: false,
        message: "User already exist with this email id",
      });
    }
    if (existingUser) {
      const user = await User.findOneAndUpdate(
        { email },
        { otp },
        { new: true }
      );
    } else {
      const user = await User.create({
        email,
        otp,
      });
    }
    const mailMessage = `your otp for account creation is ${otp.code}`;
    const result = await sendMail(email, "verify email", mailMessage);

    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(501).json(result);
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "cat't sent OTP",
      Error: err,
    });
  }
};
exports.sendOtpToChangePassword = async (req, res) => {
  try {
    const { email } = req.body;
    email.toLowerCase();
    const code = Math.floor(1000 + Math.random() * 9000);
    otp = {
      code,
      validTime: new Date(Date.now() + 10 * 60 * 1000),
    };
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "User not exist with this email",
      });
    }

    const user = await User.findOneAndUpdate({ email }, { otp }, { new: true });
    const mailMessage = `your otp to change password is ${otp.code}`;
    const result = await sendMail(email, "verify email", mailMessage);

    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(501).json(result);
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "cat't sent OTP",
      Error: err,
    });
  }
};
exports.changePassword = async (req, res) => {
  try {
    const { email, password, code } = req.body;
    email.toLowerCase();
    const existingUser = await User.findOne({ email });
    if (existingUser.otp.code != code) {
      return res.status(400).json({
        success: false,
        message: "wrong OTP",
      });
    }
    if (new Date(Date.now()) > existingUser.otp.validTime) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error in hashing password",
        error: err.message,
      });
    }
    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Password changed",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Password can't change, Try again",
      error: err,
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "please provide all the details",
      });
    }
    email.toLowerCase();
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not exist with this email",
      });
    }
    const payload = {
      email: user.email,
      _id: user._id,
      name: user.name,
    };
    if (await bcrypt.compare(password, user.password)) {
      let token = await jwt.sign(payload, process.env.SECRETCODE, {
        // expiresIn: "2h",
      });
      user.password = undefined;
      const options = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "None",
        secure: true,
      };
      return res.status(200).cookie("token", token, options).json({
        success: true,
        token,
        user,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Incorrect Password",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Login failure, Try Again",
      Error: err,
    });
  }
};

exports.userDetails = async (req, res) => {
  try {
    const id = req.user._id;
    const user = await User.findById(id);
    user.password = undefined;
    return res.status(200).json({
      success: true,
      message: "user Details",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "unable to fetch user Details, Try Again",
      Error: err,
    });
  }
};

exports.isloggedin = async (req, res) => {
  try {
    // const token = req.cookies.token;
    const token = req.headers.authorization.split(" ")[1];
    if (!token || token == undefined) {
      return res.json({
        success: false,
        message: "Token missing",
      });
    } else {
      return res.json({
        success: true,
        message: "Token found",
      });
    }
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "something went wrong while verifying token",
    });
  }
};

exports.logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};



