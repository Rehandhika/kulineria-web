'use client';

import { useQuizStore } from '@/lib/stores/quiz';
import type { QuizOption, Question } from '@/types/quiz';

interface OptionButtonProps {
  option: QuizOption;
  question: Question;
  index: number;
}

export default function OptionButton({ option, question, index }: OptionButtonProps) {
  const answerQuestion = useQuizStore((s) => s.answerQuestion);
  const status = useQuizStore((s) => s.status);
  const selectedOptionId = useQuizStore((s) => s.selectedOptionId);

  const isCorrect = option.id === question.correctAnswer ||
    (Array.isArray(question.correctAnswer) && question.correctAnswer.includes(option.id));
  const isSelected = selectedOptionId === option.id;
  const showResult = status === 'reviewing';

  let stateClass = '';
  if (showResult) {
    if (isCorrect) stateClass = 'correct';
    else if (isSelected) stateClass = 'wrong';
    else stateClass = 'dimmed';
  }
  if (isSelected && !showResult) stateClass = 'selected';

  function handleClick() {
    if (status !== 'playing' || selectedOptionId) return;
    answerQuestion(option.id);
  }

  const optionLetter = String.fromCharCode(65 + index);

  return (
    <button
      className={`option-button ${stateClass}`}
      onClick={handleClick}
      disabled={status !== 'playing' || selectedOptionId !== null}
      aria-label={`Opsi ${optionLetter}: ${option.label}`}
    >
      <span className="option-key" aria-hidden="true">{optionLetter}</span>
      <span className="option-content">
        <span className="option-label">{option.label}</span>
        {option.sublabel && (
          <span className="option-sublabel">{option.sublabel}</span>
        )}
      </span>
      {showResult && isCorrect && <span className="option-icon correct-icon">✓</span>}
      {showResult && isSelected && !isCorrect && <span className="option-icon wrong-icon">✗</span>}
    </button>
  );
}
