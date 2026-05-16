'use client';

import { useQuizStore } from '@/lib/stores/quiz';

export default function FeedbackOverlay() {
  const answers = useQuizStore((s) => s.answers);
  const lastAnswer = answers[answers.length - 1];

  if (!lastAnswer) return null;

  return (
    <div className={`feedback-overlay ${lastAnswer.isCorrect ? 'correct' : 'wrong'}`}>
      <span className="feedback-icon">{lastAnswer.isCorrect ? '✓' : '✗'}</span>
      <span className="feedback-text">
        {lastAnswer.isCorrect ? 'Benar!' : 'Salah!'}
      </span>
      {lastAnswer.isCorrect && (
        <span className="feedback-points">+{lastAnswer.pointsEarned}</span>
      )}
    </div>
  );
}