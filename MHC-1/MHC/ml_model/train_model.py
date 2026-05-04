import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import joblib

# Load dataset
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, 'datasets', 'Sleep_health_and_lifestyle_dataset.csv')
df = pd.read_csv(DATA_PATH)

# Prep features
df['BMI Category_num'] = df['BMI Category'].map({'Normal Weight': 0, 'Normal': 0, 'Overweight': 1, 'Obese': 2}).fillna(1)
features = ['Sleep Duration', 'Quality of Sleep', 'Physical Activity Level', 'Heart Rate', 'Daily Steps', 'BMI Category_num']
X = df[features].fillna(df[features].mean())
y = pd.cut(df['Stress Level'], bins=[0,4,7,10], labels=['Low', 'Moderate', 'High'])

# Encode y
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# Train RF
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Eval
y_pred = model.predict(X_test)
print(f'Accuracy: {accuracy_score(y_test, y_pred):.2f}')
print(classification_report(y_test, y_pred, target_names=le.classes_))

# Save
joblib.dump(model, 'stress_model.pkl')
joblib.dump(le, 'stress_le.pkl')
print('Model saved: stress_model.pkl')
