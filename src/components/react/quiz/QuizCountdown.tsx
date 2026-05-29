'use client';

import { useQuizStore } from '@/lib/stores/quiz';
import './QuizCountdown.css';

export default function QuizCountdown() {
  const countdownValue = useQuizStore((s) => s.countdownValue);

  return (
    <div className="countdown-wrapper">
      <div className="countdown-nara">
        <img
          src={countdownValue > 0 ? '/img/nara/NARA 3.png' : '/img/nara/NARA 2.png'}
          alt={countdownValue > 0 ? 'Nara berpikir' : 'Nara semangat'}
          className="countdown-nara-img"
          width="100"
          height="100"
          draggable={false}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
      </div>
      <div className="countdown-number" key={countdownValue}>
        {countdownValue > 0 ? countdownValue : 'Mulai!'}
      </div>
      <p className="countdown-text">
        {countdownValue > 0 ? 'Siapkan dirimu...' : 'Ayo tunjukkan kemampuanmu!'}
      </p>
    </div>
  );
}
