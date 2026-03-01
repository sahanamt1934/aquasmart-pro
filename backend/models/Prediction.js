const mongoose = require("mongoose");

const PredictionSchema = new mongoose.Schema({
  city: String,
  crop: String,
  rainfall: Number,
  temperature: Number,  // New field
  humidity: Number,     // New field
  wind_speed: Number,   // New field
  predicted_water_level: Number,
  status: String,
  advice: String,
  dynamic_need: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Prediction", PredictionSchema);