const mongoose = require("mongoose");

const privacySchema = new mongoose.Schema(
  {
    content: { 
      type: String,
      default: "",
    },
 
  },
  

  { timestamps: true }
);

const Privacy = mongoose.model("Privacy", privacySchema);

module.exports = Privacy;
