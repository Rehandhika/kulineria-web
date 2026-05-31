'use client';

import { useMemo, useState } from 'react';
import { useQuizStore } from '@/lib/stores/quiz';
import { getAllFoods } from '@/lib/data/loaders';
import './QuizResults.css';

function getTitle(percentage: number): string {
  if (percentage === 100) return 'Ahli Mahakarya Rasa';
  if (percentage >= 80) return 'Penjelajah Rempah Nusantara';
  if (percentage >= 60) return 'Penikmat Tradisi Kuliner';
  if (percentage >= 40) return 'Pencicip Rasa Pemula';
  return 'Musafir Rasa Nusantara';
}

function getMessage(percentage: number): string {
  if (percentage === 100) return 'Pengetahuanmu seharum rempah pilihan, tak tertandingi dan sempurna.';
  if (percentage >= 80) return 'Luar biasa. Kau mengenali jejak warisan rasa dengan sangat mendalam.';
  if (percentage >= 60) return 'Cukup memukau. Perjalanan kulinermu telah membekas namun masih bisa dijelajahi.';
  if (percentage >= 40) return 'Langkah awal yang baik. Banyak misteri rasa yang masih menunggu untuk kau cicipi.';
  return 'Jangan berkecil hati. Setiap perjalanan besar selalu dimulai dari satu suapan pertama.';
}

function getNaraExpression(percentage: number): string {
  if (percentage === 100) return '/img/nara/NARA 5.png'; /* celebrate — wave */
  if (percentage >= 80)  return '/img/nara/NARA 2.png'; /* excited   */
  if (percentage >= 60)  return '/img/nara/NARA 1.png'; /* idle      */
  if (percentage >= 40)  return '/img/nara/NARA 3.png'; /* thinking  */
  return '/img/nara/NARA 4.png';                         /* sad       */
}

function getNaraAlt(percentage: number): string {
  if (percentage === 100) return 'Nara merayakan';
  if (percentage >= 80)  return 'Nara semangat';
  if (percentage >= 60)  return 'Nara senang';
  if (percentage >= 40)  return 'Nara berpikir';
  return 'Nara sedih';
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

  const [reviewOpen, setReviewOpen] = useState(false);

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
          yourAnswer: selectedOption?.label || '(kosong)',
        };
      })
      .filter((w): w is WrongAnswer => w !== null);
  }, [answers, questions]);

  return (
    <div className="quiz-results">
      {/* Ambient motifs */}
      <img src="/img/motif/png ornamen nusantara.png" className="results-motif results-motif-ornamen" aria-hidden="true" alt="" draggable={false} />
      <img src="/img/motif/png bunga.png" className="results-motif results-motif-bunga-bl" aria-hidden="true" alt="" draggable={false} />
      <img src="/img/motif/png bunga.png" className="results-motif results-motif-bunga-tr" aria-hidden="true" alt="" draggable={false} />

      {/* ── Compact header: mascot + title inline ── */}
      <div className="results-header">
        <img
          src={getNaraExpression(percentage)}
          alt={getNaraAlt(percentage)}
          className="results-nara-img"
          width="48"
          height="48"
          draggable={false}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="results-header-text">
          <h2>{getTitle(percentage)}</h2>
          <p className="results-message">{getMessage(percentage)}</p>
        </div>
      </div>

      {/* ── Stats row: 3 stats inline ── */}
      <div className="results-stats-row">
        <div className="stat-item">
          <span className="stat-value">{percentage}%</span>
          <span className="stat-label">Akurasi</span>
        </div>
        <div className="stat-divider" aria-hidden="true" />
        <div className="stat-item">
          <span className="stat-value">{score}</span>
          <span className="stat-label">Skor</span>
        </div>
        <div className="stat-divider" aria-hidden="true" />
        <div className="stat-item">
          <span className="stat-value">🔥{maxStreak}</span>
          <span className="stat-label">Streak</span>
        </div>
      </div>

      {/* ── Dot review bar ── */}
      <div className="dot-review" role="img" aria-label={`${correctCount} benar, ${wrongAnswers.length} salah dari ${totalQuestions} soal`}>
        {answers.map((a, i) => (
          <span
            key={i}
            className={`dot ${a.isCorrect ? 'correct' : 'wrong'}`}
            aria-hidden="true"
          />
        ))}
        {/* Fill unanswered dots if questions > answers */}
        {questions.length > answers.length &&
          Array.from({ length: questions.length - answers.length }).map((_, i) => (
            <span key={`u-${i}`} className="dot unanswered" aria-hidden="true" />
          ))
        }
      </div>

      {/* ── Collapsible wrong answers ── */}
      {wrongAnswers.length > 0 && (
        <div className="results-review">
          <button
            className="review-toggle"
            onClick={() => setReviewOpen((o) => !o)}
            aria-expanded={reviewOpen}
          >
            <span>{wrongAnswers.length} jawaban keliru</span>
            <svg
              className={`review-toggle-icon ${reviewOpen ? 'open' : ''}`}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className={`review-list ${reviewOpen ? 'review-list--open' : ''}`}>
            <div className="review-list-inner">
              {wrongAnswers.map((w) => (
                <div key={w.questionId} className="review-item">
                  <div className="review-info">
                    <span className="review-question">{w.foodName || 'Rahasia Rasa'}</span>
                    <span className="review-answer">
                      Seharusnya: <strong>{w.correctAnswer}</strong>
                    </span>
                    <span className="review-your">Tebakanmu: {w.yourAnswer}</span>
                  </div>
                  {w.foodId && (
                    <a
                      href={`/hidangan/${w.foodId}`}
                      className="review-link"
                      onClick={() => sessionStorage.setItem('kulineria-return', '/kuis')}
                    >
                      Selami
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Action buttons ── */}
      <div className="results-actions">
        <button className="btn-primary" onClick={resetQuiz}>
          Uji Kembali
        </button>
        <button className="btn-secondary" onClick={() => window.history.back()}>
          Kembali
        </button>
      </div>
    </div>
  );
}
