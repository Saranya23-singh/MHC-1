from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
import socket

def find_free_port(start=5000):
    port = start
    while True:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('localhost', port)) != 0:
                return port
        port += 1

app = Flask(__name__)

# Load models
model = joblib.load('stress_model.pkl')
le = joblib.load('stress_le.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    features = ['sleep_duration', 'quality_sleep', 'activity_level', 'heart_rate', 'daily_steps', 'bmi_category']
    X = np.array([[data.get(f, 0) for f in features]])
    pred = model.predict(X)[0]
    probs = model.predict_proba(X)[0]
    stress_level = le.inverse_transform([pred])[0]
    confidence = np.max(probs)
    
    return jsonify({
        'stress_level': stress_level,
        'risk': stress_level,
        'confidence': float(confidence),
        'factors': 'Low sleep/activity elevates risk'
    })

if __name__ == '__main__':
    port = find_free_port(5000)
    print(f'Starting Flask ML API on port {port}')
    app.run(host='0.0.0.0', port=port, debug=True)
