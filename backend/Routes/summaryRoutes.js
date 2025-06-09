const express = require("express");
const { generateSummary, getChats, createChat, deleteChat, getChatMessages ,generateAudio} = require("../Controllers/summaryController");
const { extractText } = require("../Controllers/uploadController");
const upload = require("../Middleware/upload");
const {isAdmin} = require("../Middleware/verifyAdmin");
// const authMiddleware = require("../Middleware/authMiddleware");

const router = express.Router();

router.post("/generate-summary", generateSummary);
router.post("/upload", upload.single("file"), extractText);
router.get("/chats/:userId", getChats);
router.get("/chats/:chatId/messages", getChatMessages);
router.post("/chats", createChat);
router.delete("/chats/:chatId",deleteChat);
router.post("/generate-audio", generateAudio); 

module.exports = router;