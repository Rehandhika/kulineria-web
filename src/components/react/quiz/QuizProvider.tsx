'use client';

import { useEffect } from 'react';
import { useQuizStore, cleanupQuizTimer } from '@/lib/stores/quiz';
import QuizMenu from './QuizMenu';
import QuizCountdown from './QuizCountdown';
import QuizGame from './QuizGame';
import QuizResults from './QuizResults';
export default function QuizProvider() {
  const status = useQuizStore((s) => s.status);

  useEffect(() => {
    return () => cleanupQuizTimer();
  }, []);

  if (status === 'idle') return <QuizMenu />;
  if (status === 'countdown') return <QuizCountdown />;
  if (status === 'playing' || status === 'reviewing') return <QuizGame />;
  if (status === 'finished') return <QuizResults />;
  return <QuizMenu />;
}
