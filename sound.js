// sound.js — Bengali Quiz Game sound effects (Black Force 007)

// Preload audio files
const correctSound = new Audio('sounds/correct.mp3');
const wrongSound = new Audio('sounds/wrong.mp3');
const clickSound = new Audio('sounds/click.mp3');

// Volume level (0.0 - 1.0)
correctSound.volume = 0.6;
wrongSound.volume = 0.6;
clickSound.volume = 0.5;

// Function to play correct answer sound
function playCorrectSound() {
  correctSound.currentTime = 0;
  correctSound.play().catch(() => {});
}

// Function to play wrong answer sound
function playWrongSound() {
  wrongSound.currentTime = 0;
  wrongSound.play().catch(() => {});
}

// Function to play button click sound
function playClickSound() {
  clickSound.currentTime = 0;
  clickSound.play().catch(() => {});
}

// Optional: You can call these functions in your script.js like:
// playCorrectSound();  --> when answer is correct
// playWrongSound();    --> when answer is wrong
// playClickSound();    --> when user clicks any option
