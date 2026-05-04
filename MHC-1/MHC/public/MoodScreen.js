const moods = [
  { value: "happy", label: "Happy", emoji: "😊", note: "Feeling light, grateful, or upbeat" },
  { value: "neutral", label: "Neutral", emoji: "🙂", note: "Just checking in with yourself" },
  { value: "sad", label: "Sad", emoji: "😔", note: "Needing comfort, connection, or care" },
  { value: "stressed", label: "Stressed", emoji: "😣", note: "Feeling overwhelmed or tense" },
];

export function renderMoodScreen(container, { onContinue, onSkip }) {
  let selectedMood = moods[1];
  let feelingText = "";

  container.innerHTML = `
    <div class="companion-shell">
      <div class="ambient ambient-one"></div>
      <div class="ambient ambient-two"></div>
      <section class="mood-screen fade-up">
        <div class="mood-screen__badge">Your daily companion</div>
        <h1>Let’s begin with a gentle check-in</h1>
        <p class="mood-screen__intro">
          Tell me how you’re feeling right now, and I’ll guide you toward the support that fits best.
        </p>

        <div class="mood-grid" role="list" aria-label="Mood options">
          ${moods
            .map(
              (mood, index) => `
                <button
                  type="button"
                  class="mood-card ${index === 1 ? "is-selected" : ""}"
                  data-mood="${mood.value}"
                  data-label="${mood.label}"
                >
                  <span class="mood-card__emoji">${mood.emoji}</span>
                  <span class="mood-card__title">${mood.label}</span>
                  <span class="mood-card__note">${mood.note}</span>
                </button>
              `
            )
            .join("")}
        </div>

        <label class="mood-screen__label" for="feeling-text">How are you feeling?</label>
        <textarea
          id="feeling-text"
          class="mood-screen__textarea"
          rows="4"
          placeholder="You can share a little more if you’d like..."
        ></textarea>

        <div class="mood-screen__actions">
          <button type="button" class="secondary-btn" data-action="skip">Go straight to dashboard</button>
          <button type="button" class="primary-btn" data-action="continue">Continue</button>
        </div>
      </section>
    </div>
  `;

  const moodCards = Array.from(container.querySelectorAll(".mood-card"));
  const textArea = container.querySelector("#feeling-text");
  const continueButton = container.querySelector('[data-action="continue"]');
  const skipButton = container.querySelector('[data-action="skip"]');

  moodCards.forEach((card) => {
    card.addEventListener("click", () => {
      moodCards.forEach((item) => item.classList.remove("is-selected"));
      card.classList.add("is-selected");

      selectedMood = {
        value: card.dataset.mood,
        label: card.dataset.label,
      };
    });
  });

  textArea.addEventListener("input", (event) => {
    feelingText = event.target.value.trim();
  });

  continueButton.addEventListener("click", () => {
    onContinue({
      mood: selectedMood.value,
      label: selectedMood.label,
      text: feelingText,
    });
  });

  skipButton.addEventListener("click", onSkip);
}
