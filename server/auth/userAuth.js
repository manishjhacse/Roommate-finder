const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.auth = (req, res, next) => {
  try {
      const token = req.headers.authorization.split(" ")[1];
    //  const token = req.cookies.token;
      if (!token || token === undefined) {
          return res.status(401).json({
              success: false,
              message: "Unauthorised",
            });
        }
    try {
      const payload = jwt.verify(token, process.env.SECRETCODE);
      req.user = payload;
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Unauthorised",
      });
    }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "something went wrong while verifying token",
    });
  }
};
