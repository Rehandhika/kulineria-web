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

  // Handle smart state preservation on mount and unmount
  useEffect(() => {
    const isSelamiReturn = sessionStorage.getItem('kulineria-return') === '/kuis';
    const isReload = typeof window !== 'undefined' &&
      (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming)?.type === 'reload';

    if (isSelamiReturn || isReload) {
      // Clear the return flag so subsequent navbar visits are fresh
      sessionStorage.removeItem('kulineria-return');
      
      // Safety net: if the restored status is not 'finished', reset it since gameplay timers cannot be resumed on refresh
      const currentStatus = useQuizStore.getState().status;
      if (currentStatus !== 'finished') {
        useQuizStore.getState().resetQuiz();
      }
    } else {
      // Fresh visit, reset the quiz state
      useQuizStore.getState().resetQuiz();
    }

    return () => {
      cleanupQuizTimer();
      // On unmount, only reset if we are NOT navigating to a food page via Selami
      const isSelami = sessionStorage.getItem('kulineria-return') === '/kuis';
      if (!isSelami) {
        useQuizStore.getState().resetQuiz();
      }
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
