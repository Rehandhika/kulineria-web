'use client';

import { useQuizStore } from '@/lib/stores/quiz';
import type { QuizMode } from '@/types/quiz';

const MODES: { id: QuizMode; title: string; description: string; icon: string; time: string; questions: number }[] = [
  { id: 'tebak-gambar', title: 'Tebak Gambar', description: 'Identify the dish from its image', icon: '🍽️', time: '15s', questions: 10 },
  { id: 'tebak-region', title: 'Tebak Region', description: 'Guess which region a dish is from', icon: '🗺️', time: '10s', questions: 10 },
  { id: 'tebak-bahan', title: 'Tebak Bahan', description: 'Guess the key ingredient', icon: '🥘', time: '12s', questions: 10 },
  { id: 'taste-match', title: 'Taste Match', description: 'Match the primary taste profile', icon: '👅', time: '15s', questions: 10 },
  { id: 'speed-round', title: 'Speed Round', description: 'Rapid fire, all types mixed', icon: '⚡', time: '5s', questions: 10 },
];

export default function QuizMenu() {
  const startQuiz = useQuizStore((s) => s.startQuiz);
  const stats = useQuizStore((s) => s.stats);

  return (
    <div className="quiz-menu">
      <div className="quiz-header">
        <h1>Test Your Culinary IQ</h1>
        <p>How well do you know Indonesian cuisine?</p>
      </div>

      <div className="quiz-stats">
        <div className="stat-card">
          <span className="stat-value">{stats.highScore}</span>
          <span className="stat-label">High Score</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.totalGamesPlayed}</span>
          <span className="stat-label">Games Played</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.bestStreak}</span>
          <span className="stat-label">Best Streak</span>
        </div>
      </div>

      <div className="quiz-modes">
        {MODES.map((mode) => (
          <button
            key={mode.id}
            className={`mode-card ${mode.id === 'tebak-gambar' ? 'available' : 'coming-soon'}`}
            onClick={() => mode.id === 'tebak-gambar' && startQuiz(mode.id)}
            disabled={mode.id !== 'tebak-gambar'}
          >
            <span className="mode-icon">{mode.icon}</span>
            <div className="mode-info">
              <h3>{mode.title}</h3>
              <p>{mode.description}</p>
              <div className="mode-meta">
                <span>{mode.questions} questions</span>
                <span>{mode.time} per question</span>
              </div>
            </div>
            {mode.id !== 'tebak-gambar' && <span className="coming-soon-badge">Coming Soon</span>}
          </button>
        ))}
      </div>
    </div>
  );
}