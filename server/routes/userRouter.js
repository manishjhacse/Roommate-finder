const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  userDetails,
  logOut,
  sendOtp,
  sendOtpToChangePassword,
  changePassword,
  isloggedin,
} = require("../controller/userController");
const { auth } = require("../auth/userAuth");
router.post("/signup", signup);
router.post("/login", login);
router.post("/sendotp", sendOtp);
router.delete("/logout", logOut);
router.get("/isloggedin", isloggedin);
router.post("/sendotptochangepassword", sendOtpToChangePassword);
router.post("/changepassword", changePassword);
router.get("/userdetails", auth, userDetails);
module.exports = router;
