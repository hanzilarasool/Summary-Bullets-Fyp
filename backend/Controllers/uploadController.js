// controllers/uploadController.js
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const extractText = async (req, res) => {
  const file = req.file;
  let text = "";

  try {
    if (file.mimetype === "application/pdf") {
      const data = await pdfParse(file.buffer);
      text = data.text;
    } else if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      text = result.value;
    } else {
      return res.status(400).json({ error: "Unsupported file type." });
    }

    res.status(200).json({ text });
  } catch (err) {
    console.error("Text extraction error:", err);
    res.status(500).json({ error: "Text extraction failed." });
  }
};

module.exports = { extractText };
