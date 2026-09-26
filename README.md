# 🤟 Sign Bridge - AI-Powered Sign Language Recognition

Sign Bridge is a real-time sign language recognition system built using **MediaPipe Hands**, **JavaScript**, **Flask**, and **Scikit-Learn (Random Forest Classifier)**. It captures live hand landmark movements from a webcam, groups them into 20-frame sequences, predicts the gesture using a trained Machine Learning model, and speaks the recognized sign aloud using Web Speech Synthesis.

---

## 🤖 GitHub Copilot / AI Prompt (For 1-Click Setup on Mac)

If you are opening this project on your Mac in **VS Code / Cursor / Windsurf** with **GitHub Copilot**, simply copy and paste the prompt below into your Copilot Chat:

```text
Please set up and run this Sign Bridge project on my Mac:
1. Create a Python virtual environment (`python3 -m venv venv`) and activate it (`source venv/bin/activate`).
2. Install all required dependencies from `requirements.txt`.
3. Train the Machine Learning sequence model by running `python train_sequence_model.py` and single-frame model by running `python trainmodel.py`.
4. Start the Flask backend server (`python app.py`) in the background on port 5000.
5. Serve the frontend by running `python3 -m http.server 8000` in the background.
6. Provide the local browser URL (`http://localhost:8000`) so I can open the project.
```

---

## 🛠️ Mac (macOS) Manual Setup & Run Guide

Follow these step-by-step instructions to set up and run **Sign Bridge** on any macOS machine.

### 1. Prerequisites
- **macOS** 10.15 (Catalina) or newer.
- **Python 3.10+** installed. Check version in Terminal:
  ```bash
  python3 --version
  ```
- **Git** (optional, for cloning).
- Modern Web Browser (**Google Chrome** or **Brave** recommended for camera & MediaPipe support).

---

### 2. Setup Step-by-Step

#### Step 1: Open Terminal and Navigate to the Project Directory
```bash
cd /path/to/signBridge
```

#### Step 2: Create a Virtual Environment
```bash
python3 -m venv venv
```

#### Step 3: Activate the Virtual Environment
```bash
source venv/bin/activate
```

#### Step 4: Upgrade Pip & Install Required Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

---

### 3. Train the Machine Learning Models

Before running the backend, ensure the model files (`.pkl`) are generated:

1. **Train Sequence Model (Primary Model for Live Detection)**:
   ```bash
   python train_sequence_model.py
   ```
   *Outputs:* `signbridge_sequence_model.pkl` (20-frame sequence model).

2. **Train Landmark Model (Optional / Benchmark Model)**:
   ```bash
   python trainmodel.py
   ```
   *Outputs:* `signbridge_model.pkl` (Single-frame landmark model).

---

### 4. Run the Project on macOS

You need **two terminal tabs/windows** active (or run backend in background):

#### Terminal 1: Start Flask Backend Server (Port 5000)
```bash
source venv/bin/activate
python app.py
```
> You will see: `* Running on http://127.0.0.1:5000`

#### Terminal 2: Start Frontend Web Server (Port 8000)
```bash
cd /path/to/signBridge
python3 -m http.server 8000
```
> You will see: `Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/)`

---

### 5. Open and Use the Application

1. Open **Google Chrome** or **Safari** on your Mac.
2. Go to: **[http://localhost:8000](http://localhost:8000)** (or `http://127.0.0.1:8000`).
3. Click the **Start Camera** button.
4. Allow browser camera permission when prompted.
5. Perform sign gestures (`HELLO`, `THANK YOU`, `YES`, `NO`) in front of the camera. The system will detect the sign and speak it out loud!

---

## 🪟 Windows Setup & Run Guide

### Quick Terminal Setup (PowerShell / Command Prompt):
```powershell
# 1. Create & Activate Virtual Environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# 2. Install Dependencies
pip install -r requirements.txt

# 3. Train Models
python train_sequence_model.py
python trainmodel.py

# 4. Run Backend Server
python app.py
```

In a second terminal window:
```powershell
python -m http.server 8000
```
Open browser at: **`http://localhost:8000`**

---

## 📁 Project Architecture & Components

```text
signBridge/
├── app.py                         # Flask REST API server (Port 5000) handling /predict POST endpoint
├── index.html                     # Frontend interface (Camera feed, canvas, speech controls, data collection)
├── script.js                      # MediaPipe hand tracker, 20-frame sequence buffer, API fetch, Web Speech synthesis
├── style.css                      # Styling & layout for navigation, camera box, speech boxes
├── train_sequence_model.py        # ML training script for 20-frame sequence dataset -> signbridge_sequence_model.pkl
├── trainmodel.py                  # ML training script for landmark datasets -> signbridge_model.pkl
├── requirements.txt               # Python package dependencies
├── sign_sequence_dataset.csv      # Sequence dataset (40 sequences across HELLO, THANK_YOU, YES, NO)
├── HELLO_dataset.csv              # Single-frame landmark dataset for HELLO
├── THANK_YOU_dataset.csv          # Single-frame landmark dataset for THANK_YOU
├── YES_dataset.csv                # Single-frame landmark dataset for YES
├── NO_dataset.csv                 # Single-frame landmark dataset for NO
├── signbridge_sequence_model.pkl  # Trained Random Forest classifier model binary (Sequence Model)
└── signbridge_model.pkl           # Trained Random Forest classifier model binary (Single-frame Model)
```

---

## ⚙️ How It Works (Technical Overview)

1. **Hand Landmark Detection**: MediaPipe Hands detects 21 3D hand coordinates `(x, y, z)` for each frame from the camera feed via HTML5 Canvas in `script.js`.
2. **20-Frame Sequence Accumulation**: `script.js` collects 20 continuous frames of hand landmark data (20 frames × 21 landmarks × 3 coordinates = 1,260 feature values).
3. **API Prediction**: `script.js` sends the 1,260 feature vector to `http://127.0.0.1:5000/predict` via JSON HTTP POST request.
4. **Machine Learning Model**: `app.py` loads `signbridge_sequence_model.pkl` (a Random Forest Classifier) and predicts the sign (`HELLO`, `THANK_YOU`, `YES`, or `NO`).
5. **Text-To-Speech Output**: Upon receiving `success: true` and the predicted sign string, `script.js` displays the text on screen and speaks it aloud using the browser's `window.speechSynthesis` API.

---

## 🍎 Mac Troubleshooting & FAQ

### 1. Camera not opening / Permission Denied on Mac
- On macOS, grant camera permissions to your browser:
  1. Open **System Settings** > **Privacy & Security** > **Camera**.
  2. Ensure **Google Chrome** (or your browser) is toggled **ON**.
  3. Restart the browser and reload `http://localhost:8000`.

### 2. `ModuleNotFoundError: No module named 'flask'` or `pandas`
- Make sure your virtual environment is activated (`source venv/bin/activate`).
- Run `pip install -r requirements.txt`.

### 3. `Address already in use` (Port 5000 or 8000)
- If port 5000 is used by macOS AirPlay Receiver:
  - Turn off AirPlay Receiver in **System Settings** > **General** > **AirDrop & Handoff** > **AirPlay Receiver** (toggle off).
  - Or run Flask on a different port in `app.py`: `app.run(port=5001)`.

---

## 📜 License & Acknowledgments
Built with ❤️ for AI-powered accessibility using Python, Flask, Scikit-Learn, and MediaPipe.
