import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

const client = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { Accept: "application/json" },
});

// ── Auth token management ────────────────────────────
export const setAuthToken = (token) => {
  if (token) {
    client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common["Authorization"];
  }
};

// ── Health ────────────────────────────────────────────
export const getHealth = () =>
  client.get("/health").then((r) => r.data);

// ── Auth / Profile ───────────────────────────────────
export const getProfile = () =>
  client.get("/auth/profile").then((r) => r.data);

export const updateProfile = (body) =>
  client.patch("/auth/profile", body).then((r) => r.data);

export const updateFarmProfile = (body) =>
  client.put("/auth/farm", body).then((r) => r.data);

export const addFarm = (body) =>
  client.post("/auth/farms", body).then((r) => r.data);

export const deleteFarm = (farmId) =>
  client.delete(`/auth/farms/${farmId}`).then((r) => r.data);

// ── Crop ─────────────────────────────────────────────
export const recommendCrop = (body) =>
  client.post("/crop/recommend", body).then((r) => r.data);

export const getCropInfo = (cropName) =>
  client.get(`/crop/info/${encodeURIComponent(cropName)}`).then((r) => r.data);

// ── Pest ─────────────────────────────────────────────
export const detectPest = (file) => {
  const form = new FormData();
  form.append("image", file);
  return client
    .post("/pest/detect", form, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
    })
    .then((r) => r.data);
};

export const getCommonPests = (crop) =>
  client.get(`/pest/common/${encodeURIComponent(crop)}`).then((r) => r.data);

// ── Irrigation ───────────────────────────────────────
export const planIrrigation = (body) =>
  client.post("/irrigation/plan", body).then((r) => r.data);

export const getIrrigationToday = (lat, lng, crop, soil_type) =>
  client
    .get("/irrigation/today", { params: { lat, lng, crop, soil_type } })
    .then((r) => r.data);

// ── Market ───────────────────────────────────────────
export const getMarketPrices = (crop, state) =>
  client
    .get(`/market/prices/${encodeURIComponent(crop)}`, { params: { state } })
    .then((r) => r.data);

export const getMarketMSP = (crop) =>
  client
    .get(`/market/msp/${encodeURIComponent(crop)}`)
    .then((r) => r.data);

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

// ── Weather ──────────────────────────────────────────
export const getForecast = (lat, lng) =>
  client.get("/weather/forecast", { params: { lat, lng } }).then((r) => r.data);

export const getCurrentWeather = (lat, lng) =>
  client.get("/weather/current", { params: { lat, lng } }).then((r) => r.data);

export const getAgriAlerts = (lat, lng) =>
  client
    .get("/weather/agri-alerts", { params: { lat, lng } })
    .then((r) => r.data);

// ── Alerts ───────────────────────────────────────────
export const getAlerts = (type, limit) =>
  client.get("/alerts", { params: { type, limit } }).then((r) => r.data);

export const getUnreadAlertCount = () =>
  client.get("/alerts/unread").then((r) => r.data);

export const markAlertRead = (id) =>
  client.patch(`/alerts/${id}/read`).then((r) => r.data);

export const deleteAlert = (id) =>
  client.delete(`/alerts/${id}`).then((r) => r.data);

// ── Chat ─────────────────────────────────────────────
export const sendChatMessage = (body) =>
  client.post("/chat/message", body, { timeout: 120000 }).then((r) => r.data);

export const getChatHistory = () =>
  client.get("/chat/history").then((r) => r.data);

export const clearChatHistory = () =>
  client.delete("/chat/history").then((r) => r.data);

// ── Voice ────────────────────────────────────────────
export const translateVoice = (body) =>
  client.post("/voice/translate", body, { timeout: 120000 }).then((r) => r.data);

export const processVoice = (body) =>
  client.post("/voice/process", body, { timeout: 120000 }).then((r) => r.data);

export default client;
