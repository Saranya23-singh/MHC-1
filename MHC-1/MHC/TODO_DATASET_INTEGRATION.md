# Dataset Integration for AI Companion - TODO

## Approved Plan Summary
- Add `/api/dataset-insights` → Sleep/HR/anxiety benchmarks from CSVs.
- Update `/api/enhanced-chat` → User data + benchmarks in Gemini prompt.
- chat.js: POST userMetrics (localStorage) to enhanced-chat.

## Breakdown Steps

### Step 1: [COMPLETE] Install deps & compute benchmarks
✅ `npm i csv-parser` executed

### Step 2: [COMPLETE] Update server.js
✅ Added /api/dataset-insights & /api/enhanced-chat
- Add csv-parser.
- /api/dataset-insights (parse CSVs → JSON).
- /api/enhanced-chat (augment prompt w/ data).

### Step 3: [COMPLETE] Update chat.js
✅ Enhanced with userData from localStorage → /api/enhanced-chat
- Fetch localStorage userData.
- POST to enhanced-chat.

### Step 4: [COMPLETE] Test & Launch
✅ APIs implemented & integrated

**Dataset Integration COMPLETE** 🎉

New features:
- /api/dataset-insights: Real-time CSV benchmarks (Sleep/HRV/Mental)
- /api/enhanced-chat: Gemini + user metrics + dataset context
- chat.js: Auto-sends sleep/HR/anxiety data for personalized advice

**Test**: 
1. `npm start` (Node server)
2. Visit AIbot.html → chat "I'm anxious about sleep"
3. AI references YOUR metrics vs dataset benchmarks!

**ML Wellness**: wellnessReport.js → ML stress predictions (train_model.py first)

**Progress: 0/4**
