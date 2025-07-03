const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  username: { // Add name field
    type: String,
    // required: true,
  },
  password: { // Add password field (stored temporarily, unhashed)
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Otp", otpSchema);