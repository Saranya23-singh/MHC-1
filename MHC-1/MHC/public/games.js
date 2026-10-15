/** Games Controller - FINAL FIXED VERSION */
console.log("🔥 games.js LOADED");

document.addEventListener('DOMContentLoaded', function () {
    console.log('✅ Games controller loaded');
});

let isMuted = false;

/* 🔊 SOUND CONTROL */
function toggleMute() {
    isMuted = !isMuted;
    const btn = document.getElementById('muteBtn');

    if (btn) {
        if (isMuted) {
            btn.classList.add('muted');
            btn.innerHTML = '<i class="fas fa-volume-mute"></i> Sound Off';
        } else {
            btn.classList.remove('muted');
            btn.innerHTML = '<i class="fas fa-volume-up"></i> Sound On';
        }
    }
}

/* 🔊 POP SOUND */
function playPopSound() {
    if (isMuted) return;

    const audio = document.getElementById('popSound');
    if (audio) {
        audio.volume = 0.3;
        audio.currentTime = 0;
        audio.play().catch(() => { });
    }
}
window.playPopSound = playPopSound;

/* 🎮 INTERNAL GAME HANDLER */
function startGame(game) {
    console.log(`🎮 Starting game: ${game}`);

    const gamesGrid = document.getElementById('gamesGrid');
    const mainHeader = document.getElementById('mainHeader');

    if (gamesGrid) gamesGrid.style.display = 'none';
    if (mainHeader) mainHeader.style.display = 'none';

    // Hide all game areas
    document.querySelectorAll('.game-area').forEach(area => {
        area.classList.remove('active');
    });

    // Show selected game
    const gameArea = document.getElementById(game + 'Game');

    if (!gameArea) {
        console.error(`❌ Game area not found: ${game}`);
        backToGames();
        return;
    }

    gameArea.classList.add('active');

    /* 🎯 INIT FUNCTION MAP */
    const gameInitMap = {
        bubblewrap: window.initBubbleWrap,
        infinityloop: window.initInfinityLoop,
        calm2048: window.initCalm2048,
        grounding: window.initGrounding,
        puzzlebuilder: window.initPuzzleBuilder
    };

    const initFunc = gameInitMap[game];

    if (typeof initFunc === 'function') {
        console.log(`✅ Initializing ${game}`);
        try {
            initFunc();
        } catch (err) {
            console.error(`❌ Error running ${game}:`, err);
        }
    } else {
        console.warn(`⚠️ No init function found for ${game}`);
    }
}

/* 🌐 EXTERNAL GAME HANDLER */
function openExternalGame(url) {
    console.log(`🌐 Opening external game: ${url}`);
    window.open(url, '_blank');
}

/* 🔙 BACK BUTTON */
function backToGames() {
    console.log("🏠 Returning to games");

    document.querySelectorAll('.game-area').forEach(area => {
        area.classList.remove('active');
    });

    const gamesGrid = document.getElementById('gamesGrid');
    const mainHeader = document.getElementById('mainHeader');

    if (gamesGrid) gamesGrid.style.display = 'grid';
    if (mainHeader) mainHeader.style.display = 'block';
}

/* 🔁 INFINITY LOOP */
function generateNewLoop() {
    console.log("🔄 Generating new loop");

    if (typeof window.initInfinityLoop === 'function') {
        window.initInfinityLoop();
    } else {
        console.warn("⚠️ initInfinityLoop not found");
    }
}
window.generateNewLoop = generateNewLoop;

/* 🌍 GLOBAL EXPORTS (IMPORTANT) */
window.startGame = startGame;
window.backToGames = backToGames;
window.openExternalGame = openExternalGame;
window.toggleMute = toggleMute;

console.log('🎮 Games controller ready');