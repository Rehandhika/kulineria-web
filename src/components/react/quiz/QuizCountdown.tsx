'use client';

import { useQuizStore } from '@/lib/stores/quiz';
import './QuizCountdown.css';

export default function QuizCountdown() {
  const countdownValue = useQuizStore((s) => s.countdownValue);

  return (
    <div className="countdown-wrapper">
      {}
      <img src="/img/motif/png ornamen nusantara.png" className="countdown-motif countdown-motif-ornamen" aria-hidden="true" alt="" draggable={false} />
      <img src="/img/motif/png bunga.png" className="countdown-motif countdown-motif-bunga-bl" aria-hidden="true" alt="" draggable={false} />
      <img src="/img/motif/png bunga.png" className="countdown-motif countdown-motif-bunga-tr" aria-hidden="true" alt="" draggable={false} />

      <div className="countdown-center">
        <div className="countdown-number" key={countdownValue}>
          {countdownValue > 0 ? countdownValue : 'Mulai!'}
        </div>
        <p className="countdown-text">
          {countdownValue > 0 ? 'Siapkan dirimu...' : 'Ayo tunjukkan kemampuanmu!'}
        </p>
      </div>
    </div>
  );
}
