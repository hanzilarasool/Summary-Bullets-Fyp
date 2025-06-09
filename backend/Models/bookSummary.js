const mongoose = require("mongoose");

const bookSummarySchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: "Untitled Chat",
  },
  originalText: String,
  summary: String,
  createdAt: {
    type: Date, 
    default: Date.now,
  },
});

module.exports = mongoose.model("BookSummary", bookSummarySchema);