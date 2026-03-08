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

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Landingpage.html'));
});

// Gemini API Key - Using provided key
const GEMINI_API_KEY = "AIzaSyDqZxwhKebtIMm4iPgOGu-nWjPwTfxCUUU";

// System prompt for mental wellness assistant
const SYSTEM_PROMPT = `You are "My Companion", a supportive AI mental wellness assistant for SootheSpace. Your role is to:

1. Respond empathetically and with compassion
2. Help users with anxiety, stress, or feeling lonely
3. Guide breathing or calming exercises when appropriate
4. Encourage journaling and mindfulness practices
5. NEVER give medical diagnoses or prescribe medication
6. Always prioritize the user's emotional well-being

Guidelines:
- Keep responses warm, caring, and conversational
- Suggest breathing exercises for anxiety/stress
- Ask open-ended questions to understand their feelings
- Encourage healthy coping mechanisms
- If user expresses serious concerns, gently suggest professional help
- Use calming language and occasional emoji for warmth
- Limit responses to 2-3 paragraphs max

Remember: You are a companion, not a doctor. Always be supportive and never diagnose.`;

// Gemini API endpoint
app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message || message.trim() === "") {
            return res.status(400).json({ error: "Message is required" });
        }

        console.log("Received message:", message);

        // Call Gemini API
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `${SYSTEM_PROMPT}\n\nUser: ${message}\n\nAssistant:`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.9,
                        maxOutputTokens: 500,
                    }
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini API Error:", errorData);
            
            // Fallback response
            const fallbackResponse = getFallbackResponse(message);
            return res.json({ reply: fallbackResponse });
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const botResponse = data.candidates[0].content.parts[0].text;
            console.log("✅ AI Response:", botResponse);
            res.json({ reply: botResponse });
        } else {
            // Fallback if no response
            const fallbackResponse = getFallbackResponse(message);
            res.json({ reply: fallbackResponse });
        }

    } catch (error) {
        console.error("❌ API Error:", error);
        
        // Fallback response on error
        const fallbackResponse = getFallbackResponse(req.body.message || "");
        res.json({ reply: fallbackResponse });
    }
});

// Fallback responses when API is not available
function getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("anxious") || lowerMessage.includes("anxiety") || lowerMessage.includes("stress") || lowerMessage.includes("worried")) {
        return `I understand you're feeling anxious right now. Take a deep breath with me. 🌿\n\nLet's try a simple grounding exercise: Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.\n\nRemember, what you're feeling is temporary. Would you like me to guide you through a breathing exercise?`;
    }
    
    if (lowerMessage.includes("sad") || lowerMessage.includes("depressed") || lowerMessage.includes("down")) {
        return `I'm here with you. 💚 It's okay to feel sad - these emotions are part of being human.\n\nSometimes when we're feeling down, it helps to:\n- Write down what's on your mind\n- Talk to someone you trust\n- Practice self-compassion\n\nWould you like to try a journaling exercise or just talk about what's bothering you?`;
    }
    
    if (lowerMessage.includes("happy") || lowerMessage.includes("good") || lowerMessage.includes("great")) {
        return `That's wonderful to hear! 🎉 I'm so glad you're feeling good.\n\nPositive emotions are meant to be celebrated. Why not capture this moment by writing in your journal? Or share this happiness with someone you care about.\n\nWhat made you feel happy today?`;
    }
    
    if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
        return `I'm here to support you. 💚\n\nI can help you with:\n- **Breathing exercises** - to calm your mind\n- **Journaling** - to process your thoughts\n- **Meditation** - to find inner peace\n- **Just talking** - to feel heard\n\nWhat would you like to explore together?`;
    }
    
    if (lowerMessage.includes("breathing") || lowerMessage.includes("breathe")) {
        return `I'd love to guide you through a breathing exercise! 🌬️\n\nLet's try the 4-7-8 technique:\n1. **Inhale** through your nose for 4 seconds\n2. **Hold** your breath for 7 seconds\n3. **Exhale** slowly through your mouth for 8 seconds\n\nThis helps activate your body's relaxation response. Would you like me to lead you through it?`;
    }
    
    if (lowerMessage.includes("journal") || lowerMessage.includes("write")) {
        return `Journaling is a powerful tool for self-reflection! 📝\n\nSome prompts to get you started:\n- What am I grateful for today?\n- What's one thing I learned about myself?\n- How am I feeling right now, honestly?\n\nWould you like to go to the journal section to write?`;
    }
    
    // Default empathetic response
    return `Thank you for sharing that with me. 💚 I'm here to listen without judgment.\n\nTake your time. What's on your mind? Sometimes it helps to just let things out.\n\nIf you're feeling overwhelmed, we can try:\n- A calming breathing exercise\n- Writing in your journal\n- Or just continuing to talk\n\nI'm here for you.`;
}

// Also keep old /chat endpoint for backward compatibility
app.post("/chat", async (req, res) => {
    req.url = "/api/chat";
    app._router.handle(req, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

