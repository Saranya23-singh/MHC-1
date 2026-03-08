// Breathing Exercise JavaScript
// 4-7-8 Breathing: Inhale 4s, Hold 7s, Exhale 8s

let breathingInterval;
let isBreathing = false;
let timeoutIds = [];

function updatePhaseIndicator(phase, time) {
    const indicator = document.getElementById('phaseIndicator');
    if (indicator) {
        indicator.textContent = `${phase} - ${time} seconds`;
    }
}

function breatheCycle() {
    const circle = document.getElementById('circle');
    const button = document.getElementById('breathButton');
    
    if (!circle) {
        console.error('Circle element not found!');
        return;
    }
    
    // Remove all animation classes first
    circle.classList.remove('inhale', 'hold', 'exhale');
    
    // Force reflow to restart animation
    void circle.offsetWidth;
    
    // ============ INHALE PHASE - 4 seconds ============
    console.log("Inhale phase started");
    circle.innerText = 'Inhale';
    circle.classList.add('inhale');
    updatePhaseIndicator('Inhale', 4);

    // Schedule Hold phase after 4 seconds
    timeoutIds.push(setTimeout(() => {
        if (!isBreathing) return;
        
        // ============ HOLD PHASE - 7 seconds ============
        console.log("Hold phase started");
        circle.innerText = 'Hold';
        circle.classList.remove('inhale');
        circle.classList.add('hold');
        updatePhaseIndicator('Hold', 7);

        // Schedule Exhale phase after 7 seconds (total 11 seconds so far)
        timeoutIds.push(setTimeout(() => {
            if (!isBreathing) return;
            
            // ============ EXHALE PHASE - 8 seconds ============
            console.log("Exhale phase started");
            circle.innerText = 'Exhale';
            circle.classList.remove('hold');
            circle.classList.add('exhale');
            updatePhaseIndicator('Exhale', 8);
            
        }, 7000)); // 7 seconds hold
    }, 4000)); // 4 seconds inhale
}

function stopBreathing() {
    const button = document.getElementById('breathButton');
    const circle = document.getElementById('circle');
    const indicator = document.getElementById('phaseIndicator');
    
    // Clear all intervals and timeouts
    clearInterval(breathingInterval);
    timeoutIds.forEach(function(timeoutId) {
        clearTimeout(timeoutId);
    });
    timeoutIds = [];
    
    if (circle) {
        circle.classList.remove('inhale', 'hold', 'exhale');
        circle.style.animation = 'none';
        circle.innerText = 'Ready';
    }
    
    if (indicator) {
        indicator.textContent = '';
    }
    
    if (button) {
        button.innerHTML = '<i class="fas fa-play"></i> Start';
        button.classList.remove('stop');
    }
    
    isBreathing = false;
    console.log("Breathing stopped");
}

function toggleBreathing() {
    const button = document.getElementById('breathButton');
    
    console.log('toggleBreathing called, isBreathing:', isBreathing);
    
    if (isBreathing) {
        stopBreathing();
    } else {
        // Start breathing
        isBreathing = true;
        breatheCycle();
        
        // Set interval for continuous breathing cycles (4 + 7 + 8 = 19 seconds)
        breathingInterval = setInterval(breatheCycle, 19000);
        
        if (button) {
            button.innerHTML = '<i class="fas fa-stop"></i> Stop';
            button.classList.add('stop');
        }
        
        console.log('Breathing started - continuous mode');
    }
}

// Make functions available globally
window.toggleBreathing = toggleBreathing;

