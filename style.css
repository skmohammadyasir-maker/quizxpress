/* ===============================
   🎯 QuizXpress Script
   Handles UI, game events, and rendering
   =============================== */

const qBox = document.getElementById("questionBox");
const optionsEl = document.getElementById("options");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");
const startBtn = document.getElementById("startBtn");
const gameBox = document.getElementById("gameBox");
const startScreen = document.getElementById("startScreen");
const resultBox = document.getElementById("resultBox");
const finalScore = document.getElementById("finalScore");

let engine;

function initGame() {
  engine = new GameEngine({
    questions: QUESTIONS,
    total: 40,
    timePerQ: 15,
    coinsPerCorrect: 5
  });
  showQuestion();
}

function showQuestion() {
  const q = engine.current();
  if (!q) {
    showResult();
    return;
  }

  qBox.innerText = q.q;

  // Create option table
  optionsEl.innerHTML = `
    <table class="option-table">
      ${q.options
        .map(
          (opt, i) =>
            `<tr><td><button class="option-btn" data-index="${i}">${opt}</button></td></tr>`
        )
        .join("")}
    </table>
  `;

  // Timer
  engine.startTimer(
    (t) => (timerEl.innerText = `⏳ ${t}s`),
    () => handleAnswer(-1)
  );

  document.querySelectorAll(".option-btn").forEach((btn) => {
    btn.onclick = () => handleAnswer(parseInt(btn.dataset.index));
  });
}

function handleAnswer(index) {
  engine.stopTimer();
  const q = engine.current();
  const result = engine.answer(index);
  const buttons = document.querySelectorAll(".option-btn");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.a) {
      btn.classList.add("correct");
    }
    if (index === i && !result.correct) {
      btn.classList.add("wrong");
    }
  });

  scoreEl.innerText = `⭐ ${engine.score}`;
  setTimeout(() => showQuestion(), 1200);
}

function showResult() {
  gameBox.style.display = "none";
  resultBox.style.display = "block";
  finalScore.innerText = `${engine.score} Points`;
}

startBtn.onclick = () => {
  startScreen.style.display = "none";
  gameBox.style.display = "block";
  initGame();
};
