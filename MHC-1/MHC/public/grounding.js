// 5-4-3-2-1 Grounding Exercise Game
const groundingSteps = [
    { count: 5, category: 'see', text: 'Name 5 things you can see around you', verb: 'seen' },
    { count: 4, category: 'touch', text: 'Name 4 things you can touch', verb: 'felt' },
    { count: 3, category: 'hear', text: 'Name 3 sounds you can hear', verb: 'heard' },
    { count: 2, category: 'smell', text: 'Name 2 scents you notice', verb: 'smelled' },
    { count: 1, category: 'taste', text: 'Name 1 thing you can taste', verb: 'tasted' }
];

let currentStep = 0;
let stepItems = [];

function initGrounding() {
    currentStep = 0;
    stepItems = [];
    showStep();
}

function showStep() {
    const indicator = document.getElementById('stepIndicator');
    const step = document.getElementById('currentStep');
    const completion = document.getElementById('completionMessage');

    completion.style.display = 'none';
    step.style.display = 'block';

    // Show step indicators
    indicator.innerHTML = '';
    for (let i = 0; i < groundingSteps.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'step-dot';
        if (i < currentStep) dot.classList.add('completed');
        if (i === currentStep) dot.classList.add('active');
        indicator.appendChild(dot);
    }

    if (currentStep >= groundingSteps.length) {
        showCompletion();
        return;
    }

    const stepData = groundingSteps[currentStep];
    document.getElementById('stepTitle').textContent = `${stepData.category.charAt(0).toUpperCase() + stepData.category.slice(1)}`;
    document.getElementById('stepDesc').textContent = stepData.text;

    const inputArea = document.getElementById('inputArea');
    inputArea.innerHTML = `
        <input type="text" id="itemInput" placeholder="Type and press Enter" onkeypress="handleItemKeyPress(event)">
        <button class="add-btn" onclick="addItem()">Add</button>
        <div class="items-list" id="itemsList"></div>
        ${stepItems.length >= stepData.count ? `<button class="next-btn" onclick="nextStep()">Next Step</button>` : `<p style="margin-top:10px;color:#6B7C85;">Add ${stepData.count - stepItems.length} more</p>`}
    `;

    // Show existing items
    renderItems();
}

function handleItemKeyPress(event) {
    if (event.key === 'Enter') {
        addItem();
    }
}

function addItem() {
    const input = document.getElementById('itemInput');
    const value = input.value.trim();

    if (value && stepItems.length < groundingSteps[currentStep].count) {
        stepItems.push(value);
        input.value = '';

        renderItems();
        updateNextButton();
    }
}

function renderItems() {
    const list = document.getElementById('itemsList');
    if (!list) return;

    list.innerHTML = stepItems.map(item => `<span class="item-tag">${item}</span>`).join('');
}

function updateNextButton() {
    const stepData = groundingSteps[currentStep];
    const inputArea = document.getElementById('inputArea');

    if (stepItems.length >= stepData.count) {
        const existingNextBtn = inputArea.querySelector('.next-btn');
        if (!existingNextBtn) {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'next-btn';
            nextBtn.textContent = 'Next Step';
            nextBtn.onclick = nextStep;
            inputArea.appendChild(nextBtn);
        }

        // Remove the "add more" message if exists
        const msg = inputArea.querySelector('p');
        if (msg) msg.remove();
    }
}

function nextStep() {
    currentStep++;
    stepItems = [];
    showStep();
}

function showCompletion() {
    const step = document.getElementById('currentStep');
    const completion = document.getElementById('completionMessage');

    step.style.display = 'none';
    completion.style.display = 'block';
}

function startGrounding() {
    currentStep = 0;
    stepItems = [];
    showStep();
}

function resetGrounding() {
    currentStep = 0;
    stepItems = [];
    showStep();
}

// Fixed: expose to window for games controller integration
window.initGrounding = initGrounding;
window.resetGrounding = resetGrounding;

