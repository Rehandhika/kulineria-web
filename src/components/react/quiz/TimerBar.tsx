'use client';

import { useQuizStore } from '@/lib/stores/quiz';

export default function TimerBar() {
  const timeRemaining = useQuizStore((s) => s.timeRemaining);
  const currentQuestion = useQuizStore((s) => s.getCurrentQuestion());
  const timeLimit = currentQuestion?.timeLimit ?? 15;
  const percentage = (timeRemaining / timeLimit) * 100;

  const color = percentage > 60 ? 'var(--c-success)' : percentage > 30 ? 'var(--c-warning)' : 'var(--c-danger)';

  return (
    <div className="timer-bar">
      <div
        className="timer-fill"
        style={{ width: `${percentage}%`, backgroundColor: color, transition: 'width 1s linear, background-color 0.3s ease' }}
      />
      <span className="timer-text" aria-live="polite" aria-atomic="true">{timeRemaining}s</span>
    </div>
  );
}
