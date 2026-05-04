import { renderMoodScreen } from "./MoodScreen.js";
import { renderChatScreen } from "./ChatScreen.js";

const app = document.getElementById("app");

const state = {
  selectedMood: null,
  moodLabel: "",
  userText: "",
  chatStarted: false,
};

const routes = {
  dashboard: "dashboard.html",
  breathing: "BE.html",
  journal: "introJournal.html",
  peer: "peer-support.html",
};

function navigateTo(path) {
  window.location.href = path;
}

function handleBreathing() {
  navigateTo(routes.breathing);
}

function handleJournal() {
  navigateTo(routes.journal);
}

function handlePeerMatch() {
  navigateTo(routes.peer);
}

function handleDashboard() {
  navigateTo(routes.dashboard);
}

function handleMoodSubmit({ mood, label, text }) {
  localStorage.setItem("userMood", mood);
  if (mood === "sad" || mood === "stressed") {
    state.selectedMood = mood;
    state.moodLabel = label;
    state.userText = text;
    state.chatStarted = true;
    render();
  } else {
    window.location.href = '/dashboard.html';
  }
}

function handleBackToMood() {
  state.selectedMood = null;
  state.moodLabel = "";
  state.userText = "";
  state.chatStarted = false;
  render();
}

function render() {
  if (!app) return;

  if (!state.chatStarted) {
    renderMoodScreen(app, {
      onContinue: handleMoodSubmit,
      onSkip: handleDashboard,
    });
    return;
  }

  renderChatScreen(app, {
    mood: state.selectedMood,
    moodLabel: state.moodLabel,
    userText: state.userText,
    handleBreathing,
    handleJournal,
    handlePeerMatch,
    handleDashboard,
    onBack: handleBackToMood,
  });
}

render();
