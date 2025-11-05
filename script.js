// ✅ script.js — Fully working with index.html + questions.js + engine.js
// Developed for Black Force 007 Bengali Quiz Game

document.addEventListener('DOMContentLoaded', function() {
  // ===== DOM Elements =====
  const questionElement = document.getElementById('question');
  const optionsElement = document.getElementById('options');
  const nextBtn = document.getElementById('nextBtn');
  const restartBtn = document.getElementById('restartBtn');
  const qIndexElement = document.getElementById('qIndex');
  const qTotalElement = document.getElementById('qTotal');
  const correctElement = document.getElementById('correct');
  const wrongElement = document.getElementById('wrong');
  const scoreElement = document.getElementById('score');

  // ===== Quiz Data =====
  const quizQuestions = QUESTIONS.map((q, i) => ({
    id: q.id || i + 1,
    category: q.category || "সাধারণ জ্ঞান",
    question: q.question,
    options: q.options,
    correct: q.answerIndex,
    hint: q.explanation || "সঠিক উত্তর সম্পর্কে আরও জানার চেষ্টা করুন।"
  }));

  // ===== Quiz Engine =====
  class QuizEngine {
    constructor(questions) {
      this.questions = this.shuffleArray([...questions]);
      this.currentIndex = 0;
      this.correct = 0;
      this.wrong = 0;
      this.score = 0;
      this.pointsPerCorrect = 10;
    }

    // Shuffle questions
    shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    getCurrentQuestion() {
      return this.questions[this.currentIndex];
    }

    getProgress() {
      return { current: this.currentIndex + 1, total: this.questions.length };
    }

    checkAnswer(selectedIndex) {
      const current = this.getCurrentQuestion();
      const isCorrect = selectedIndex === current.correct;
      if (isCorrect) {
        this.correct++;
        this.score += this.pointsPerCorrect;
      } else {
        this.wrong++;
      }
      return isCorrect;
    }

    moveToNextQuestion() {
      this.currentIndex++;
      return this.currentIndex < this.questions.length;
    }

    getStats() {
      return { correct: this.correct, wrong: this.wrong, score: this.score };
    }

    restartGame() {
      this.currentIndex = 0;
      this.correct = 0;
      this.wrong = 0;
      this.score = 0;
      this.questions = this.shuffleArray([...quizQuestions]);
    }
  }

  // ===== Initialize Quiz Engine =====
  const quizEngine = new QuizEngine(quizQuestions);

  // ===== Initialize Game =====
  function initializeGame() {
    qTotalElement.textContent = quizQuestions.length;
    updateStats();
    loadQuestion();
  }

  // ===== Load Question =====
  function loadQuestion() {
    const currentQuestion = quizEngine.getCurrentQuestion();
    const progress = quizEngine.getProgress();

    if (!currentQuestion) {
      endGame();
      return;
    }

    qIndexElement.textContent = progress.current;

    questionElement.innerHTML = `
      <div style="margin-bottom: 10px; font-size: 0.9rem; color: var(--neon-blue);">
        📚 বিষয়: ${currentQuestion.category}
      </div>
      <div>${currentQuestion.question}</div>
    `;

    optionsElement.innerHTML = '';
    currentQuestion.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.textContent = option;
      button.className = 'option-btn';
      button.addEventListener('click', () => handleAnswerClick(index));
      optionsElement.appendChild(button);
    });

    nextBtn.classList.add('hidden');
    restartBtn.classList.add('hidden');
  }

  // ===== Handle Answer Click =====
  function handleAnswerClick(selectedIndex) {
    const isCorrect = quizEngine.checkAnswer(selectedIndex);
    const currentQuestion = quizEngine.getCurrentQuestion();
    const buttons = optionsElement.querySelectorAll('button');

    buttons.forEach(btn => btn.disabled = true);

    // Correct Highlight
    buttons[currentQuestion.correct].style.background = 'linear-gradient(90deg, #00c853, #009624)';
    buttons[currentQuestion.correct].style.color = '#fff';
    buttons[currentQuestion.correct].style.border = '2px solid #00c853';

    // Wrong Highlight
    if (!isCorrect) {
      buttons[selectedIndex].style.background = 'linear-gradient(90deg, #ff1744, #d50000)';
      buttons[selectedIndex].style.color = '#fff';
      buttons[selectedIndex].style.border = '2px solid #ff1744';
    }

    showHint(currentQuestion.hint);
    updateStats();
    nextBtn.classList.remove('hidden');
  }

  // ===== Show Hint =====
  function showHint(hint) {
    const existingHint = document.querySelector('.hint-message');
    if (existingHint) existingHint.remove();

    const hintElement = document.createElement('div');
    hintElement.className = 'hint-message';
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
    questionElement.parentNode.insertBefore(hintElement, questionElement.nextSibling);
  }

  // ===== Update Stats =====
  function updateStats() {
    const stats = quizEngine.getStats();
    correctElement.textContent = stats.correct;
    wrongElement.textContent = stats.wrong;
    scoreElement.textContent = stats.score;
  }

  // ===== Next Question =====
  function nextQuestion() {
    const hintElement = document.querySelector('.hint-message');
    if (hintElement) hintElement.remove();

    const hasMore = quizEngine.moveToNextQuestion();
    if (hasMore) {
      loadQuestion();
    } else {
      endGame();
    }
  }

  // ===== End Game =====
  function endGame() {
    const stats = quizEngine.getStats();
    const percentage = Math.round((stats.correct / quizQuestions.length) * 100);
    let message = "";

    if (percentage >= 80) {
      message = "অভিনন্দন! 🎉 আপনার নৈতিক ও সামাজিক জ্ঞান অসাধারণ!";
    } else if (percentage >= 60) {
      message = "ভালো! 👍 আপনার জ্ঞান ভালো, আরও উন্নতি সম্ভব।";
    } else {
      message = "চেষ্টা চালিয়ে যান! 💪 আরও শিখুন ও সচেতন হোন।";
    }

    questionElement.innerHTML = `
      <div style="text-align: center;">
        <h2 style="color: var(--neon-gold); margin-bottom: 20px;">🎯 কুইজ সম্পন্ন!</h2>
        <p>স্কোর: <strong style="color: var(--neon-blue);">${stats.score}</strong></p>
        <p>সঠিক উত্তর: <strong style="color: #00c853;">${stats.correct}</strong></p>
        <p>ভুল উত্তর: <strong style="color: #ff1744;">${stats.wrong}</strong></p>
        <p>সাফল্যের হার: <strong style="color: var(--neon-gold);">${percentage}%</strong></p>
        <p style="margin-top: 15px; font-size: 1rem; color: var(--neon-blue);">${message}</p>
      </div>
    `;

    optionsElement.innerHTML = '';
    nextBtn.classList.add('hidden');
    restartBtn.classList.remove('hidden');
  }

  // ===== Restart Game =====
  function restartGame() {
    const hintElement = document.querySelector('.hint-message');
    if (hintElement) hintElement.remove();
    quizEngine.restartGame();
    initializeGame();
  }

  // ===== Event Listeners =====
  nextBtn.addEventListener('click', nextQuestion);
  restartBtn.addEventListener('click', restartGame);

  // ===== Start Game =====
  initializeGame();
});
