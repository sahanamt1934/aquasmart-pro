import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib

# 1. Expand Dataset Size for State-wide Generalization
rows = 7000 

# 2. Simulate Karnataka's Full Climatic Range
data = {
    # Rainfall: 0 (Arid North) to 300 (Coastal/Malnad Monsoons)
    'rainfall': np.random.uniform(0, 300, rows),
    # Temperature: 15°C (Winter/Elevated) to 46°C (Arid North Summers)
    'temperature': np.random.uniform(15, 46, rows),
    # Humidity: 15% (Dry inland) to 100% (Coastal humidity)
    'humidity': np.random.uniform(15, 100, rows),
    # Soil Types: 0:Red, 1:Black, 2:Laterite
    'soil_type': np.random.randint(0, 3, rows)
}

df = pd.DataFrame(data)

# 3. Physics-Based Features for Water Table Prediction
# Assign retention factors based on Karnataka soil physics
retention_factors = {0: 0.4, 1: 0.7, 2: 0.3} # Black soil (1) retains the most moisture
df['soil_moisture'] = df.apply(lambda x: x['rainfall'] * retention_factors[x['soil_type']], axis=1)

# 4. Target Calculation: Water Table Depth
# Table depth increases with heat (evaporation) and decreases with rain (recharge)
df['water_level'] = 30 + (df['temperature'] * 0.4) - (df['rainfall'] * 0.25) + np.random.normal(0, 5, rows)
df['water_level'] = df['water_level'].clip(2, 85) # Min 2m, Max 85m

# 5. Train & Save
X = df[['rainfall', 'temperature', 'humidity', 'soil_type', 'soil_moisture']]
y = df['water_level']
model = RandomForestRegressor(n_estimators=150, random_state=42)
model.fit(X, y)
joblib.dump(model, "model.pkl")
print("✅ Universal Model Trained for Karnataka Scope")