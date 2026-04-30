"""
Train Crop Recommendation Model
Uses RandomForestClassifier on the Kaggle Crop Recommendation Dataset.
Features: N, P, K, temperature, humidity, pH, rainfall → crop label
"""

import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import joblib

# ── Paths ──────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "crop_recommendation.csv")
MODEL_DIR = os.path.join(BASE_DIR, "..", "models")
os.makedirs(MODEL_DIR, exist_ok=True)

def generate_synthetic_data():
    """Generate synthetic crop recommendation dataset if CSV not found."""
    np.random.seed(42)
    
    crops_config = {
        'rice':       {'N': (60,100), 'P': (35,65), 'K': (35,55), 'temp': (20,28), 'hum': (78,92), 'ph': (5.5,7.0), 'rain': (180,260)},
        'wheat':      {'N': (60,100), 'P': (45,75), 'K': (15,35), 'temp': (14,24), 'hum': (50,72), 'ph': (5.8,7.5), 'rain': (50,120)},
        'maize':      {'N': (60,100), 'P': (35,65), 'K': (15,35), 'temp': (18,28), 'hum': (55,75), 'ph': (5.5,7.5), 'rain': (60,110)},
        'chickpea':   {'N': (15,45), 'P': (55,85), 'K': (75,85), 'temp': (15,22), 'hum': (14,20), 'ph': (6.8,8.0), 'rain': (60,100)},
        'kidneybeans':{'N': (15,35), 'P': (55,75), 'K': (15,25), 'temp': (15,22), 'hum': (18,24), 'ph': (5.5,7.0), 'rain': (60,120)},
        'pigeonpeas': {'N': (15,40), 'P': (55,75), 'K': (15,25), 'temp': (18,32), 'hum': (30,65), 'ph': (5.0,7.5), 'rain': (100,180)},
        'mothbeans':  {'N': (15,35), 'P': (40,60), 'K': (15,25), 'temp': (24,32), 'hum': (40,65), 'ph': (3.5,9.0), 'rain': (30,70)},
        'mungbean':   {'N': (15,35), 'P': (40,60), 'K': (15,25), 'temp': (25,32), 'hum': (80,90), 'ph': (6.0,7.5), 'rain': (30,60)},
        'blackgram':  {'N': (25,50), 'P': (55,75), 'K': (15,25), 'temp': (25,35), 'hum': (58,72), 'ph': (6.5,8.0), 'rain': (60,100)},
        'lentil':     {'N': (10,30), 'P': (55,80), 'K': (15,25), 'temp': (18,28), 'hum': (22,58), 'ph': (6.0,8.0), 'rain': (35,55)},
        'pomegranate':{'N': (15,35), 'P': (5,20), 'K': (35,45), 'temp': (18,28), 'hum': (85,95), 'ph': (5.5,7.5), 'rain': (100,120)},
        'banana':     {'N': (80,120),'P': (70,100),'K': (45,55), 'temp': (25,32), 'hum': (75,85), 'ph': (5.5,7.0), 'rain': (90,120)},
        'mango':      {'N': (15,35), 'P': (15,35), 'K': (25,45), 'temp': (27,38), 'hum': (45,65), 'ph': (5.5,7.5), 'rain': (90,110)},
        'grapes':     {'N': (15,35), 'P': (120,145),'K': (195,210),'temp': (8,42),  'hum': (78,88), 'ph': (5.5,7.0), 'rain': (60,80)},
        'watermelon': {'N': (80,110),'P': (5,20),  'K': (45,55), 'temp': (24,28), 'hum': (82,92), 'ph': (6.0,7.0), 'rain': (45,60)},
        'muskmelon':  {'N': (80,110),'P': (5,15),  'K': (45,55), 'temp': (27,32), 'hum': (90,95), 'ph': (6.0,7.0), 'rain': (20,40)},
        'apple':      {'N': (15,35), 'P': (120,145),'K': (195,210),'temp': (21,25), 'hum': (90,94), 'ph': (5.5,6.5), 'rain': (100,130)},
        'orange':     {'N': (15,30), 'P': (5,15),  'K': (5,15),  'temp': (20,30), 'hum': (90,95), 'ph': (6.5,7.5), 'rain': (100,120)},
        'papaya':     {'N': (35,60), 'P': (45,65), 'K': (45,55), 'temp': (30,42), 'hum': (90,95), 'ph': (6.5,7.5), 'rain': (140,170)},
        'coconut':    {'N': (15,30), 'P': (5,15),  'K': (25,40), 'temp': (25,30), 'hum': (90,98), 'ph': (5.5,6.5), 'rain': (140,170)},
        'cotton':     {'N': (100,140),'P': (40,60),'K': (15,25), 'temp': (22,28), 'hum': (75,85), 'ph': (6.0,8.0), 'rain': (60,100)},
        'jute':       {'N': (60,90), 'P': (35,55), 'K': (35,45), 'temp': (23,28), 'hum': (78,88), 'ph': (6.0,7.5), 'rain': (160,200)},
        'coffee':     {'N': (80,120),'P': (15,30), 'K': (25,40), 'temp': (23,28), 'hum': (55,70), 'ph': (6.0,7.0), 'rain': (140,180)},
    }
    
    rows = []
    samples_per_crop = 100
    for crop, cfg in crops_config.items():
        for _ in range(samples_per_crop):
            row = {
                'N': np.random.uniform(*cfg['N']),
                'P': np.random.uniform(*cfg['P']),
                'K': np.random.uniform(*cfg['K']),
                'temperature': np.random.uniform(*cfg['temp']),
                'humidity': np.random.uniform(*cfg['hum']),
                'ph': np.random.uniform(*cfg['ph']),
                'rainfall': np.random.uniform(*cfg['rain']),
                'label': crop
            }
            rows.append(row)
    
    df = pd.DataFrame(rows)
    os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)
    df.to_csv(DATA_PATH, index=False)
    print(f"✅ Generated synthetic dataset: {len(df)} rows, {len(crops_config)} crops")
    return df


def train():
    # ── Load Data ──────────────────────────────────────
    if os.path.exists(DATA_PATH):
        print(f"📂 Loading dataset from {DATA_PATH}")
        df = pd.read_csv(DATA_PATH)
    else:
        print("⚠️  Dataset not found — generating synthetic data...")
        df = generate_synthetic_data()
    
    print(f"📊 Dataset shape: {df.shape}")
    print(f"🌾 Crops: {df['label'].nunique()} unique → {list(df['label'].unique())}")
    
    # ── Features & Labels ──────────────────────────────
    feature_cols = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    X = df[feature_cols].values
    y = df['label'].values
    
    # ── Train/Test Split ───────────────────────────────
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # ── Scale Features ─────────────────────────────────
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # ── Train Model ────────────────────────────────────
    print("\n🚀 Training RandomForestClassifier...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=None,
        min_samples_split=2,
        min_samples_leaf=1,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train_scaled, y_train)
    
    # ── Evaluate ───────────────────────────────────────
    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\n✅ Accuracy: {accuracy:.4f} ({accuracy*100:.1f}%)")
    print("\n📋 Classification Report:")
    print(classification_report(y_test, y_pred))
    
    # ── Save Model & Scaler ───────────────────────────
    model_path = os.path.join(MODEL_DIR, "crop_model.pkl")
    scaler_path = os.path.join(MODEL_DIR, "scaler.pkl")
    
    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    
    print(f"\n💾 Model saved → {model_path}")
    print(f"💾 Scaler saved → {scaler_path}")
    
    # ── Feature Importance ─────────────────────────────
    importances = model.feature_importances_
    print("\n📊 Feature Importances:")
    for feat, imp in sorted(zip(feature_cols, importances), key=lambda x: -x[1]):
        print(f"   {feat:>15s}: {imp:.4f}")
    
    return model, scaler


if __name__ == "__main__":
    train()
