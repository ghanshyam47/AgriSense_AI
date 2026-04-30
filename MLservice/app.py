"""
AgriSense ML Service — Flask Entry Point
Exposes crop recommendation, pest detection, and irrigation planning APIs.
"""

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from services.crop_service import crop_service
from services.pest_service import pest_service
from services.irrigation_service import irrigation_service

app = Flask(__name__)
CORS(app)

# ── Health Check ─────────────────────────────────────
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "service": "AgriSense ML Service",
        "models": {
            "crop": crop_service.model is not None,
            "pest": pest_service.model is not None,
            "irrigation": True
        }
    })

# ── Crop Recommendation ─────────────────────────────
@app.route("/predict/crop", methods=["POST"])
def predict_crop():
    """
    Predict top 3 recommended crops.
    
    Accepts either technical inputs:
        { N, P, K, temperature, humidity, ph, rainfall }
    
    Or simple farmer-friendly inputs:
        { soil_condition: "dry"|"wet"|"normal", season: "kharif"|"rabi"|"zaid" }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data provided"}), 400
        
        # Check if simple or technical input
        if "soil_condition" in data or "season" in data:
            result = crop_service.predict_from_simple_input(
                soil_condition=data.get("soil_condition", "normal"),
                season=data.get("season", "kharif"),
                temperature=data.get("temperature"),
                humidity=data.get("humidity"),
                rainfall=data.get("rainfall")
            )
        else:
            required = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
            missing = [f for f in required if f not in data]
            if missing:
                return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400
            
            result = crop_service.predict(
                N=float(data["N"]),
                P=float(data["P"]),
                K=float(data["K"]),
                temperature=float(data["temperature"]),
                humidity=float(data["humidity"]),
                ph=float(data["ph"]),
                rainfall=float(data["rainfall"])
            )
        
        if isinstance(result, dict) and "error" in result:
            return jsonify(result), 500
        
        return jsonify({"success": True, "recommendations": result})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── Crop Info ────────────────────────────────────────
@app.route("/crop/info/<crop_name>", methods=["GET"])
def crop_info(crop_name):
    result = crop_service.get_crop_info(crop_name)
    if "error" in result:
        return jsonify(result), 404
    return jsonify({"success": True, "data": result})

# ── Pest Detection ───────────────────────────────────
@app.route("/predict/pest", methods=["POST"])
def predict_pest():
    """
    Detect plant disease from uploaded image.
    Accepts multipart/form-data with 'image' field.
    """
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image file provided. Use 'image' field."}), 400
        
        file = request.files["image"]
        if file.filename == "":
            return jsonify({"error": "Empty filename"}), 400
        
        allowed_ext = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in allowed_ext:
            return jsonify({"error": f"Invalid file type. Allowed: {', '.join(allowed_ext)}"}), 400
        
        image_bytes = file.read()
        if len(image_bytes) > 10 * 1024 * 1024:  # 10MB limit
            return jsonify({"error": "Image too large. Max 10MB."}), 400
        
        result = pest_service.predict(image_bytes)
        return jsonify({"success": True, "detection": result})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── Common Pests ─────────────────────────────────────
@app.route("/pest/common/<crop>", methods=["GET"])
def common_pests(crop):
    result = pest_service.get_common_pests(crop)
    return jsonify({"success": True, "data": result})

# ── Irrigation Planning ─────────────────────────────
@app.route("/predict/irrigation", methods=["POST"])
def predict_irrigation():
    """
    Generate 5-day irrigation plan.
    Input: { crop, soil_type, temperature, humidity, rainfall_forecast }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data provided"}), 400
        
        required = ["crop", "soil_type", "temperature", "humidity", "rainfall_forecast"]
        missing = [f for f in required if f not in data]
        if missing:
            return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400
        
        result = irrigation_service.plan(
            crop=data["crop"],
            soil_type=data["soil_type"],
            temperature=float(data["temperature"]),
            humidity=float(data["humidity"]),
            rainfall_forecast=data["rainfall_forecast"],
            wind_speed=data.get("wind_speed"),
            crop_stage=data.get("crop_stage")
        )
        
        return jsonify({"success": True, "plan": result})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("\n🌾 AgriSense ML Service starting...")
    print("   Endpoints:")
    print("   POST /predict/crop        — Crop recommendation")
    print("   POST /predict/pest        — Pest/disease detection")
    print("   POST /predict/irrigation  — Irrigation planning")
    print("   GET  /health              — Health check\n")
    app.run(host="0.0.0.0", port=5000, debug=True)
