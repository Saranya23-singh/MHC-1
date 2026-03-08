// Calming Sound Player JavaScript
// Plays audio files from public/sounds/ folder

let currentSound = null;
let audioPlayer = null;
let isPlaying = false;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeSounds();
});

function initializeSounds() {
    // Create or get audio player element
    audioPlayer = document.getElementById('audioPlayer');
    
    if (!audioPlayer) {
        // Create audio element if not exists
        audioPlayer = document.createElement('audio');
        audioPlayer.id = 'audioPlayer';
        audioPlayer.loop = true;
        audioPlayer.volume = 0.5;
        document.body.appendChild(audioPlayer);
    }
    
    // Setup volume control
    const volumeSlider = document.getElementById('volumeSlider');
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            audioPlayer.volume = e.target.value / 100;
            console.log("Volume:", e.target.value / 100);
        });
    }
    
    // Setup play/pause button
    const playPauseBtn = document.getElementById('playPauseBtn');
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlayPause);
    }
}

function playSound(soundName) {
    console.log("Playing sound:", soundName);
    
    const soundConfigs = {
        rain: {
            name: 'Rain',
            icon: 'fa-cloud-rain',
            url: 'sounds/rain.mp3'
        },
        ocean: {
            name: 'Ocean',
            icon: 'fa-water',
            url: 'sounds/ocean.mp3'
        },
        forest: {
            name: 'Forest',
            icon: 'fa-tree',
            url: 'sounds/forest.mp3'
        },
        nature: {
            name: 'Nature',
            icon: 'fa-leaf',
            url: 'sounds/nature.mp3'
        },
        dawn: {
            name: 'Dawn',
            icon: 'fa-sunrise',
            url: 'sounds/dawn.mp3'
        },
        windchimes: {
            name: 'Wind Chimes',
            icon: 'fa-wind',
            url: 'sounds/windchimes.mp3'
        }
    };
    
    const config = soundConfigs[soundName];
    
    if (!config) {
        console.error('Sound not found:', soundName);
        return;
    }
    
    // If clicking the same sound that's playing, toggle pause
    if (currentSound === soundName) {
        if (isPlaying) {
            audioPlayer.pause();
            isPlaying = false;
            updatePlayButton(false);
            updateNowPlaying(config.name + " (Paused)");
        } else {
            audioPlayer.play();
            isPlaying = true;
            updatePlayButton(true);
            updateNowPlaying(config.name + " - Now Playing");
        }
        return;
    }
    
    // Stop current sound
    stopSound();
    
    // Set new sound
    currentSound = soundName;
    audioPlayer.src = config.url;
    audioPlayer.loop = true;
    
    console.log("Loading audio from:", config.url);
    
    // Get volume from slider if exists
    const volumeSlider = document.getElementById('volumeSlider');
    if (volumeSlider) {
        audioPlayer.volume = volumeSlider.value / 100;
    }
    
    // Play the sound
    audioPlayer.play()
        .then(() => {
            console.log("Audio started playing");
            isPlaying = true;
            updateUI(soundName, config.name, true);
            updateNowPlaying(config.name + " - Now Playing");
        })
        .catch(error => {
            console.error('Error playing sound:', error);
            updateNowPlaying("Error loading sound");
        });
}

function stopSound() {
    if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
    }
    
    currentSound = null;
    isPlaying = false;
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.sound-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    updateNowPlaying("Select a sound");
    updatePlayButton(false);
}

function togglePlayPause() {
    console.log("Toggle play/pause, currentSound:", currentSound, "isPlaying:", isPlaying);
    
    if (!currentSound) {
        // No sound selected, default to rain
        playSound('rain');
        return;
    }
    
    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        updatePlayButton(false);
    } else {
        audioPlayer.play()
            .then(() => {
                isPlaying = true;
                updatePlayButton(true);
            })
            .catch(error => {
                console.error("Error resuming:", error);
            });
    }
}

function updatePlayButton(playing) {
    const playPauseBtn = document.getElementById('playPauseBtn');
    if (playPauseBtn) {
        const icon = playPauseBtn.querySelector('i');
        if (icon) {
            icon.className = playing ? 'fas fa-pause' : 'fas fa-play';
        }
    }
}

function updateUI(soundName, soundDisplayName, active) {
    // Update button states
    const buttons = document.querySelectorAll('.sound-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.sound === soundName) {
            btn.classList.add('active');
        }
    });
}

function updateNowPlaying(text) {
    const playingText = document.getElementById('playingText');
    const nowPlaying = document.getElementById('nowPlaying');
    
    if (playingText) {
        playingText.textContent = text || 'Select a sound';
    }
    
    if (nowPlaying) {
        if (isPlaying) {
            nowPlaying.classList.add('active');
        } else {
            nowPlaying.classList.remove('active');
        }
    }
}

// Export functions for global use
window.playSound = playSound;
window.stopSound = stopSound;
window.togglePlayPause = togglePlayPause;

