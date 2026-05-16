'use client';

import { useQuizStore } from '@/lib/stores/quiz';

export default function QuizResults() {
  const score = useQuizStore((s) => s.score);
  const maxStreak = useQuizStore((s) => s.maxStreak);
  const answers = useQuizStore((s) => s.answers);
  const stats = useQuizStore((s) => s.stats);
  const resetQuiz = useQuizStore((s) => s.resetQuiz);

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const totalQuestions = answers.length;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const getMessage = () => {
    if (percentage === 100) return 'Sempurna! Kamu ahli kuliner Indonesia!';
    if (percentage >= 80) return 'Hebat! Pengetahuan kuliner yang luar biasa!';
    if (percentage >= 60) return 'Bagus! Terus belajar ya!';
    if (percentage >= 40) return 'Lumayan! Coba lagi untuk meningkatkan skor!';
    return 'Jangan menyerah! Ayo coba lagi!';
  };

  return (
    <div className="quiz-results">
      <div className="results-header">
        <h2>Quiz Selesai!</h2>
        <p className="results-message">{getMessage()}</p>
      </div>

      <div className="results-score">
        <div className="score-circle">
          <span className="score-number">{percentage}%</span>
          <span className="score-label">Accuracy</span>
        </div>
      </div>

      <div className="results-stats">
        <div className="result-stat">
          <span className="result-value">{score}</span>
          <span className="result-label">Total Score</span>
        </div>
        <div className="result-stat">
          <span className="result-value">{correctCount}/{totalQuestions}</span>
          <span className="result-label">Correct</span>
        </div>
        <div className="result-stat">
          <span className="result-value">{maxStreak}</span>
          <span className="result-label">Max Streak</span>
        </div>
        <div className="result-stat">
          <span className="result-value">{stats.highScore}</span>
          <span className="result-label">High Score</span>
        </div>
      </div>

      <div className="results-actions">
        <button className="btn-primary" onClick={resetQuiz}>
          Main Lagi
        </button>
        <button className="btn-secondary" onClick={() => window.history.back()}>
          Kembali
        </button>
      </div>
    </div>
  );
}