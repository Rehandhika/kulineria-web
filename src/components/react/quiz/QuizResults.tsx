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

interface ModeBreakdown {
  tebakMakanan: { total: number; correct: number };
  tebakAsal: { total: number; correct: number };
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
  const stats = useQuizStore((s) => s.stats);
  const resetQuiz = useQuizStore((s) => s.resetQuiz);
  const mode = useQuizStore((s) => s.mode);

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const totalQuestions = answers.length;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const breakdown: ModeBreakdown = useMemo(() => {
    const b: ModeBreakdown = { tebakMakanan: { total: 0, correct: 0 }, tebakAsal: { total: 0, correct: 0 } };
    answers.forEach((a, i) => {
      const q = questions[i];
      if (!q) return;
      const isAsal = 'description' in q && q.description !== undefined;
      if (isAsal) { b.tebakAsal.total++; if (a.isCorrect) b.tebakAsal.correct++; }
      else { b.tebakMakanan.total++; if (a.isCorrect) b.tebakMakanan.correct++; }
    });
    return b;
  }, [answers, questions]);

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

  const modes = [
    { key: 'tebakMakanan' as const, label: 'Tebak Makanan', icon: '🍽️' },
    { key: 'tebakAsal' as const, label: 'Tebak Asal', icon: '🗺️' },
  ];

  return (
    <div className="quiz-results">
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
        <div className="result-stat">
          <span className="result-value">🏆 {stats.highScore}</span>
          <span className="result-label">High Score</span>
        </div>
      </div>

      {modes.some(m => breakdown[m.key].total > 0) && (
        <div className="results-breakdown">
          <h3>Performa per Mode</h3>
          {modes.map(m => {
            const data = breakdown[m.key];
            if (data.total === 0) return null;
            const pct = data.total > 0 ? (data.correct / data.total) * 100 : 0;
            return (
              <div key={m.key} className="breakdown-row">
                <span className="breakdown-label">{m.icon} {m.label}</span>
                <div className="breakdown-bar">
                  <div className="breakdown-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="breakdown-value">{data.correct}/{data.total}</span>
              </div>
            );
          })}
        </div>
      )}

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
