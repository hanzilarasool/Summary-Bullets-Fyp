const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { 
      type: String, 
      required: [true, "Username is required"], 
      trim: true, 
      unique: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"]
    },
    email: { 
      type: String, 
      required: [true, "Email is required"], 
      trim: true, 
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    password: { 
      type: String, 
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"]
    },
    role: { 
      type: String, 
      enum: ["admin", "user"], 
      default: "user" 
    },
    isPremium: { 
      type: Boolean, 
      default: false 
    },
    plan: {
      type: String,
      enum: ["free", "basic", "standard", "premium"],
      default: "free",
    },
    subscription: {
      summaryRequestsUsed: { type: Number, default: 0 },
      pdfDownloadsUsed: { type: Number, default: 0 },
      downloadHistory: [{ type: String }],
    },
    expiresAt: { type: Date }, // <-- moved here
    stripeCustomerId: String,
  },
  { timestamps: true }
);

// Indexes
userSchema.index({ username: 1 }, { unique: true, sparse: false });
userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);