import requests
import time

BASE_URL = "http://127.0.0.1:8000"

def test_full_flow():
    # 0. Health check
    h_resp = requests.get(f"{BASE_URL}/health")
    print("Health Check:", h_resp.status_code, h_resp.json())
    assert h_resp.status_code == 200
    assert h_resp.json()["status"] == "ok"

    # 1. Register a test user
    email = f"testuser_{int(time.time())}@hospital.com"
    reg_resp = requests.post(f"{BASE_URL}/register", json={
        "name": "Dr. Smith",
        "email": email,
        "password": "securepassword123"
    })
    print("Register Response:", reg_resp.status_code, reg_resp.json())
    assert reg_resp.status_code == 200

    # 2. Login
    login_resp = requests.post(f"{BASE_URL}/login", json={
        "email": email,
        "password": "securepassword123"
    })
    print("Login Response:", login_resp.status_code, login_resp.json())
    assert login_resp.status_code == 200
    assert "preferences" in login_resp.json()

    # 3. Preferences auto-save
    pref_save = requests.post(f"{BASE_URL}/preferences/{email}", json={
        "theme": "dark",
        "auto_save": True,
        "draft_form_data": {"age": 55, "blood_pressure": 90}
    })
    print("Save Preferences Response:", pref_save.status_code, pref_save.json())
    assert pref_save.status_code == 200

    pref_get = requests.get(f"{BASE_URL}/preferences/{email}")
    print("Get Preferences Response:", pref_get.status_code, pref_get.json())
    assert pref_get.status_code == 200
    assert pref_get.json()["draft_form_data"]["age"] == 55

    # 4. Fetch active model
    model_resp = requests.get(f"{BASE_URL}/models/active")
    print("Active Model Response:", model_resp.status_code, model_resp.json())
    assert model_resp.status_code == 200

    # 5. Perform prediction linked to user email
    data = {
        'age': 55, 'blood_pressure': 90, 'specific_gravity': 1.010, 'albumin': 2, 'sugar': 1,
        'red_blood_cells': 'abnormal', 'pus_cell': 'normal', 'pus_cell_clumps': 'present',
        'bacteria': 'notpresent', 'blood_glucose_random': 140, 'blood_urea': 50,
        'serum_creatinine': 2.1, 'sodium': 130, 'potassium': 5.0, 'hemoglobin': 11.2,
        'packed_cell_volume': 35, 'white_blood_cell_count': 9200, 'red_blood_cell_count': 4.1,
        'hypertension': 'yes', 'diabetes_mellitus': 'yes', 'coronary_artery_disease': 'no',
        'appetite': 'poor', 'pedal_edema': 'yes', 'anemia': 'yes',
        'user_email': email
    }
    pred_resp = requests.post(f"{BASE_URL}/predict", json=data)
    print("Prediction Response:", pred_resp.status_code, pred_resp.json())
    assert pred_resp.status_code == 200
    assert "inputs" in pred_resp.json()

    # 6. Fetch history for the user
    hist_resp = requests.get(f"{BASE_URL}/history/{email}")
    print("History Response:", hist_resp.status_code, hist_resp.json())
    assert hist_resp.status_code == 200
    assert len(hist_resp.json()["history"]) == 1
    assert hist_resp.json()["history"][0]["inputs"]["age"] == 55

    print("ALL TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_full_flow()

