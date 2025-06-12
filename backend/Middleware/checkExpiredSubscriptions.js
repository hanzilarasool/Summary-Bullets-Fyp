const mongoose = require("mongoose");
const User = require("../Models/User");
const cron = require("node-cron");

// Run every day at midnight
cron.schedule('0 0 * * *', async () => {
  const now = new Date();
  const expiredUsers = await User.find({ expiresAt: { $ne: null, $lt: now } });
  for (const user of expiredUsers) {
    user.isPremium = false;
    user.plan = "free";
    user.subscription.summaryRequestsUsed = 0;
    user.subscription.pdfDownloadsUsed = 0;
    user.subscription.downloadHistory = [];
    user.expiresAt = null;
    await user.save();
    // Optionally, send email to user
  }
  console.log(`Checked and reset ${expiredUsers.length} expired subscriptions.`);
});

