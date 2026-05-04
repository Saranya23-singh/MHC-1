// Puzzle Builder Game - Drag and Drop Shapes



const puzzleShapes = [
    // Square
    { id: 'square', width: 100, height: 100, color: '#81C784', svg: '<rect width="100" height="100" rx="8" fill="#81C784" stroke="#4CAF50" stroke-width="2"/>' },
    // Rectangle horizontal
    { id: 'rect-h', width: 200, height: 100, color: '#64B5F6', svg: '<rect width="200" height="100" rx="8" fill="#64B5F6" stroke="#2196F3" stroke-width="2"/>' },
    // Rectangle vertical
    { id: 'rect-v', width: 100, height: 200, color: '#FFB74D', svg: '<rect width="100" height="200" rx="8" fill="#FFB74D" stroke="#FF9800" stroke-width="2"/>' },
    // L shape
    { id: 'l-shape', width: 100, height: 200, color: '#F06292', svg: '<path d="M0,0 L100,0 L100,100 L50,100 L50,200 L0,200 Z" fill="#F06292" stroke="#E91E63" stroke-width="2"/>' }
];

let placedShapes = [];

function initPuzzleBuilder() {
    console.log("Initializing Puzzle Builder...");
    placedShapes = [];
    renderShapes();
    renderBoard();
}

function renderShapes() {
    const container = document.getElementById('shapesContainer');
    container.innerHTML = '';

    // Create shapes
    puzzleShapes.forEach((shape, index) => {
        const shapeDiv = document.createElement('div');
        shapeDiv.className = 'shape';
        shapeDiv.dataset.id = shape.id;
        shapeDiv.dataset.index = index;
        shapeDiv.style.width = shape.width + 'px';
        shapeDiv.style.height = shape.height + 'px';
        shapeDiv.style.cursor = 'grab';
        shapeDiv.innerHTML = `<svg width="${shape.width}" height="${shape.height}" viewBox="0 0 ${shape.width} ${shape.height}">${shape.svg}</svg>`;

        // Mouse drag events
        shapeDiv.addEventListener('mousedown', handleDragStart);

        // Touch drag events
        shapeDiv.addEventListener('touchstart', handleTouchStart, { passive: false });

        container.appendChild(shapeDiv);
    });

    console.log("Shapes rendered:", puzzleShapes.length);
}

function renderBoard() {
    const board = document.getElementById('puzzleBoard');
    board.innerHTML = '';

    // Create a simple 2x2 grid drop zone
    const zone = document.createElement('div');
    zone.className = 'drop-zone';
    zone.style.width = '200px';
    zone.style.height = '200px';
    zone.style.left = '25px';
    zone.style.top = '25px';

    zone.addEventListener('dragover', handleDragOver);
    zone.addEventListener('dragleave', handleDragLeave);
    zone.addEventListener('drop', handleDrop);

    board.appendChild(zone);

    // Re-render placed shapes
    updatePlacedShapesDisplay();
}

function updatePlacedShapesDisplay() {
    const board = document.getElementById('puzzleBoard');
    const zone = board.querySelector('.drop-zone');

    // Clear existing shapes in zone
    zone.innerHTML = '';

    placedShapes.forEach(placed => {
        const shapeSvg = document.createElement('div');
        shapeSvg.style.position = 'absolute';
        shapeSvg.style.left = '0';
        shapeSvg.style.top = '0';
        shapeSvg.style.width = placed.shape.width + 'px';
        shapeSvg.style.height = placed.shape.height + 'px';
        shapeSvg.innerHTML = `<svg width="${placed.shape.width}" height="${placed.shape.height}" viewBox="0 0 ${placed.shape.width} ${placed.shape.height}">${placed.shape.svg}</svg>`;
        shapeSvg.classList.add('shape-placed');
        zone.appendChild(shapeSvg);
        zone.classList.add('filled');
    });

    checkPuzzleComplete();
}

// Drag and Drop - Mouse
let draggedElement = null;
let draggedShapeData = null;
let offsetX = 0;
let offsetY = 0;

function handleDragStart(e) {
    e.preventDefault();
    draggedElement = e.currentTarget;
    draggedShapeData = puzzleShapes[e.currentTarget.dataset.index];

    const rect = draggedElement.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    draggedElement.style.position = 'fixed';
    draggedElement.style.zIndex = '1000';
    draggedElement.style.opacity = '0.8';

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);

    console.log("Drag started:", draggedShapeData.id);
}

function handleDragMove(e) {
    if (!draggedElement) return;

    draggedElement.style.left = (e.clientX - offsetX) + 'px';
    draggedElement.style.top = (e.clientY - offsetY) + 'px';
}

function handleDragEnd(e) {
    if (!draggedElement) return;

    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);

    // Check if dropped on board
    const board = document.getElementById('puzzleBoard');
    const boardRect = board.getBoundingClientRect();
    const elementRect = draggedElement.getBoundingClientRect();

    const elementCenterX = elementRect.left + elementRect.width / 2;
    const elementCenterY = elementRect.top + elementRect.height / 2;

    if (elementCenterX >= boardRect.left && elementCenterX <= boardRect.right &&
        elementCenterY >= boardRect.top && elementCenterY <= boardRect.bottom) {

        // Add to placed shapes
        placedShapes.push({ shape: draggedShapeData });
        draggedElement.style.display = 'none';

        console.log("Shape placed:", draggedShapeData.id);
    }

    // Reset element
    draggedElement.style.position = '';
    draggedElement.style.zIndex = '';
    draggedElement.style.opacity = '';
    draggedElement.style.left = '';
    draggedElement.style.top = '';

    draggedElement = null;
    draggedShapeData = null;

    renderBoard();
}

// Drag and Drop - Touch
function handleTouchStart(e) {
    e.preventDefault();
    draggedElement = e.currentTarget;
    draggedShapeData = puzzleShapes[e.currentTarget.dataset.index];

    const touch = e.touches[0];
    const rect = draggedElement.getBoundingClientRect();
    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;

    draggedElement.style.position = 'fixed';
    draggedElement.style.zIndex = '1000';
    draggedElement.style.opacity = '0.8';

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    console.log("Touch drag started:", draggedShapeData.id);
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!draggedElement) return;

    const touch = e.touches[0];
    draggedElement.style.left = (touch.clientX - offsetX) + 'px';
    draggedElement.style.top = (touch.clientY - offsetY) + 'px';
}

function handleTouchEnd(e) {
    if (!draggedElement) return;

    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);

    // Check if dropped on board
    const board = document.getElementById('puzzleBoard');
    const boardRect = board.getBoundingClientRect();
    const elementRect = draggedElement.getBoundingClientRect();

    const elementCenterX = elementRect.left + elementRect.width / 2;
    const elementCenterY = elementRect.top + elementRect.height / 2;

    if (elementCenterX >= boardRect.left && elementCenterX <= boardRect.right &&
        elementCenterY >= boardRect.top && elementCenterY <= boardRect.bottom) {

        placedShapes.push({ shape: draggedShapeData });
        draggedElement.style.display = 'none';

        console.log("Shape placed via touch:", draggedShapeData.id);
    }

    draggedElement.style.position = '';
    draggedElement.style.zIndex = '';
    draggedElement.style.opacity = '';
    draggedElement.style.left = '';
    draggedElement.style.top = '';

    draggedElement = null;
    draggedShapeData = null;

    renderBoard();
}

// Drag over events
function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    if (draggedShapeData) {
        placedShapes.push({ shape: draggedShapeData });
        draggedElement.style.display = 'none';
        renderBoard();
    }
}

function checkPuzzleComplete() {
    const complete = document.getElementById('puzzleComplete');

    if (placedShapes.length >= 2) {
        complete.style.display = 'block';
    } else {
        complete.style.display = 'none';
    }

    console.log("Placed shapes:", placedShapes.length);
}

function resetPuzzle() {
    placedShapes = [];

    // Show all shapes again
    const shapes = document.querySelectorAll('.shapes-container .shape');
    shapes.forEach(s => s.style.display = 'block');

    renderBoard();
    console.log("Puzzle reset");
}

// Fixed: expose to window for games controller integration
window.initPuzzleBuilder = initPuzzleBuilder;
window.resetPuzzle = resetPuzzle;

