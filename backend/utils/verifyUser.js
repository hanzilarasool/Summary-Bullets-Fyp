const jwt = require("jsonwebtoken");
const { errorHandler } = require("./error.js");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const User = require("../Models/User"); // Add this

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

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err);
      return next(errorHandler(401, "Unauthorized"));
    }

    // Re-fetch user to get up-to-date role
    const user = await User.findById(decoded.id);
    if (!user) return next(errorHandler(404, "User not found"));

    req.user = {
      id: user._id,
      role: user.role,
      email: user.email,
    };

    console.log("Token verified. User ID:", req.user.id, "Role:", req.user.role);
    next();
  });
});
