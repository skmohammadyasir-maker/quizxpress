// engine.js
// Core quiz engine — requires questions.js (QUESTIONS variable) to be loaded first.

(function () {
  // Config
  const POINTS_CORRECT = 10;
  const POINTS_WRONG = 0; // change to negative if you prefer penalty, e.g. -5
  const MAX_OPTIONS = 4;

  // DOM elements
  const qIndexEl = document.getElementById('qIndex');
  const qTotalEl = document.getElementById('qTotal');
  const questionEl = document.getElementById('question');
  const optionsEl = document.getElementById('options');
  const correctEl = document.getElementById('correct');
  const wrongEl = document.getElementById('wrong');
  const scoreEl = document.getElementById('score');
  const nextBtn = document.getElementById('nextBtn');
  const restartBtn = document.getElementById('restartBtn');

  // Internal state
  let pool = []; // shuffled questions
  let currentIndex = 0;
  let stats = {
    correct: 0,
    wrong: 0,
    score: 0
  };
  let answered = false;

  // Helpers
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function clampOptions(q) {
    // If options length < MAX_OPTIONS, fill with placeholders (shouldn't happen here)
    if (!q.options || q.options.length === 0) q.options = ['-'];
    return q;
  }

  function renderStats() {
    correctEl.textContent = stats.correct;
    wrongEl.textContent = stats.wrong;
    scoreEl.textContent = stats.score;
  }

  function showQuestion() {
    answered = false;
    nextBtn.classList.add('hidden');
    restartBtn.classList.add('hidden');
    optionsEl.innerHTML = '';
    const q = pool[currentIndex];
    qIndexEl.textContent = currentIndex + 1;
    qTotalEl.textContent = pool.length;
    questionEl.textContent = q.question || 'প্রশ্ন নেই।';

    // Shuffle options for each question to avoid pattern
    let opts = q.options.map((o, idx) => ({ text: o, originalIndex: idx }));
    opts = shuffle(opts);

    // create buttons
    opts.forEach((optObj, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.type = 'button';
      btn.dataset.origIndex = optObj.originalIndex;
      btn.dataset.shownIndex = idx;
      btn.textContent = optObj.text;
      btn.addEventListener('click', onSelectOption);
      optionsEl.appendChild(btn);
    });

    // show progress
    renderStats();
  }

  function disableOptions() {
    const btns = optionsEl.querySelectorAll('button');
    btns.forEach(b => {
      b.disabled = true;
      b.classList.add('disabled');
    });
  }

  function highlightCorrectWrong(clickedBtn, correctOriginalIndex) {
    const btns = optionsEl.querySelectorAll('button');
    btns.forEach(b => {
      const orig = parseInt(b.dataset.origIndex, 10);
      b.classList.remove('selected');
      b.style.opacity = '1';
      if (orig === correctOriginalIndex) {
        b.style.borderColor = '#22c55e'; // green
        b.style.boxShadow = '0 0 12px rgba(34,197,94,0.35)';
      } else {
        b.style.borderColor = '#ef4444'; // red-ish for non-correct (only clicked becomes red)
      }
    });

    if (clickedBtn) {
      const clickedOrig = parseInt(clickedBtn.dataset.origIndex, 10);
      if (clickedOrig !== correctOriginalIndex) {
        // mark clicked as wrong
        clickedBtn.style.borderColor = '#ef4444';
        clickedBtn.style.boxShadow = '0 0 10px rgba(239,68,68,0.25)';
      }
    }
  }

  function onSelectOption(e) {
    if (answered) return;
    answered = true;
    const btn = e.currentTarget;
    disableOptions();

    const chosenOrig = parseInt(btn.dataset.origIndex, 10);
    const q = pool[currentIndex];
    const correctOrig = q.answerIndex;

    if (chosenOrig === correctOrig) {
      // correct
      stats.correct += 1;
      stats.score += POINTS_CORRECT;
      btn.classList.add('selected');
      btn.style.borderColor = '#16a34a';
      btn.style.boxShadow = '0 0 14px rgba(16,185,129,0.25)';
    } else {
      // wrong
      stats.wrong += 1;
      stats.score += POINTS_WRONG;
      btn.classList.add('selected-wrong');
    }

    // highlight correct and wrong
    highlightCorrectWrong(btn, correctOrig);

    // show small explanation (if present)
    if (q.explanation) {
      const expl = document.createElement('div');
      expl.className = 'explanation';
      expl.style.marginTop = '12px';
      expl.style.background = 'rgba(255,255,255,0.03)';
      expl.style.padding = '10px';
      expl.style.borderRadius = '8px';
      expl.style.fontSize = '0.95rem';
      expl.textContent = q.explanation;
      // append below options
      const questionBox = document.querySelector('.question-box');
      // remove previous explanation if exists
      const prev = questionBox.querySelector('.explanation');
      if (prev) prev.remove();
      questionBox.appendChild(expl);
    }

    renderStats();

    // show next or finish
    if (currentIndex < pool.length - 1) {
      nextBtn.classList.remove('hidden');
    } else {
      // finished
      restartBtn.classList.remove('hidden');
      showSummaryModal();
      saveHighScore();
    }
  }

  function goNext() {
    if (!answered) return;
    currentIndex++;
    if (currentIndex >= pool.length) {
      currentIndex = pool.length - 1;
    }
    // remove explanation block if any
    const questionBox = document.querySelector('.question-box');
    const prev = questionBox.querySelector('.explanation');
    if (prev) prev.remove();
    showQuestion();
  }

  function restart() {
    // Reset and reshuffle
    stats = { correct: 0, wrong: 0, score: 0 };
    pool = shuffle(QUESTIONS.map(q => Object.assign({}, q))).map(clampOptions);
    // shuffle options inside question? we already shuffle while rendering
    currentIndex = 0;
    renderStats();
    showQuestion();
    nextBtn.classList.add('hidden');
    restartBtn.classList.add('hidden');
  }

  function showSummaryModal() {
    // For simplicity: show an alert-like summary and show restart button already visible
    const total = pool.length;
    const msg = `আপনি শেষ করেছেন!\n\nমোট প্রশ্ন: ${total}\nসঠিক: ${stats.correct}\nভুল: ${stats.wrong}\nস্কোর: ${stats.score}`;
    // Use a lightweight overlay inside the page instead of alert
    showInlineToast(msg);
  }

  function showInlineToast(text) {
    // create simple toast at top center of card
    const existing = document.getElementById('bf-toast');
    if (existing) existing.remove();
    const card = document.querySelector('main.card');
    const toast = document.createElement('div');
    toast.id = 'bf-toast';
    toast.style.position = 'absolute';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.top = '10px';
    toast.style.background = 'linear-gradient(90deg, rgba(2,6,23,0.95), rgba(10,10,30,0.95))';
    toast.style.border = '1px solid rgba(255,255,255,0.06)';
    toast.style.padding = '12px 18px';
    toast.style.borderRadius = '10px';
    toast.style.boxShadow = '0 6px 20px rgba(0,0,0,0.6)';
    toast.style.color = 'var(--text-light)';
    toast.style.zIndex = '999';
    toast.style.whiteSpace = 'pre-line';
    toast.textContent = text;

    card.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 6000);
  }

  function saveHighScore() {
    try {
      const key = 'bf007_highscore_v1';
      const previous = JSON.parse(localStorage.getItem(key)) || { score: 0, date: null };
      if (stats.score > (previous.score || 0)) {
        const now = new Date().toISOString();
        localStorage.setItem(key, JSON.stringify({ score: stats.score, date: now, correct: stats.correct, wrong: stats.wrong }));
        showInlineToast(`নতুন সর্বোচ্চ স্কোর: ${stats.score} 🎉`);
      }
    } catch (err) {
      console.warn('Could not save high score', err);
    }
  }

  // Public API for script.js to initialize
  window.BFQuizEngine = {
    init: function (options = {}) {
      // Accept optional override params (not necessary)
      if (!Array.isArray(QUESTIONS) || QUESTIONS.length === 0) {
        questionEl.textContent = 'কোন প্রশ্ন পাওয়া যায়নি — questions.js ঠিকভাবে লোড হয়েছে কি দেখুন।';
        return;
      }
      // prepare pool: clone and shuffle questions for fresh game
      pool = shuffle(QUESTIONS.map(q => Object.assign({}, q))).map(clampOptions);
      currentIndex = 0;
      stats = { correct: 0, wrong: 0, score: 0 };
      renderStats();
      showQuestion();

      // attach buttons
      nextBtn.addEventListener('click', goNext);
      restartBtn.addEventListener('click', restart);

      // show restart button at end only; already hidden by CSS/HTML
    }
  };

})();
