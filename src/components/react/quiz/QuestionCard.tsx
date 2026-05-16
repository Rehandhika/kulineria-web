'use client';

import type { Question } from '@/types/quiz';
import OptionButton from './OptionButton';

interface QuestionCardProps {
  question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  return (
    <div className="question-card">
      <div className="question-image">
        <img src={question.media} alt={question.prompt} />
      </div>
      <h2 className="question-prompt">{question.prompt}</h2>
      <div className="question-options">
        {question.options.map((option) => (
          <OptionButton key={option.id} option={option} correctId={question.correctAnswer as string} />
        ))}
      </div>
    </div>
  );
}