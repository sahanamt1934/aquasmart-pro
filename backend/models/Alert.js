const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema(
  {
    city: String,
    rainfall_mm: Number,
    predicted_water_level: Number,
    status: {
      type: String,
      enum: ["SAFE", "WARNING", "DANGER"]
    },
    message: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", AlertSchema);
