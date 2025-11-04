// UI Elements
const qTotalEl = document.getElementById('qTotal');
const qTotal2El = document.getElementById('qTotal2');
const qIndexEl = document.getElementById('qIndex');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const timerEl = document.getElementById('timer');
const statCorrect = document.getElementById('stat-correct');
const statWrong = document.getElementById('stat-wrong');
const statScore = document.getElementById('stat-score');
const statCoins = document.getElementById('stat-coins');
const resultScreen = document.getElementById('result-screen');
const finalCorrect = document.getElementById('final-correct');
const finalWrong = document.getElementById('final-wrong');
const finalScore = document.getElementById('final-score');
const finalCoins = document.getElementById('final-coins');
const bestScore = document.getElementById('bestScore');
const playAgain = document.getElementById('playAgain');
const fiftyBtn = document.getElementById('fiftyBtn');
const hintBtn = document.getElementById('hintBtn');
const skipBtn = document.getElementById('skipBtn');
const hintEl = document.getElementById('hint');
const soundToggle = document.getElementById('soundToggle');

let soundsOn = true;
const sounds = {
  click: new Audio('sounds/click.mp3'),
  correct: new Audio('sounds/correct.mp3'),
  wrong: new Audio('sounds/wrong.mp3')
};
function playSound(name){
  if(!soundsOn) return;
  const s = sounds[name];
  if(s){ s.currentTime=0; s.play().catch(()=>{}); }
}

// Initialize engine
const engine = new GameEngine({
  questions: QUESTIONS,
  total: QUESTIONS.length,
  timePerQ: 15,
  coinsPerCorrect: 5,
  skipPenalty: 0
});

function renderStats(){
  qTotalEl.textContent = engine.total;
  qIndexEl.textContent = Math.min(engine.index+1, engine.total);
  statCorrect.textContent = engine.correct;
  statWrong.textContent = engine.wrong;
  statScore.textContent = engine.score;
  statCoins.textContent = engine.coins;
}

function renderQuestion(){
  const q = engine.current();
  optionsEl.innerHTML='';
  hintEl.classList.add('hidden');
  hintEl.textContent='';
  if(!q){ finishGame(); return; }

  questionEl.textContent = q.q;
  optionsEl.className = 'options-grid';

  q.options.forEach((opt,i)=>{
    const b = document.createElement('div');
    b.className = 'option';
    b.dataset.index = i;
    b.textContent = opt;
    b.onclick = () => onOptionClick(i,b);
    optionsEl.appendChild(b);
  });

  renderStats();
  startQTimer();
}

let optionClickable = true;

function onOptionClick(i,btnEl){
  if(!optionClickable) return;
  optionClickable=false;
  engine.stopTimer();
  const res = engine.answer(i);
  if(res.correct){
    btnEl.classList.add('correct');
    playSound('correct');
  } else {
    btnEl.classList.add('wrong');
    playSound('wrong');
    const correctIndex = engine.questions[engine.index-1]?.a;
    if(correctIndex!=null){
      const el = [...optionsEl.children].find(x=>+x.dataset.index===correctIndex);
      if(el) el.classList.add('correct');
    }
  }
  setTimeout(()=>{
    optionClickable=true;
    if(engine.isFinished()) finishGame();
    else renderQuestion();
  },1000);
}

function startQTimer(){
  timerEl.textContent = engine.timePerQ;
  engine.startTimer((t)=>{ timerEl.textContent=t; },()=>{
    playSound('wrong');
    engine.wrong++;
    engine.index++;
    engine.streak=0;
    renderStats();
    if(engine.isFinished()) finishGame(); else renderQuestion();
  });
}

function finishGame(){
  engine.stopTimer();
  finalCorrect.textContent = engine.correct;
  finalWrong.textContent = engine.wrong;
  finalScore.textContent = engine.score;
  finalCoins.textContent = engine.coins;
  const best = Math.max(parseInt(localStorage.getItem('best_score')||0), engine.score);
  localStorage.setItem('best_score', best);
  bestScore.textContent = best;
  resultScreen.classList.remove('hidden');
}

playAgain.onclick = ()=>{
  resultScreen.classList.add('hidden');
  engine.reset();
  renderQuestion();
};

fiftyBtn.onclick = ()=>{
  playSound('click');
  const removed = engine.useFifty();
  if(!removed){ alert('50-50 আগেই ব্যবহৃত হয়েছে'); return; }
  for(const idx of removed){
    const el = [...optionsEl.children].find(x=>+x.dataset.index===idx);
    if(el) el.style.visibility='hidden';
  }
};

hintBtn.onclick = ()=>{
  playSound('click');
  const hint = engine.useHint();
  if(!hint){ alert('Hint আগেই ব্যবহৃত হয়েছে'); return; }
  hintEl.textContent = hint;
  hintEl.classList.remove('hidden');
};

skipBtn.onclick = ()=>{
  playSound('click');
  const ok = engine.useSkip();
  if(!ok){ alert('Skip আগেই ব্যবহৃত হয়েছে'); return; }
  if(engine.isFinished()) finishGame(); else renderQuestion();
};

soundToggle.onclick = ()=>{
  soundsOn=!soundsOn;
  soundToggle.textContent = soundsOn ? '🔊' : '🔇';
};

renderQuestion();
