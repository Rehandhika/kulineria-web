'use client';

import { useEffect } from 'react';
import { useQuizStore, cleanupQuizTimer } from '@/lib/stores/quiz';
import QuizMenu from './QuizMenu';
import QuizCountdown from './QuizCountdown';
import QuizGame from './QuizGame';
import QuizResults from './QuizResults';
import './QuizMenu.css';

export default function QuizProvider() {
  const status = useQuizStore((s) => s.status);

  // Hide footer when not idle
  useEffect(() => {
    const el = document.getElementById('quiz-footer');
    if (!el) return;
    el.style.display = status === 'idle' ? '' : 'none';
  }, [status]);

  // Hide navbar during gameplay for maximum screen space
  useEffect(() => {
    const nav = document.querySelector('.top-nav') as HTMLElement | null;
    if (!nav) return;
    const isPlaying = status === 'countdown' || status === 'playing' || status === 'reviewing';
    nav.style.transform = isPlaying ? 'translateY(-100%)' : '';
    nav.style.transition = 'transform 0.3s ease';
    nav.style.pointerEvents = isPlaying ? 'none' : '';

    return () => {
      nav.style.transform = '';
      nav.style.transition = '';
      nav.style.pointerEvents = '';
    };
  }, [status]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupQuizTimer();
      useQuizStore.getState().resetQuiz();
    };
  }, []);

  if (status === 'idle') return <QuizMenu />;

  return (
    <div className="quiz-game-dark-bg">
      {status === 'countdown' && <QuizCountdown />}
      {(status === 'playing' || status === 'reviewing') && <QuizGame />}
      {status === 'finished' && <QuizResults />}
    </div>
  );
}
