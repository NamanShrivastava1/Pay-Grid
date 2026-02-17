const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Transaction must have a source account."],
      index: true,
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Transaction must have a destination account."],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
        message:
          "Status must be either PENDING, COMPLETED, FAILED or REVERSED.",
      },
      default: "PENDING",
    },
    amount: {
      type: Number,
      required: [true, "Transaction must have an amount."],
      min: [0, "Transaction amount must be a positive number."],
    },
    idempotencyKey: {
      type: String,
      required: [true, "Transaction must have an idempotency key."],
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const transactionModel = mongoose.model("transaction", transactionSchema);

module.exports = transactionModel;
