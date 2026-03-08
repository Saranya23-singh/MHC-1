// Journal System JavaScript
// Each entry gets saved with date/timestamp and creates individual journal pages

// DOM Elements
let journalText;
let saveMessage;
let journalHistory;
let dateDisplay;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeJournal();
});

function initializeJournal() {
    journalText = document.getElementById('journalText');
    saveMessage = document.getElementById('saveMessage');
    journalHistory = document.getElementById('journalHistory');
    dateDisplay = document.getElementById('dateDisplay');
    
    // Check if this is an individual entry page (view mode)
    const urlParams = new URLSearchParams(window.location.search);
    const entryId = urlParams.get('id');
    
    if (entryId) {
        loadJournalEntry(entryId);
    } else {
        loadJournalPage();
    }
}

function loadJournalPage() {
    // Display today's date
    if (dateDisplay) {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.textContent = today.toLocaleDateString('en-US', options);
    }
    
    // Load saved entry for today (if exists)
    const savedEntry = localStorage.getItem("journalEntry");
    if (journalText && savedEntry) {
        journalText.value = savedEntry;
    }
    
    // Load journal history
    loadJournalHistory();
}

function saveJournal() {
    if (!journalText) return;
    
    const text = journalText.value.trim();
    
    if (!text) {
        showMessage('Please write something before saving!', 'error');
        return;
    }
    
    // Get existing entries
    const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    
    // Create new entry object
    const newEntry = {
        id: Date.now(),
        text: text,
        date: new Date().toISOString(),
        timestamp: new Date().getTime()
    };
    
    // Add to beginning of array
    entries.unshift(newEntry);
    
    // Save to localStorage
    localStorage.setItem('journalEntries', JSON.stringify(entries));
    
    // Also save as current entry
    localStorage.setItem("journalEntry", text);
    
    // Show success message
    showMessage('Entry saved successfully! 🌿', 'success');
    
    // Refresh history
    loadJournalHistory();
    
    // Update wellness score
    updateWellnessScore();
}

function loadJournalHistory() {
    if (!journalHistory) return;
    
    const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    
    if (entries.length === 0) {
        journalHistory.innerHTML = '<p class="no-entries">No journal entries yet. Start writing!</p>';
        return;
    }
    
    // Generate HTML for entries
    let html = '';
    
    entries.forEach(entry => {
        const date = new Date(entry.date);
        const dateStr = date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        // Preview first 80 characters
        const preview = entry.text.length > 80 
            ? entry.text.substring(0, 80) + '...' 
            : entry.text;
        
        html += `
            <div class="journal-card" onclick="openJournalEntry(${entry.id})">
                <div class="journal-card-date">${dateStr}</div>
                <div class="journal-card-preview">${escapeHtml(preview)}</div>
            </div>
        `;
    });
    
    journalHistory.innerHTML = html;
}

function openJournalEntry(id) {
    window.location.href = `journal-entry.html?id=${id}`;
}

function loadJournalEntry(id) {
    const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    const entry = entries.find(e => e.id == id);
    
    if (!entry) {
        // Entry not found, redirect to main journal
        window.location.href = 'journal.html';
        return;
    }
    
    // Display entry details
    const entryDate = document.getElementById('entryDate');
    const entryText = document.getElementById('entryText');
    const backButton = document.getElementById('backButton');
    
    if (entryDate) {
        const date = new Date(entry.date);
        entryDate.textContent = date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    if (entryText) {
        entryText.textContent = entry.text;
    }
    
    // Setup back button
    if (backButton) {
        backButton.href = 'journal.html';
    }
}

function showMessage(text, type) {
    if (!saveMessage) return;
    
    saveMessage.textContent = text;
    saveMessage.className = 'message show ' + type;
    
    setTimeout(() => {
        saveMessage.classList.remove('show');
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function updateWellnessScore() {
    const user = JSON.parse(localStorage.getItem('soothespace_user') || '{}');
    const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    
    if (!user) return;
    
    // Calculate score based on journal entries
    let score = user.wellnessScore || 0;
    
    // Add points for journaling
    if (entries.length > 0) {
        // Base score from having entries
        score = Math.min(100, score + 10);
    }
    
    // Update user
    user.wellnessScore = score;
    localStorage.setItem('soothespace_user', JSON.stringify(user));
}

// Export functions for global use
window.saveJournal = saveJournal;
window.openJournalEntry = openJournalEntry;

