// ===== 2048 CALM MODE (FIXED VERSION) =====

let board = [];
let score = 0;
let highest = localStorage.getItem("highest2048") || 0;

const SIZE = 4;

document.addEventListener("DOMContentLoaded", () => {
    window.initCalm2048 = initCalm2048;
});

// ================= INIT =================
function initCalm2048() {
    score = 0;
    board = Array(SIZE).fill().map(() => Array(SIZE).fill(0));

    document.getElementById("gameScore").textContent = score;
    document.getElementById("gameHighest").textContent = highest;

    addTile();
    addTile();
    render();

    document.removeEventListener("keydown", handleKey);
    document.addEventListener("keydown", handleKey);
}

// ================= TILE =================
function addTile() {
    let empty = [];

    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (board[r][c] === 0) empty.push({ r, c });
        }
    }

    if (empty.length) {
        let { r, c } = empty[Math.floor(Math.random() * empty.length)];
        board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
}

// ================= RENDER =================
function render() {
    const grid = document.getElementById("gameBoard");
    grid.innerHTML = "";

    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            let tile = document.createElement("div");
            tile.className = "tile";

            let val = board[r][c];

            if (val) {
                tile.textContent = val;
                tile.dataset.value = val;

                // Highest score tracking
                if (val > highest) {
                    highest = val;
                    localStorage.setItem("highest2048", highest);
                    document.getElementById("gameHighest").textContent = highest;
                }

                // 🎉 WIN CONDITION
                if (val === 2048) {
                    setTimeout(() => alert("You Win! 🎉"), 100);
                }
            }

            grid.appendChild(tile);
        }
    }
}

// ================= SLIDE LOGIC =================
function slide(row) {
    row = row.filter(v => v);

    let newRow = [];
    let skip = false;

    for (let i = 0; i < row.length; i++) {
        if (row[i] === row[i + 1] && !skip) {
            newRow.push(row[i] * 2);
            score += row[i] * 2;
            skip = true;
        } else {
            if (!skip) newRow.push(row[i]);
            skip = false;
        }
    }

    return newRow;
}

// ================= MOVES =================
function moveLeft() {
    let moved = false;

    for (let r = 0; r < SIZE; r++) {
        let newRow = slide(board[r]);
        while (newRow.length < SIZE) newRow.push(0);

        if (board[r].join() !== newRow.join()) {
            board[r] = newRow;
            moved = true;
        }
    }

    if (moved) update();
}

function moveRight() {
    let moved = false;

    for (let r = 0; r < SIZE; r++) {
        let reversed = board[r].slice().reverse();
        let newRow = slide(reversed).reverse();

        while (newRow.length < SIZE) newRow.unshift(0);

        if (board[r].join() !== newRow.join()) {
            board[r] = newRow;
            moved = true;
        }
    }

    if (moved) update();
}

function moveUp() {
    let moved = false;

    for (let c = 0; c < SIZE; c++) {
        let col = [];

        for (let r = 0; r < SIZE; r++) col.push(board[r][c]);

        let newCol = slide(col);
        while (newCol.length < SIZE) newCol.push(0);

        for (let r = 0; r < SIZE; r++) {
            if (board[r][c] !== newCol[r]) moved = true;
            board[r][c] = newCol[r];
        }
    }

    if (moved) update();
}

function moveDown() {
    let moved = false;

    for (let c = 0; c < SIZE; c++) {
        let col = [];

        for (let r = 0; r < SIZE; r++) col.push(board[r][c]);

        let newCol = slide(col.reverse()).reverse();
        while (newCol.length < SIZE) newCol.unshift(0);

        for (let r = 0; r < SIZE; r++) {
            if (board[r][c] !== newCol[r]) moved = true;
            board[r][c] = newCol[r];
        }
    }

    if (moved) update();
}

// ================= UPDATE =================
function update() {
    addTile();
    document.getElementById("gameScore").textContent = score;
    render();

    if (isGameOver()) {
        setTimeout(() => alert("Game Over"), 100);
    }
}

// ================= GAME OVER =================
function isGameOver() {
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (board[r][c] === 0) return false;
            if (c < 3 && board[r][c] === board[r][c + 1]) return false;
            if (r < 3 && board[r][c] === board[r + 1][c]) return false;
        }
    }
    return true;
}

// ================= CONTROLS =================
function handleKey(e) {
    const gameArea = document.getElementById("calm2048Game");
    if (!gameArea.classList.contains("active")) return;

    switch (e.key) {
        case "ArrowLeft": moveLeft(); break;
        case "ArrowRight": moveRight(); break;
        case "ArrowUp": moveUp(); break;
        case "ArrowDown": moveDown(); break;
    }
}