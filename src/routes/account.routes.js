const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const accountController = require("../controllers/account.controller");

const router = express.Router();

/**
 * - POST api/accounts/
 * - Create a new account for the authenticated user
 * - Protected route, requires authentication
 */
router.post(
  "/",
  authMiddleware.authMiddleware,
  accountController.createAccountController,
);

router.get(
  "/",
  authMiddleware.authMiddleware,
  accountController.getUserAccountsController,
);

router.get(
  "/balance/:accountId",
  authMiddleware.authMiddleware,
  accountController.getAccountBalanceController,
);

module.exports = router;
