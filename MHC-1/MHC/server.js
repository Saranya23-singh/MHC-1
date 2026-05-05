import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import csv from "csv-parser";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// -------------------------
// NO CACHE
// -------------------------
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// -------------------------
// ROUTE
// -------------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// -------------------------
// THERAPIST FALLBACK RESPONSES
// -------------------------
const therapistResponses = {
  anxiety: [
    "I understand you're feeling anxious. Take a deep breath with me.",
    "Anxiety can feel overwhelming. Try 4-7-8 breathing.",
    "It's normal to feel anxious. What can we focus on right now?"
  ],
  sadness: [
    "I'm here with you. It's okay to feel sad.",
    "Sadness can feel heavy. You're not alone.",
    "Be kind to yourself. What would you say to a friend?"
  ],
  stress: [
    "That sounds overwhelming. Let's take it one step at a time.",
    "Try breaking things into smaller tasks.",
    "You're doing your best. What can you simplify today?"
  ],
  anger: [
    "It's okay to feel angry. What triggered it?",
    "Take a pause and breathe into the feeling.",
    "Let's find a healthy way to release that anger."
  ],
  loneliness: [
    "You're not alone. I'm here with you.",
    "Connection starts small. Maybe reach out to someone.",
    "You deserve to feel seen and supported."
  ],
  general: [
    "I'm here to listen. Tell me more.",
    "How can I support you right now?",
    "Your feelings matter."
  ]
};

// -------------------------
// DATA STORAGE
// -------------------------
const counselData = [];

// -------------------------
// KEYWORDS
// -------------------------
const sentimentKeywords = {
  anxiety: ["anxious", "worry", "panic"],
  sadness: ["sad", "down", "depressed"],
  stress: ["stress", "overwhelmed"],
  anger: ["angry", "mad"],
  loneliness: ["lonely", "alone"]
};

// -------------------------
// HELPERS
// -------------------------
function tokenize(text) {
  return text.toLowerCase().split(/\W+/).filter(t => t.length > 2);
}

function detectMood(message) {
  let bestMood = "general";
  let bestScore = 0;

  for (const [mood, words] of Object.entries(sentimentKeywords)) {
    let score = 0;
    for (const w of words) {
      if (message.toLowerCase().includes(w)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMood = mood;
    }
  }

  return bestMood;
}

// 🔥 IMPORTANT: SHORT REPLY FORMATTER
function formatReply(text) {
  if (!text) return "";

  let clean = text.trim();

  // remove "Hi Name,"
  clean = clean.replace(/^hi\s+\w+,?\s*/i, "");

  let sentences = clean.split(/(?<=[.!?])\s+/);

  let short = sentences.slice(0, 2).join(" ");

  if (short.length > 180) {
    short = short.substring(0, 180) + "...";
  }

  return short;
}

// -------------------------
// LOAD DATASET (FIXED PATH)
// -------------------------
function loadData() {
  return new Promise((resolve, reject) => {

    const filePath = path.join(
      __dirname,
      "datasets",
      "Mental_Health_dataset",
      "counselchat-data.csv"
    );

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        if (row.questiontext && row.answertext) {
          counselData.push({
            q: row.questiontext.toLowerCase(),
            a: row.answertext
          });
        }
      })
      .on("end", () => {
        console.log(`✅ Loaded ${counselData.length} counsel entries`);
        resolve();
      })
      .on("error", reject);
  });
}

await loadData();

// -------------------------
// CHAT API
// -------------------------
app.post("/api/chat", (req, res) => {
  const message = (req.body.message || "").toLowerCase();

  if (!message) {
    return res.json({ reply: "Please say something." });
  }

  const mood = detectMood(message);

  let candidates = [];

  // match dataset
  for (const row of counselData) {
    if (row.q.includes(message)) {
      candidates.push(row.a);
    }
  }

  let reply;

  if (candidates.length > 0) {
    reply = candidates[Math.floor(Math.random() * candidates.length)];
  } else {
    const responses = therapistResponses[mood] || therapistResponses.general;
    reply = responses[Math.floor(Math.random() * responses.length)];
  }

  // 🔥 FINAL OUTPUT FIX
  return res.json({
    reply: formatReply(reply)
  });
});

// -------------------------
// STATIC FILES
// -------------------------
app.use(express.static(path.join(__dirname, "public")));

// -------------------------
// SERVER
// -------------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});