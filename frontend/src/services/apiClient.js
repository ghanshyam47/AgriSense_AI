import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

const client = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { Accept: "application/json" },
});

const authHeaders = (token) =>
  token ? { Authorization: `Bearer ${token}` } : {};

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

export const getMarketMSP = (crop) =>
  client.get(`/market/msp/${encodeURIComponent(crop)}`).then((r) => r.data);

export const getMarketTrend = (crop, state, days = 7) =>
  client
    .get(`/market/trend/${encodeURIComponent(crop)}`, {
      params: { state, days },
    })
    .then((r) => r.data);

export const getMarketAdvice = (crop, state) =>
  client
    .get(`/market/advice/${encodeURIComponent(crop)}`, { params: { state } })
    .then((r) => r.data);

// Weather
export const getForecast = (lat, lng) =>
  client.get("/weather/forecast", { params: { lat, lng } }).then((r) => r.data);

export const getCurrentWeather = (lat, lng) =>
  client.get("/weather/current", { params: { lat, lng } }).then((r) => r.data);

export const getAgriAlerts = (lat, lng) =>
  client
    .get("/weather/agri-alerts", { params: { lat, lng } })
    .then((r) => r.data);

export const getCommonPests = (crop) =>
  client.get(`/pest/common/${encodeURIComponent(crop)}`).then((r) => r.data);

// Chat
export const sendChatMessage = (body, token) =>
  client
    .post("/chat/message", body, { headers: authHeaders(token) })
    .then((r) => r.data);

export const processVoice = (body, token) =>
  client
    .post("/voice/process", body, { headers: authHeaders(token) })
    .then((r) => r.data);

export const translateVoice = (body) =>
  client.post("/voice/translate", body).then((r) => r.data);

// Alerts (auth required)
export const getAlerts = (token, params = {}) =>
  client
    .get("/alerts", { params, headers: authHeaders(token) })
    .then((r) => r.data);

export const getUnreadAlertsCount = (token) =>
  client
    .get("/alerts/unread", { headers: authHeaders(token) })
    .then((r) => r.data);

export const markAlertAsRead = (id, token) =>
  client
    .patch(`/alerts/${id}/read`, {}, { headers: authHeaders(token) })
    .then((r) => r.data);

export const deleteAlert = (id, token) =>
  client
    .delete(`/alerts/${id}`, { headers: authHeaders(token) })
    .then((r) => r.data);

// Profile / farm settings (auth required)
export const getProfile = (token) =>
  client
    .get("/auth/profile", { headers: authHeaders(token) })
    .then((r) => r.data);

export const updateProfile = (body, token) =>
  client
    .patch("/auth/profile", body, { headers: authHeaders(token) })
    .then((r) => r.data);

export const updateFarmProfile = (body, token) =>
  client
    .put("/auth/farm", body, { headers: authHeaders(token) })
    .then((r) => r.data);

export default client;
