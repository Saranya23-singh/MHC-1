# Tranquoria - Mental Wellness App

## Core Flow
1. `/` → `login.html`
2. Login → `companion.html` (mood selection)
3. Mood:
   - Sad/Stressed → AI/games
   - Neutral/Happy → `dashboard.html`
4. Dashboard accessible anytime

## Key Files
**Server:**
- `server.js` - Express API (/api/chat Gemini)

**Flow:**
- `public/navigation.js` - goTo* functions
- `public/login.html` - Auth
- `public/companion.html` - Mood/AI
- `public/CompanionLayer.js` - SPA logic
- `public/ChatScreen.js` - AI UI

**Dashboard:**
- `public/dashboard.*` - Main UI

## Run
```bash
cd MHC-1/MHC
node server.js
open http://localhost:3000
```

## Unused (marked // UNUSED FILE)
- AIbot.* (old bot)
- ml_model/* (backup ML)
- VC/* (video chat)
- .offline files (backups)

**All files preserved.**
