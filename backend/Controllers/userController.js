const User = require("../Models/User.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const { errorHandler } = require("../utils/error.js");
require("dotenv").config();
const SummaryRequest = require("../Models/SummaryRequest.js");
const nodemailer = require("nodemailer");
require("dotenv").config();


// Configure Nodemailer transporter (replace with your credentials)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Replace with your Gmail address
    pass: process.env.EMAIL_PASS,    // Replace with your app-specific password
  },
});
// user-controller.js (partial)
exports.updatePDFDownload = catchAsyncErrors(async (req, res, next) => {
  const { userId, bookId } = req.body;

  try {
    console.log("Updating PDF download for userId:", userId, "bookId:", bookId); // Debug log
    const user = await User.findById(userId);
    if (!user) return next(errorHandler(404, "User not found"));

    console.log("User found:", user); // Debug log
    if (!user.subscription.downloadHistory.includes(bookId)) {
      user.subscription.pdfDownloadsUsed += 1;
      user.subscription.downloadHistory = user.subscription.downloadHistory || [];
      user.subscription.downloadHistory.push(bookId);
      await user.save({ validateBeforeSave: false }); // Skip validation if needed
      console.log("User updated:", user); // Debug log
    } else {
      console.log("Book already in download history, no update needed");
    }

    res.status(200).json({ message: "PDF download count updated", user });
  } catch (error) {
    console.error("Error in updatePDFDownload:", error.message, error.stack); // Detailed error log
    next(errorHandler(500, "Failed to update PDF download count: " + error.message));
  }
});
exports.getUser = catchAsyncErrors(async (req, res, next) => {
  const { userId } = req.params; // Get userId from URL parameter

  try {
    const user = await User.findById(userId).select("-password"); // Exclude password
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).json(user); // Return user data
  } catch (error) {
    next(errorHandler(500, "Failed to fetch user data"));
  }
});
exports.signin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password || email.trim() === "" || password.trim() === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return next(errorHandler(404, "User not found"));
  }

  // Validate password
  const isPasswordValid = bcryptjs.compareSync(password, user.password);
  if (!isPasswordValid) {
    return next(errorHandler(400, "Invalid password"));
  }

  // Generate JWT token with role info
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET, 
    { expiresIn: "7d" }
  );

  // Prepare user data excluding password
  const { password: _, ...userData } = user._doc;

  // Send response with cookie and also send token in body
  // res
  //   .status(200)
  //   .cookie("access_token", token, {
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: "strict",
  //   })
  //   .json({
  //     token,
  //     user: userData
  //   }); 
  res
  .status(200)
  .cookie("access_token", token, {
    httpOnly: true,
    secure: true,           // REQUIRED for cross-site and production
    sameSite: "none",       // REQUIRED for cross-site cookies
    // domain: ".yourdomain.com", // Optional if you use a custom domain with subdomains
  })
  .json({
    token,
    user: userData
  });
});

exports.signout = catchAsyncErrors(async (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    next(error);
  }
});

exports.protectedRoute = catchAsyncErrors(async (req, res, next) => {
  try {
    res.status(200).json({ message: "This is a protected route" });
  } catch (error) {
    next(error);
  }
});

exports.signup = catchAsyncErrors(async (req, res, next) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password || username.trim() === "" || email.trim() === "" || password.trim() === "") {
    return next(errorHandler(400, "Username, email, and password are required"));
  }

  // Check for existing username or email
  const existingUser = await User.findOne({ $or: [{ username: username.trim() }, { email: email.trim() }] });
  if (existingUser) {
    return next(errorHandler(400, existingUser.username === username.trim() ? "Username already in use" : "Email already in use"));
  }

  // Validate password length (optional, for better security)
  if (password.length < 6) {
    return next(errorHandler(400, "Password must be at least 6 characters long"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username: username.trim(),
    email: email.trim(),
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Signup error:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return next(errorHandler(400, `${field} already in use`));
    }
    next(errorHandler(500, "Failed to create user"));
  }
});

exports.changePassword = catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!currentPassword || !newPassword) {
    return next(
      errorHandler(400, "Current password and new password are required")
    );
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    // Verify current password
    const isPasswordCorrect = bcryptjs.compareSync(
      currentPassword,
      user.password
    );
    if (!isPasswordCorrect) {
      return next(errorHandler(400, "Current password is incorrect"));
    }

    // Hash new password
    const hashedNewPassword = bcryptjs.hashSync(newPassword, 10);
    user.password = hashedNewPassword;

    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
});

exports.changeEmail = catchAsyncErrors(async (req, res, next) => {
  const { newEmail } = req.body;
  const userId = req.user.id;

  if (!newEmail) {
    return next(errorHandler(400, "New email is required"));
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser && existingUser._id.toString() !== userId) {
      return next(errorHandler(400, "Email is already in use"));
    }

    user.email = newEmail;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    const { password, ...rest } = user._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: false,
      })
      .json({
        message: "Email updated successfully",
        user: rest,
      });
  } catch (error) {
    next(error);
  }
});

// create summary request controller
exports.createSummaryRequest = catchAsyncErrors(async (req, res, next) => {
  const { userId, bookName, userEmail, status } = req.body;

  try {
    const summaryRequest = new SummaryRequest({
      userId,
      bookName,
      userEmail,
      status,
    });
    await summaryRequest.save();

    res.status(201).json({ message: "Summary request created", summaryRequest });
  } catch (error) {
    next(errorHandler(500, "Failed to create summary request: " + error.message));
  }
});

exports.sendSummaryRequest = catchAsyncErrors(async (req, res, next) => {
  const { userId, bookName, userEmail, status } = req.body;

  try {
    // Validate required fields
    if (!userId || !bookName || !userEmail || !status) {
      return next(errorHandler(400, "Missing required fields: userId, bookName, userEmail, or status"));
    }

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Summary Request",
      text: `New summary request received at ${new Date().toLocaleString("PKT", { timeZone: "Asia/Karachi" })}:\nUser ID: ${userId}\nBook Name: ${bookName}\nUser Email: ${userEmail}\nStatus: ${status}`,
      html: `<p>New summary request received at ${new Date().toLocaleString("PKT", { timeZone: "Asia/Karachi" })}:</p><ul><li>User ID: ${userId}</li><li>Book Name: ${bookName}</li><li>User Email: ${userEmail}</li><li>Status: ${status}</li></ul>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);

    // Store summary request in database
    const summaryRequest = new SummaryRequest({
      userId,
      bookName,
      userEmail,
      status,
    });
    await summaryRequest.save();
    console.log("Summary request stored:", summaryRequest._id);

    // Update user's summaryRequestsUsed (server-side limit enforcement)
    const user = await User.findById(userId);
    if (!user) {
      console.warn("User not found for ID:", userId);
    } else {
      user.subscription.summaryRequestsUsed = (user.subscription.summaryRequestsUsed || 0) + 1;
      await user.save({ validateBeforeSave: false }); // Skip validation to avoid issues
      console.log("User summaryRequestsUsed updated:", user.subscription.summaryRequestsUsed);
    }

    res.status(200).json({
      message: "Summary request sent and stored successfully",
      summaryRequest,
      userUpdated: user ? true : false,
    });
  } catch (error) {
    console.error("Error in sendSummaryRequest:", error.message, error.stack);
    if (error.code === "EAUTH" || error.responseCode === 535) {
      return next(errorHandler(500, "Failed to send email: Invalid credentials. Please check your email settings."));
    }
    next(errorHandler(500, "Failed to send summary request: " + error.message));
  }
});


// admin summary request /response routes
// Admin: Get all summary requests
exports.getAllSummaryRequests = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
    const requests = await SummaryRequest.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, requests });
  } catch (err) {
    next(err);
  }
};

// Admin: Update status of a summary request
exports.updateSummaryRequestStatus = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
    const { id } = req.params;
    const { status } = req.body;
    if (!["pending", "processed", "rejected"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const reqDoc = await SummaryRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!reqDoc) return res.status(404).json({ message: "Request not found" });
    res.status(200).json({ success: true, request: reqDoc });
  } catch (err) {
    next(err);
  }
};

// Admin: Send summary fulfilled email & mark as processed
exports.sendSummaryFulfilled = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
    const { requestId, email, message } = req.body;
    if (!requestId || !email || !message)
      return res.status(400).json({ message: "Missing required fields" });

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Book Summary Request is Fulfilled!",
      text: message,
      html: `<p>${message}</p>`,
    };
    await transporter.sendMail(mailOptions);

    // Update request status
    const reqDoc = await SummaryRequest.findByIdAndUpdate(
      requestId,
      { status: "processed" },
      { new: true }
    );
    res.status(200).json({ success: true, request: reqDoc });
  } catch (err) {
    next(err);
  }
};