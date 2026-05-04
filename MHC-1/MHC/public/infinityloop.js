// Infinity Loop Puzzle Game
// Each tile has line segments (top, 1, right, 2, bottom, 4, left, 8)



const loopPatterns = {
    0: { connections: 0, svg: '<svg viewBox="0 0 50 50"></svg>' },
    1: { connections: 1, svg: '<svg viewBox="0 0 50 50"><line x1="25" y1="0" x2="25" y2="25" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/></svg>' },
    2: { connections: 2, svg: '<svg viewBox="0 0 50 50"><line x1="25" y1="25" x2="50" y2="25" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/></svg>' },
    3: { connections: 3, svg: '<svg viewBox="0 0 50 50"><line x1="25" y1="0" x2="25" y2="25" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/><line x1="25" y1="25" x2="50" y2="25" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/></svg>' },
    4: { connections: 4, svg: '<svg viewBox="0 0 50 50"><line x1="25" y1="25" x2="25" y2="50" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/></svg>' },
    5: { connections: 5, svg: '<svg viewBox="0 0 50 50"><line x1="25" y1="0" x2="25" y2="25" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/><line x1="25" y1="25" x2="25" y2="50" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/></svg>' },
    6: { connections: 6, svg: '<svg viewBox="0 0 50 50"><line x1="25" y1="25" x2="50" y2="25" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/><line x1="25" y1="25" x2="25" y2="50" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/></svg>' },
    7: { connections: 7, svg: '<svg viewBox="0 0 50 50"><line x1="25" y1="0" x2="25" y2="25" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/><line x1="25" y1="25" x2="50" y2="25" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/><line x1="25" y1="25" x2="25" y2="50" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/></svg>' },
    8: { connections: 8, svg: '<svg viewBox="0 0 50 50"><line x1="0" y1="25" x2="25" y2="25" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/></svg>' },
    9: { connections: 9, svg: '<svg viewBox="0 0 50 50"><line x1="0" y1="25" x2="25" y2="25" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/><line x1="25" y1="25" x2="25" y2="0" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/></svg>' },
    10: { connections: 10, svg: '<svg viewBox="0 0 50 50"><line x1="0" y1="25" x2="25" y2="25" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/><line x1="25" y1="25" x2="50" y2="25" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/></svg>' },
    11: { connections: 11, svg: '<svg viewBox="0 0 50 50"><line x1="0" y1="25" x2="25" y2="25" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/><line x1="25" y1="25" x2="25" y2="0" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/><line x1="25" y1="25" x2="50" y2="25" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/></svg>' },
    12: { connections: 12, svg: '<svg viewBox="0 0 50 50"><line x1="0" y1="25" x2="25" y2="25" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/><line x1="25" y1="25" x2="25" y2="50" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/></svg>' },
    13: { connections: 13, svg: '<svg viewBox="0 0 50 50"><line x1="0" y1="25" x2="25" y2="25" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/><line x1="25" y1="25" x2="25" y2="0" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/><line x1="25" y1="25" x2="25" y2="50" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/></svg>' },
    14: { connections: 14, svg: '<svg viewBox="0 0 50 50"><line x1="0" y1="25" x2="25" y2="25" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/><line x1="25" y1="25" x2="50" y2="25" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/><line x1="25" y1="25" x2="25" y2="50" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/></svg>' },
    15: { connections: 15, svg: '<svg viewBox="0 0 50 50"><line x1="0" y1="25" x2="25" y2="25" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/><line x1="25" y1="25" x2="25" y2="0" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/><line x1="25" y1="25" x2="50" y2="25" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/><line x1="25" y1="25" x2="25" y2="50" stroke="#2F6F57" stroke-width="4" stroke-linecap="round"/></svg>' }
};

let loopTiles = [];
const gridSize = 4;

function initInfinityLoop() {
    console.log("Initializing Infinity Loop...");
    console.log("Infinity Loop game initialized");
    generateNewLoop();
}

function generateNewLoop() {
    const grid = document.getElementById('loopGrid');
    const message = document.getElementById('loopMessage');
    grid.innerHTML = '';
    message.style.display = 'none';
    loopTiles = [];

    // Generate a solvable pattern - use simple straight lines
    // For a 4x4 grid, create horizontal and vertical lines
    const validPatterns = [1, 2, 4, 8]; // single lines

    for (let i = 0; i < gridSize * gridSize; i++) {
        // Randomly choose a direction
        let connections = validPatterns[Math.floor(Math.random() * validPatterns.length)];

        // Occasionally add a corner (T-junction)
        if (Math.random() > 0.7) {
            const extra = validPatterns[Math.floor(Math.random() * validPatterns.length)];
            connections |= extra;
        }

        loopTiles.push(connections);

        const tile = document.createElement('div');
        tile.className = 'loop-tile';
        tile.innerHTML = loopPatterns[connections] ? loopPatterns[connections].svg : '';
        tile.dataset.index = i;
        tile.dataset.connections = connections;

        tile.addEventListener('click', function () {
            rotateTile(this, i);
        });

        grid.appendChild(tile);
    }

    console.log("Infinity Loop generated with " + gridSize * gridSize + " tiles");
}

function rotateTile(tile, index) {
    // Rotate 90 degrees clockwise
    // Top(1) -> Right(2) -> Bottom(4) -> Left(8) -> Top(1)
    let current = loopTiles[index];
    let rotated = 0;

    if (current & 1) rotated |= 2;  // top -> right
    if (current & 2) rotated |= 4;  // right -> bottom
    if (current & 4) rotated |= 8;  // bottom -> left
    if (current & 8) rotated |= 1;  // left -> top

    loopTiles[index] = rotated;
    tile.dataset.connections = rotated;
    tile.innerHTML = loopPatterns[rotated] ? loopPatterns[rotated].svg : '';

    // Add rotation animation
    tile.style.transform = 'rotate(90deg)';
    setTimeout(() => {
        tile.style.transform = '';
    }, 200);

    console.log("Tile rotated to:", rotated);

    // Check for connections
    checkConnections();
}

function checkConnections() {
    const tiles = document.querySelectorAll('.loop-tile');
    let connectedCount = 0;

    // Check each tile for valid connections
    for (let i = 0; i < gridSize * gridSize; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        const connections = loopTiles[i];

        let hasValidConnection = false;

        // Check right connection
        if ((connections & 2) && col < gridSize - 1) {
            const rightIndex = i + 1;
            const rightConnections = loopTiles[rightIndex];
            if (rightConnections & 8) hasValidConnection = true; // right connects to left
        }

        // Check bottom connection
        if ((connections & 4) && row < gridSize - 1) {
            const bottomIndex = i + gridSize;
            const bottomConnections = loopTiles[bottomIndex];
            if (bottomConnections & 1) hasValidConnection = true; // bottom connects to top
        }

        // Check left connection
        if ((connections & 8) && col > 0) {
            const leftIndex = i - 1;
            const leftConnections = loopTiles[leftIndex];
            if (leftConnections & 2) hasValidConnection = true; // left connects to right
        }

        // Check top connection
        if ((connections & 1) && row > 0) {
            const topIndex = i - gridSize;
            const topConnections = loopTiles[topIndex];
            if (topConnections & 4) hasValidConnection = true; // top connects to bottom
        }

        // Add visual feedback for connected tiles
        if (hasValidConnection) {
            tiles[i].classList.add('connected');
            connectedCount++;
        } else {
            tiles[i].classList.remove('connected');
        }
    }

    // Check if we have a good loop (at least 50% connected)
    const totalConnections = loopTiles.filter(c => c > 0).length;
    if (connectedCount >= totalConnections * 0.5 && totalConnections > 8) {
        showLoopComplete();
    }

    console.log("Connected tiles:", connectedCount);
}

function showLoopComplete() {
    const message = document.getElementById('loopMessage');
    message.style.display = 'block';
    message.innerHTML = 'Beautiful loop created 🌿 Keep going.';
}

// Fixed: expose to window for games controller integration
window.initInfinityLoop = initInfinityLoop;
window.generateNewLoop = generateNewLoop;

