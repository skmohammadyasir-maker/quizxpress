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
    
    // Display question with category
    questionElement.innerHTML = `
      <div style="margin-bottom: 10px; font-size: 0.9rem; color: var(--neon-blue);">
        বিষয়: ${currentQuestion.category}
      </div>
      <div>${currentQuestion.question}</div>
    `;
    
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
    const currentQuestion = quizEngine.getCurrentQuestion();
    
    // Disable all buttons after selection
    buttons.forEach(button => {
      button.disabled = true;
    });
    
    // Highlight correct and wrong answers
    buttons[currentQuestion.correct].style.background = 'linear-gradient(90deg, #00c853, #009624)';
    buttons[currentQuestion.correct].style.color = '#fff';
    buttons[currentQuestion.correct].style.border = '2px solid #00c853';
    
    if (!isCorrect) {
      buttons[selectedIndex].style.background = 'linear-gradient(90deg, #ff1744, #d50000)';
      buttons[selectedIndex].style.color = '#fff';
      buttons[selectedIndex].style.border = '2px solid #ff1744';
    }
    
    // Show hint
    showHint(currentQuestion.hint);
    
    updateStats();
    nextBtn.classList.remove('hidden');
  }

  // Show hint
  function showHint(hint) {
    const hintElement = document.createElement('div');
    hintElement.style.cssText = `
      margin-top: 15px;
      padding: 10px;
      background: rgba(0, 229, 255, 0.1);
      border: 1px solid var(--neon-blue);
      border-radius: 8px;
      font-size: 0.9rem;
      color: var(--neon-blue);
      text-align: center;
    `;
    hintElement.innerHTML = `💡 ইঙ্গিত: ${hint}`;
    
    // Remove existing hint if any
    const existingHint = document.querySelector('.hint-message');
    if (existingHint) {
      existingHint.remove();
    }
    
    hintElement.classList.add('hint-message');
    questionElement.parentNode.insertBefore(hintElement, questionElement.nextSibling);
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
    // Remove hint
    const hintElement = document.querySelector('.hint-message');
    if (hintElement) {
      hintElement.remove();
    }
    
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
    const percentage = Math.round((stats.correct / quizQuestions.length) * 100);
    
    let message = "";
    if (percentage >= 80) {
      message = "অভিনন্দন! আপনার নৈতিক জ্ঞান ও সামাজিক সচেতনতা অসাধারণ!";
    } else if (percentage >= 60) {
      message = "ভালো! আপনার জ্ঞান মোটামুটি ভালো, আরও উন্নতি সম্ভব।";
    } else {
      message = "চেষ্টা চালিয়ে যান! সামাজিক আচরণ সম্পর্কে আরও শিখুন।";
    }
    
    questionElement.innerHTML = `
      <div style="text-align: center;">
        <h2 style="color: var(--neon-gold); margin-bottom: 20px;">🎉 কুইজ সম্পন্ন! 🎉</h2>
        <p style="margin: 10px 0;">আপনার স্কোর: <strong style="color: var(--neon-blue);">${stats.score}</strong></p>
        <p style="margin: 10px 0;">সঠিক উত্তর: <strong style="color: #00c853;">${stats.correct}</strong></p>
        <p style="margin: 10px 0;">ভুল উত্তর: <strong style="color: #ff1744;">${stats.wrong}</strong></p>
        <p style="margin: 10px 0;">সাফল্যের হার: <strong style="color: var(--neon-gold);">${percentage}%</strong></p>
        <p style="margin-top: 20px; font-size: 1.1rem; color: var(--neon-blue);">${message}</p>
      </div>
    `;
    
    optionsElement.innerHTML = '';
    nextBtn.classList.add('hidden');
    restartBtn.classList.remove('hidden');
  }

  // Restart game
  function restartGame() {
    // Remove hint if exists
    const hintElement = document.querySelector('.hint-message');
    if (hintElement) {
      hintElement.remove();
    }
    
    quizEngine.restartGame();
    initializeGame();
  }

  // Event listeners
  nextBtn.addEventListener('click', nextQuestion);
  restartBtn.addEventListener('click', restartGame);

  // Start the game
  initializeGame();
});
