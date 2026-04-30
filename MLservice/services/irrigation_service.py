"""
Irrigation Planning Service
Hybrid rule-based + data-driven irrigation recommendations.
"""

# Crop water requirements (mm/day at peak stage)
CROP_WATER_NEEDS = {
    "rice":       {"low": 6, "avg": 8, "high": 10, "method": "flood/drip", "critical_stages": ["transplanting","flowering","grain_filling"]},
    "wheat":      {"low": 3, "avg": 4.5, "high": 6, "method": "sprinkler/drip", "critical_stages": ["crown_root","flowering","grain_filling"]},
    "maize":      {"low": 4, "avg": 5.5, "high": 7, "method": "furrow/drip", "critical_stages": ["knee_high","tasseling","grain_filling"]},
    "cotton":     {"low": 4, "avg": 6, "high": 8, "method": "drip/furrow", "critical_stages": ["flowering","boll_formation"]},
    "chickpea":   {"low": 2, "avg": 3, "high": 4, "method": "sprinkler", "critical_stages": ["flowering","pod_filling"]},
    "potato":     {"low": 4, "avg": 5.5, "high": 7, "method": "drip/sprinkler", "critical_stages": ["stolon","tuber_bulking"]},
    "tomato":     {"low": 3, "avg": 5, "high": 7, "method": "drip", "critical_stages": ["flowering","fruit_setting","ripening"]},
    "sugarcane":  {"low": 5, "avg": 7, "high": 9, "method": "furrow/drip", "critical_stages": ["tillering","grand_growth"]},
    "banana":     {"low": 5, "avg": 7, "high": 9, "method": "drip/basin", "critical_stages": ["vegetative","flowering","fruit_development"]},
    "mango":      {"low": 2, "avg": 3.5, "high": 5, "method": "basin/drip", "critical_stages": ["flowering","fruit_development"]},
    "soybean":    {"low": 3, "avg": 5, "high": 6, "method": "sprinkler/drip", "critical_stages": ["flowering","pod_filling"]},
    "groundnut":  {"low": 3, "avg": 4.5, "high": 6, "method": "sprinkler", "critical_stages": ["flowering","pegging","pod_development"]},
    "onion":      {"low": 3, "avg": 4.5, "high": 6, "method": "drip/sprinkler", "critical_stages": ["bulb_initiation","bulb_development"]},
    "default":    {"low": 3, "avg": 5, "high": 7, "method": "drip/sprinkler", "critical_stages": ["vegetative","reproductive"]},
}

# Soil water holding capacity (mm/m depth)
SOIL_WATER_CAPACITY = {
    "sandy":  {"capacity": 80, "drainage": "fast", "frequency": "frequent_light"},
    "loamy":  {"capacity": 150, "drainage": "moderate", "frequency": "moderate"},
    "clay":   {"capacity": 200, "drainage": "slow", "frequency": "less_frequent_heavy"},
    "silt":   {"capacity": 170, "drainage": "moderate", "frequency": "moderate"},
    "red":    {"capacity": 100, "drainage": "moderate", "frequency": "moderate"},
    "black":  {"capacity": 220, "drainage": "slow", "frequency": "less_frequent_heavy"},
    "alluvial":{"capacity": 160, "drainage": "moderate", "frequency": "moderate"},
    "default":{"capacity": 150, "drainage": "moderate", "frequency": "moderate"},
}


class IrrigationService:
    def plan(self, crop, soil_type, temperature, humidity, rainfall_forecast, 
             wind_speed=None, crop_stage=None):
        """
        Generate irrigation recommendation based on crop, soil, and weather.
        Returns a 5-day plan with daily water needs.
        """
        crop_data = CROP_WATER_NEEDS.get(crop.lower(), CROP_WATER_NEEDS["default"])
        soil_data = SOIL_WATER_CAPACITY.get(soil_type.lower(), SOIL_WATER_CAPACITY["default"])
        
        # Parse rainfall forecast (could be single value or list)
        if isinstance(rainfall_forecast, (int, float)):
            daily_rain = [rainfall_forecast / 5] * 5
        elif isinstance(rainfall_forecast, list):
            daily_rain = (rainfall_forecast + [0]*5)[:5]
        else:
            daily_rain = [0] * 5
        
        # Estimate evapotranspiration (simplified Penman-Monteith)
        et0 = self._estimate_et0(temperature, humidity, wind_speed)
        
        # Crop coefficient based on stage
        kc = self._get_crop_coefficient(crop_stage)
        
        # Daily water need = ET0 * Kc
        etc = et0 * kc  # mm/day
        
        # Generate 5-day plan
        daily_plan = []
        for day in range(5):
            effective_rain = daily_rain[day] * 0.8  # 80% effectiveness
            net_need = max(0, etc - effective_rain)
            
            # Adjust for soil type
            if soil_data["drainage"] == "fast":
                net_need *= 1.2  # Sandy soil needs more frequent watering
            elif soil_data["drainage"] == "slow":
                net_need *= 0.85  # Clay retains more water
            
            # Convert to liters per hectare
            liters_per_hectare = net_need * 10000  # 1mm over 1ha = 10,000 liters
            
            should_irrigate = net_need > 1.5  # Threshold
            
            daily_plan.append({
                "day": day + 1,
                "date_offset": f"+{day + 1} day",
                "water_need_mm": round(net_need, 1),
                "liters_per_hectare": round(liters_per_hectare),
                "rainfall_expected_mm": round(daily_rain[day], 1),
                "should_irrigate": should_irrigate,
                "recommendation": self._get_recommendation(net_need, daily_rain[day], soil_data)
            })
        
        # Summary
        total_water = sum(d["water_need_mm"] for d in daily_plan if d["should_irrigate"])
        total_rain = sum(daily_rain)
        
        return {
            "crop": crop,
            "soil_type": soil_type,
            "irrigation_method": crop_data["method"],
            "critical_stages": crop_data["critical_stages"],
            "et0_mm_per_day": round(et0, 1),
            "crop_coefficient": round(kc, 2),
            "etc_mm_per_day": round(etc, 1),
            "total_irrigation_needed_mm": round(total_water, 1),
            "total_rainfall_expected_mm": round(total_rain, 1),
            "daily_plan": daily_plan,
            "advice": self._generate_advice(total_water, total_rain, crop, soil_type, crop_data)
        }
    
    def _estimate_et0(self, temperature, humidity, wind_speed=None):
        """Simplified reference evapotranspiration (mm/day)."""
        wind = wind_speed if wind_speed else 2.0
        # Simplified Hargreaves method
        et0 = 0.0023 * (temperature + 17.8) * ((temperature * 0.6) ** 0.5) * 0.408
        # Adjust for humidity
        humidity_factor = max(0.5, 1 - (humidity - 50) / 100)
        et0 *= humidity_factor
        # Adjust for wind
        et0 *= (1 + 0.1 * (wind - 2))
        return max(1.0, min(et0, 12.0))
    
    def _get_crop_coefficient(self, stage=None):
        """Crop coefficient based on growth stage."""
        coefficients = {
            "initial": 0.4, "vegetative": 0.7, "mid_season": 1.0,
            "flowering": 1.15, "reproductive": 1.1, "fruit_development": 1.0,
            "maturity": 0.8, "late_season": 0.6, "harvest": 0.35,
        }
        if stage and stage.lower() in coefficients:
            return coefficients[stage.lower()]
        return 0.85  # Default mid-range
    
    def _get_recommendation(self, net_need, rainfall, soil_data):
        """Get human-readable recommendation for a day."""
        if rainfall > 20:
            return "Heavy rain expected — skip irrigation today"
        elif rainfall > 10:
            return "Moderate rain expected — reduce irrigation by half"
        elif net_need < 1.5:
            return "Soil moisture adequate — no irrigation needed"
        elif net_need < 4:
            return "Light irrigation recommended in the morning"
        elif net_need < 7:
            return "Moderate irrigation needed — water in early morning or evening"
        else:
            return "Heavy irrigation needed — water deeply in early morning"
    
    def _generate_advice(self, total_water, total_rain, crop, soil_type, crop_data):
        """Generate overall irrigation advice."""
        advice = []
        if total_rain > 50:
            advice.append("Heavy rainfall expected this week — reduce irrigation significantly.")
        elif total_rain > 20:
            advice.append("Moderate rainfall expected — adjust irrigation accordingly.")
        elif total_rain < 5:
            advice.append("Little to no rain expected — ensure adequate irrigation.")
        
        advice.append(f"Recommended method for {crop}: {crop_data['method']}.")
        
        if "drip" in crop_data["method"]:
            advice.append("Drip irrigation saves 30-50% water compared to flood irrigation.")
        
        return " ".join(advice)


irrigation_service = IrrigationService()
