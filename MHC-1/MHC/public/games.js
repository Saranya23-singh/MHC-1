/** Games Controller - Fixed for Tranquoria Games Feature
 * Handles game selection, muting, sounds, and navigation
 * Debug logs added for troubleshooting
 */

document.addEventListener('DOMContentLoaded', function () {
    console.log('✅ Games controller loaded - DOM ready');
    console.log('🎮 Available games: bubblewrap, infinityloop, calm2048, grounding, puzzlebuilder');
});

let isMuted = false;

function toggleMute() {
    console.log('🔊 Toggle mute:', isMuted ? 'ON -> OFF' : 'OFF -> ON');
    isMuted = !isMuted;
    const btn = document.getElementById('muteBtn');
    const text = document.getElementById('muteText');
    if (isMuted) {
        btn.classList.add('muted');
        btn.innerHTML = '<i class="fas fa-volume-mute"></i> <span>Sound Off</span>';
    } else {
        btn.classList.remove('muted');
        btn.innerHTML = '<i class="fas fa-volume-up"></i> <span>Sound On</span>';
    }
    console.log('🔊 Mute status:', isMuted);
}

function playPopSound() {
    if (isMuted) {
        console.log('🔇 Sound muted - pop skipped');
        return;
    }
    const audio = document.getElementById('popSound');
    if (audio) {
        audio.volume = 0.3;
        audio.currentTime = 0;
        audio.play().catch(e => console.warn('🔊 Audio play failed:', e));
        console.log('🔊 Pop sound played');
    } else {
        console.warn('🔊 popSound audio element not found');
    }
}

function startGame(game) {
    console.log(`🎮 Starting game: ${game}`);

    // Hide main UI
    const gamesGrid = document.getElementById('gamesGrid');
    const mainHeader = document.getElementById('mainHeader');
    if (gamesGrid) gamesGrid.style.display = 'none';
    if (mainHeader) mainHeader.style.display = 'none';

    // Hide all game areas
    document.querySelectorAll('.game-area').forEach(area => area.classList.remove('active'));

    // Show and init specific game
    const gameArea = document.getElementById(game + 'Game');
    if (gameArea) {
        gameArea.classList.add('active');
        console.log(`✅ ${game.charAt(0).toUpperCase() + game.slice(1)} game area activated`);
    } else {
        console.error(`❌ Game area not found: ${game}Game`);
        backToGames();
        return;
    }

    // Call init function if exists
    const initFunc = window['init' + game.charAt(0).toUpperCase() + game.slice(1)];
    if (typeof initFunc === 'function') {
        console.log(`🔧 Calling init${game.charAt(0).toUpperCase() + game.slice(1)}()`);
        try {
            initFunc();
            console.log(`✅ ${game} initialized successfully`);
        } catch (e) {
            console.error(`❌ Init failed for ${game}:`, e);
        }
    } else {
        console.warn(`⚠️ init${game.charAt(0).toUpperCase() + game.slice(1)}() not found - game may auto-init`);
    }

    console.log(`🎮 ${game} game started successfully`);
}

function backToGames() {
    console.log('🏠 Back to games grid');

    // Hide all game areas
    document.querySelectorAll('.game-area').forEach(area => area.classList.remove('active'));

    // Show main UI
    const gamesGrid = document.getElementById('gamesGrid');
    const mainHeader = document.getElementById('mainHeader');
    if (gamesGrid) gamesGrid.style.display = 'grid';
    if (mainHeader) mainHeader.style.display = 'block';

    console.log('✅ Returned to games selection');
}

// Make generateNewLoop globally accessible for infinityloop.html
window.generateNewLoop = function () {
    console.log('🔄 Generating new infinity loop pattern');
    if (typeof initInfinityLoop === 'function') {
        initInfinityLoop();
    } else {
        console.warn('⚠️ initInfinityLoop not available');
    }
};

console.log('🎮 Games controller script loaded');

