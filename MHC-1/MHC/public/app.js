
// Single App Navigation - Tranquoria
const appDiv = document.getElementById('app');
let currentPage = 'Landingpage.html';

async function loadPage(page) {
  try {
    appDiv.innerHTML = '<div class="loading">Loading...</div>';
    const response = await fetch(page);
    appDiv.innerHTML = await response.text();
    currentPage = page;
    initCurrentPage();
  } catch (e) {
    appDiv.innerHTML = '<h1>Error loading page</h1>';
  }
}

function goToLanding() { loadPage('Landingpage.html'); }
function goToDashboard() { loadPage('dashboard.html'); }
function goToAI() { loadPage('companion.html'); }
function goToJournal() { loadPage('journal.html'); }
function goToAssessment() { loadPage('assessment.html'); }
function goToGames() { loadPage('games.html'); }
function goToHealth() { loadPage('sleeptracker.html'); }
function goToPeer() { loadPage('peer-support.html'); }

// Init current page scripts
function initCurrentPage() {
  if (currentPage.includes('dashboard')) initDashboard();
  if (currentPage.includes('companion') || currentPage.includes('AIbot')) initChat();
}

// Auto-replace links with app navigation
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]');
  if (link && link.href.includes('.html')) {
    e.preventDefault();
    const page = link.href.split('/').pop();
    window[`goTo${page.replace('.html', '').replace(/^[a-z]/, m => m.toUpperCase())}`]?.();
  }
});

// Load default
loadPage('Landingpage.html');

// Global navigation helpers
window.goToLanding = goToLanding;
window.goToDashboard = goToDashboard;
window.goToAI = goToAI;
window.goToJournal = goToJournal;

