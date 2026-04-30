"""
Crop Recommendation Service
Loads trained RandomForest model and provides predictions.
Maps simple farmer descriptions → technical parameters.
"""

import os
import numpy as np
import joblib

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "crop_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "models", "scaler.pkl")

# ── Simple description → technical value mappings ─────
SOIL_CONDITION_MAP = {
    "dry":    {"N": 30, "P": 40, "K": 20, "ph": 7.0},
    "wet":    {"N": 70, "P": 50, "K": 40, "ph": 6.0},
    "normal": {"N": 50, "P": 45, "K": 30, "ph": 6.5},
    "sandy":  {"N": 25, "P": 35, "K": 15, "ph": 7.5},
    "clay":   {"N": 60, "P": 55, "K": 45, "ph": 6.2},
    "loamy":  {"N": 55, "P": 50, "K": 35, "ph": 6.5},
    "red":    {"N": 40, "P": 30, "K": 25, "ph": 5.8},
    "black":  {"N": 65, "P": 55, "K": 40, "ph": 7.2},
}

SEASON_MAP = {
    "kharif":  {"temperature": 28, "humidity": 80, "rainfall": 180},  # Jun–Oct
    "rabi":    {"temperature": 18, "humidity": 55, "rainfall": 60},   # Oct–Mar
    "zaid":    {"temperature": 35, "humidity": 45, "rainfall": 30},   # Mar–Jun
    "summer":  {"temperature": 35, "humidity": 45, "rainfall": 30},
    "winter":  {"temperature": 18, "humidity": 55, "rainfall": 60},
    "monsoon": {"temperature": 28, "humidity": 85, "rainfall": 200},
    "rainy":   {"temperature": 28, "humidity": 85, "rainfall": 200},
}

# ── Crop information database ─────────────────────────
CROP_INFO = {
    "rice":       {"season": "Kharif", "water": "High", "duration": "120-150 days", "msp": 2275},
    "wheat":      {"season": "Rabi", "water": "Medium", "duration": "120-150 days", "msp": 2275},
    "maize":      {"season": "Kharif", "water": "Medium", "duration": "80-110 days", "msp": 2090},
    "chickpea":   {"season": "Rabi", "water": "Low", "duration": "90-120 days", "msp": 5440},
    "kidneybeans":{"season": "Kharif", "water": "Medium", "duration": "90-120 days", "msp": 0},
    "pigeonpeas": {"season": "Kharif", "water": "Low", "duration": "120-180 days", "msp": 7000},
    "mothbeans":  {"season": "Kharif", "water": "Low", "duration": "60-90 days", "msp": 0},
    "mungbean":   {"season": "Kharif/Zaid", "water": "Low", "duration": "60-75 days", "msp": 8558},
    "blackgram":  {"season": "Kharif", "water": "Low", "duration": "80-90 days", "msp": 6950},
    "lentil":     {"season": "Rabi", "water": "Low", "duration": "110-130 days", "msp": 6425},
    "pomegranate":{"season": "Year-round", "water": "Low", "duration": "150-180 days", "msp": 0},
    "banana":     {"season": "Year-round", "water": "High", "duration": "300-365 days", "msp": 0},
    "mango":      {"season": "Kharif", "water": "Low", "duration": "Perennial", "msp": 0},
    "grapes":     {"season": "Rabi", "water": "Medium", "duration": "Perennial", "msp": 0},
    "watermelon": {"season": "Zaid", "water": "Medium", "duration": "80-110 days", "msp": 0},
    "muskmelon":  {"season": "Zaid", "water": "Medium", "duration": "70-90 days", "msp": 0},
    "apple":      {"season": "Rabi", "water": "Medium", "duration": "Perennial", "msp": 0},
    "orange":     {"season": "Kharif", "water": "Medium", "duration": "Perennial", "msp": 0},
    "papaya":     {"season": "Year-round", "water": "Medium", "duration": "270-330 days", "msp": 0},
    "coconut":    {"season": "Year-round", "water": "Medium", "duration": "Perennial", "msp": 0},
    "cotton":     {"season": "Kharif", "water": "Medium", "duration": "150-180 days", "msp": 7121},
    "jute":       {"season": "Kharif", "water": "High", "duration": "120-150 days", "msp": 5050},
    "coffee":     {"season": "Year-round", "water": "Medium", "duration": "Perennial", "msp": 0},
}


class CropService:
    def __init__(self):
        self.model = None
        self.scaler = None
        self._load_model()
    
    def _load_model(self):
        """Load trained model and scaler from disk."""
        try:
            if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
                self.model = joblib.load(MODEL_PATH)
                self.scaler = joblib.load(SCALER_PATH)
                print("✅ Crop model loaded successfully")
            else:
                print("⚠️  Crop model not found — run training/train_crop.py first")
        except Exception as e:
            print(f"❌ Error loading crop model: {e}")
    
    def predict(self, N, P, K, temperature, humidity, ph, rainfall):
        """
        Predict top 3 crops for the given soil/weather parameters.
        Returns list of {crop, confidence, info} dicts.
        """
        if self.model is None or self.scaler is None:
            return {"error": "Model not loaded. Run training/train_crop.py first."}
        
        features = np.array([[N, P, K, temperature, humidity, ph, rainfall]])
        features_scaled = self.scaler.transform(features)
        
        # Get probability for each class
        probabilities = self.model.predict_proba(features_scaled)[0]
        classes = self.model.classes_
        
        # Sort by probability descending
        top_indices = np.argsort(probabilities)[::-1][:3]
        
        results = []
        for idx in top_indices:
            crop_name = classes[idx]
            confidence = float(probabilities[idx])
            info = CROP_INFO.get(crop_name, {})
            results.append({
                "crop": crop_name,
                "confidence": round(confidence * 100, 1),
                "season": info.get("season", "N/A"),
                "water_requirement": info.get("water", "N/A"),
                "duration": info.get("duration", "N/A"),
                "msp_per_quintal": info.get("msp", 0),
            })
        
        return results
    
    def predict_from_simple_input(self, soil_condition="normal", season="kharif", 
                                   temperature=None, humidity=None, rainfall=None):
        """
        Accept simple farmer-friendly inputs and map to technical parameters.
        """
        soil = SOIL_CONDITION_MAP.get(soil_condition.lower(), SOIL_CONDITION_MAP["normal"])
        season_data = SEASON_MAP.get(season.lower(), SEASON_MAP["kharif"])
        
        N = soil["N"]
        P = soil["P"]
        K = soil["K"]
        ph = soil["ph"]
        temp = temperature if temperature is not None else season_data["temperature"]
        hum = humidity if humidity is not None else season_data["humidity"]
        rain = rainfall if rainfall is not None else season_data["rainfall"]
        
        return self.predict(N, P, K, temp, hum, ph, rain)
    
    def get_crop_info(self, crop_name):
        """Get detailed info about a specific crop."""
        crop_name = crop_name.lower().strip()
        if crop_name in CROP_INFO:
            info = CROP_INFO[crop_name]
            return {"crop": crop_name, **info}
        return {"error": f"Crop '{crop_name}' not found in database"}


# Singleton instance
crop_service = CropService()
