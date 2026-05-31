'use client';

import { useEffect, useCallback } from 'react';
import './QuizGame.css';
import { useQuizStore } from '@/lib/stores/quiz';
import QuestionCard from './QuestionCard';

export default function QuizGame() {
  const status = useQuizStore((s) => s.status);
  const currentQuestion = useQuizStore((s) => s.getCurrentQuestion());
  const score = useQuizStore((s) => s.score);
  const streak = useQuizStore((s) => s.streak);
  const currentIndex = useQuizStore((s) => s.currentIndex);
  const questions = useQuizStore((s) => s.questions);
  const answers = useQuizStore((s) => s.answers);
  const timeRemaining = useQuizStore((s) => s.timeRemaining);
  const lastAnswerCorrect = useQuizStore((s) => s.lastAnswerCorrect);
  const selectedOptionId = useQuizStore((s) => s.selectedOptionId);
  const answerQuestion = useQuizStore((s) => s.answerQuestion);
  const nextQuestion = useQuizStore((s) => s.nextQuestion);

  const timeLimit = currentQuestion?.timeLimit ?? 15;
  const timerPercent = (timeRemaining / timeLimit) * 100;
  const timerUrgent = timerPercent <= 30;

  // Keyboard shortcuts: A-D or 1-4 for options, Enter/Space for next
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!currentQuestion) return;

    if (status === 'playing' && !selectedOptionId) {
      // Check for letters A-D (case-insensitive)
      const letter = e.key.toUpperCase();
      if (letter >= 'A' && letter <= String.fromCharCode(64 + currentQuestion.options.length)) {
        const index = letter.charCodeAt(0) - 65;
        e.preventDefault();
        answerQuestion(currentQuestion.options[index].id);
        return;
      }

      // Alternative fallback: check for numbers 1-4
      const keyNum = parseInt(e.key);
      if (keyNum >= 1 && keyNum <= currentQuestion.options.length) {
        e.preventDefault();
        answerQuestion(currentQuestion.options[keyNum - 1].id);
      }
    }

    if (status === 'reviewing' && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      nextQuestion();
    }
  }, [status, currentQuestion, selectedOptionId, answerQuestion, nextQuestion]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!currentQuestion) return null;

  const totalQuestions = questions.length;
  const questionNumber = currentIndex + 1;

  // Build progress dots from answers
  const dots = questions.map((_, i) => {
    if (i < answers.length) {
      return answers[i].isCorrect ? 'correct' : 'wrong';
    }
    if (i === currentIndex) return 'current';
    return 'pending';
  });

  // Dynamic Nara Mascot Avatar for the compact bar
  const getNaraAvatar = () => {
    if (status === 'reviewing') {
      return lastAnswerCorrect ? '/img/nara/NARA 8.png' : '/img/nara/NARA 4.png';
    }
    return '/img/nara/NARA 3.png'; // thinking while playing
  };

  const getNaraAlt = () => {
    if (status === 'reviewing') {
      return lastAnswerCorrect ? 'Nara gembira' : 'Nara menyemangati';
    }
    return 'Nara menemani berpikir';
  };

  return (
    <div className="quiz-game">
      {/* Ambient motifs */}
      <img src="/img/motif/png ornamen nusantara.png" className="game-motif game-motif-ornamen" aria-hidden="true" alt="" draggable={false} />
      <img src="/img/motif/png bunga.png" className="game-motif game-motif-bunga-bl" aria-hidden="true" alt="" draggable={false} />
      <img src="/img/motif/png bunga.png" className="game-motif game-motif-bunga-tr" aria-hidden="true" alt="" draggable={false} />

      {/* ── Compact Header Bar ── */}
      <div className="quiz-compact-bar">
        <div className="bar-left">
          <div className="bar-nara-avatar-wrapper">
            <img
              src={getNaraAvatar()}
              alt={getNaraAlt()}
              className={`bar-nara-avatar ${status === 'reviewing' ? (lastAnswerCorrect ? 'bounce' : 'sad') : 'thinking'}`}
              width="28"
              height="28"
              draggable={false}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <span className="bar-question-num">Soal {questionNumber}/{totalQuestions}</span>
          <div className="bar-dots">
            {dots.map((dot, i) => (
              <span key={i} className={`dot dot-${dot}`} />
            ))}
          </div>
        </div>
        <div className="bar-right">
          <span className="bar-score">{score}</span>
          {streak >= 3 && <span className="bar-streak">{streak}</span>}
        </div>
      </div>

      {/* ── Timer Bar ── */}
      <div className={`timer-bar ${timerUrgent ? 'urgent' : ''} ${status === 'reviewing' ? (lastAnswerCorrect ? 'result-correct' : 'result-wrong') : ''}`}>
        <div
          className="timer-fill"
          style={{ width: status === 'reviewing' ? '100%' : `${timerPercent}%` }}
        />
        {status === 'playing' && (
          <span className="timer-text">{timeRemaining}s</span>
        )}
        {status === 'reviewing' && lastAnswerCorrect && (
          <span className="timer-text timer-points">+{answers[answers.length - 1]?.pointsEarned ?? 0}</span>
        )}
        {status === 'reviewing' && lastAnswerCorrect === false && selectedOptionId && (
          <span className="timer-text timer-wrong-label">Belum tepat</span>
        )}
        {status === 'reviewing' && lastAnswerCorrect === false && !selectedOptionId && (
          <span className="timer-text timer-wrong-label">Waktu habis</span>
        )}
      </div>

      {/* ── Question Card ── */}
      <QuestionCard question={currentQuestion} />

      {/* ── Inline Advance Button (wrong/timeout only) ── */}
      {status === 'reviewing' && !lastAnswerCorrect && (
        <button className="inline-advance-btn" onClick={nextQuestion}>
          Lanjut
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      )}
    </div>
  );
}
