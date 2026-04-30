"""
Pest Detection Service
Loads trained MobileNetV2 model and predicts plant diseases from images.
"""

import os, io, json, numpy as np
from PIL import Image

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "pest_model.h5")
META_PATH = os.path.join(BASE_DIR, "models", "pest_model_meta.json")
CLASSES_PATH = os.path.join(BASE_DIR, "models", "pest_classes.json")

DISEASE_CLASSES = [
    "Apple___Apple_scab","Apple___Black_rot","Apple___Cedar_apple_rust","Apple___healthy",
    "Blueberry___healthy","Cherry___Powdery_mildew","Cherry___healthy",
    "Corn___Cercospora_leaf_spot","Corn___Common_rust","Corn___Northern_Leaf_Blight","Corn___healthy",
    "Grape___Black_rot","Grape___Esca_(Black_Measles)","Grape___Leaf_blight","Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot","Peach___healthy","Pepper___Bacterial_spot","Pepper___healthy",
    "Potato___Early_blight","Potato___Late_blight","Potato___healthy",
    "Raspberry___healthy","Soybean___healthy","Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch","Strawberry___healthy",
    "Tomato___Bacterial_spot","Tomato___Early_blight","Tomato___Late_blight",
    "Tomato___Leaf_Mold","Tomato___Septoria_leaf_spot","Tomato___Spider_mites",
    "Tomato___Target_Spot","Tomato___Yellow_Leaf_Curl_Virus","Tomato___Mosaic_virus","Tomato___healthy"
]

TREATMENT_DB = {
    "Apple___Apple_scab": {"disease":"Apple Scab","severity":"medium","treatment":"Apply fungicide (captan). Remove fallen leaves. Prune for air circulation.","prevention":"Plant resistant varieties. Proper spacing."},
    "Apple___Black_rot": {"disease":"Black Rot","severity":"high","treatment":"Remove infected fruit/cankers. Apply captan fungicide.","prevention":"Prune dead wood. Remove mummified fruits."},
    "Apple___Cedar_apple_rust": {"disease":"Cedar Apple Rust","severity":"medium","treatment":"Apply myclobutanil at pink bud stage.","prevention":"Plant resistant varieties. Remove nearby cedar trees."},
    "Corn___Cercospora_leaf_spot": {"disease":"Gray Leaf Spot","severity":"medium","treatment":"Apply strobilurin fungicide. Rotate crops.","prevention":"Use resistant hybrids. Manage residue."},
    "Corn___Common_rust": {"disease":"Common Rust","severity":"medium","treatment":"Apply fungicide if severe.","prevention":"Plant resistant hybrids. Early planting."},
    "Corn___Northern_Leaf_Blight": {"disease":"Northern Leaf Blight","severity":"high","treatment":"Apply foliar fungicide. Remove crop debris.","prevention":"Use resistant hybrids. Crop rotation."},
    "Grape___Black_rot": {"disease":"Black Rot","severity":"high","treatment":"Apply myclobutanil. Remove mummified fruit.","prevention":"Remove mummies in winter. Apply fungicide at key stages."},
    "Grape___Esca_(Black_Measles)": {"disease":"Esca","severity":"high","treatment":"No effective chemical treatment. Remove infected vines.","prevention":"Protect pruning wounds."},
    "Grape___Leaf_blight": {"disease":"Leaf Blight","severity":"medium","treatment":"Apply copper-based fungicide.","prevention":"Good air circulation. Avoid overhead irrigation."},
    "Orange___Haunglongbing_(Citrus_greening)": {"disease":"Citrus Greening","severity":"critical","treatment":"No cure. Remove infected trees. Control psyllids.","prevention":"Use certified disease-free nursery stock."},
    "Peach___Bacterial_spot": {"disease":"Bacterial Spot","severity":"medium","treatment":"Apply copper-based bactericide.","prevention":"Plant resistant varieties."},
    "Pepper___Bacterial_spot": {"disease":"Bacterial Spot","severity":"medium","treatment":"Apply copper hydroxide. Remove infected plants.","prevention":"Use disease-free seed. Crop rotation."},
    "Potato___Early_blight": {"disease":"Early Blight","severity":"medium","treatment":"Apply chlorothalonil or mancozeb.","prevention":"Crop rotation. Certified seed."},
    "Potato___Late_blight": {"disease":"Late Blight","severity":"critical","treatment":"Apply metalaxyl immediately. Remove infected plants.","prevention":"Use resistant varieties. Monitor weather."},
    "Squash___Powdery_mildew": {"disease":"Powdery Mildew","severity":"low","treatment":"Apply sulfur or neem oil.","prevention":"Plant resistant varieties. Good air circulation."},
    "Strawberry___Leaf_scorch": {"disease":"Leaf Scorch","severity":"medium","treatment":"Apply captan fungicide. Remove infected leaves.","prevention":"Disease-free planting material."},
    "Tomato___Bacterial_spot": {"disease":"Bacterial Spot","severity":"medium","treatment":"Apply copper-based bactericide.","prevention":"Use certified seed. Crop rotation."},
    "Tomato___Early_blight": {"disease":"Early Blight","severity":"medium","treatment":"Apply chlorothalonil or copper fungicide.","prevention":"Mulch around plants. Crop rotation."},
    "Tomato___Late_blight": {"disease":"Late Blight","severity":"critical","treatment":"Apply metalaxyl immediately. Destroy infected plants.","prevention":"Use resistant varieties. Avoid overhead irrigation."},
    "Tomato___Leaf_Mold": {"disease":"Leaf Mold","severity":"low","treatment":"Improve ventilation. Apply chlorothalonil.","prevention":"Reduce humidity. Good air circulation."},
    "Tomato___Septoria_leaf_spot": {"disease":"Septoria Leaf Spot","severity":"medium","treatment":"Apply chlorothalonil. Remove lower leaves.","prevention":"Crop rotation. Mulch. Stake plants."},
    "Tomato___Spider_mites": {"disease":"Spider Mite Infestation","severity":"medium","treatment":"Spray neem oil or insecticidal soap.","prevention":"Keep plants well-watered. Monitor regularly."},
    "Tomato___Target_Spot": {"disease":"Target Spot","severity":"medium","treatment":"Apply chlorothalonil. Remove debris.","prevention":"Crop rotation. Proper spacing."},
    "Tomato___Yellow_Leaf_Curl_Virus": {"disease":"Yellow Leaf Curl Virus","severity":"high","treatment":"No cure. Remove infected plants. Control whitefly.","prevention":"Use resistant varieties. Reflective mulch."},
    "Tomato___Mosaic_virus": {"disease":"Mosaic Virus","severity":"high","treatment":"No cure. Remove infected plants. Disinfect tools.","prevention":"Use resistant varieties. Disinfect hands/tools."},
    "Cherry___Powdery_mildew": {"disease":"Powdery Mildew","severity":"low","treatment":"Apply sulfur-based fungicide.","prevention":"Proper spacing. Avoid excessive nitrogen."},
}


class PestService:
    def __init__(self):
        self.model = None
        self.classes = DISEASE_CLASSES
        self._load_model()

    def _load_model(self):
        try:
            if os.path.exists(MODEL_PATH):
                import tensorflow as tf
                self.model = tf.keras.models.load_model(MODEL_PATH)
                print("✅ Pest detection model loaded")
            else:
                print("⚠️  Pest model not found — run training/train_pest.py first")
            if os.path.exists(CLASSES_PATH):
                with open(CLASSES_PATH) as f:
                    idx_map = json.load(f)
                    self.classes = [idx_map[str(i)] for i in range(len(idx_map))]
        except Exception as e:
            print(f"❌ Error loading pest model: {e}")

    def preprocess_image(self, image_bytes):
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB").resize((224, 224))
        return np.expand_dims(np.array(img) / 255.0, axis=0)

    def predict(self, image_bytes):
        if self.model is None:
            return {"disease":"Model Not Available","severity":"unknown","confidence":0,
                    "treatment":"Run train_pest.py to create model or consult a local expert."}
        try:
            img_array = self.preprocess_image(image_bytes)
            preds = self.model.predict(img_array, verbose=0)[0]
            top_idx = np.argmax(preds)
            confidence = float(preds[top_idx])
            class_name = self.classes[top_idx]
            top3 = [{"class":self.classes[i],"confidence":round(float(preds[i])*100,1)}
                    for i in np.argsort(preds)[::-1][:3]]

            if "healthy" in class_name.lower():
                return {"disease":"Healthy","severity":"none","confidence":round(confidence*100,1),
                        "class":class_name,"treatment":"No treatment needed.","top_predictions":top3}
            if confidence < 0.3:
                return {"disease":"Unknown","severity":"unknown","confidence":round(confidence*100,1),
                        "class":class_name,"treatment":"Consult agricultural extension officer.","top_predictions":top3}

            info = TREATMENT_DB.get(class_name, {"disease":class_name,"severity":"unknown","treatment":"Consult expert."})
            return {**info, "confidence":round(confidence*100,1), "class":class_name, "top_predictions":top3}
        except Exception as e:
            return {"error":str(e),"disease":"Error","severity":"unknown"}

    def get_common_pests(self, crop):
        crop = crop.lower().strip()
        results = {k:v for k,v in TREATMENT_DB.items() if crop in k.lower()}
        if not results:
            return {"message":f"No pest data for '{crop}'. Try: tomato, potato, corn, grape, apple, pepper"}
        return results

pest_service = PestService()
