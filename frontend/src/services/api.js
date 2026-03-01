import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000"
});

export const weatherPredict = (city) => {
  return API.post("/weather-predict", { city });
};

export default API;
