import sqlite3
import os
import json
from typing import List, Dict, Optional, Any

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "kidney_care.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize database tables if they do not exist."""
    with get_connection() as conn:
        cursor = conn.cursor()
        
        # Create users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        cursor.execute("PRAGMA table_info(users)")
        user_columns = [column[1] for column in cursor.fetchall()]
        if "role" not in user_columns:
            cursor.execute("ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user'")
        
        # Create predictions table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS predictions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_email TEXT NOT NULL,
                patient_id TEXT NOT NULL,
                date TEXT NOT NULL,
                risk TEXT NOT NULL,
                status TEXT NOT NULL,
                confidence TEXT NOT NULL,
                age_gender TEXT NOT NULL,
                inputs_json TEXT DEFAULT '{}',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_email) REFERENCES users (email)
            )
        """)

        # Migration check: Ensure inputs_json column exists in predictions table if created previously
        cursor.execute("PRAGMA table_info(predictions)")
        columns = [column[1] for column in cursor.fetchall()]
        if "inputs_json" not in columns:
            cursor.execute("ALTER TABLE predictions ADD COLUMN inputs_json TEXT DEFAULT '{}'")

        # Create user preferences table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_preferences (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_email TEXT UNIQUE NOT NULL,
                theme TEXT DEFAULT 'dark',
                auto_save INTEGER DEFAULT 1,
                custom_settings TEXT DEFAULT '{}',
                draft_form_data TEXT DEFAULT '{}',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_email) REFERENCES users (email)
            )
        """)

        # Create models table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS models (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                model_name TEXT NOT NULL,
                version TEXT NOT NULL,
                accuracy REAL NOT NULL,
                algorithm TEXT NOT NULL,
                hyperparameters TEXT DEFAULT '{}',
                feature_names TEXT DEFAULT '[]',
                trained_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_active INTEGER DEFAULT 1
            )
        """)

        conn.commit()

def create_user(name: str, email: str, password: str) -> Optional[Dict]:
    """Create a new user in the database."""
    try:
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
                (name, email.lower().strip(), password)
            )
            conn.commit()
            return {"name": name, "email": email.lower().strip()}
    except sqlite3.IntegrityError:
        return None

def get_user_by_email(email: str) -> Optional[Dict]:
    """Retrieve user details by email."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE LOWER(email) = ?", (email.lower().strip(),))
        row = cursor.fetchone()
        if row:
            return dict(row)
        return None

def set_user_role(email: str, role: str) -> bool:
    """Set a user's application role."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET role = ? WHERE LOWER(email) = ?", (role, email.lower().strip()))
        conn.commit()
        return cursor.rowcount > 0

def get_admin_count() -> int:
    """Return the number of registered administrators."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'admin'")
        return cursor.fetchone()[0]

def save_user_preferences(
    user_email: str,
    theme: str = 'dark',
    auto_save: bool = True,
    custom_settings: Optional[Dict] = None,
    draft_form_data: Optional[Dict] = None
) -> Dict:
    """Save or update user preferences and customizations in DB."""
    email_clean = user_email.lower().strip()
    settings_str = json.dumps(custom_settings or {})
    draft_str = json.dumps(draft_form_data or {})
    auto_save_val = 1 if auto_save else 0

    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO user_preferences (user_email, theme, auto_save, custom_settings, draft_form_data, updated_at)
            VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(user_email) DO UPDATE SET
                theme = excluded.theme,
                auto_save = excluded.auto_save,
                custom_settings = excluded.custom_settings,
                draft_form_data = excluded.draft_form_data,
                updated_at = CURRENT_TIMESTAMP
        """, (email_clean, theme, auto_save_val, settings_str, draft_str))
        conn.commit()
        return {
            "user_email": email_clean,
            "theme": theme,
            "auto_save": auto_save,
            "custom_settings": custom_settings or {},
            "draft_form_data": draft_form_data or {}
        }

def get_user_preferences(user_email: str) -> Dict:
    """Retrieve saved preferences for a user."""
    email_clean = user_email.lower().strip()
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM user_preferences WHERE LOWER(user_email) = ?", (email_clean,))
        row = cursor.fetchone()
        if row:
            row_dict = dict(row)
            return {
                "user_email": row_dict["user_email"],
                "theme": row_dict["theme"],
                "auto_save": bool(row_dict["auto_save"]),
                "custom_settings": json.loads(row_dict["custom_settings"] or '{}'),
                "draft_form_data": json.loads(row_dict["draft_form_data"] or '{}'),
                "updated_at": row_dict["updated_at"]
            }
        return {
            "user_email": email_clean,
            "theme": "dark",
            "auto_save": True,
            "custom_settings": {},
            "draft_form_data": {}
        }

def save_model_metadata(
    model_name: str,
    version: str,
    accuracy: float,
    algorithm: str,
    hyperparameters: Dict,
    feature_names: List[str],
    is_active: bool = True
) -> Dict:
    """Record model metrics and metadata into DB."""
    with get_connection() as conn:
        cursor = conn.cursor()
        if is_active:
            cursor.execute("UPDATE models SET is_active = 0 WHERE is_active = 1")
        cursor.execute("""
            INSERT INTO models (model_name, version, accuracy, algorithm, hyperparameters, feature_names, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            model_name,
            version,
            accuracy,
            algorithm,
            json.dumps(hyperparameters),
            json.dumps(feature_names),
            1 if is_active else 0
        ))
        conn.commit()
        model_id = cursor.lastrowid
        return {
            "id": model_id,
            "model_name": model_name,
            "version": version,
            "accuracy": accuracy,
            "algorithm": algorithm,
            "hyperparameters": hyperparameters,
            "feature_names": feature_names,
            "is_active": is_active
        }

def get_active_model_metadata() -> Optional[Dict]:
    """Retrieve current active model details from DB."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM models WHERE is_active = 1 ORDER BY id DESC LIMIT 1")
        row = cursor.fetchone()
        if row:
            row_dict = dict(row)
            return {
                "id": row_dict["id"],
                "model_name": row_dict["model_name"],
                "version": row_dict["version"],
                "accuracy": row_dict["accuracy"],
                "algorithm": row_dict["algorithm"],
                "hyperparameters": json.loads(row_dict["hyperparameters"] or '{}'),
                "feature_names": json.loads(row_dict["feature_names"] or '[]'),
                "trained_at": row_dict["trained_at"],
                "is_active": bool(row_dict["is_active"])
            }
        return None

def get_all_models_history() -> List[Dict]:
    """Retrieve history of all trained models."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM models ORDER BY id DESC")
        rows = cursor.fetchall()
        result = []
        for row in rows:
            rd = dict(row)
            rd["hyperparameters"] = json.loads(rd["hyperparameters"] or '{}')
            rd["feature_names"] = json.loads(rd["feature_names"] or '[]')
            rd["is_active"] = bool(rd["is_active"])
            result.append(rd)
        return result

def save_prediction(
    user_email: str,
    patient_id: str,
    date: str,
    risk: str,
    status: str,
    confidence: str,
    age_gender: str,
    inputs_json: Optional[str] = "{}"
) -> Dict:
    """Save a patient prediction to the database."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO predictions (user_email, patient_id, date, risk, status, confidence, age_gender, inputs_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (user_email.lower().strip(), patient_id, date, risk, status, confidence, age_gender, inputs_json or "{}"))
        conn.commit()
        return {
            "id": patient_id,
            "date": date,
            "risk": risk,
            "status": status,
            "confidence": confidence,
            "ageGender": age_gender,
            "inputs": json.loads(inputs_json) if inputs_json else {}
        }

def get_user_predictions(user_email: str) -> List[Dict]:
    """Retrieve all predictions for a specific user ordered by latest first."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id as record_id, patient_id as id, date, risk, status, confidence, age_gender as ageGender, inputs_json as inputsJson
            FROM predictions
            WHERE LOWER(user_email) = ?
            ORDER BY record_id DESC
        """, (user_email.lower().strip(),))
        rows = cursor.fetchall()
        res = []
        for row in rows:
            rd = dict(row)
            try:
                rd["inputs"] = json.loads(rd.pop("inputsJson") or '{}')
            except Exception:
                rd["inputs"] = {}
            res.append(rd)
        return res

def get_all_predictions() -> List[Dict]:
    """Retrieve every prediction with the owning user's details for administrators."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT predictions.id AS record_id, users.name, predictions.user_email,
                   predictions.patient_id, predictions.date, predictions.risk,
                   predictions.status, predictions.confidence, predictions.age_gender,
                   predictions.inputs_json
            FROM predictions
            LEFT JOIN users ON LOWER(users.email) = LOWER(predictions.user_email)
            ORDER BY predictions.id DESC
        """)
        rows = cursor.fetchall()
        result = []
        for row in rows:
            record = dict(row)
            try:
                record["inputs"] = json.loads(record.pop("inputs_json") or '{}')
            except Exception:
                record["inputs"] = {}
            record["ageGender"] = record.pop("age_gender")
            record["patient_id"] = record.pop("patient_id")
            result.append(record)
        return result


