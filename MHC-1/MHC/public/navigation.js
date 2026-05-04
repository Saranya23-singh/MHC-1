// Tranquoria Navigation System - HARD RESET: Auth disabled
// Replace all <a href> with onclick="goToDashboard()" etc.

function checkAuth() {
    // DISABLED FOR RESET
    // if (!localStorage.getItem('isLoggedIn')) {
    //     goToLogin();
    //     return false;
    // }
    return true;
}

window.goToLogin = () => {
    localStorage.removeItem('userMood');
    window.location.href = 'login.html';
};

window.goToMood = () => {
    window.location.href = 'mood.html';
};

window.goToDashboard = () => {
    window.location.href = 'dashboard.html';
};

window.goToAI = () => {
    window.location.href = 'AIbot.html';
};

window.goToGames = () => {
    window.location.href = 'games.html';
};

window.goToLanding = () => {
    localStorage.clear();
    window.location.href = 'login.html';
};

// Init on load - DISABLED
document.addEventListener('DOMContentLoaded', () => {
    // Auto-redirect DISABLED FOR RESET
    console.log('Navigation loaded - auth checks disabled');
});
