// SootheSpace - Anxiety Relief Games JavaScript

// ============================================
// BREATHING BUBBLE GAME
// ============================================
let isBreathing = false;
let breathingInterval = null;
let isInhaling = true;

function startBreathingGame() {
    document.getElementById('gamesGrid').style.display = 'none';
    document.getElementById('mainHeader').style.display = 'none';
    document.getElementById('breathingGame').classList.add('active');
    resetBreathing();
}

function resetBreathing() {
    isBreathing = false;
    isInhaling = true;
    clearInterval(breathingInterval);
    const bubble = document.getElementById('breathingBubble');
    const text = document.getElementById('breathingText');
    const instruction = document.getElementById('breathingInstruction');
    
    bubble.classList.remove('inhale', 'exhale');
    text.textContent = 'Tap to Start';
    instruction.textContent = 'Tap the bubble to start breathing';
}

function toggleBreathing() {
    const bubble = document.getElementById('breathingBubble');
    const text = document.getElementById('breathingText');
    const instruction = document.getElementById('breathingInstruction');
    
    if (!isBreathing) {
        // Start breathing
        isBreathing = true;
        text.textContent = 'Inhale...';
        instruction.textContent = 'Follow the bubble: Grow = Inhale, Shrink = Exhale';
        bubble.classList.add('inhale');
        
        // 4 seconds inhale, 4 seconds exhale cycle
        breathingInterval = setInterval(() => {
            isInhaling = !isInhaling;
            if (isInhaling) {
                bubble.classList.remove('exhale');
                bubble.classList.add('inhale');
                text.textContent = 'Inhale...';
            } else {
                bubble.classList.remove('inhale');
                bubble.classList.add('exhale');
                text.textContent = 'Exhale...';
            }
        }, 4000);
    } else {
        // Stop breathing
        clearInterval(breathingInterval);
        isBreathing = false;
        bubble.classList.remove('inhale', 'exhale');
        text.textContent = 'Tap to Start';
        instruction.textContent = 'Tap the bubble to start breathing';
    }
}

// ============================================
// MEMORY CARD GAME
// ============================================
const memorySymbols = ['🌸', '🌺', '🌻', '🍀', '🌿', '🦋', '🧘', '☀️'];
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let canFlip = true;

function startMemoryGame() {
    document.getElementById('gamesGrid').style.display = 'none';
    document.getElementById('mainHeader').style.display = 'none';
    document.getElementById('memoryGame').classList.add('active');
    document.getElementById('memoryResult').style.display = 'none';
    initMemoryGame();
}

function initMemoryGame() {
    // Reset variables
    matchedPairs = 0;
    moves = 0;
    flippedCards = [];
    canFlip = true;
    document.getElementById('memoryMoves').textContent = 'Moves: 0';
    
    // Create pairs and shuffle
    memoryCards = [...memorySymbols, ...memorySymbols];
    memoryCards = shuffleArray(memoryCards);
    
    // Render grid
    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = memoryCards.map((symbol, index) => `
        <div class="memory-card" data-index="${index}" onclick="flipCard(${index})">
            <span class="card-front">${symbol}</span>
            <span class="card-back">?</span>
        </div>
    `).join('');
}

function flipCard(index) {
    if (!canFlip) return;
    
    const cards = document.querySelectorAll('.memory-card');
    const card = cards[index];
    
    // Don't flip if already flipped or matched
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
    
    // Flip the card
    card.classList.add('flipped');
    flippedCards.push({ index, symbol: memoryCards[index] });
    
    // Check for match when 2 cards are flipped
    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('memoryMoves').textContent = `Moves: ${moves}`;
        canFlip = false;
        
        if (flippedCards[0].symbol === flippedCards[1].symbol) {
            // Match found
            setTimeout(() => {
                cards[flippedCards[0].index].classList.add('matched');
                cards[flippedCards[1].index].classList.add('matched');
                flippedCards = [];
                matchedPairs++;
                canFlip = true;
                
                // Check for win
                if (matchedPairs === memorySymbols.length) {
                    setTimeout(showMemoryWin, 500);
                }
            }, 500);
        } else {
            // No match - flip back
            setTimeout(() => {
                cards[flippedCards[0].index].classList.remove('flipped');
                cards[flippedCards[1].index].classList.remove('flipped');
                flippedCards = [];
                canFlip = true;
            }, 1000);
        }
    }
}

function showMemoryWin() {
    document.getElementById('finalMoves').textContent = moves;
    document.getElementById('memoryResult').style.display = 'block';
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// ============================================
// COLOR MATCH GAME
// ============================================
const calmColors = [
    { name: 'Lavender', hex: '#E6E6FA' },
    { name: 'Mint', hex: '#98FF98' },
    { name: 'Sky Blue', hex: '#87CEEB' },
    { name: 'Peach', hex: '#FFDAB9' },
    { name: 'Rose', hex: '#FFB6C1' },
    { name: 'Lemon', hex: '#FFFACD' },
    { name: 'Coral', hex: '#FF7F50' },
    { name: 'Sage', hex: '#9DC183' },
    { name: 'Aqua', hex: '#7FFFD4' },
    { name: 'Blush', hex: '#DE5D83' }
];

let colorScore = 0;
let colorTimer = 30;
let colorInterval = null;
let targetColor = null;
let currentColors = [];

function startColorGame() {
    document.getElementById('gamesGrid').style.display = 'none';
    document.getElementById('mainHeader').style.display = 'none';
    document.getElementById('colorGame').classList.add('active');
    document.getElementById('colorResult').style.display = 'none';
    initColorGame();
}

function initColorGame() {
    colorScore = 0;
    colorTimer = 30;
    document.getElementById('colorScore').textContent = 'Score: 0';
    document.getElementById('colorTimer').textContent = '30';
    
    // Clear any existing timer
    if (colorInterval) clearInterval(colorInterval);
    
    // Generate new round
    generateColorRound();
    
    // Start timer
    colorInterval = setInterval(() => {
        colorTimer--;
        document.getElementById('colorTimer').textContent = colorTimer;
        
        if (colorTimer <= 0) {
            endColorGame();
        }
    }, 1000);
}

function generateColorRound() {
    // Select target color
    targetColor = calmColors[Math.floor(Math.random() * calmColors.length)];
    
    // Display target
    const colorDisplay = document.getElementById('colorDisplay');
    colorDisplay.style.backgroundColor = targetColor.hex;
    colorDisplay.textContent = targetColor.name;
    
    // Generate options (including correct answer)
    currentColors = [targetColor];
    const otherColors = calmColors.filter(c => c.name !== targetColor.name);
    const shuffledOthers = shuffleArray(otherColors).slice(0, 3);
    currentColors = [...currentColors, ...shuffledOthers];
    currentColors = shuffleArray(currentColors);
    
    // Render options
    const optionsContainer = document.getElementById('colorOptions');
    optionsContainer.innerHTML = currentColors.map(color => `
        <div class="color-option" 
             style="background-color: ${color.hex};" 
             onclick="selectColor('${color.name}')"
             title="${color.name}">
        </div>
    `).join('');
}

function selectColor(selectedName) {
    if (selectedName === targetColor.name) {
        // Correct!
        colorScore += 10;
        colorTimer += 5; // Bonus time
        document.getElementById('colorScore').textContent = `Score: ${colorScore}`;
        document.getElementById('colorTimer').textContent = colorTimer;
        
        // Flash green
        document.getElementById('colorDisplay').style.border = '4px solid #2ECC71';
        setTimeout(() => {
            document.getElementById('colorDisplay').style.border = 'none';
            generateColorRound();
        }, 300);
    } else {
        // Wrong!
        colorTimer -= 3;
        document.getElementById('colorTimer').textContent = colorTimer;
        
        // Flash red
        document.getElementById('colorDisplay').style.border = '4px solid #F47C3C';
        setTimeout(() => {
            document.getElementById('colorDisplay').style.border = 'none';
        }, 300);
        
        if (colorTimer <= 0) {
            endColorGame();
        }
    }
}

function endColorGame() {
    clearInterval(colorInterval);
    document.getElementById('finalScore').textContent = colorScore;
    document.getElementById('colorResultTitle').textContent = colorScore >= 50 ? 'Great Job!' : 'Game Over!';
    document.getElementById('colorResult').style.display = 'block';
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function backToGames() {
    // Stop all games
    if (breathingInterval) clearInterval(breathingInterval);
    if (colorInterval) clearInterval(colorInterval);
    
    // Hide all game areas
    document.getElementById('breathingGame').classList.remove('active');
    document.getElementById('memoryGame').classList.remove('active');
    document.getElementById('colorGame').classList.remove('active');
    
    // Show games grid
    document.getElementById('gamesGrid').style.display = 'grid';
    document.getElementById('mainHeader').style.display = 'block';
}

