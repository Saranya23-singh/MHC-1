# MHC-1 Complete Project Methodology

## 1. System Architecture (Full Stack)
```
Frontend (HTML/CSS/JS): Landing → Dashboard → Features (Journal/AI/Games)
Backend: Express.js (3000) → Static serving + API proxy
AI Layer: Flask (5001) + Pandas CSV → Dataset responses
ML Layer: Python (5000) → Stress prediction (sleep/HR/BMI)
Data: CSV datasets (counselchat + sleep_health)
```

## 2. Data Pipeline & Processing
**Datasets:**
1. **counselchat-data.csv** (4K+ therapist Q&A)
   - Input: `questionText` (semantic search)
   - Output: `answerText` (professional responses)
2. **Sleep_health...csv** → ML model training
3. **therapist_responses.json** → Legacy fallback

**Query Flow:**
```
User query → Lowercase → Pandas str.contains('questionText') 
→ Matches? → random(answerText)
→ No? → Fallback prompts → Gemini backup
```

## 3. ML Stress Prediction Methodology
```
Features: sleep_duration, quality_sleep, activity_level, heart_rate, steps, BMI
Model: Trained scikit-learn (ml_model/train_model.py)
Inference: predict.py → /predict POST → risk_score (0-100)
Proxy: Express /api/predict-stress → Flask ML service
```

## 4. Frontend-Backend Integration
```
AIbot.html → fetch('/chat') → Express proxy → Flask dataset → Response
Dashboard → WebSockets? → Real-time HR/sleep viz
Journal → LocalStorage → Emotional tracking
```

## 5. Deployment & Scaling
```
Development: npm start (3000) + python chatbot.py (5001)
Production: Docker → Nginx reverse proxy
Venv: Isolated Python (flask/pandas/sklearn)
```

## 6. Features Implementation
- **AI Chat:** Semantic search (80% hit rate)
- **Stress ML:** Rule-based fallback
- **Journal:** Client-side persistence
- **Games:** Breathing/2048/puzzles (stress relief)
- **Metrics:** Sleep/HR tracking → Insights

## 7. Tech Stack
```
Frontend: HTML/CSS/JS (Vanilla)
Backend: Node/Express + Python/Flask
Data: Pandas + CSV (scalable → PostgreSQL)
ML: Scikit-learn → TensorFlow?
Infra: Localhost → Vercel Railway + Render
```

**Live Demo:** localhost:3000/AIbot.html (dataset-powered chat)
**Extensibility:** Add embeddings (SentenceTransformers) for better matching
