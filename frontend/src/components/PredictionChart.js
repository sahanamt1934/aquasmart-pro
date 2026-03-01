import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const PredictionChart = ({ data }) => {
  return (
    <div>
      <h3>📈 Water Level Trend</h3>
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="rainfall_mm" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="predicted_water_level"
          stroke="#007bff"
        />
      </LineChart>
    </div>
  );
};

export default PredictionChart;
