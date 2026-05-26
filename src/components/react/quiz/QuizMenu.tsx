'use client';

import { useQuizStore } from '@/lib/stores/quiz';
import type { QuizMode } from '@/types/quiz';
import './QuizMenu.css';

const MODES: { id: QuizMode; title: string; description: string; icon: string; time: string; modeClass: string }[] = [
  {
    id: 'tebak-makanan',
    title: 'Tebak Makanan',
    description: 'Cocokkan gambar dengan nama masakannya',
    icon: '🍽️',
    time: '15 detik/soal',
    modeClass: 'mode-tebak-makanan',
  },
  {
    id: 'tebak-asal',
    title: 'Tebak Asal',
    description: 'Tebak daerah asal masakan Nusantara',
    icon: '🗺️',
    time: '12 detik/soal',
    modeClass: 'mode-tebak-asal',
  },
];

export default function QuizMenu() {
  const startQuiz = useQuizStore((s) => s.startQuiz);

  return (
    <div className="quiz-menu">
      <div className="quiz-hero">
        <div className="quiz-hero-decor">
          <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="quiz-hero-svg">
            <circle cx="100" cy="40" r="36" fill="var(--c-brand-caramel)" opacity="0.12" />
            <circle cx="60" cy="80" r="28" fill="var(--c-brand-sage)" opacity="0.1" />
            <circle cx="140" cy="80" r="28" fill="var(--c-brand-dusty-rose)" opacity="0.1" />
            <path d="M100 10 L110 30 L130 32 L115 48 L118 68 L100 58 L82 68 L85 48 L70 32 L90 30 Z" fill="var(--c-accent)" opacity="0.08" />
          </svg>
        </div>
        <span className="quiz-hero-icon">🧠</span>
        <h1 className="quiz-hero-title">Uji Pengetahuan Kuliner</h1>
        <p className="quiz-hero-sub">Seberapa kenal kamu dengan masakan Nusantara?</p>
      </div>

      <div className="quiz-modes">
        {MODES.map((mode) => (
          <button
            key={mode.id}
            className={`mode-card ${mode.modeClass}`}
            onClick={() => startQuiz(mode.id)}
          >
            <span className="mode-icon">{mode.icon}</span>
            <div className="mode-info">
              <h3>{mode.title}</h3>
              <p>{mode.description}</p>
              <span className="mode-badge">10 soal &middot; {mode.time}</span>
            </div>
            <span className="mode-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
