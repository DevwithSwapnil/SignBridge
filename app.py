from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib

app = Flask(__name__)
CORS(app)

print("Loading Sign Bridge sequence model...")

model = joblib.load("signbridge_sequence_model.pkl")

print("Model loaded successfully!")


@app.route("/")
def home():
    return "Sign Bridge Backend is Running!"


@app.route("/predict", methods=["POST"])
def predict():

    try:
        data = request.get_json()

        features = data["features"]

        features = np.array(features)

        features = features.reshape(1, -1)

        prediction = model.predict(features)

        predicted_sign = str(prediction[0])

        return jsonify({
            "success": True,
            "prediction": predicted_sign
        })

    except Exception as error:

        print("Prediction error:", error)

        return jsonify({
            "success": False,
            "error": str(error)
        }), 400


if __name__ == "__main__":

    print("")
    print("================================")
    print("SIGN BRIDGE BACKEND")
    print("================================")
    print("Server starting...")
    print("")

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )