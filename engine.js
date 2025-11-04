// engine.js
class QuizEngine {
  constructor(questions) {
    this.questions = questions;
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.correctAnswers = 0;
    this.wrongAnswers = 0;
    this.gameCompleted = false;
  }

  getCurrentQuestion() {
    if (this.currentQuestionIndex < this.questions.length) {
      return this.questions[this.currentQuestionIndex];
    }
    return null;
  }

  checkAnswer(selectedIndex) {
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) return false;

    const isCorrect = selectedIndex === currentQuestion.correct;
    
    if (isCorrect) {
      this.correctAnswers++;
      this.score += 10; // প্রতিটি সঠিক উত্তরের জন্য 10 পয়েন্ট
    } else {
      this.wrongAnswers++;
      this.score = Math.max(0, this.score - 5); // ভুল উত্তরে 5 পয়েন্ট কাটা, কিন্তু নেগেটিভ যাবে না
    }

    return isCorrect;
  }

  moveToNextQuestion() {
    this.currentQuestionIndex++;
    if (this.currentQuestionIndex >= this.questions.length) {
      this.gameCompleted = true;
    }
    return !this.gameCompleted;
  }

  restartGame() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.correctAnswers = 0;
    this.wrongAnswers = 0;
    this.gameCompleted = false;
  }

  getProgress() {
    return {
      current: this.currentQuestionIndex + 1,
      total: this.questions.length
    };
  }

  getStats() {
    return {
      score: this.score,
      correct: this.correctAnswers,
      wrong: this.wrongAnswers
    };
  }

  isGameCompleted() {
    return this.gameCompleted;
  }
}
