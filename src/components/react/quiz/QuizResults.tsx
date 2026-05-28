'use client';

import { useMemo } from 'react';
import { useQuizStore } from '@/lib/stores/quiz';
import { getAllFoods } from '@/lib/data/loaders';
import './QuizResults.css';

function getMessage(percentage: number): string {
  if (percentage === 100) return 'Sempurna! Kamu memang ahli kuliner Indonesia!';
  if (percentage >= 80) return 'Hebat! Pengetahuan kuliner yang luar biasa!';
  if (percentage >= 60) return 'Bagus! Terus belajar dan eksplorasi!';
  if (percentage >= 40) return 'Lumayan! Yuk coba lagi untuk naikkan skor!';
  return 'Jangan menyerah! Ayo coba lagi dan kenali lebih banyak masakan!';
}

function getEmoji(percentage: number): string {
  if (percentage === 100) return '🏆';
  if (percentage >= 80) return '🌟';
  if (percentage >= 60) return '👍';
  if (percentage >= 40) return '💪';
  return '📚';
}

interface WrongAnswer {
  questionId: string;
  foodId: string;
  foodName: string;
  correctAnswer: string;
  yourAnswer: string;
}

export default function QuizResults() {
  const score = useQuizStore((s) => s.score);
  const maxStreak = useQuizStore((s) => s.maxStreak);
  const answers = useQuizStore((s) => s.answers);
  const questions = useQuizStore((s) => s.questions);
  const resetQuiz = useQuizStore((s) => s.resetQuiz);

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const totalQuestions = answers.length;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const wrongAnswers: WrongAnswer[] = useMemo(() => {
    const allFoods = getAllFoods();
    return answers
      .map((a, i) => {
        const q = questions[i];
        if (!q || a.isCorrect) return null;
        const correctOption = q.options.find((o) => o.id === q.correctAnswer);
        const selectedOption = q.options.find((o) => o.id === a.selectedOption);
        const isAsal = 'description' in q && q.description !== undefined;

        let foodId = '';
        let foodName = '';
        if (isAsal) {
          const foodNameStr = typeof q.media === 'string' ? q.media : '';
          const found = allFoods.find((f) => f.name === foodNameStr);
          if (found) { foodId = found.id; foodName = found.name; }
        } else {
          const found = allFoods.find((f) => f.id === q.correctAnswer);
          if (found) { foodId = found.id; foodName = found.name; }
        }

        return {
          questionId: q.id,
          foodId,
          foodName,
          correctAnswer: correctOption?.label || '',
          yourAnswer: selectedOption?.label || '(tidak menjawab)',
        };
      })
      .filter((w): w is WrongAnswer => w !== null);
  }, [answers, questions]);

  return (    <div className="quiz-results">
      <div className="results-header">
        <span className="results-emoji">{getEmoji(percentage)}</span>
        <h2>Kuis Selesai!</h2>
        <p className="results-message">{getMessage(percentage)}</p>
      </div>

      <div className="results-score">
        <div className="score-circle" style={{
          background: `conic-gradient(var(--c-accent) ${percentage}%, var(--c-surface-2) ${percentage}%)`,
        }}>
          <div className="score-circle-inner">
            <span className="score-number">{percentage}%</span>
            <span className="score-label">Akurasi</span>
          </div>
        </div>
      </div>

      <div className="results-stats">
        <div className="result-stat">
          <span className="result-value">{score}</span>
          <span className="result-label">Total Skor</span>
        </div>
        <div className="result-stat">
          <span className="result-value">{correctCount}/{totalQuestions}</span>
          <span className="result-label">Benar</span>
        </div>
        <div className="result-stat">
          <span className="result-value">🔥 {maxStreak}</span>
          <span className="result-label">Streak</span>
        </div>
      </div>

      {wrongAnswers.length > 0 && (
        <div className="results-review">
          <h3>Pelajari Jawaban Salah</h3>
          <div className="review-list">
            {wrongAnswers.map((w) => (
              <div key={w.questionId} className="review-item">
                <div className="review-info">
                  <span className="review-question">{w.foodName || 'Makanan'}</span>
                  <span className="review-answer">
                    Jawaban: <strong>{w.correctAnswer}</strong>
                  </span>
                  <span className="review-your">Kamu: {w.yourAnswer}</span>
                </div>
                {w.foodId && (
                  <a
                    href={`/hidangan/${w.foodId}`}
                    className="review-link"
                    onClick={() => sessionStorage.setItem('kulineria-return', '/kuis')}
                  >
                    Pelajari
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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
