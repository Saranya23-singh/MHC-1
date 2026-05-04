// Bubble Wrap Game
const bubbleColors = [
    '#E8F5E9', '#C8E6C9', '#A5D6A7', '#81C784',
    '#FFF9C4', '#FFECB3', '#FFE0B2', '#FFCCBC',
    '#F8BBD9', '#E1BEE7', '#D1C4E9', '#C5CAE9'
];

function initBubbleWrap() {
    const grid = document.getElementById('bubbleGrid');
    grid.innerHTML = '';

    // Create 30 bubbles in a grid
    for (let i = 0; i < 30; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.background = `linear-gradient(135deg, ${bubbleColors[i % bubbleColors.length]} 0%, ${lightenColor(bubbleColors[i % bubbleColors.length], 20)} 100%)`;
        bubble.dataset.index = i;

        bubble.addEventListener('click', function () {
            popBubble(this);
        });

        grid.appendChild(bubble);
    }
}

function popBubble(bubble) {
    if (bubble.classList.contains('popping') || bubble.classList.contains('hidden')) return;

    bubble.classList.add('popping');
    playPopSound();

    setTimeout(() => {
        bubble.classList.remove('popping');
        bubble.classList.add('hidden');

        // Regenerate bubble after a delay
        setTimeout(() => {
            bubble.classList.remove('hidden');
            bubble.style.animation = 'none';
            setTimeout(() => {
                bubble.style.animation = '';
            }, 10);
        }, 2000);
    }, 400);
}

function lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 +
        (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)
    ).toString(16).slice(1);
}

// Fixed: expose to window for games controller integration
window.initBubbleWrap = initBubbleWrap;

