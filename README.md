# Kidney Disease Prediction System

A complete modern full-stack Machine Learning based web application that predicts whether a patient has Kidney Disease or not based on medical input parameters.

## Tech Stack
- **Frontend**: React.js (via CDN), Tailwind CSS, Framer Motion
- **Backend**: Python FastAPI, Uvicorn
- **Machine Learning**: Scikit-learn, Random Forest

## Features
- Beautiful modern responsive UI with Glassmorphism and Animated gradients.
- Dark/Light mode toggle.
- Authentication screens (UI-only for demo).
- User Dashboard with statistics.
- Interactive 24-field Medical Prediction Form.
- Live API integration with FastAPI backend.
- Machine Learning inference using pre-trained Random Forest model.

## Folder Structure
- `/backend`: Contains FastAPI app (`main.py`), ML training script (`train_model.py`), and saved models (`/models`).
- `/frontend`: Contains the React application (`index.html` and `app.jsx`).

## Setup Instructions

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Train the ML model (this generates the `models/` directory):
   ```bash
   python train_model.py
   ```
5. Run the FastAPI server:
   ```bash
   python main.py
   ```
   *The API will be running at `http://localhost:8000`*

### 2. Frontend Setup
Since the frontend uses CDN for React and Tailwind CSS, there is no need to run `npm install`. Node.js is not required.
1. Simply open the `frontend/index.html` file in any modern web browser.
2. Alternatively, serve it using any local web server (e.g., Live Server extension in VS Code, or Python's `http.server`):
   ```bash
   cd frontend
   python -m http.server 3000
   ```
3. Navigate to `http://localhost:3000` in your browser.

## Using the Application
1. Click **Get Started** or **Sign In**.
2. From the **Dashboard**, click **New Prediction**.
3. Fill in the mock medical parameters and click **Run Prediction Model**.
4. View the AI analysis and generated result.
