'use client';

import type { Question } from '@/types/quiz';
import OptionButton from './OptionButton';

interface QuestionCardProps {
  question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const isTebakAsal = question.mode === 'tebak-asal';

  return (
    <div className="question-card" key={question.id}>
      {isTebakAsal ? (
        /* ── Tebak Asal: text-only hero ── */
        <div className="question-text-hero">
          <span className="question-emoji" aria-hidden="true">🍲</span>
          <h2 className="question-food-name">{question.media}</h2>
          {question.description && (
            <p className="question-description">&ldquo;{question.description}&rdquo;</p>
          )}
          <p className="question-prompt-text">{question.prompt}</p>
        </div>
      ) : (
        /* ── Tebak Makanan: image with prompt overlay ── */
        <div className="question-image-hero">
          <img src={question.media} alt={question.prompt} loading="eager" />
          <div className="question-image-overlay">
            <p className="question-prompt-overlay">{question.prompt}</p>
          </div>
        </div>
      )}

      <div className="question-options">
        {question.options.map((option, index) => (
          <OptionButton key={option.id} option={option} question={question} index={index} />
        ))}
      </div>
    </div>
  );
}
