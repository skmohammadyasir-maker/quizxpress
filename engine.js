/* Simple GameEngine class: handles question flow, scoring, lifelines, timer, persistence */
class GameEngine {
  constructor({questions, total=40, timePerQ=15, coinsPerCorrect=5, skipPenalty=0}){
    this.allQuestions = questions.slice();
    this.total = Math.min(total, questions.length);
    this.timePerQ = timePerQ;
    this.coinsPerCorrect = coinsPerCorrect;
    this.skipPenalty = skipPenalty;
    this.reset();
  }

  reset(){
    this.questions = shuffleArray(this.allQuestions).slice(0,this.total);
    this.index = 0;
    this.correct = 0;
    this.wrong = 0;
    this.score = 0;
    this.coins = 0;
    this.streak = 0;
    this.lifelines = {fifty:true,hint:true,skip:true};
    this.timer = this.timePerQ;
    this.running=false;
  }

  current(){
    return this.questions[this.index] || null;
  }

  startTimer(onTick,onExpire){
    this.stopTimer();
    this.timer = this.timePerQ;
    this.running = true;
    onTick?.(this.timer);
    this._interval = setInterval(()=>{
      this.timer--;
      onTick?.(this.timer);
      if(this.timer<=0){
        this.stopTimer();
        onExpire?.();
      }
    },1000);
  }

  stopTimer(){
    if(this._interval)clearInterval(this._interval);
    this._interval=null;this.running=false;
  }

  answer(optionIndex){
    const q = this.current();
    if(!q) return;
    const correct = (optionIndex === q.a);
    if(correct){
      this.correct++;
      this.streak++;
      const streakBonus = Math.floor(this.streak/3); // small bonus
      const gained = this.coinsPerCorrect + streakBonus;
      this.score += 10 + streakBonus*2;
      this.coins += gained;
    } else {
      this.wrong++;
      this.streak=0;
      this.score = Math.max(0,this.score-5);
    }
    this.index++;
    return {correct};
  }

  useFifty(){
    if(!this.lifelines.fifty) return null;
    this.lifelines.fifty=false;
    const q = this.current();
    if(!q) return null;
    const wrongOptions = q.options.map((o,i)=>i).filter(i=>i!==q.a);
    const removed = shuffleArray(wrongOptions).slice(0,Math.max(1,wrongOptions.length-1));
    return removed; // indices to hide
  }

  useHint(){
    if(!this.lifelines.hint) return null;
    this.lifelines.hint=false;
    const q = this.current();
    return q?.hint || null;
  }

  useSkip(){
    if(!this.lifelines.skip) return false;
    this.lifelines.skip=false;
    this.index++;
    this.score = Math.max(0,this.score - this.skipPenalty);
    return true;
  }

  isFinished(){
    return this.index>=this.total;
  }
}

/* small util shuffle */
function shuffleArray(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}
