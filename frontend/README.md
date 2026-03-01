# AquaSmart Pro: IoT & ML-Based Precision Irrigation

An intelligent irrigation advisory system that combines **Live Weather Data**, **Soil Characteristics**, and **Crop Growth Stages** to provide real-time water management.

## 🚀 Tech Stack
- **Frontend:** React.js (Tailwind CSS, Recharts)
- **Backend:** Node.js & Express.js
- **Database:** MongoDB Atlas
- **ML Service:** Python (FastAPI)
- **Machine Learning:** Random Forest Classifier (Scikit-Learn)
- **API:** OpenWeatherMap API

## 🧠 System Logic
The system uses a **Hybrid Intelligence** approach:
1. **Weather Analysis:** Fetches real-time Temp, Humidity, and Rainfall.
2. **ML Prediction:** Uses a Random Forest model to predict baseline water requirements.
3. **Agronomic Adjustment:** Applies multipliers based on the **Crop Type** and **Growth Stage** (Seedling, Vegetative, Reproductive, Maturity).

## 📊 Status Indicators
- ✅ **Notice/Safe:** Soil moisture is sufficient. No irrigation needed.
- ⚠️ **Warning:** High evapotranspiration detected. Plan for irrigation.
- 🚨 **Danger:** Critical water deficit at a sensitive growth stage. Irrigate immediately.

## 🛠️ Project Structure
- `/frontend`: React dashboard for data visualization.
- `/backend`: Node.js server handling API integration and database logic.
- `/ml-service`: Python FastAPI service hosting the `model.pkl`.
