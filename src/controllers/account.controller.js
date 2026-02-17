const accountModel = require("../models/account.model");

/**
 * - Create a new account for the authenticated user
 * - route POST /api/accounts/
 */
async function createAccountController(req, res) {
  const user = req.user;

  const account = await accountModel.create({
    user: user._id,
  });

  res.status(201).json({
    account,
  });
}

module.exports = { createAccountController };
