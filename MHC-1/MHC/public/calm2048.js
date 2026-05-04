// 2048 Calm Mode Game
let board = [];
let score = 0;
let highest = 0;

document.addEventListener("DOMContentLoaded", function () {
    console.log("2048 Calm game script loaded");
    const gameArea = document.getElementById('calm2048Game');
    if (gameArea && gameArea.classList.contains('active')) {
        console.log("🎮 2048 Calm - Auto init (game active)");
        initCalm2048();
    } else {
        console.log("🎮 2048 Calm - Auto init skipped (game not active)");
    }
});

function initCalm2048() {
    console.log("Initializing 2048 board...");
    score = 0;
    highest = 0;
    board = Array(4).fill().map(() => Array(4).fill(0));

    document.getElementById('gameScore').textContent = '0';
    document.getElementById('gameHighest').textContent = '0';

    // Add initial tiles
    addNewTile();
    addNewTile();

    renderBoard();

    // Add keyboard controls
    document.addEventListener('keydown', handleKeyDown);

    // Add swipe controls
    setupSwipeControls();

    console.log("2048 Calm game initialized!");
}

function addNewTile() {
    const emptyCells = [];
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c] === 0) emptyCells.push({ r, c });
        }
    }

    if (emptyCells.length > 0) {
        const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[cell.r][cell.c] = Math.random() < 0.9 ? 2 : 4;
        console.log("New tile added at:", cell.r, cell.c);
    }
}

function renderBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';

    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            const value = board[r][c];

            if (value === 0) {
                tile.classList.add('empty');
            } else {
                tile.dataset.value = value;
                tile.textContent = value;

                if (value > highest) {
                    highest = value;
                    document.getElementById('gameHighest').textContent = highest;
                }
            }

            gameBoard.appendChild(tile);
        }
    }
}

function moveLeft() {
    let moved = false;

    for (let r = 0; r < 4; r++) {
        let row = board[r].filter(val => val !== 0);

        for (let c = 0; c < row.length - 1; c++) {
            if (row[c] === row[c + 1]) {
                row[c] *= 2;
                score += row[c];
                row[c + 1] = 0;
            }
        }

        row = row.filter(val => val !== 0);
        while (row.length < 4) row.push(0);

        if (board[r].join(',') !== row.join(',')) {
            board[r] = row;
            moved = true;
        }
    }

    if (moved) {
        addNewTile();
        document.getElementById('gameScore').textContent = score;
        renderBoard();
    } else {
        checkAndReshuffle();
    }
}

function moveRight() {
    let moved = false;

    for (let r = 0; r < 4; r++) {
        let row = board[r].filter(val => val !== 0);

        for (let c = row.length - 1; c > 0; c--) {
            if (row[c] === row[c - 1]) {
                row[c] *= 2;
                score += row[c];
                row[c - 1] = 0;
            }
        }

        row = row.filter(val => val !== 0);
        while (row.length < 4) row.unshift(0);

        if (board[r].join(',') !== row.join(',')) {
            board[r] = row;
            moved = true;
        }
    }

    if (moved) {
        addNewTile();
        document.getElementById('gameScore').textContent = score;
        renderBoard();
    } else {
        checkAndReshuffle();
    }
}

function moveUp() {
    let moved = false;

    for (let c = 0; c < 4; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]].filter(val => val !== 0);

        for (let r = 0; r < col.length - 1; r++) {
            if (col[r] === col[r + 1]) {
                col[r] *= 2;
                score += col[r];
                col[r + 1] = 0;
            }
        }

        col = col.filter(val => val !== 0);
        while (col.length < 4) col.push(0);

        for (let r = 0; r < 4; r++) {
            if (board[r][c] !== col[r]) {
                board[r][c] = col[r];
                moved = true;
            }
        }
    }

    if (moved) {
        addNewTile();
        document.getElementById('gameScore').textContent = score;
        renderBoard();
    } else {
        checkAndReshuffle();
    }
}

function moveDown() {
    let moved = false;

    for (let c = 0; c < 4; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]].filter(val => val !== 0);

        for (let r = col.length - 1; r > 0; r--) {
            if (col[r] === col[r - 1]) {
                col[r] *= 2;
                score += col[r];
                col[r - 1] = 0;
            }
        }

        col = col.filter(val => val !== 0);
        while (col.length < 4) col.unshift(0);

        for (let r = 0; r < 4; r++) {
            if (board[r][c] !== col[r]) {
                board[r][c] = col[r];
                moved = true;
            }
        }
    }

    if (moved) {
        addNewTile();
        document.getElementById('gameScore').textContent = score;
        renderBoard();
    } else {
        checkAndReshuffle();
    }
}

function checkAndReshuffle() {
    // Check if board is full and no moves possible
    let isFull = true;
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c] === 0) isFull = false;
        }
    }

    if (isFull) {
        // Check if any merges are possible
        let canMerge = false;
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (c < 3 && board[r][c] === board[r][c + 1]) canMerge = true;
                if (r < 3 && board[r][c] === board[r + 1][c]) canMerge = true;
            }
        }

        if (!canMerge) {
            // Reshuffle the board
            console.log("Board full, reshuffling...");
            let allTiles = [];
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 4; c++) {
                    if (board[r][c] !== 0) allTiles.push(board[r][c]);
                }
            }

            // Shuffle
            allTiles = allTiles.sort(() => Math.random() - 0.5);

            // Redistribute
            let index = 0;
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 4; c++) {
                    board[r][c] = index < allTiles.length ? allTiles[index] : 0;
                    index++;
                }
            }

            renderBoard();
        }
    }
}

function handleKeyDown(e) {
    // Only handle if the game is active
    const gameArea = document.getElementById('calm2048Game');
    if (!gameArea || !gameArea.classList.contains('active')) return;

    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            moveLeft();
            break;
        case 'ArrowRight':
            e.preventDefault();
            moveRight();
            break;
        case 'ArrowUp':
            e.preventDefault();
            moveUp();
            break;
        case 'ArrowDown':
            e.preventDefault();
            moveDown();
            break;
    }
}

function setupSwipeControls() {
    let touchStartX = 0;
    let touchStartY = 0;
    const gameArea = document.getElementById('calm2048Game');

    if (!gameArea) return;

    gameArea.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    gameArea.addEventListener('touchend', e => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;

        const minSwipe = 30;

        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipe) {
            if (dx > 0) moveRight();
            else moveLeft();
        } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > minSwipe) {
            if (dy > 0) moveDown();
            else moveUp();
        }
    }, { passive: true });
}

