'use client';

import { useEffect } from 'react';
import { useQuizStore, cleanupQuizTimer } from '@/lib/stores/quiz';
import QuizMenu from './QuizMenu';
import QuizCountdown from './QuizCountdown';
import QuizGame from './QuizGame';
import QuizResults from './QuizResults';
import './QuizMenu.css'; // Shared layouts, hero styles, and immersive gameplay backgrounds

export default function QuizProvider() {
  const status = useQuizStore((s) => s.status);

  useEffect(() => {
    const el = document.getElementById('quiz-footer');
    if (!el) return;
    if (status === 'idle') {
      el.style.display = '';
    } else {
      el.style.display = 'none';
    }
  }, [status]);

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
