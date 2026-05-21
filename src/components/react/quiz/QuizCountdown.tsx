'use client';

import { useQuizStore } from '@/lib/stores/quiz';
import './QuizCountdown.css';

export default function QuizCountdown() {
  const countdownValue = useQuizStore((s) => s.countdownValue);

  return (
    <div className="countdown-wrapper">
      <div className="countdown-nara">
        <span role="img" aria-label="Nara" className="countdown-nara-icon">
          {countdownValue > 0 ? '🧑‍🍳' : '🔥'}
        </span>
      </div>
      <div className="countdown-number" key={countdownValue}>
        {countdownValue > 0 ? countdownValue : 'GO!'}
      </div>
      <p className="countdown-text">
        {countdownValue > 0 ? 'Siapkan dirimu...' : 'Mulai!'}
      </p>
    </div>
  );
}
