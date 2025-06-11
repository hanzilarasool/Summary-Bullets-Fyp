// // controllers/privacyController.js
// const Privacy = require("../Models/privacy");
// const catchAsyncErrors = require("../Middleware/catchAsyncErrors");

// exports.getPrivacy = catchAsyncErrors(async (req, res) => {
//   let privacy = await Privacy.findOne();

//   // If not found, create a default one
//   if (!privacy) {
//     privacy = new Privacy({ content: "privacy content" });
//     await privacy.save();
//   }

//   res.status(200).json(privacy);
// });

// // Update privacy content
// exports.updatePrivacy = catchAsyncErrors(async (req, res) => {
//   try {
//     let privacy = await Privacy.findOne();
//     console.log(privacy.content)
//     console.log(req.body, "req.body");
//     if (!privacy) {
//       privacy = new Privacy(req.body);
//     } else {
//       Object.assign(privacy, req.body);
//     }
//     const updatedPrivacy = await privacy.save();
//     res.status(200).json(updatedPrivacy);
//   } catch (error) {
//     res.status(400).json({
//       message: "Error updating privacy content",
//       error: error.message,
//     });
//   }
// });


// exports.createPrivacy = catchAsyncErrors(async (req, res) => {
//   try {
//     const privacy = new Privacy(req.body);
//     const createdPrivacy = await privacy.save();
//     res.status(201).json(createdPrivacy);
//   } catch (error) {
//     res.status(400).json({
//       message: "Error creating privacy content",
//       error: error.message,
//     });
//   }
// });
const Privacy = require("../Models/privacy");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");

exports.getPrivacy = catchAsyncErrors(async (req, res) => {
  let privacy = await Privacy.findOne();

  // If not found, create a default one
  if (!privacy) {
    privacy = new Privacy({ content: JSON.stringify([]) }); // Default to empty BlockNote content
    await privacy.save();
  }

  res.status(200).json(privacy);
});

exports.updatePrivacy = catchAsyncErrors(async (req, res) => {
  try {
    let privacy = await Privacy.findOne();
    console.log(req.body, "req.body");
    if (!privacy) {
      privacy = new Privacy({ content: req.body.content || JSON.stringify([]) });
    } else {
      privacy.content = req.body.content || JSON.stringify([]); // Update content field
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
    const privacy = new Privacy({ content: req.body.content || JSON.stringify([]) });
    const createdPrivacy = await privacy.save();
    res.status(201).json(createdPrivacy);
  } catch (error) {
    res.status(400).json({
      message: "Error creating privacy content",
      error: error.message,
    });
  }
});