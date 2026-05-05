import pandas as pd
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, f1_score

print("🚀 Starting model...\n")

# ===== AUTO FIND DATASET =====
dataset_folder = "../datasets"

if not os.path.exists(dataset_folder):
    print("❌ Dataset folder not found:", dataset_folder)
    exit()

files = os.listdir(dataset_folder)

print("📂 Available dataset files:")
for f in files:
    print(" -", f)

# 👉 Pick first CSV automatically (you can change later)
csv_files = [f for f in files if f.endswith(".csv")]

if not csv_files:
    print("❌ No CSV file found in datasets folder")
    exit()

dataset_path = os.path.join(dataset_folder, csv_files[0])
print("\n✅ Using dataset:", dataset_path)

# ===== LOAD DATA =====
df = pd.read_csv(dataset_path)

print("\n📊 Dataset Preview:")
print(df.head())

# ===== AUTO SELECT TARGET COLUMN =====
# Try common names
possible_targets = ["target", "label", "stress", "stress_level", "emotion"]

target = None
for col in possible_targets:
    if col in df.columns:
        target = col
        break

# If not found, use last column
if target is None:
    target = df.columns[-1]

print("\n🎯 Target column:", target)

# ===== PREPROCESS =====
df = df.dropna()

X = df.drop(columns=[target])
y = df[target]

# Convert categorical to numeric (important)
X = pd.get_dummies(X)

# ===== TRAIN TEST SPLIT =====
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ===== MODELS =====
models = {
    "Logistic Regression": LogisticRegression(max_iter=1000),
    "Decision Tree": DecisionTreeClassifier(),
    "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42)
}

print("\n===== RESULTS =====\n")

for name, model in models.items():
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)

    acc = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred, average='weighted')

    print(f"{name}")
    print(f"Accuracy: {acc*100:.2f}%")
    print(f"F1 Score: {f1:.2f}")
    print("-" * 40)

# ===== FEATURE IMPORTANCE =====
rf = models["Random Forest"]

importances = rf.feature_importances_
features = X.columns

print("\n===== FEATURE IMPORTANCE =====\n")
for f, i in sorted(zip(features, importances), key=lambda x: x[1], reverse=True):
    print(f"{f}: {i:.4f}")