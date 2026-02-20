const userModel = require("../models/user.model");
const tokenBlacklistModel = require("../models/blackList.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");

/**
 * - user register controller
 * - route POST /api/auth/register
 */
async function userRegisterController(req, res) {
  const { email, name, password } = req.body;

  const isUserExists = userModel.findOne({ email });
  if (!isUserExists) {
    return res.status(422).json({
      message: "User already exists with this Email.",
      status: "failed",
    });
  }

  const user = await userModel.create({
    email,
    name,
    password,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token);

  res.status(201).json({
    message: "User registered successfully.",
    status: "success",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  });

  await emailService.sendRegistrationEmail(user.email, user.name);
}

/**
 * - user login controller
 * - route POST /api/auth/login
 */
async function userLoginController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password.",
      status: "failed",
    });
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return res.status(401).json({
      message: "Invalid email or password.",
      status: "failed",
    });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token);

  res.status(200).json({
    message: "User logged in successfully.",
    status: "success",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  });
}

/**
 * - user logout controller
 * - route POST /api/auth/logout
 */
async function userLogoutController(req, res) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({
      message: "Unauthorized. No token provided.",
      status: "failed",
    });
  }

  res.clearCookie("token");

  await tokenBlacklistModel.create({
    token,
  });

  res.status(200).json({
    message: "User logged out successfully.",
    status: "success",
  });
}

module.exports = {
  userRegisterController,
  userLoginController,
  userLogoutController,
};
