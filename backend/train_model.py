import pandas as pd
import numpy as np
import kagglehub
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

def train_kaggle_model():
    print("Downloading kaggle dataset...")
    path = kagglehub.dataset_download('mansoordaku/ckdisease')
    csv_path = os.path.join(path, 'kidney_disease.csv')
    
    df = pd.read_csv(csv_path)
    
    # drop id column
    df.drop('id', axis=1, inplace=True)
    
    # rename column names to match frontend and main.py perfectly
    df.columns = [
        'age', 'blood_pressure', 'specific_gravity', 'albumin', 'sugar', 
        'red_blood_cells', 'pus_cell', 'pus_cell_clumps', 'bacteria', 
        'blood_glucose_random', 'blood_urea', 'serum_creatinine', 'sodium',
        'potassium', 'hemoglobin', 'packed_cell_volume', 'white_blood_cell_count', 
        'red_blood_cell_count', 'hypertension', 'diabetes_mellitus', 
        'coronary_artery_disease', 'appetite', 'pedal_edema', 'anemia', 'kidney_disease'
    ]
    
    # converting necessary columns to numerical type
    df['packed_cell_volume'] = pd.to_numeric(df['packed_cell_volume'], errors='coerce')
    df['white_blood_cell_count'] = pd.to_numeric(df['white_blood_cell_count'], errors='coerce')
    df['red_blood_cell_count'] = pd.to_numeric(df['red_blood_cell_count'], errors='coerce')
    
    # replace incorrect values
    df['diabetes_mellitus'] = df['diabetes_mellitus'].replace({'\tno':'no','\tyes':'yes',' yes':'yes'})
    df['coronary_artery_disease'] = df['coronary_artery_disease'].replace({'\tno':'no'})
    
    # Map ckd and variants to 1, notckd to 0
    df['kidney_disease'] = df['kidney_disease'].map({'ckd': 1, 'ckd\t': 1, 'notckd': 0, 'not ckd': 0})
    df['kidney_disease'] = pd.to_numeric(df['kidney_disease'], errors='coerce')
    df = df.dropna(subset=['kidney_disease'])

    # Define explicit columns based on the problem domain
    cat_cols = [
        'red_blood_cells', 'pus_cell', 'pus_cell_clumps', 'bacteria',
        'hypertension', 'diabetes_mellitus', 'coronary_artery_disease',
        'appetite', 'pedal_edema', 'anemia'
    ]
    num_cols = [col for col in df.columns if col not in cat_cols and col != 'kidney_disease']
    
    # filling null values, we will use two methods, random sampling for higher null values and 
    # mean/mode sampling for lower null values
    def random_value_imputation(feature):
        random_sample = df[feature].dropna().sample(df[feature].isna().sum(), replace=True)
        random_sample.index = df[df[feature].isnull()].index
        df.loc[df[feature].isnull(), feature] = random_sample
        
    def impute_mode(feature):
        mode = df[feature].mode()[0]
        df[feature] = df[feature].fillna(mode)

    # filling num_cols null values using random sampling method
    for col in num_cols:
        random_value_imputation(col)

    # filling "red_blood_cells" and "pus_cell" using random sampling method and rest of cat_cols using mode imputation
    random_value_imputation('red_blood_cells')
    random_value_imputation('pus_cell')
    
    for col in cat_cols:
        impute_mode(col)
        
    # encode categorical variables
    encoders = {}
    for col in cat_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        encoders[col] = le
        
    # Prepare X and y
    X = df.drop('kidney_disease', axis=1)
    y = df['kidney_disease']
    
    # Splitting data into training and test set
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=0)
    
    print("Training Random Forest model with kaggle notebook hyperparameters...")
    # These are the exact hyperparameters from the notebook
    model = RandomForestClassifier(
        criterion='entropy', 
        max_depth=11, 
        max_features='sqrt', 
        min_samples_leaf=2, 
        min_samples_split=3, 
        n_estimators=130,
        random_state=42
    )
    model.fit(X_train, y_train)
    
    print("Evaluating model...")
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Test Accuracy of Random Forest Classifier is {acc:.4f} \n")
    print(f"Confusion Matrix :-\n{confusion_matrix(y_test, y_pred)}\n")
    print(f"Classification Report :-\n{classification_report(y_test, y_pred)}")
    
    # Save the model and encoders
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    models_dir = os.path.join(BASE_DIR, 'models')
    os.makedirs(models_dir, exist_ok=True)
    joblib.dump(model, os.path.join(models_dir, 'kidney_model.joblib'))
    joblib.dump(encoders, os.path.join(models_dir, 'encoders.joblib'))
    joblib.dump(X.columns.tolist(), os.path.join(models_dir, 'features.joblib'))
    
    print(f"Model and encoders saved successfully in '{models_dir}' directory.")

    # Save model metadata in SQLite database
    try:
        from database import init_db, save_model_metadata
        init_db()
        save_model_metadata(
            model_name="KidneyCare Random Forest Classifier",
            version=f"1.0.{int(os.path.getmtime(os.path.join(models_dir, 'kidney_model.joblib')))}",
            accuracy=float(round(acc, 4)),
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
            feature_names=X.columns.tolist(),
            is_active=True
        )
        print("Model metadata successfully saved to SQLite database.")
    except Exception as db_err:
        print(f"Failed to record model metadata in DB: {db_err}")

if __name__ == "__main__":
    train_kaggle_model()

