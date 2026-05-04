import { renderSuggestionCards, attachSuggestionEvents } from "./SuggestionCards.js";

async function getAIResponse(message) {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    console.log("✅ API RESPONSE:", data);

    return data.reply || "I'm here for you 💚";
  } catch (err) {
    console.error("❌ API ERROR:", err);
    return "I'm here for you 💚";
  }
}

// TRANQUORIA AI COMPANION CHATSCREEN
// Purpose: Render AI chat interface after mood selection
// Calls /api/chat → displays data.reply
// Suggestions based on mood
export function renderChatScreen(
  container,
  {
    mood,
    moodLabel,
    userText,
    handleBreathing,
    handleJournal,
    handlePeerMatch,
    handleDashboard,
    onBack,
  }
) {
  container.innerHTML = `
    <div class="companion-shell">
      <div class="ambient ambient-one"></div>
      <div class="ambient ambient-two"></div>
      <section class="chat-screen fade-up">
        <header class="chat-screen__header">
          <button type="button" class="icon-btn" data-action="back">←</button>
          <div>
            <p class="chat-screen__eyebrow">Companion chat</p>
            <h1>I’m here with you</h1>
          </div>
          <button type="button" class="secondary-btn secondary-btn--small" data-action="dashboard">
            Dashboard
          </button>
        </header>

        <div class="chat-window" id="chat-window">
          <div class="chat-bubble chat-bubble--bot">
            <p>Hey, I’m here for you 💛 How are you feeling today?</p>
          </div>

          <div class="chat-bubble chat-bubble--user">
            <p id="user-message"></p>
          </div>

          <div class="chat-bubble chat-bubble--bot typing-bubble" id="typing-bubble">
            <span></span><span></span><span></span>
          </div>
        </div>

        <div class="chat-composer">
          <p class="chat-composer__hint">
            Your next step is ready below. Choose whatever feels most supportive right now.
          </p>
        </div>
      </section>
    </div>
  `;

  container.querySelector('[data-action="back"]').addEventListener("click", onBack);
  container.querySelector('[data-action="dashboard"]').addEventListener("click", handleDashboard);

  const userMessage = container.querySelector("#user-message");
  const chatWindow = container.querySelector("#chat-window");
  const typingBubble = container.querySelector("#typing-bubble");

  userMessage.textContent = userText ? `${moodLabel} — ${userText}` : moodLabel;

  // 🔥 REAL AI CALL
  setTimeout(async () => {
    const aiReply = await getAIResponse(userText);

    const suggestionsMarkup = renderSuggestionCards(mood, {
      handleBreathing,
      handleJournal,
      handlePeerMatch,
      handleDashboard,
    });

    typingBubble.innerHTML = `
      <p>${aiReply}</p>
      <div class="chat-suggestions">${suggestionsMarkup}</div>
    `;

    typingBubble.classList.remove("typing-bubble");

    attachSuggestionEvents(container, {
      handleBreathing,
      handleJournal,
      handlePeerMatch,
      handleDashboard,
    });

    chatWindow.scrollTop = chatWindow.scrollHeight;
  }, 1200);
}