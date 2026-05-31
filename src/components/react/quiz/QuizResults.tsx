'use client';

import { useMemo, useState, useEffect } from 'react';
import { useQuizStore } from '@/lib/stores/quiz';
import { getAllFoods } from '@/lib/data/loaders';
import { scrollTo as lenisScrollTo } from '@/lib/animations/scroll-smoother';
import './QuizResults.css';


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

  const [reviewOpen, setReviewOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('kulineria-quiz-scroll') !== null;
    }
    return false;
  });

  useEffect(() => {
    const savedScroll = sessionStorage.getItem('kulineria-quiz-scroll');
    if (savedScroll) {
      sessionStorage.removeItem('kulineria-quiz-scroll');
      const targetY = parseInt(savedScroll, 10);
      
      const timer = setTimeout(() => {
        window.scrollTo({
          top: targetY,
          behavior: 'instant' as any
        });
        lenisScrollTo(targetY, { immediate: true });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

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
      {/* Ambient motifs: Elegant Mega Mendung and Clouds */}
      <img src="/img/motif/png ornamen nusantara.png" className="results-motif results-motif-ornamen" aria-hidden="true" alt="" draggable={false} />
      <img src="/img/motif/png batik mega mendung.png" className="results-motif results-motif-megamendung-tl" aria-hidden="true" alt="" draggable={false} />
      <img src="/img/motif/png batik mega mendung.png" className="results-motif results-motif-megamendung-br" aria-hidden="true" alt="" draggable={false} />
      <img src="/img/motif/png awan.png" className="results-motif results-motif-awan-left" aria-hidden="true" alt="" draggable={false} />
      <img src="/img/motif/png awan.png" className="results-motif results-motif-awan-right" aria-hidden="true" alt="" draggable={false} />

      <div className="results-card">
        {/* ── Compact header: mascot centered above text ── */}
        <div className="results-header">
          <img
            src="/img/nara/NARA 5.png"
            alt="Nara merayakan"
            className="results-nara-img"
            width="250"
            height="250"
            draggable={false}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
          <div className="results-header-text">
            <h2>Hasil Kuis</h2>
            <p className="results-message">Ini menunjukkan seberapa jauh Anda mengenal kuliner Nusantara</p>
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
            <span className="stat-value">{maxStreak}</span>
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
              <span>{wrongAnswers.length} jawaban salah</span>
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
                        onClick={() => {
                          sessionStorage.setItem('kulineria-return', '/kuis');
                          sessionStorage.setItem('kulineria-quiz-scroll', window.scrollY.toString());
                        }}
                      >
                        Pelajari
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
            Main Lagi
          </button>
          <button className="btn-secondary" onClick={() => window.history.back()}>
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
