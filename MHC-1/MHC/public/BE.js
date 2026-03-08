// Breathing Exercise JavaScript
// 4-7-8 Breathing: Inhale 4s, Hold 7s, Exhale 8s

let breathingInterval;
let isBreathing = false;
let timeoutIds = [];
let timerInterval;
let currentPhaseTime = 0;

const elements = {
    circle: null,
    button: null,
    phaseIndicator: null,
    timerDisplay: null
};

// Initialize elements when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    elements.circle = document.getElementById('circle');
    elements.button = document.getElementById('breathButton');
    elements.phaseIndicator = document.getElementById('phaseIndicator');
    elements.timerDisplay = document.getElementById('timerDisplay');
    
    console.log('Breathing exercise initialized');
    console.log('Circle element:', elements.circle);
    console.log('Button element:', elements.button);
});

function updatePhaseIndicator(phase, description) {
    if (elements.phaseIndicator) {
        elements.phaseIndicator.textContent = phase ? `${phase} - ${description}` : '';
    }
}

function updateTimer(seconds) {
    if (elements.timerDisplay) {
        elements.timerDisplay.textContent = seconds;
    }
}

function breatheCycle() {
    if (!elements.circle) {
        console.error('Circle element not found!');
        return;
    }
    
    const circle = elements.circle;
    
    // Remove all animation classes first
    circle.classList.remove('inhale', 'hold', 'exhale');
    
    // Force reflow to restart animation
    void circle.offsetWidth;
    
    // Show timer display
    if (elements.timerDisplay) {
        elements.timerDisplay.style.display = 'block';
    }
    
    // Clear any existing timer interval
    clearInterval(timerInterval);
    
    // ============ INHALE PHASE - 4 seconds ============
    circle.innerText = 'Inhale';
    circle.classList.add('inhale');
    updatePhaseIndicator('Inhale', '4 seconds - Breathe in slowly');
    currentPhaseTime = 4;
    updateTimer(currentPhaseTime);
    
    // Start countdown timer
    timerInterval = setInterval(() => {
        if (currentPhaseTime > 0) {
            currentPhaseTime--;
            updateTimer(currentPhaseTime);
        }
    }, 1000);

    // ============ HOLD PHASE - 7 seconds (after 4 seconds) ============
    const holdTimeout = setTimeout(() => {
        if (!isBreathing || !circle) return;
        
        // Clear previous timer
        clearInterval(timerInterval);
        
        // Hold phase
        circle.classList.remove('inhale');
        circle.classList.add('hold');
        circle.innerText = 'Hold';
        updatePhaseIndicator('Hold', '7 seconds - Keep your breath');
        currentPhaseTime = 7;
        updateTimer(currentPhaseTime);
        
        // Start countdown for hold
        timerInterval = setInterval(() => {
            if (currentPhaseTime > 0) {
                currentPhaseTime--;
                updateTimer(currentPhaseTime);
            }
        }, 1000);
        
        // ============ EXHALE PHASE - 8 seconds (after 7 seconds) ============
        const exhaleTimeout = setTimeout(() => {
            if (!isBreathing || !circle) return;
            
            // Clear previous timer
            clearInterval(timerInterval);
            
            // Exhale phase
            circle.classList.remove('hold');
            circle.classList.add('exhale');
            circle.innerText = 'Exhale';
            updatePhaseIndicator('Exhale', '8 seconds - Release slowly');
            currentPhaseTime = 8;
            updateTimer(currentPhaseTime);
            
            // Start countdown for exhale
            timerInterval = setInterval(() => {
                if (currentPhaseTime > 0) {
                    currentPhaseTime--;
                    updateTimer(currentPhaseTime);
                }
            }, 1000);
            
            timeoutIds.push(exhaleTimeout);
        }, 7000);
        
        timeoutIds.push(holdTimeout);
    }, 4000);
    
    timeoutIds.push(holdTimeout);
}

function stopBreathing() {
    // Clear all timers and intervals
    clearInterval(breathingInterval);
    clearInterval(timerInterval);
    timeoutIds.forEach(function(timeoutId) {
        clearTimeout(timeoutId);
    });
    timeoutIds = [];
    
    if (elements.circle) {
        elements.circle.classList.remove('inhale', 'hold', 'exhale');
        elements.circle.innerText = 'Inhale';
    }
    
    if (elements.timerDisplay) {
        elements.timerDisplay.style.display = 'none';
        elements.timerDisplay.textContent = '';
    }
    
    if (elements.button) {
        elements.button.innerHTML = '<i class="fas fa-play"></i> Start';
        elements.button.classList.remove('stop');
    }
    
    updatePhaseIndicator('', '');
    
    isBreathing = false;
    console.log('Breathing stopped');
}

function toggleBreathing() {
    console.log('toggleBreathing called, isBreathing:', isBreathing);
    
    if (isBreathing) {
        stopBreathing();
        
        // Track session when stopped
        trackBreathingSession();
    } else {
        isBreathing = true;
        breatheCycle();
        
        // Set interval for continuous breathing cycles (4 + 7 + 8 = 19 seconds)
        breathingInterval = setInterval(breatheCycle, 19000);
        
        if (elements.button) {
            elements.button.innerHTML = '<i class="fas fa-stop"></i> Stop';
            elements.button.classList.add('stop');
        }
        
        console.log('Breathing started');
    }
}

function trackBreathingSession() {
    // Track session in localStorage
    const sessions = JSON.parse(localStorage.getItem('breathing_sessions') || '[]');
    sessions.push({
        date: new Date().toISOString(),
        duration: 19 // one full cycle in seconds
    });
    localStorage.setItem('breathing_sessions', JSON.stringify(sessions));
    
    // Call dashboard functions if available
    if (typeof updateWellnessScore === 'function') {
        updateWellnessScore();
    }
    if (typeof updateStreak === 'function') {
        updateStreak();
    }
    if (typeof loadWeeklyAnalytics === 'function') {
        loadWeeklyAnalytics();
    }
    
    console.log('Breathing session tracked!');
}

// Make functions available globally for HTML onclick handlers
window.toggleBreathing = toggleBreathing;
window.trackBreathingSession = trackBreathingSession;

