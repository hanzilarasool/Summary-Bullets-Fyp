const User = require("../Models/User");

module.exports = async function checkSubscription(req, res, next) {
  const userId = req.user.id;
  const user = await User.findById(userId);

  if (user && user.expiresAt && new Date(user.expiresAt) < new Date()) {
    // Subscription expired: reset user
    user.isPremium = false;
    user.plan = "free";
    user.subscription.summaryRequestsUsed = 0;
    user.subscription.pdfDownloadsUsed = 0;
    user.subscription.downloadHistory = [];
    user.expiresAt = null;
    await user.save();
    // Optionally, notify the user to renew subscription
    return res.status(403).json({
      message: "Your subscription has expired. Please renew to continue using premium features.",
    });
  }

  // Attach user to req for further use
  req.userObj = user;
  next();
};

// implement this in frontend
// const isExpired = expiresAt && new Date(expiresAt) < new Date();
// if (isExpired) {
//   // Show "Your subscription expired, please renew!" message
// }