const express = require("express");
const router = express.Router();
const subscriptionController = require("../Controllers/subscriptionController");
const verifyToken = require("../utils/verifyUser");

// ✅ Webhook — raw body required, handled at app.js level


// 🔐 Subscribe requires auth
router.post("/subscribe", verifyToken.verifyToken, subscriptionController.subscribeUser);
router.get("/getsubscriptionstatus", verifyToken.verifyToken, subscriptionController.getSubscriptionStatus);
module.exports = router;

