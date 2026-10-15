const moods = [
  { value: "happy", label: "Happy", emoji: "😊", note: "Feeling light, grateful, or upbeat" },
  { value: "neutral", label: "Neutral", emoji: "🙂", note: "Just checking in with yourself" },
  { value: "sad", label: "Sad", emoji: "😔", note: "Needing comfort, connection, or care" },
  { value: "stressed", label: "Stressed", emoji: "😣", note: "Feeling overwhelmed or tense" },
];

export function renderMoodScreen(container, { onContinue, onSkip }) {
  console.log("MoodScreen loaded ✅");

  let selectedMood = "neutral";
  let selectedLabel = "Neutral";
  let feelingText = "";

  container.innerHTML = `
    <div class="mood-screen">

      <h2>Let’s begin with a gentle check-in</h2>
      <p>Tell me how you're feeling right now</p>

      <div class="mood-grid">
        ${moods.map(m => `
          <div class="mood-card" data-mood="${m.value}" data-label="${m.label}">
            <div class="emoji">${m.emoji}</div>
            <div class="title">${m.label}</div>
            <div class="note">${m.note}</div>
          </div>
        `).join("")}
      </div>

      <textarea id="feeling-text" placeholder="Share more (optional)..."></textarea>

      <div class="actions">
        <button id="skip-btn">Skip</button>
        <button id="continue-btn">Continue</button>
      </div>

    </div>
  `;

  // ===== CLICK HANDLER (BULLETPROOF) =====
  container.addEventListener("click", (e) => {
    const card = e.target.closest(".mood-card");

    if (card) {
      console.log("Mood selected:", card.dataset.mood);

      container.querySelectorAll(".mood-card")
        .forEach(c => c.classList.remove("active"));

      card.classList.add("active");

      selectedMood = card.dataset.mood;
      selectedLabel = card.dataset.label;
    }

    if (e.target.id === "continue-btn") {
      console.log("Continue clicked");

      onContinue({
        mood: selectedMood,
        label: selectedLabel,
        text: feelingText
      });
    }

    if (e.target.id === "skip-btn") {
      console.log("Skip clicked");
      onSkip();
    }
  });

  // ===== TEXT INPUT =====
  const textarea = container.querySelector("#feeling-text");
  textarea.addEventListener("input", (e) => {
    feelingText = e.target.value;
  });
}