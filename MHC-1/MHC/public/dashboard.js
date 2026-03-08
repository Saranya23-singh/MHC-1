// SootheSpace Dashboard JavaScript

// Daily reflection prompts
const prompts = [
    "What made you smile today?",
    "What are you grateful for today?",
    "What is one thing you learned today?",
    "How did you take care of yourself today?",
    "What is something you're looking forward to?",
    "What is a challenge you overcame recently?",
    "What would you tell your younger self?",
    "What brings you peace?",
    "What are you proud of about yourself?",
    "How are you feeling right now, honestly?",
    "What is one small win you had today?",
    "What does your ideal peaceful day look like?",
    "What are you holding onto that you could let go of?",
    "Who made a positive impact on your day?",
    "What is something beautiful you noticed today?"
];

// Mood suggestions
const moodSuggestions = {
    happy: "🎉 That's wonderful! Keep spreading that positive energy. Perhaps share your joy through journaling or try a meditation to amplify these feelings!",
    neutral: "💭 A balanced state is a great foundation. Why not try a breathing exercise to center yourself, or write about your day?",
    sad: "💚 I'm here with you. This feeling is temporary. Consider trying our 4-7-8 breathing exercise or chatting with AI Companion for support.",
    anxious: "🌿 Let's calm your mind together. The 4-7-8 breathing exercise can help, or we can chat about what's on your mind.",
    calm: "😌 Wonderful! You've found your peace. This is a perfect time for meditation or journaling to capture this moment."
};

// Nature sounds (using placeholder URLs - in production, these would be actual audio files)
const natureSounds = {
    rain: { name: "Rain Sounds", url: null },
    ocean: { name: "Ocean Waves", url: null },
    forest: { name: "Forest Ambience", url: null },
    fireplace: { name: "Crackling Fire", url: null }
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initializeDashboard();
});

function checkAuth() {
    const user = JSON.parse(localStorage.getItem('soothespace_user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
}

function initializeDashboard() {
    // Set user name
    const user = JSON.parse(localStorage.getItem('soothespace_user'));
    document.getElementById('userName').textContent = user?.name || 'Friend';
    
    // Set current date
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = today.toLocaleDateString('en-US', options);
    
    // Load saved mood for today
    loadTodayMood();
    
    // Update wellness score
    updateWellnessScore();
    
    // Update streak
    updateStreak();
    
    // Set daily prompt
    setDailyPrompt();
    
    // Load weekly analytics
    loadWeeklyAnalytics();
}

// Mood Selection
function selectMood(mood) {
    // Remove selected class from all buttons
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selected class to clicked button
    document.querySelector(`[data-mood="${mood}"]`).classList.add('selected');
    
    // Save mood to localStorage
    const user = JSON.parse(localStorage.getItem('soothespace_user'));
    const moodData = {
        mood: mood,
        date: new Date().toISOString(),
        timestamp: Date.now()
    };
    
    // Get existing moods
    let moods = JSON.parse(localStorage.getItem('soothespace_moods') || '[]');
    moods.push(moodData);
    localStorage.setItem('soothespace_moods', JSON.stringify(moods));
    
    // Update streak
    updateStreak();
    
    // Show suggestion
    const suggestion = document.getElementById('moodSuggestion');
    suggestion.innerHTML = moodSuggestions[mood];
    suggestion.classList.add('show');
    
    // Update wellness score
    updateWellnessScore();
    
    // Load weekly analytics
    loadWeeklyAnalytics();
}

function loadTodayMood() {
    const moods = JSON.parse(localStorage.getItem('soothespace_moods') || '[]');
    const today = new Date().toDateString();
    
    const todayMood = moods.find(m => new Date(m.date).toDateString() === today);
    
    if (todayMood) {
        const btn = document.querySelector(`[data-mood="${todayMood.mood}"]`);
        if (btn) {
            btn.classList.add('selected');
            const suggestion = document.getElementById('moodSuggestion');
            suggestion.innerHTML = moodSuggestions[todayMood.mood];
            suggestion.classList.add('show');
        }
    }
}

// Wellness Score
function updateWellnessScore() {
    const user = JSON.parse(localStorage.getItem('soothespace_user'));
    const moods = JSON.parse(localStorage.getItem('soothespace_moods') || '[]');
    const journalEntry = localStorage.getItem('journalEntry');
    const breathingSessions = JSON.parse(localStorage.getItem('breathing_sessions') || '[]');
    
    let score = 0;
    let factors = 0;
    
    // Mood factor (up to 30 points)
    const today = new Date().toDateString();
    const todayMood = moods.find(m => new Date(m.date).toDateString() === today);
    if (todayMood) {
        const moodScores = { happy: 30, calm: 30, neutral: 20, anxious: 10, sad: 10 };
        score += moodScores[todayMood.mood] || 0;
    }
    factors += 30;
    
    // Journal factor (up to 30 points)
    if (journalEntry && journalEntry.trim().length > 0) {
        // Check if journaled today
        const journalDate = localStorage.getItem('journal_date');
        if (journalDate === today) {
            score += 30;
        }
    }
    factors += 30;
    
    // Breathing factor (up to 20 points)
    const todayBreathing = breathingSessions.filter(s => new Date(s.date).toDateString() === today);
    if (todayBreathing.length > 0) {
        score += Math.min(20, todayBreathing.length * 10);
    }
    factors += 20;
    
    // Streak factor (up to 20 points)
    const streak = user?.streak || 0;
    score += Math.min(20, streak * 3);
    factors += 20;
    
    // Calculate percentage
    const percentage = Math.round((score / factors) * 100);
    
    // Update UI
    document.getElementById('wellnessScore').textContent = `${percentage}%`;
    
    // Animate circle
    const circle = document.getElementById('scoreCircle');
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    
    // Save to user
    if (user) {
        user.wellnessScore = percentage;
        localStorage.setItem('soothespace_user', JSON.stringify(user));
    }
}

// Streak System
function updateStreak() {
    const user = JSON.parse(localStorage.getItem('soothespace_user'));
    if (!user) return;
    
    const moods = JSON.parse(localStorage.getItem('soothespace_moods') || '[]');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate streak
    let streak = 0;
    let checkDate = new Date(today);
    
    while (true) {
        const dateStr = checkDate.toDateString();
        const hasActivity = moods.some(m => new Date(m.date).toDateString() === dateStr);
        
        if (hasActivity) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else if (streak === 0 && checkDate.toDateString() === today.toDateString()) {
            // No activity today yet, check yesterday
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
        
        // Limit check to 365 days
        if (streak > 365) break;
    }
    
    // Update user streak
    user.streak = streak;
    user.lastActive = new Date().toISOString();
    localStorage.setItem('soothespace_user', JSON.stringify(user));
    
    // Update UI
    document.getElementById('streakDays').textContent = streak;
    
    // Update message
    const messages = [
        "Start your journey today!",
        "Great start! Keep going!",
        "You're building momentum!",
        "Amazing consistency!",
        "You're on fire! 🔥",
        "Incredible dedication! 🌟"
    ];
    document.getElementById('streakMessage').textContent = messages[Math.min(streak, messages.length - 1)];
}

// Daily Prompt
function setDailyPrompt() {
    // Get today's prompt based on date
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const promptIndex = dayOfYear % prompts.length;
    
    document.getElementById('dailyPrompt').textContent = `"${prompts[promptIndex]}"`;
}

function newPrompt() {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    document.getElementById('dailyPrompt').textContent = `"${prompts[randomIndex]}"`;
}

// Nature Sounds Player
function playSound(soundType) {
    const audioPlayer = document.getElementById('audioPlayer');
    const nowPlaying = document.getElementById('nowPlaying');
    const playingText = document.getElementById('playingText');
    
    // Remove playing class from all buttons
    document.querySelectorAll('.sound-btn').forEach(btn => {
        btn.classList.remove('playing');
    });
    
    // Check if clicking same sound
    const currentBtn = document.querySelector(`[data-sound="${soundType}"]`);
    if (currentBtn.classList.contains('playing')) {
        // Stop playing
        audioPlayer.pause();
        currentBtn.classList.remove('playing');
        playingText.textContent = "Select a sound to play";
        return;
    }
    
    // Add playing class to clicked button
    currentBtn.classList.add('playing');
    
    // Show now playing
    playingText.textContent = `Playing: ${natureSounds[soundType].name}`;
    
    // In a real app, this would play actual audio
    // For demo, we'll just show the UI feedback
    console.log(`Playing: ${soundType}`);
}

// Weekly Analytics
function loadWeeklyAnalytics() {
    const moods = JSON.parse(localStorage.getItem('soothespace_moods') || '[]');
    const breathingSessions = JSON.parse(localStorage.getItem('breathing_sessions') || '[]');
    const journalEntries = JSON.parse(localStorage.getItem('soothespace_journals') || '[]');
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    
    const bars = document.querySelectorAll('.chart-bar');
    
    bars.forEach((bar, index) => {
        const dayDate = new Date(startOfWeek);
        dayDate.setDate(startOfWeek.getDate() + index);
        const dateStr = dayDate.toDateString();
        
        // Count activities for this day
        const moodCount = moods.filter(m => new Date(m.date).toDateString() === dateStr).length;
        const breathingCount = breathingSessions.filter(s => new Date(s.date).toDateString() === dateStr).length;
        const journalCount = journalEntries.filter(j => new Date(j.date).toDateString() === dateStr).length;
        
        // Calculate height based on activities (max 100%)
        const totalActivities = moodCount + breathingCount + journalCount;
        const height = Math.min(100, totalActivities * 33);
        
        bar.style.setProperty('--height', `${height}%`);
        bar.dataset.value = totalActivities;
    });
}

// Logout
function logout() {
    localStorage.removeItem('soothespace_user');
    window.location.href = 'Landingpage.html';
}

// Track breathing session (called from BE.js)
function trackBreathingSession() {
    const sessions = JSON.parse(localStorage.getItem('breathing_sessions') || '[]');
    sessions.push({
        date: new Date().toISOString(),
        duration: 0 // In a real app, track actual duration
    });
    localStorage.setItem('breathing_sessions', JSON.stringify(sessions));
    
    // Update wellness score
    updateWellnessScore();
    
    // Update streak
    updateStreak();
    
    // Update analytics
    loadWeeklyAnalytics();
}

// Track journal entry (called from journal.html)
function trackJournalEntry() {
    const entries = JSON.parse(localStorage.getItem('soothespace_journals') || '[]');
    entries.push({
        date: new Date().toISOString()
    });
    localStorage.setItem('soothespace_journals', JSON.stringify(entries));
    localStorage.setItem('journal_date', new Date().toDateString());
    
    // Update wellness score
    updateWellnessScore();
    
    // Update streak
    updateStreak();
    
    // Update analytics
    loadWeeklyAnalytics();
}

