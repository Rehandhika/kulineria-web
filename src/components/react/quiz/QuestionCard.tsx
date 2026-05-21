'use client';

import type { Question } from '@/types/quiz';
import OptionButton from './OptionButton';

interface QuestionCardProps {
  question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const isTebakAsal = question.mode === 'tebak-asal';

  return (
    <div className="question-card">
      {isTebakAsal ? (
        <div className="question-text-content">
          <h2 className="question-food-name">{question.media}</h2>
          {question.description && (
            <p className="question-description">&ldquo;{question.description}&rdquo;</p>
          )}
        </div>
      ) : (
        <div className="question-image">
          <img src={question.media} alt={question.prompt} />
        </div>
      )}

      <h2 className="question-prompt">{question.prompt}</h2>

      <div className="question-options">
        {question.options.map((option) => (
          <OptionButton key={option.id} option={option} question={question} />
        ))}
      </div>
    </div>
  );
}
