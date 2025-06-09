const jwt = require("jsonwebtoken");
const { errorHandler } = require("../utils/error");

exports.verifyAdmin = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(errorHandler(401, "Unauthorized"));

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(errorHandler(403, "Invalid token"));

    if (decoded.role !== "admin") {
      return next(errorHandler(403, "Admin access required"));
    }

    req.user = decoded; // { id, role }
    next();
  });
};
