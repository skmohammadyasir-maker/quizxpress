// script.js
document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const questionElement = document.getElementById('question');
  const optionsElement = document.getElementById('options');
  const nextBtn = document.getElementById('nextBtn');
  const restartBtn = document.getElementById('restartBtn');
  const qIndexElement = document.getElementById('qIndex');
  const qTotalElement = document.getElementById('qTotal');
  const correctElement = document.getElementById('correct');
  const wrongElement = document.getElementById('wrong');
  const scoreElement = document.getElementById('score');

  // Initialize quiz engine
  const quizEngine = new QuizEngine(quizQuestions);
  
  // Initialize UI
  function initializeGame() {
    qTotalElement.textContent = quizQuestions.length;
    updateStats();
    loadQuestion();
  }

  // Load current question
  function loadQuestion() {
    const currentQuestion = quizEngine.getCurrentQuestion();
    const progress = quizEngine.getProgress();
    
    if (!currentQuestion) {
      endGame();
      return;
    }

    qIndexElement.textContent = progress.current;
    questionElement.textContent = currentQuestion.question;
    
    // Clear previous options
    optionsElement.innerHTML = '';
    
    // Create option buttons
    currentQuestion.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.textContent = option;
      button.addEventListener('click', () => handleAnswerClick(index));
      optionsElement.appendChild(button);
    });

    // Update button visibility
    nextBtn.classList.add('hidden');
    restartBtn.classList.add('hidden');
  }

  // Handle answer selection
  function handleAnswerClick(selectedIndex) {
    const isCorrect = quizEngine.checkAnswer(selectedIndex);
    const buttons = optionsElement.querySelectorAll('button');
    
    // Disable all buttons after selection
    buttons.forEach(button => {
      button.disabled = true;
    });
    
    // Highlight correct and wrong answers
    const currentQuestion = quizEngine.getCurrentQuestion();
    buttons[currentQuestion.correct].style.background = 'linear-gradient(90deg, #00c853, #009624)';
    buttons[currentQuestion.correct].style.color = '#fff';
    buttons[currentQuestion.correct].style.border = '2px solid #00c853';
    
    if (!isCorrect) {
      buttons[selectedIndex].style.background = 'linear-gradient(90deg, #ff1744, #d50000)';
      buttons[selectedIndex].style.color = '#fff';
      buttons[selectedIndex].style.border = '2px solid #ff1744';
    }
    
    updateStats();
    nextBtn.classList.remove('hidden');
  }

  // Update statistics
  function updateStats() {
    const stats = quizEngine.getStats();
    correctElement.textContent = stats.correct;
    wrongElement.textContent = stats.wrong;
    scoreElement.textContent = stats.score;
  }

  // Move to next question
  function nextQuestion() {
    const hasMoreQuestions = quizEngine.moveToNextQuestion();
    
    if (hasMoreQuestions) {
      loadQuestion();
    } else {
      endGame();
    }
  }

  // End game screen
  function endGame() {
    const stats = quizEngine.getStats();
    questionElement.innerHTML = `
      <div style="text-align: center;">
        <h2 style="color: var(--neon-gold); margin-bottom: 20px;">🎉 কুইজ সম্পন্ন! 🎉</h2>
        <p style="margin: 10px 0;">আপনার স্কোর: <strong style="color: var(--neon-blue);">${stats.score}</strong></p>
        <p style="margin: 10px 0;">সঠিক উত্তর: <strong style="color: #00c853;">${stats.correct}</strong></p>
        <p style="margin: 10px 0;">ভুল উত্তর: <strong style="color: #ff1744;">${stats.wrong}</strong></p>
        <p style="margin-top: 20px; font-size: 1.1rem;">আপনার নৈতিক জ্ঞান বেশ ভালো!</p>
      </div>
    `;
    
    optionsElement.innerHTML = '';
    nextBtn.classList.add('hidden');
    restartBtn.classList.remove('hidden');
  }

  // Restart game
  function restartGame() {
    quizEngine.restartGame();
    initializeGame();
  }

  // Event listeners
  nextBtn.addEventListener('click', nextQuestion);
  restartBtn.addEventListener('click', restartGame);

  // Start the game
  initializeGame();
});
