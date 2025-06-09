// controllers/privacyController.js
const Privacy = require("../Models/privacy");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
exports.getPrivacy = catchAsyncErrors(async (req, res) => {
  try {
    const privacy = await Privacy.findOne();
    if (!privacy) {
      return res.status(404).json({ message: "Privacy content not found" });
    }
    res.status(200).json(privacy);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching privacy content",
      error: error.message,
    });
  }
});

// Update privacy content
exports.updatePrivacy = catchAsyncErrors(async (req, res) => {
  try {
    let privacy = await Privacy.findOne();
    console.log(privacy.content)
    if (!privacy) {
      privacy = new Privacy(req.body);
    } else {
      Object.assign(privacy, req.body);
    }
    const updatedPrivacy = await privacy.save();
    res.status(200).json(updatedPrivacy);
  } catch (error) {
    res.status(400).json({
      message: "Error updating privacy content",
      error: error.message,
    });
  }
});
exports.createPrivacy = catchAsyncErrors(async (req, res) => {
  try {
    const privacy = new Privacy(req.body);
    const createdPrivacy = await privacy.save();
    res.status(201).json(createdPrivacy);
  } catch (error) {
    res.status(400).json({
      message: "Error creating privacy content",
      error: error.message,
    });
  }
});