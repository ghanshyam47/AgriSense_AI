import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

const client = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { Accept: "application/json" },
});

// Health
export const getHealth = () => client.get("/health").then((r) => r.data);

// Crop recommendation (accepts either technical or simple body)
export const recommendCrop = (body) =>
  client.post("/crop/recommend", body).then((r) => r.data);

// Crop info
export const getCropInfo = (cropName) =>
  client.get(`/crop/info/${encodeURIComponent(cropName)}`).then((r) => r.data);

// Irrigation plan
export const planIrrigation = (body) =>
  client.post("/irrigation/plan", body).then((r) => r.data);

// Pest detect (multipart/form-data)
export const detectPest = (file) => {
  const form = new FormData();
  form.append("image", file);
  return client
    .post("/pest/detect", form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
};

// Market
export const getMarketPrices = (crop, state) =>
  client
    .get(`/market/prices/${encodeURIComponent(crop)}`, { params: { state } })
    .then((r) => r.data);

// Weather
export const getForecast = (lat, lng) =>
  client.get("/weather/forecast", { params: { lat, lng } }).then((r) => r.data);

// Chat
export const sendChatMessage = (body) =>
  client.post("/chat/message", body).then((r) => r.data);

export default client;
