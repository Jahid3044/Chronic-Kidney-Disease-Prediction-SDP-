from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import joblib
import json
import pandas as pd
import os
import random
from datetime import datetime
import uvicorn
import warnings
import csv
import io
import secrets

from database import (
    init_db,
    create_user,
    get_user_by_email,
    set_user_role,
    get_admin_count,
    save_prediction,
    get_user_predictions,
    save_user_preferences,
    get_user_preferences,
    save_model_metadata,
    get_active_model_metadata,
    get_all_models_history,
    get_all_predictions
)

warnings.filterwarnings("ignore", category=UserWarning)

app = FastAPI(title="Kidney Disease Prediction API")
admin_tokens = set()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
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

@app.on_event("startup")
def startup_event():
    init_db()
    # If no active model in DB, populate initial active model metadata
    if model is not None and get_active_model_metadata() is None:
        try:
            save_model_metadata(
                model_name="KidneyCare Random Forest Classifier",
                version="1.0.0",
                accuracy=0.98,
                algorithm="RandomForestClassifier",
                hyperparameters={
                    "criterion": "entropy",
                    "max_depth": 11,
                    "max_features": "sqrt",
                    "min_samples_leaf": 2,
                    "min_samples_split": 3,
                    "n_estimators": 130,
                    "random_state": 42
                },
                feature_names=features or [],
                is_active=True
            )
        except Exception as ex:
            print("Startup model metadata sync error:", ex)

class UserRegister(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class PreferencesInput(BaseModel):
    theme: Optional[str] = 'dark'
    auto_save: Optional[bool] = True
    custom_settings: Optional[Dict[str, Any]] = None
    draft_form_data: Optional[Dict[str, Any]] = None

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
    gender: Optional[str] = "Male"
    user_email: Optional[str] = None

@app.get("/")
@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "database": "connected",
        "model_loaded": model is not None,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/register")
def register(user: UserRegister):
    if get_user_by_email(user.email):
        raise HTTPException(status_code=400, detail="Email already registered.")
    
    created = create_user(user.name, user.email, user.password)
    if not created:
        raise HTTPException(status_code=500, detail="Failed to create user account.")
    
    # Initialize default user preferences in DB
    save_user_preferences(user.email, theme='dark', auto_save=True)
    return {"message": "User registered successfully", "user": created}

@app.post("/login")
def login(user: UserLogin):
    db_user = get_user_by_email(user.email)
    if not db_user or db_user["password"] != user.password:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    prefs = get_user_preferences(user.email)
    return {
        "message": "Login successful",
        "user": {"name": db_user["name"], "email": db_user["email"]},
        "preferences": prefs,
        "is_admin": db_user.get("role") == "admin"
    }

class AdminLogin(BaseModel):
    email: str
    password: str

class AdminRegister(BaseModel):
    name: str
    email: str
    password: str

@app.get("/admin/status")
def admin_status():
    return {"can_register": get_admin_count() == 0}

@app.post("/admin/register")
def admin_register(admin: AdminRegister):
    if get_admin_count() > 0:
        raise HTTPException(status_code=403, detail="An administrator account already exists.")
    if len(admin.password) < 8:
        raise HTTPException(status_code=400, detail="Administrator password must contain at least 8 characters.")
    created = create_user(admin.name, admin.email, admin.password)
    if not created:
        raise HTTPException(status_code=400, detail="That email address is already registered.")
    set_user_role(admin.email, "admin")
    return {"message": "Administrator account created successfully."}

@app.post("/admin/login")
def admin_login(credentials: AdminLogin):
    db_user = get_user_by_email(credentials.email)
    if not db_user or db_user.get("role") != "admin" or db_user["password"] != credentials.password:
        raise HTTPException(status_code=401, detail="Invalid administrator credentials.")
    token = secrets.token_urlsafe(32)
    admin_tokens.add(token)
    return {"token": token, "admin": {"name": db_user["name"], "email": db_user["email"], "is_admin": True}}

def require_admin(x_admin_token: Optional[str] = Header(default=None)):
    if not x_admin_token or x_admin_token not in admin_tokens:
        raise HTTPException(status_code=403, detail="Administrator access required.")

@app.get("/admin/predictions")
def admin_predictions(_: None = Depends(require_admin)):
    return {"predictions": get_all_predictions()}

@app.get("/admin/predictions/{patient_id}/download")
def download_patient_prediction(patient_id: str, _: None = Depends(require_admin)):
    records = [record for record in get_all_predictions() if record["patient_id"] == patient_id]
    if not records:
        raise HTTPException(status_code=404, detail="Patient assessment not found.")
    return _prediction_csv_response(records, f"KidneyCare_{patient_id}.csv")

@app.get("/admin/predictions/download")
def download_all_predictions(_: None = Depends(require_admin)):
    return _prediction_csv_response(get_all_predictions(), "KidneyCare_All_Assessments.csv")

def _prediction_csv_response(records: list[Dict], filename: str):
    output = io.StringIO()
    fieldnames = ["record_id", "name", "user_email", "patient_id", "date", "risk", "status", "confidence", "ageGender", "inputs"]
    writer = csv.DictWriter(output, fieldnames=fieldnames)
    writer.writeheader()
    for record in records:
        row = {field: record.get(field, "") for field in fieldnames}
        row["inputs"] = json.dumps(record.get("inputs", {}), ensure_ascii=True)
        writer.writerow(row)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@app.get("/preferences/{user_email}")
def get_preferences(user_email: str):
    return get_user_preferences(user_email)

@app.post("/preferences/{user_email}")
def update_preferences(user_email: str, prefs: PreferencesInput):
    saved = save_user_preferences(
        user_email=user_email,
        theme=prefs.theme or 'dark',
        auto_save=prefs.auto_save if prefs.auto_save is not None else True,
        custom_settings=prefs.custom_settings,
        draft_form_data=prefs.draft_form_data
    )
    return {"message": "Preferences saved successfully", "preferences": saved}

@app.get("/models/active")
def active_model():
    model_meta = get_active_model_metadata()
    if not model_meta:
        return {
            "model_name": "KidneyCare ML Model",
            "version": "1.0.0",
            "accuracy": 0.98,
            "algorithm": "RandomForestClassifier",
            "is_active": True
        }
    return model_meta

@app.get("/models/history")
def model_history():
    return {"models": get_all_models_history()}

@app.get("/history/{user_email}")
def get_history(user_email: str):
    history = get_user_predictions(user_email)
    return {"history": history}

@app.post("/predict")
def predict(data: PredictionInput):
    if model is None:
        raise HTTPException(status_code=500, detail="Model is not loaded.")
    
    raw_input_dict = data.dict()
    input_dict = dict(raw_input_dict)
    user_email = input_dict.pop("user_email", None)
    patient_id = f"PT-{random.randint(1000, 9999)}"
    
    # Encode categorical variables using loaded encoders without Pandas overhead
    for col, le in encoders.items():
        if col in input_dict:
            try:
                input_dict[col] = le.transform([input_dict[col]])[0]
            except ValueError:
                input_dict[col] = 0
                
    # Ensure columns match training order exactly
    input_list = [input_dict[feature] for feature in features]
    
    # Predict directly using a 2D array
    probabilities = model.predict_proba([input_list])[0]
    probability = probabilities[1] # Probability of class 1 (kidney disease)
    prediction = 1 if probability > 0.5 else 0
    
    risk_level = "Low"
    if probability > 0.7:
        risk_level = "High"
    elif probability > 0.4:
        risk_level = "Medium"
        
    pred_status = "Detected" if prediction == 1 else "Normal"
    pred_label = "Kidney Disease Detected" if prediction == 1 else "No Kidney Disease Detected"
    confidence_str = f"{round(probability * 100)}%"
    date_str = datetime.now().strftime("%b %d, %Y")
    gender_val = data.gender if (data.gender and data.gender.strip()) else "Male"
    age_val = int(data.age) if data.age is not None else 0
    age_gender = f"{age_val} / {gender_val}"

    saved_record = None
    if user_email:
        saved_record = save_prediction(
            user_email=user_email,
            patient_id=patient_id,
            date=date_str,
            risk=risk_level,
            status=pred_status,
            confidence=confidence_str,
            age_gender=age_gender,
            inputs_json=json.dumps(raw_input_dict)
        )

    return {
        "prediction": pred_label,
        "status": pred_status,
        "probability": float(probability),
        "confidence": confidence_str,
        "risk_level": risk_level,
        "patient_id": patient_id,
        "age": age_val,
        "gender": gender_val,
        "ageGender": age_gender,
        "date": date_str,
        "inputs": raw_input_dict,
        "record": saved_record
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)

