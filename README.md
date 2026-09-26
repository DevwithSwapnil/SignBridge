# 🤟 SignBridge - AI-Powered Real-Time Sign Language Recognition & Translation

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0%2B-green.svg)](https://flask.palletsprojects.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.3%2B-orange.svg)](https://scikit-learn.org/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-Hands-red.svg)](https://mediapipe.dev/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

**SignBridge** is a real-time sign language recognition and voice translation system designed to bridge the communication gap between deaf/hard-of-hearing individuals and non-signers.

Using **MediaPipe Hands**, **JavaScript**, **Flask**, and a **Random Forest Classifier (Scikit-Learn)**, SignBridge tracks 21 3D hand landmarks from a live webcam feed, groups them into 20-frame dynamic sequences, classifies the gesture in real time, and speaks the recognized sign aloud using Web Speech Synthesis.

---

## 🌟 Key Features

- 🎥 **Live Hand Tracking**: Captures 21 3D hand coordinates `(x, y, z)` in real time using MediaPipe Hands via HTML5 Canvas.
- 🧠 **Dynamic Sequence Classification**: Analyzes 20 continuous frames (1,260 temporal feature coordinates) with a trained Random Forest model to accurately classify gesture movements.
- 🔊 **Voice Output (Text-to-Speech)**: Uses Web Speech Synthesis API to speak translated gestures immediately.
- 🎤 **Bi-directional Communication**: Includes Speech-to-Text capabilities for standard spoken conversation.
- 📊 **Built-in Data Collection Suite**: Easily record new single-frame hand landmarks or dynamic 20-frame sign sequences directly from the web browser and export dataset CSVs.
- ⚡ **Fast REST API**: Flask backend providing low-latency `/predict` inference endpoint.

---

## 🏗️ System Architecture & Data Flow

```text
┌─────────────────┐       ┌──────────────────────┐       ┌───────────────────────────────┐
│                 │       │                      │       │                               │
│  Webcam Stream  ├──────►│   MediaPipe Hands    ├──────►│  20-Frame Sequence Buffer     │
│                 │       │  (21 3D Coordinates) │       │  (1,260 Feature Vector Array) │
└─────────────────┘       └──────────────────────┘       └──────────────┬────────────────┘
                                                                        │
                                                                 HTTP POST /predict
                                                                        │
┌─────────────────┐       ┌──────────────────────┐                      ▼
│   Web Speech    │       │                      │       ┌───────────────────────────────┐
│   Synthesis     │◄──────┤   Frontend UI        │◄──────┤   Flask REST API Backend      │
│  (Audio Voice)  │       │   (Text Display)     │       │   (Random Forest Classifier)  │
└─────────────────┘       └──────────────────────┘       └───────────────────────────────┘
```

---

## 📁 Repository Structure

```text
SignBridge/
├── app.py                         # Flask REST API server (Port 5000) providing /predict endpoint
├── index.html                     # Web Interface (Camera feed, recognition display, data collector)
├── script.js                      # MediaPipe hand tracker, sequence buffer, fetch API & speech synthesis
├── style.css                      # Modern dark layout, animations, responsive design system
├── train_sequence_model.py        # ML script training 20-frame sequence model -> signbridge_sequence_model.pkl
├── trainmodel.py                  # ML script training landmark model -> signbridge_model.pkl
├── requirements.txt               # Python package dependencies
├── sign_sequence_dataset.csv      # Sequence dataset (40 sequence samples for HELLO, THANK_YOU, YES, NO)
├── HELLO_dataset.csv              # Landmark dataset for HELLO (410 samples)
├── THANK_YOU_dataset.csv          # Landmark dataset for THANK_YOU (410 samples)
├── YES_dataset.csv                # Landmark dataset for YES (359 samples)
├── NO_dataset.csv                 # Landmark dataset for NO (523 samples)
├── signbridge_sequence_model.pkl  # Trained Random Forest Classifier (Sequence Model)
├── signbridge_model.pkl           # Trained Random Forest Classifier (Landmark Model)
└── .gitignore                     # Git exclusion rules for virtual environments & build artifacts
```

---

## 🛠️ Step-by-Step Setup & Run Guide

### 📋 Prerequisites

- **Operating System**: Windows 10/11, macOS, or Linux.
- **Python**: Version **3.10** or higher. Check installed version:
  ```bash
  python --version
  # or
  python3 --version
  ```
- **Git**: Installed on your system.
- **Web Browser**: Google Chrome, Brave, Microsoft Edge, or Safari (Camera permission support required).

---

### 1️⃣ Step 1: Clone the Repository

```bash
git clone https://github.com/DevwithSwapnil/SignBridge.git
cd SignBridge
```

---

### 2️⃣ Step 2: Create & Activate Virtual Environment

#### 🪟 Windows (PowerShell / Command Prompt)

**PowerShell:**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Command Prompt (cmd):**
```cmd
python -m venv venv
.\venv\Scripts\activate.bat
```

#### 🍎 macOS & 🐧 Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

---

### 3️⃣ Step 3: Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

---

### 4️⃣ Step 4: Train Machine Learning Models

Before running the backend, train the Random Forest Classifier models to generate the `.pkl` binary files:

1. **Train Sequence Model (Primary Live Detection Model)**:
   ```bash
   python train_sequence_model.py
   ```
   *Output:* `signbridge_sequence_model.pkl`

2. **Train Landmark Model (Single-Frame Benchmark Model)**:
   ```bash
   python trainmodel.py
   ```
   *Output:* `signbridge_model.pkl`

---

### 5️⃣ Step 5: Run the Application

You need **two terminal instances** active (one for Flask API backend, one for Frontend web server):

#### Terminal 1: Start Flask Backend API (Port 5000)

Make sure virtual environment is activated, then run:

```bash
python app.py
```
> You will see:
> `================================`
> `SIGN BRIDGE BACKEND`
> `================================`
> `Server starting...`
> `* Running on http://127.0.0.1:5000`

---

#### Terminal 2: Start Frontend Web Server (Port 8000)

Open a new terminal tab/window in the project directory:

**Windows / macOS / Linux:**
```bash
python -m http.server 8000
```
> You will see: `Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/)`

---

### 6️⃣ Step 6: Access & Use SignBridge in Browser

1. Open **Google Chrome** or **Brave** browser.
2. Navigate to: **`http://localhost:8000`**
3. Scroll to **Sign Bridge Communication** or click **Start Communication**.
4. Click the **Start Camera** button.
5. Grant camera permission when prompted by the browser.
6. Perform gestures in front of your webcam (e.g. **HELLO**, **THANK YOU**, **YES**, **NO**).
7. SignBridge will display the predicted sign on screen and pronounce it via Text-to-Speech! 🔊

---

## 🤖 AI / 1-Click Terminal Setup Prompt

If you are using **GitHub Copilot / Cursor / Windsurf / Antigravity**, paste this prompt to execute setup automatically:

```text
Please set up and launch Sign Bridge:
1. Create a Python virtual environment (`python -m venv venv`) and activate it.
2. Install dependencies via `pip install -r requirements.txt`.
3. Train models by running `python train_sequence_model.py` and `python trainmodel.py`.
4. Run Flask backend (`python app.py`) on port 5000 in background.
5. Run HTTP frontend server (`python -m http.server 8000`) on port 8000 in background.
6. Share http://localhost:8000.
```

---

## 🧪 Data Collection & Training Custom Gestures

SignBridge features a built-in browser-based dataset collection suite:

1. Launch the web app at `http://localhost:8000`.
2. Scroll to **Sign Data Collection** (Single-Frame) or **Sign Sequence Collection** (20-Frame Sequence).
3. Select a gesture label (`HELLO`, `THANK YOU`, `YES`, `NO`) from the dropdown.
4. Click **Start Collecting** or **Start Sequence**.
5. Perform the sign gesture repeatedly in front of your camera.
6. Click **Download Dataset** to save `dataset.csv` or `sign_sequence_dataset.csv`.
7. Move the exported CSV into your project folder and re-run `python train_sequence_model.py` to train your new gestures!

---

## 🔌 API Endpoint Documentation

### Base URL: `http://127.0.0.1:5000`

#### 1. `GET /`
- **Description**: Health check endpoint verifying backend status.
- **Response**: `200 OK`
  ```text
  Sign Bridge Backend is Running!
  ```

#### 2. `POST /predict`
- **Description**: Predict sign gesture label from a 1,260-element landmark sequence array.
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "features": [0.521, 0.432, 0.001, ..., 0.612]
  }
  ```
- **Response (Success)**: `200 OK`
  ```json
  {
    "success": true,
    "prediction": "HELLO"
  }
  ```
- **Response (Error)**: `400 Bad Request`
  ```json
  {
    "success": false,
    "error": "Invalid feature dimensions"
  }
  ```

---

## ❓ Troubleshooting & FAQs

### 1. 📷 Camera is not opening or shows "Permission Denied"
- **macOS**: Go to `System Settings` > `Privacy & Security` > `Camera` and enable permissions for your browser.
- **Windows**: Go to `Settings` > `Privacy & security` > `Camera` and turn on `Let desktop apps access your camera`.

### 2. ❌ `Address already in use` error on Port 5000
- **macOS AirPlay Issue**: macOS uses port 5000 for AirPlay Receiver. Disable it via `System Settings` > `General` > `AirDrop & Handoff` > disable `AirPlay Receiver`, or change port in `app.py` to `5001`.

### 3. 📦 `ModuleNotFoundError: No module named 'flask'`
- Ensure your virtual environment is activated before running python scripts (`source venv/bin/activate` or `.\venv\Scripts\Activate.ps1`).

---

## 📄 License & Acknowledgments

Built with ❤️ for accessible AI technology using **Python**, **Flask**, **Scikit-Learn**, and **Google MediaPipe**.
