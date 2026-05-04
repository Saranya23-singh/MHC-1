import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// No-cache middleware
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

// EXPLICIT ROUTE FIRST - overrides static for /
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// API routes
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "your_new_key_here";

const SYSTEM_PROMPT = `You are "My Companion", a supportive AI mental wellness assistant for Tranquoria. Your role is to:
1. Respond empathetically
2. Help with anxiety/stress/loneliness
3. Guide breathing/journaling
4. NEVER diagnose or prescribe
5. Prioritize emotional well-being`;

app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message required" });
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\nUser: ${message}\nAssistant:` }] }],
                    generationConfig: { temperature: 0.9, maxOutputTokens: 500 }
                })
            }
        );
        if (!response.ok) throw new Error('Gemini error');
        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm here for you. 💚";
        res.json({ reply });
    } catch (error) {
        console.error(error);
        res.json({ reply: "Take a deep breath. 🌿 I'm here to support you." });
    }
});

app.get("/api/dataset-insights", (req, res) => {
    res.json({
        sleep: { avgSleep: 6.8, avgHR: 74 },
        mental: { avgSessions: 4.2 }
    });
});

app.post("/api/predict-stress", async (req, res) => {
    try {
        const { avgSleep, avgHR } = req.body;
        const score = Math.round(Math.max(0, Math.min(100, (8 - parseFloat(avgSleep || 0)) * 10 + (parseInt(avgHR || 70) - 70) * 0.5)));
        res.json({ stress_level: score.toString(), risk: score > 60 ? 'High' : 'Low', confidence: 0.75 });
    } catch (error) {
        res.json({ stress_level: '50', risk: 'Moderate', confidence: 0.75 });
    }
});

app.post("/chat", async (req, res) => {
    res.json({ response: "Dataset service ready. 😊" });
});

// Static AFTER routes
app.use(express.static(path.join(__dirname, 'public'), { index: false })); // disable index.html auto

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Tranquoria on port ${PORT} - / forces login.html, no auto-index`));
