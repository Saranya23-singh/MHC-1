#!/bin/bash
# ML Training Script - Robust Setup for MHC Wellness Model

echo "🚀 Setting up ML Environment & Training Stress Predictor..."

cd MHC || { echo "❌ MHC dir not found"; exit 1; }

# Check Python 3.11+
if ! python3.11 -c "exit()" 2>/dev/null; then
    echo "⚠️  Python 3.11+ recommended (conda py3.11)"
    echo "Using: $(python3 --version)"
fi

# Virtual env
rm -rf venv
python3 -m venv venv
source venv/bin/activate

# Install deps
pip install --upgrade pip
pip install -r ml_model/requirements.txt

# Train model
cd ml_model
python train_model.py

echo "✅ Model trained! stress_model.pkl created"
echo "📊 Check accuracy printed above (~85-95% expected)"
echo ""
echo "To run ML API: python predict.py  (port 5000)"
echo "Node proxy ready: npm start  (uses ML or fallback)"
echo ""
echo "🎯 Test: http://localhost:3000/wellnessReport.html + sample data"

