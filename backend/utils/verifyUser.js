const jwt = require("jsonwebtoken");
const { errorHandler } = require("./error.js");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");

exports.verifyToken = catchAsyncErrors(async (req, res, next) => {
  let token = req.cookies.access_token;

  if (!token && req.headers.authorization) {
    console.log("Token not found in cookies, checking Authorization header");
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    console.log("No token found in cookies or Authorization header");
    return next(errorHandler(401, "Unauthorized"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Token verification failed:", err);
      return next(errorHandler(401, "Unauthorized"));
    }
    console.log("Token verified successfully for user:", user.id);
    req.user = user;
    next();
  });
});
