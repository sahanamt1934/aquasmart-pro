import React, { useState } from "react";
import { weatherPredict } from "../services/api";

const WeatherPredict = ({ onNewPrediction }) => {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handlePredict = async () => {
    if (!city) {
      setError("Please enter a city");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await weatherPredict(city);
      setResult(response.data);
      onNewPrediction(response.data.data); // send to parent
    } catch (err) {
      setError("Prediction failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: "30px" }}>
      <h2>🌦 Weather-based Prediction</h2>

      <input
        type="text"
        placeholder="Enter city (e.g. Bengaluru)"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ padding: "8px", width: "250px" }}
      />

      <button
        onClick={handlePredict}
        style={{ marginLeft: "10px", padding: "8px 15px" }}
      >
        {loading ? "Predicting..." : "Get Prediction"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Result</h3>
          <p><b>City:</b> {result.city}</p>
          <p><b>Rainfall:</b> {result.rainfall_mm} mm</p>
          <p><b>Water Level:</b> {result.data.predicted_water_level}</p>
          <p>
            <b>Status:</b>{" "}
            <span
              style={{
                color:
                  result.data.status === "DANGER"
                    ? "red"
                    : result.data.status === "WARNING"
                    ? "orange"
                    : "green"
              }}
            >
              {result.data.status}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default WeatherPredict;
