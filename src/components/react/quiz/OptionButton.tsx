'use client';

import { useState } from 'react';
import { useQuizStore } from '@/lib/stores/quiz';
import type { QuizOption } from '@/types/quiz';

interface OptionButtonProps {
  option: QuizOption;
  correctId: string;
}

export default function OptionButton({ option, correctId }: OptionButtonProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const answerQuestion = useQuizStore((s) => s.answerQuestion);
  const status = useQuizStore((s) => s.status);

  const isCorrect = option.id === correctId;
  const isSelected = selected === option.id;
  const showResult = status === 'reviewing' && selected !== null;

  function handleClick() {
    if (status !== 'playing' || selected) return;
    setSelected(option.id);
    answerQuestion(option.id);
  }

  return (
    <button
      className={`option-button ${showResult ? (isCorrect ? 'correct' : isSelected ? 'wrong' : '') : ''} ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      disabled={status !== 'playing' || selected !== null}
    >
      <span className="option-label">{option.label}</span>
      {option.sublabel && <span className="option-sublabel">{option.sublabel}</span>}
      {showResult && isCorrect && <span className="option-icon">✓</span>}
      {showResult && isSelected && !isCorrect && <span className="option-icon">✗</span>}
    </button>
  );
}