'use client';

import { useQuizStore } from '@/lib/stores/quiz';
import type { QuizOption, Question } from '@/types/quiz';

interface OptionButtonProps {
  option: QuizOption;
  question: Question;
}

export default function OptionButton({ option, question }: OptionButtonProps) {
  const answerQuestion = useQuizStore((s) => s.answerQuestion);
  const status = useQuizStore((s) => s.status);
  const selectedOptionId = useQuizStore((s) => s.selectedOptionId);

  const isCorrect = option.id === question.correctAnswer;
  const isSelected = selectedOptionId === option.id;
  const showResult = status === 'reviewing';

  function handleClick() {
    if (status !== 'playing' || selectedOptionId) return;
    answerQuestion(option.id);
  }

  return (
    <button
      className={`option-button ${showResult ? (isCorrect ? 'correct' : isSelected ? 'wrong' : 'dimmed') : ''} ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      disabled={status !== 'playing' || selectedOptionId !== null}
    >
      <span className="option-label">{option.label}</span>
      {option.sublabel && (
        <span className="option-sublabel">{option.sublabel}</span>
      )}
      {showResult && isCorrect && <span className="option-icon">✓</span>}
      {showResult && isSelected && !isCorrect && <span className="option-icon">✗</span>}
    </button>
  );
}
