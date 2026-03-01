require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");
const Prediction = require("./models/Prediction");

const app = express();
app.use(cors());
app.use(express.json());

// 1. Better Database Connection Handling
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Database Synced & Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));

app.post("/weather-predict", async (req, res) => {
    try {
        const { city, crop_type, growth_stage, soil_type } = req.body;

        // 2. Weather API Logic (Handling Coordinates vs City Name)
        let weatherUrl;
        if (city.includes(",")) {
            const [lat, lon] = city.split(",").map(coord => coord.trim());
            weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`;
        } else {
            weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`;
        }

        const weatherRes = await axios.get(weatherUrl);
        const weatherData = weatherRes.data;
        
        // OpenWeather rain data can be in '1h' or '3h' or missing entirely
        const rain = weatherData.rain ? (weatherData.rain["1h"] || weatherData.rain["3h"] || 0) : 0;

        // 3. ML Service Call (With Timeout and Error Handling)
        // Ensure your Python app.py is running on port 8000!
        const mlRes = await axios.post("http://127.0.0.1:8000/predict", {
            city: weatherData.name,
            crop_type,
            growth_stage,
            soil_type, 
            rainfall: rain,
            temperature: weatherData.main.temp,
            humidity: weatherData.main.humidity,
            soil_moisture: rain * 0.6, // Placeholder logic
            wind_speed: weatherData.wind.speed
        }, { timeout: 5000 }); // 5 second timeout so Node doesn't hang

        const saved = await Prediction.create({ 
            ...mlRes.data, 
            rainfall: rain,
            location: weatherData.name 
        });

        res.json({ success: true, data: saved });

    } catch (err) {
        console.error("❌ Service Error:", err.response?.data || err.message);
        
        // Differentiate between Weather API errors and ML Service errors
        const status = err.response?.status || 500;
        const message = err.code === 'ECONNREFUSED' 
            ? "ML Python Service is not running on Port 8000" 
            : "Internal Service Error";
            
        res.status(status).json({ error: message });
    }
});

app.get("/predictions", async (req, res) => {
    try {
        const data = await Prediction.find().sort({ createdAt: -1 }).limit(10);
        res.json({ data });
    } catch (err) {
        res.status(500).json({ error: "Could not fetch history" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));