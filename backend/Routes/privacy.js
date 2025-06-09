const express = require("express");
const router = express.Router();
const verifyToken = require("../utils/verifyUser");
const {
  getPrivacy,
  updatePrivacy,
  createPrivacy
} = require("../Controllers/privacyController");

router.route("/getprivacy").get(getPrivacy);
router.route("/privacy").put(verifyToken.verifyToken, updatePrivacy);
router.route("/createprivacy").post(verifyToken.verifyToken, createPrivacy);

module.exports = router;
