const userModel = require("../models/user.model");
const tokenBlacklistModel = require("../models/blackList.model");
const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized. No token provided.",
      status: "failed",
    });
  }

  const isBlacklisted = await tokenBlacklistModel.findOne({ token });

  if (isBlacklisted) {
    return res.status(401).json({
      message: "Unauthorized. Token is blacklisted.",
      status: "failed",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized. Invalid token.",
      status: "failed",
    });
  }
}

async function systemUserMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized. No token provided.",
      status: "failed",
    });
  }

  const isBlacklisted = await tokenBlacklistModel.findOne({ token });

  if (isBlacklisted) {
    return res.status(401).json({
      message: "Unauthorized. Token is blacklisted.",
      status: "failed",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id).select("+systemUser");

    if (!user.systemUser) {
      return res.status(403).json({
        message: "Unauthorized. User is not a system user.",
        status: "failed",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized. Invalid token.",
      status: "failed",
    });
  }
}

module.exports = { authMiddleware, systemUserMiddleware };
