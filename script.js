// ============================
// 🎮 Black Force 007 — Script
// ============================

// safely get element helper
function $(id){ return document.getElementById(id); }

// UI elements (fallback-safe)
const qTotalEl = $('qTotal') || {textContent:''};
const qTotal2El = $('qTotal2') || {textContent:''};
const qIndexEl = $('qIndex') || {textContent:''};
const questionEl = $('question') || {textContent:''};
const optionsEl = $('options') || document.body.appendChild(document.createElement('div'));
const timerEl = $('timer') || {textContent:''};
const statCorrect = $('stat-correct') || {textContent:''};
const statWrong = $('stat-wrong') || {textContent:''};
const statScore = $('stat-score') || {textContent:''};
const statCoins = $('stat-coins') || {textContent:''};
const resultScreen = $('result-screen') || document.body.appendChild(document.createElement('div'));
const finalCorrect = $('final-correct') || {textContent:''};
const finalWrong = $('final-wrong') || {textContent:''};
const finalScore = $('final-score') || {textContent:''};
const finalCoins = $('final-coins') || {textContent:''};
const bestScore = $('bestScore') || {textContent:''};
const playAgain = $('playAgain') || document.body.appendChild(document.createElement('button'));
const fiftyBtn = $('fiftyBtn') || document.body.appendChild(document.createElement('button'));
const hintBtn = $('hintBtn') || document.body.appendChild(document.createElement('button'));
const skipBtn = $('skipBtn') || document.body.appendChild(document.createElement('button'));
const hintEl = $('hint') || document.body.appendChild(document.createElement('div'));
const soundToggle = $('soundToggle') || document.body.appendChild(document.createElement('button'));

// sound control
let soundsOn = true;
const sounds = {
  click: new Audio('sounds/click.mp3'),
  correct: new Audio('sounds/correct.mp3'),
  wrong: new Audio('sounds/wrong.mp3')
};
function playSound(name){
  if(!soundsOn) return;
  const s = sounds[name];
  if(s){ s.currentTime = 0; s.play().catch(()=>{}); }
}

// instantiate engine (requires GameEngine + QUESTIONS)
const engine = new GameEngine({
  questions: QUESTIONS,
  total: 40,
  timePerQ: 15,
  coinsPerCorrect: 5,
  skipPenalty: 0
});

// ============================
// 🔢 Render & Gameplay Logic
// ============================

function renderStats(){
  qTotalEl.textContent = engine.total;
  qTotal2El.textContent = engine.total;
  qIndexEl.textContent = Math.min(engine.index + 1, engine.total);
  statCorrect.textContent = engine.correct;
  statWrong.textContent = engine.wrong;
  statScore.textContent = engine.score;
  statCoins.textContent = engine.coins;
}

function renderQuestion(){
  const q = engine.current();
  optionsEl.innerHTML = '';
  hintEl.classList.add('hidden');
  hintEl.textContent = '';

  if(!q){ finishGame(); return; }

  questionEl.textContent = q.q;
  q.options.forEach((opt, i) => {
    const b = document.createElement('div');
    b.className = 'option';
    b.dataset.index = i;
    b.textContent = opt;
    b.addEventListener('click', () => onOptionClick(i, b));
    optionsEl.appendChild(b);
  });

  renderStats();
  startQTimer();
}

let optionClickable = true;

function onOptionClick(i, btnEl){
  if(!optionClickable) return;
  optionClickable = false;
  engine.stopTimer();

  const res = engine.answer(i);

  if(res.correct){
    btnEl.classList.add('correct');
    playSound('correct');
  } else {
    btnEl.classList.add('wrong');
    playSound('wrong');
    const correctIndex = engine.questions[engine.index - 1]?.a;
    if(correctIndex != null){
      const el = [...optionsEl.children].find(x => +x.dataset.index === correctIndex);
      if(el) el.classList.add('correct');
    }
  }

  setTimeout(() => {
    optionClickable = true;
    if(engine.isFinished()) finishGame();
    else renderQuestion();
  }, 900);
}

function startQTimer(){
  timerEl.textContent = engine.timePerQ;
  engine.startTimer(t => { timerEl.textContent = t; }, () => {
    playSound('wrong');
    engine.wrong++;
    engine.index++;
    engine.streak = 0;
    renderStats();
    if(engine.isFinished()) finishGame();
    else renderQuestion();
  });
}

function finishGame(){
  engine.stopTimer();
  finalCorrect.textContent = engine.correct;
  finalWrong.textContent = engine.wrong;
  finalScore.textContent = engine.score;
  finalCoins.textContent = engine.coins;
  const best = Math.max(parseInt(localStorage.getItem('bf_best') || 0), engine.score);
  localStorage.setItem('bf_best', best);
  bestScore.textContent = best;
  resultScreen.classList.remove('hidden');
}

// ============================
// 🕹️ Button Controls
// ============================

playAgain.addEventListener('click', () => {
  playSound('click');
  resultScreen.classList.add('hidden');
  engine.reset();
  renderQuestion();
});

fiftyBtn.addEventListener('click', () => {
  playSound('click');
  const removed = engine.useFifty();
  if(!removed){ alert('50-50 আগেই ব্যবহৃত হয়েছে'); return; }
  for(const idx of removed){
    const el = [...optionsEl.children].find(x => +x.dataset.index === idx);
    if(el) el.style.visibility = 'hidden';
  }
});

hintBtn.addEventListener('click', () => {
  playSound('click');
  const hint = engine.useHint();
  if(!hint){ alert('Hint আগেই ব্যবহৃত হয়েছে'); return; }
  hintEl.textContent = hint;
  hintEl.classList.remove('hidden');
});

skipBtn.addEventListener('click', () => {
  playSound('click');
  const ok = engine.useSkip();
  if(!ok){ alert('Skip আগেই ব্যবহৃত হয়েছে'); return; }
  if(engine.isFinished()) finishGame();
  else renderQuestion();
});

soundToggle.addEventListener('click', () => {
  soundsOn = !soundsOn;
  soundToggle.textContent = soundsOn ? '🔊' : '🔇';
});

// ============================
// 🚀 Game Start
// ============================
renderQuestion();
