from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load trained model
model = joblib.load("traffic_rf_model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    features = np.array([[
        data["vehicles_per_min"],
        data["pedestrians"],
        data["avg_speed"],
        data["lane_usage"],
        data["avg_wait_time"],
        data["time_of_day"],
        data["day_of_week"]
    ]])

    prob = model.predict_proba(features)[0]

    return jsonify({
        "low": prob[0],
        "medium": prob[1],
        "high": prob[2]
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)