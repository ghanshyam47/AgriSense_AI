"""
Train Pest Detection Model (MobileNetV2 Transfer Learning)
Uses PlantVillage dataset or generates a placeholder model for development.
In production, download the PlantVillage dataset into training/data/pest_images/
"""

import os
import numpy as np
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "..", "models")
os.makedirs(MODEL_DIR, exist_ok=True)

# ── 38 PlantVillage disease classes ──────────────────
DISEASE_CLASSES = [
    "Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust", "Apple___healthy",
    "Blueberry___healthy",
    "Cherry___Powdery_mildew", "Cherry___healthy",
    "Corn___Cercospora_leaf_spot", "Corn___Common_rust", "Corn___Northern_Leaf_Blight", "Corn___healthy",
    "Grape___Black_rot", "Grape___Esca_(Black_Measles)", "Grape___Leaf_blight", "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot", "Peach___healthy",
    "Pepper___Bacterial_spot", "Pepper___healthy",
    "Potato___Early_blight", "Potato___Late_blight", "Potato___healthy",
    "Raspberry___healthy",
    "Soybean___healthy",
    "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch", "Strawberry___healthy",
    "Tomato___Bacterial_spot", "Tomato___Early_blight", "Tomato___Late_blight",
    "Tomato___Leaf_Mold", "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites", "Tomato___Target_Spot",
    "Tomato___Yellow_Leaf_Curl_Virus", "Tomato___Mosaic_virus", "Tomato___healthy"
]


def create_placeholder_model():
    """
    Create a placeholder model for development/testing.
    In production, replace with actual trained MobileNetV2 model.
    """
    try:
        import tensorflow as tf
        from tensorflow.keras.applications import MobileNetV2
        from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
        from tensorflow.keras.models import Model

        print("🚀 Building MobileNetV2 model architecture...")
        
        base_model = MobileNetV2(
            weights='imagenet',
            include_top=False,
            input_shape=(224, 224, 3)
        )
        base_model.trainable = False

        x = base_model.output
        x = GlobalAveragePooling2D()(x)
        x = Dropout(0.3)(x)
        x = Dense(256, activation='relu')(x)
        x = Dropout(0.2)(x)
        predictions = Dense(len(DISEASE_CLASSES), activation='softmax')(x)

        model = Model(inputs=base_model.input, outputs=predictions)
        model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )

        model_path = os.path.join(MODEL_DIR, "pest_model.h5")
        model.save(model_path)
        print(f"💾 Placeholder model saved → {model_path}")
        print(f"   Classes: {len(DISEASE_CLASSES)}")
        print("⚠️  This is an untrained model — predictions will be random.")
        print("   To train properly, place PlantVillage images in training/data/pest_images/")
        
        return model
    
    except ImportError:
        print("⚠️  TensorFlow not installed — creating mock model metadata only.")
        meta = {
            "model_type": "MobileNetV2_transfer_learning",
            "input_shape": [224, 224, 3],
            "num_classes": len(DISEASE_CLASSES),
            "classes": DISEASE_CLASSES,
            "status": "placeholder",
            "note": "Install tensorflow and run train_pest.py to create actual model"
        }
        meta_path = os.path.join(MODEL_DIR, "pest_model_meta.json")
        with open(meta_path, "w") as f:
            json.dump(meta, f, indent=2)
        print(f"💾 Model metadata saved → {meta_path}")
        return None


def train_on_dataset():
    """
    Full training pipeline for PlantVillage dataset.
    Expects images in: training/data/pest_images/<ClassName>/image.jpg
    """
    import tensorflow as tf
    from tensorflow.keras.applications import MobileNetV2
    from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
    from tensorflow.keras.models import Model
    from tensorflow.keras.preprocessing.image import ImageDataGenerator

    data_dir = os.path.join(BASE_DIR, "data", "pest_images")
    
    if not os.path.exists(data_dir):
        print(f"❌ Dataset not found at {data_dir}")
        print("   Download PlantVillage dataset and organize into class folders.")
        print("   Falling back to placeholder model...\n")
        return create_placeholder_model()
    
    print("🚀 Training pest detection model on PlantVillage dataset...")
    
    # ── Data Augmentation ──────────────────────────────
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest',
        validation_split=0.2
    )
    
    train_generator = train_datagen.flow_from_directory(
        data_dir,
        target_size=(224, 224),
        batch_size=32,
        class_mode='categorical',
        subset='training'
    )
    
    val_generator = train_datagen.flow_from_directory(
        data_dir,
        target_size=(224, 224),
        batch_size=32,
        class_mode='categorical',
        subset='validation'
    )
    
    # ── Build Model ────────────────────────────────────
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    base_model.trainable = False
    
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dropout(0.3)(x)
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.2)(x)
    num_classes = train_generator.num_classes
    predictions = Dense(num_classes, activation='softmax')(x)
    
    model = Model(inputs=base_model.input, outputs=predictions)
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    
    # ── Train ──────────────────────────────────────────
    history = model.fit(
        train_generator,
        epochs=10,
        validation_data=val_generator,
        verbose=1
    )
    
    # ── Save ───────────────────────────────────────────
    model_path = os.path.join(MODEL_DIR, "pest_model.h5")
    model.save(model_path)
    
    val_loss, val_acc = model.evaluate(val_generator)
    print(f"\n✅ Validation Accuracy: {val_acc:.4f}")
    print(f"💾 Model saved → {model_path}")
    
    # Save class indices
    class_indices = train_generator.class_indices
    classes_path = os.path.join(MODEL_DIR, "pest_classes.json")
    with open(classes_path, "w") as f:
        json.dump({v: k for k, v in class_indices.items()}, f, indent=2)
    print(f"💾 Class indices saved → {classes_path}")
    
    return model


if __name__ == "__main__":
    data_dir = os.path.join(BASE_DIR, "data", "pest_images")
    if os.path.exists(data_dir) and os.listdir(data_dir):
        train_on_dataset()
    else:
        print("📦 No training images found — creating placeholder model...\n")
        create_placeholder_model()
