'use client';

import { useQuizStore } from '@/lib/stores/quiz';
import type { QuizMode } from '@/types/quiz';
import './QuizMenu.css';

const MODES: { id: QuizMode; title: string; description: string; icon: string; time: string }[] = [
  {
    id: 'tebak-makanan',
    title: 'Tebak Makanan',
    description: 'Cocokkan gambar dengan nama masakannya',
    icon: '🍽️',
    time: '15 detik/soal',
  },
  {
    id: 'tebak-asal',
    title: 'Tebak Asal',
    description: 'Tebak daerah asal masakan Nusantara',
    icon: '🗺️',
    time: '12 detik/soal',
  },
  {
    id: 'campuran',
    title: 'Campuran',
    description: 'Soal Tebak Makanan + Tebak Asal campur aduk',
    icon: '⚡',
    time: '15 detik/soal',
  },
];

export default function QuizMenu() {
  const startQuiz = useQuizStore((s) => s.startQuiz);
  const stats = useQuizStore((s) => s.stats);

  return (
    <div className="quiz-menu">
      <div className="quiz-header">
        <span className="quiz-header-icon">🧠</span>
        <h1>Uji Pengetahuan Kuliner</h1>
        <p>Seberapa kenal kamu dengan masakan Nusantara?</p>
      </div>

      <div className="quiz-stats">
        <div className="stat-card">
          <span className="stat-value">{stats.highScore}</span>
          <span className="stat-label">Skor Tertinggi</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.totalGamesPlayed}</span>
          <span className="stat-label">Dimainkan</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.bestStreak}</span>
          <span className="stat-label">Streak Terbaik</span>
        </div>
      </div>

      <div className="quiz-modes">
        {MODES.map((mode) => (
          <button
            key={mode.id}
            className="mode-card"
            onClick={() => startQuiz(mode.id)}
          >
            <span className="mode-icon">{mode.icon}</span>
            <div className="mode-info">
              <h3>{mode.title}</h3>
              <p>{mode.description}</p>
              <span className="mode-time">10 soal · {mode.time}</span>
            </div>
            <span className="mode-arrow">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
