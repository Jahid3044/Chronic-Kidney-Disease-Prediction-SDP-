from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import os
import uvicorn
import warnings

warnings.filterwarnings("ignore", category=UserWarning)

app = FastAPI(title="Kidney Disease Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and encoders
try:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    model = joblib.load(os.path.join(BASE_DIR, "models/kidney_model.joblib"))
    encoders = joblib.load(os.path.join(BASE_DIR, "models/encoders.joblib"))
    features = joblib.load(os.path.join(BASE_DIR, "models/features.joblib"))
except Exception as e:
    print(f"Error loading models: {e}")
    model, encoders, features = None, None, None

class PredictionInput(BaseModel):
    age: float
    blood_pressure: float
    specific_gravity: float
    albumin: float
    sugar: float
    red_blood_cells: str
    pus_cell: str
    pus_cell_clumps: str
    bacteria: str
    blood_glucose_random: float
    blood_urea: float
    serum_creatinine: float
    sodium: float
    potassium: float
    hemoglobin: float
    packed_cell_volume: float
    white_blood_cell_count: float
    red_blood_cell_count: float
    hypertension: str
    diabetes_mellitus: str
    coronary_artery_disease: str
    appetite: str
    pedal_edema: str
    anemia: str

@app.post("/predict")
def predict(data: PredictionInput):
    if model is None:
        raise HTTPException(status_code=500, detail="Model is not loaded.")
    
    input_dict = data.dict()
    
    # Encode categorical variables using loaded encoders without Pandas overhead
    for col, le in encoders.items():
        if col in input_dict:
            try:
                # transform expects an array-like
                input_dict[col] = le.transform([input_dict[col]])[0]
            except ValueError:
                # fallback
                input_dict[col] = 0
                
    # Ensure columns match training order exactly
    input_list = [input_dict[feature] for feature in features]
    
    # Predict directly using a 2D array, which is much faster than a DataFrame
    # predict_proba returns probabilities for classes [0, 1]
    probabilities = model.predict_proba([input_list])[0]
    probability = probabilities[1] # Probability of class 1 (kidney disease)
    prediction = 1 if probability > 0.5 else 0
    
    risk_level = "Low"
    if probability > 0.7:
        risk_level = "High"
    elif probability > 0.4:
        risk_level = "Medium"
        
    return {
        "prediction": "Kidney Disease Detected" if prediction == 1 else "No Kidney Disease Detected",
        "probability": float(probability),
        "risk_level": risk_level
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
