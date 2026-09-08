const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

const protect = (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return next(new AppError("Not authorized, no access token", 401));
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decoded.type !== "access") {
      return next(new AppError("Invalid token type", 401));
    }
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Access token expired", 401));
    }
    return next(new AppError("Invalid access token", 401));
  }
};

module.exports = protect;
