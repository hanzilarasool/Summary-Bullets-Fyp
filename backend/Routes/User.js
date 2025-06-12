const express = require("express");
const { subscribeUser, handleWebhook } = require("../Controllers/subscriptionController");
const {
  signin,
  signout,
  signup,
  changeEmail, 
  changePassword,
  protectedRoute,
  updatePDFDownload,
  getUser,
  createSummaryRequest,
  sendSummaryRequest
} = require("../Controllers/userController");
const verifyToken = require("../utils/verifyUser");
const router = express.Router();
 
router.route("/signin").post(signin);
router.route("/signup").post(signup);
router.route("/signout").post(signout);
router.route("/changeEmail").put(verifyToken.verifyToken, changeEmail);
router.route("/changePassword").put(verifyToken.verifyToken, changePassword);
router.route("/protectedRoute").post(verifyToken.verifyToken, protectedRoute);
// router.post("/subscribe", verifyToken.verifyToken, subscribeUser);
// router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);
router.route("/update-pdf-download").post(updatePDFDownload);
router.route("/user/:userId").get(verifyToken.verifyToken, getUser);

router.route("/summary-request").post(verifyToken.verifyToken, createSummaryRequest);
router.route("/send-summary-request").post(verifyToken.verifyToken, sendSummaryRequest);

module.exports = router;