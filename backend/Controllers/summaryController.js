// controllers/summaryController.js
const { OpenAI } = require("openai");
require("dotenv").config();
const BookSummary = require("../Models/bookSummary");
const Chat = require('../Models/Chat');
const axios = require("axios");


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });



const generateSummary = async (req, res) => {
  const { text, model = "gpt-3.5-turbo", temperature = 0.5 } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "You are a helpful book summarizer." },
        { role: "user", content: `Summarize the following book content in bullet points:\n${text}` },
      ],
      temperature: parseFloat(temperature), // Use provided temperature
    });

    const summary = completion.choices[0].message.content;
    
    const bookSummary = new BookSummary({
      chatId: req.body.chatId,
      userId: req.body.userId,
      originalText: text,
      summary,
    });
    await bookSummary.save();

    res.status(200).json({ summary });
  } catch (error) {
    console.error("Summary error:", error);
    res.status(500).json({ error: "Failed to generate summary." });
  }
};


const path = require("path");
const fs = require("fs");

const generateAudio = async (req, res) => {
  const { text, bookName, voice = "alloy" } = req.body;
  const filePath = path.join(__dirname, `../audios/${bookName}-${voice}.mp3`);

  // If audio already exists, serve it
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }

  try {
    const audioResponse = await openai.audio.speech.create({
      model: "tts-1",
      voice,
      input: text,
    });

    const buffer = Buffer.from(await audioResponse.arrayBuffer());
    fs.writeFileSync(filePath, buffer); // Save to disk

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": `attachment; filename="${bookName}-summary.mp3"`,
    });
    res.send(buffer);
  } catch (error) {
    console.error("Audio generation error:", error);
    res.status(500).json({ error: "Failed to generate audio." });
  }
};


const getChats = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ error: "userId is required." });
  }

  try {
    const chats = await Chat.find({ userId })
      .select("_id title createdAt")
      .sort({ createdAt: -1 });
    res.status(200).json(chats.map(chat => ({
      _id: chat._id,
      title: chat.title,
      createdAt: chat.createdAt
    })));
  } catch (error) {
    console.error("Get chats error:", error);
    res.status(500).json({ error: "Failed to fetch chats." });
  }
};

const getChatMessages = async (req, res) => {
  const { chatId } = req.params;
  if (!chatId) {
    return res.status(400).json({ error: "chatId is required." });
  }

  try {
    const messages = await BookSummary.find({ chatId })
      .sort({ createdAt: 1 })
      .select("originalText summary _id createdAt");
    res.status(200).json(messages);
  } catch (error) {
    console.error("Get chat messages error:", error);
    res.status(500).json({ error: "Failed to fetch chat messages." });
  }
};

const createChat = async (req, res) => {
  try {
    const { userId, title } = req.body;
    if (!userId || !title) {
      return res.status(400).json({ error: "User ID and title are required." });
    }
    const chat = new Chat({ userId, title });
    await chat.save();
    res.status(201).json({ chatId: chat._id, title: chat.title });
  } catch (error) {
    console.error("Create chat error:", error);
    res.status(500).json({ error: "Failed to create chat." });
  }
};

const deleteChat = async (req, res) => {
  const { chatId } = req.params;
  if (!chatId) {
    return res.status(400).json({ error: "chatId is required." });
  }

  try {
    // Delete BookSummary documents
    await BookSummary.deleteMany({ chatId });
    // Delete Chat document
    await Chat.findByIdAndDelete(chatId);
    res.status(200).json({ message: "Chat deleted successfully." });
  } catch (error) {
    console.error("Delete chat error:", error);
    res.status(500).json({ error: "Failed to delete chat." });
  }
};

module.exports = { generateSummary, getChats, getChatMessages, createChat, deleteChat ,generateAudio };