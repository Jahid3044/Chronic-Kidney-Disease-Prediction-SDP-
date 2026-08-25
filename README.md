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

### One-command startup (recommended)
From the project root, run:

```bash
python start_app.py
```

This launches both services together:
- Backend API: `http://localhost:8000`
- Frontend app: `http://localhost:3000`

This avoids the frequent "Connection Error" caused by forgetting to start the backend manually before making a prediction.

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
1. Serve the frontend with a local web server:
   ```bash
   cd frontend
   python -m http.server 3000
   ```
2. Navigate to `http://localhost:3000` in your browser.

> If the backend is not running, the prediction page will show a connection error because the app cannot reach the API on port 8000.

### Administrator Portal
The administrator portal is available from the **Admin Portal** link in the navigation. The first visitor must create an administrator account, then sign in with that account before accessing all saved patient CKD screening assessments. The portal supports downloading an individual patient CSV or one CSV containing all assessments.

Only the first administrator registration is allowed. Administrator sessions use a server-issued token, and the prediction endpoints remain limited to the signed-in administrator.

## Using the Application
1. Click **Get Started** or **Sign In**.
2. From the **Dashboard**, click **New Prediction**.
3. Fill in the mock medical parameters and click **Run Prediction Model**.
4. View the AI analysis and generated result.
