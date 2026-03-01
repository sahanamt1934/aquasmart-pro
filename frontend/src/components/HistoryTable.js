import React from "react";

const HistoryTable = ({ data }) => {
  return (
    <div style={{ marginTop: "30px" }}>
      <h3>📜 Prediction History</h3>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>City</th>
            <th>Rainfall</th>
            <th>Water Level</th>
            <th>Status</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.city || "Manual"}</td>
              <td>{item.rainfall_mm}</td>
              <td>{item.predicted_water_level}</td>
              <td>{item.status}</td>
              <td>{new Date(item.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;
