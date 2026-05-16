'use client';

import './QuizProvider.css';
import { useQuizStore } from '@/lib/stores/quiz';
import QuizMenu from './QuizMenu';
import QuizGame from './QuizGame';
import QuizResults from './QuizResults';

export default function QuizProvider() {
  const status = useQuizStore((s) => s.status);

  if (status === 'idle') return <QuizMenu />;
  if (status === 'countdown') return <QuizMenu />;
  if (status === 'playing' || status === 'reviewing') return <QuizGame />;
  if (status === 'finished') return <QuizResults />;
  return <QuizMenu />;
}