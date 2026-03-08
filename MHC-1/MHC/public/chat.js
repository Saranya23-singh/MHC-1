// AI Companion Chat JavaScript
// Uses backend server which connects to Gemini API

const API_URL = "http://localhost:3000/api/chat";

// Initialize chat when page loads
document.addEventListener("DOMContentLoaded", () => {
    setupEventListeners();
});

function setupEventListeners() {
    // Handle Enter key in input
    const userInput = document.getElementById("user-input");
    if (userInput) {
        userInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                sendMessage();
            }
        });
    }
}

async function sendMessage() {
    const userInput = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");

    if (!userInput || !chatBox) return;

    const message = userInput.value.trim();
    
    if (!message) return;

    console.log("Sending message:", message);

    // Add user message bubble
    addMessageBubble("user", message);
    userInput.value = "";
    
    // Show loading indicator with "typing" animation
    const loadingId = showTypingIndicator();

    try {
        // Send message to backend API
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
        });

        console.log("Response status:", response.status);

        // Remove typing indicator
        removeTypingIndicator(loadingId);

        if (!response.ok) {
            console.error("HTTP Error:", response.status);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Response data:", data);

        // Display bot response
        if (data.reply) {
            const formattedReply = formatResponse(data.reply);
            addMessageBubble("bot", formattedReply);
        } else {
            throw new Error("No reply in response");
        }
        
    } catch (error) {
        // Remove typing indicator
        removeTypingIndicator(loadingId);
        
        console.error("❌ Error communicating with AI:", error);
        
        // Show user-friendly error message
        addMessageBubble("bot", "I'm having trouble responding right now. Please try again. 🌿");
    }
}

function showTypingIndicator() {
    const chatBox = document.getElementById("chat-box");
    if (!chatBox) return null;
    
    const typingDiv = document.createElement("div");
    typingDiv.className = "message bot typing-indicator";
    typingDiv.id = "typing-" + Date.now();
    typingDiv.innerHTML = `
        <div class="typing-content">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-text">AI is typing...</span>
        </div>
    `;
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return typingDiv.id;
}

function removeTypingIndicator(typingId) {
    if (!typingId) return;
    const typingElement = document.getElementById(typingId);
    if (typingElement) {
        typingElement.remove();
    }
}

function addMessageBubble(sender, text) {
    const chatBox = document.getElementById("chat-box");
    if (!chatBox) return;
    
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender} fade-in`;
    messageDiv.innerHTML = `<span>${text}</span>`;

    chatBox.appendChild(messageDiv);
    
    // Auto-scroll to the bottom
    setTimeout(() => {
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 100);
}

function formatResponse(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br>");
}

// Export function for global use
window.sendMessage = sendMessage;

