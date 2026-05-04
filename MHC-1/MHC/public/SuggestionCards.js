const suggestionsByMood = {
  happy: [
    {
      title: "Go to Dashboard",
      emoji: "📊",
      description: "Carry this good energy into your daily wellness overview.",
      actionKey: "dashboard",
    },
    {
      title: "Journaling",
      emoji: "📝",
      description: "Capture what’s going well so you can return to it later.",
      actionKey: "journal",
    },
  ],
  neutral: [
    {
      title: "Journaling",
      emoji: "📝",
      description: "A quick reflection can help you notice what you need most.",
      actionKey: "journal",
    },
    {
      title: "Peer Support",
      emoji: "🤝",
      description: "A kind conversation can make an ordinary day feel lighter.",
      actionKey: "peer",
    },
  ],
  sad: [
    {
      title: "Peer Support",
      emoji: "🤝",
      description: "You don’t have to hold everything on your own right now.",
      actionKey: "peer",
    },
    {
      title: "Journaling",
      emoji: "📝",
      description: "Let your thoughts out gently, one line at a time.",
      actionKey: "journal",
    },
  ],
  stressed: [
    {
      title: "Breathing Exercise",
      emoji: "🧘",
      description: "A short breathing reset can help calm your body and mind.",
      actionKey: "breathing",
    },
    {
      title: "Peer Support",
      emoji: "🤝",
      description: "Talking things through can soften the pressure you’re feeling.",
      actionKey: "peer",
    },
  ],
};

export function renderSuggestionCards(mood, handlers) {
  const suggestions = suggestionsByMood[mood] || suggestionsByMood.neutral;

  return `
    <div class="suggestion-grid">
      ${suggestions
        .map(
          (item) => `
            <button type="button" class="suggestion-card" data-action="${item.actionKey}">
              <span class="suggestion-card__emoji">${item.emoji}</span>
              <span class="suggestion-card__title">${item.title}</span>
              <span class="suggestion-card__description">${item.description}</span>
            </button>
          `
        )
        .join("")}
    </div>
  `;
}

export function attachSuggestionEvents(container, handlers) {
  const actionMap = {
    breathing: handlers.handleBreathing,
    journal: handlers.handleJournal,
    peer: handlers.handlePeerMatch,
    dashboard: handlers.handleDashboard,
  };

  container.querySelectorAll(".suggestion-card").forEach((card) => {
    card.addEventListener("click", () => {
      const handler = actionMap[card.dataset.action];
      if (typeof handler === "function") {
        handler();
      }
    });
  });
}
