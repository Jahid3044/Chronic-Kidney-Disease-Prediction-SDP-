import json
from database import (
    init_db,
    create_user,
    get_user_by_email,
    save_prediction,
    get_user_predictions,
    save_user_preferences,
    get_user_preferences,
    save_model_metadata,
    get_active_model_metadata,
    get_all_models_history
)

def test_db():
    print("Testing DB functions...")
    init_db()
    
    # Create user
    user = create_user("Test User", "test@example.com", "password123")
    print("User Created:", user)
    
    # Retrieve user
    db_user = get_user_by_email("test@example.com")
    print("Fetched User:", db_user)
    
    # User preferences
    saved_prefs = save_user_preferences("test@example.com", theme="light", auto_save=True, draft_form_data={"age": 45})
    print("Saved Prefs:", saved_prefs)
    fetched_prefs = get_user_preferences("test@example.com")
    print("Fetched Prefs:", fetched_prefs)
    assert fetched_prefs["theme"] == "light"
    assert fetched_prefs["draft_form_data"]["age"] == 45

    # Model metadata
    saved_model = save_model_metadata(
        model_name="RandomForestClassifier",
        version="1.0.1",
        accuracy=0.98,
        algorithm="RandomForest",
        hyperparameters={"n_estimators": 130},
        feature_names=["age", "bp"],
        is_active=True
    )
    print("Saved Model:", saved_model)
    active_model = get_active_model_metadata()
    print("Active Model:", active_model)
    assert active_model["accuracy"] == 0.98

    # Save prediction with inputs
    inputs_sample = {"age": 50, "gender": "Male", "blood_pressure": 80}
    pred = save_prediction(
        user_email="test@example.com",
        patient_id="PT-9999",
        date="Aug 24, 2026",
        risk="High",
        status="Detected",
        confidence="92%",
        age_gender="50 / Male",
        inputs_json=json.dumps(inputs_sample)
    )
    print("Saved Prediction:", pred)
    
    # Get user predictions
    history = get_user_predictions("test@example.com")
    print("User History Count:", len(history))
    print("User History:", history)
    assert len(history) >= 1
    assert history[0]["inputs"]["age"] == 50

    print("ALL DB TESTS PASSED!")

if __name__ == "__main__":
    test_db()

