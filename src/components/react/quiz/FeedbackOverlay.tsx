'use client';

import { useMemo } from 'react';
import { useQuizStore } from '@/lib/stores/quiz';
import { getAllFoods } from '@/lib/data/loaders';

function getCorrectLabel(questionId: string): string {
  const store = useQuizStore.getState();
  const question = store.questions.find((q) => q.id === questionId);
  if (!question) return '';
  const correctOption = question.options.find((o) => o.id === question.correctAnswer);
  return correctOption?.label ?? '';
}

export default function FeedbackOverlay() {
  const answers = useQuizStore((s) => s.answers);
  const streak = useQuizStore((s) => s.streak);
  const nextQuestion = useQuizStore((s) => s.nextQuestion);
  const questions = useQuizStore((s) => s.questions);
  const lastAnswer = answers[answers.length - 1];

  const foodLink = useMemo(() => {
    if (!lastAnswer || lastAnswer.isCorrect) return null;
    const q = questions.find((q) => q.id === lastAnswer.questionId);
    if (!q) return null;
    const isAsal = 'description' in q && q.description !== undefined;
    const allFoods = getAllFoods();
    if (isAsal) {
      const foodName = typeof q.media === 'string' ? q.media : '';
      const found = allFoods.find((f) => f.name === foodName);
      return found ? { id: found.id, name: found.name } : null;
    }
    const found = allFoods.find((f) => f.id === q.correctAnswer);
    return found ? { id: found.id, name: found.name } : null;
  }, [lastAnswer, questions]);

  if (!lastAnswer) return null;

  const correctLabel = getCorrectLabel(lastAnswer.questionId);

  return (
    <div className={`feedback-overlay ${lastAnswer.isCorrect ? 'correct' : 'wrong'}`}>
      <div className="feedback-content">
        <div className="feedback-icon-wrapper">
          <span className="feedback-icon">{lastAnswer.isCorrect ? '✓' : '✗'}</span>
        </div>
        <span className="feedback-text">
          {lastAnswer.isCorrect ? 'Benar!' : 'Salah!'}
        </span>
        {lastAnswer.isCorrect && (
          <span className="feedback-points">+{lastAnswer.pointsEarned} poin</span>
        )}
        {!lastAnswer.isCorrect && correctLabel && (
          <p className="feedback-answer">Jawaban: <strong>{correctLabel}</strong></p>
        )}
        {!lastAnswer.isCorrect && foodLink && (
          <a
            href={`/food/${foodLink.id}`}
            className="feedback-fact-link"
            target="_blank"
            rel="noopener"
          >
            Pelajari {foodLink.name}
          </a>
        )}
        {streak >= 3 && lastAnswer.isCorrect && (
          <span className="feedback-streak">🔥 Streak {streak}!</span>
        )}
      </div>
      <button className="feedback-continue" onClick={nextQuestion}>
        Lanjut →
      </button>
    </div>
  );
}
