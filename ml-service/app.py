from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

model = joblib.load("model.pkl")

CROP_DATA = {
    "Ragi": {"base_need": 3.46, "msg": "Drought-hardy."},
    "Sugarcane": {"base_need": 6.44, "msg": "High demand."},
    "Maize": {"base_need": 5.50, "msg": "Critical at silking."},
    "Groundnut": {"base_need": 4.45, "msg": "Critical at pod stage."}
}

class AdvisoryInput(BaseModel):
    city: str
    crop_type: str
    growth_stage: str
    soil_type: str # ✅ String input
    rainfall: float
    temperature: float
    humidity: float
    soil_moisture: float
    wind_speed: float = 0.0

@app.post("/predict")
def predict(data: AdvisoryInput):
    # ✅ Map string to numeric for model.pkl
    soil_mapping = {"Red": 0, "Black": 1, "Laterite": 2}
    soil_numeric = soil_mapping.get(data.soil_type, 0)

    features = pd.DataFrame(
        [[data.rainfall, data.temperature, data.humidity, soil_numeric, data.soil_moisture]], 
        columns=["rainfall", "temperature", "humidity", "soil_type", "soil_moisture"]
    )
    predicted_level = model.predict(features)[0]

    stage_map = {"Seedling": 0.5, "Vegetative": 1.0, "Reproductive": 1.2, "Maturity": 0.8}
    multiplier = stage_map.get(data.growth_stage, 1.0)
    crop_info = CROP_DATA.get(data.crop_type, {"base_need": 5.0})
    dynamic_need = crop_info["base_need"] * multiplier
    
    deficit = dynamic_need - (data.rainfall + (data.soil_moisture * 0.4))
    status = "SAFE" if deficit <= 0 else "WARNING" if deficit < 2.5 else "DANGER"

    return {
        "predicted_water_level": round(float(predicted_level), 2),
        "status": status,
        "advice": f"Stage: {data.growth_stage}. {crop_info['msg']}",
        "crop": data.crop_type,
        "dynamic_need": round(dynamic_need, 2),
        "temperature": data.temperature,
        "humidity": data.humidity,
        "wind_speed": data.wind_speed,
        "city": data.city
    }