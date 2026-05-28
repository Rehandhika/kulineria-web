'use client';

import { useQuizStore } from '@/lib/stores/quiz';
import type { QuizMode } from '@/types/quiz';
import './QuizMenu.css';

const MODES: { id: QuizMode; title: string; description: string; time: string; level: number }[] = [
  {
    id: 'tebak-makanan',
    title: 'Tebak Makanan',
    description: 'Cocokkan gambar dengan nama masakannya',
    time: '15 detik/soal',
    level: 1,
  },
  {
    id: 'tebak-asal',
    title: 'Tebak Asal',
    description: 'Tebak daerah asal masakan Nusantara',
    time: '12 detik/soal',
    level: 2,
  },
];

export default function QuizMenu() {
  const startQuiz = useQuizStore((s) => s.startQuiz);

  return (
    <div className="quiz-menu">
      <div className="quiz-hero">
        <h1 className="quiz-hero-title">
          Peta <span>Penjelajahan</span>
        </h1>
        <p className="quiz-hero-sub">
          Ikuti jejak rempah dan uji ingatanmu di setiap pemberhentian.
        </p>
      </div>

      <div className="quiz-journey-map">
        <div className="journey-svg-wrapper">
          
          {/* Garis Penghubung Horizontal (Desktop/Tablet) */}
          <svg className="journey-path-svg path-horizontal" viewBox="0 0 700 400" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="svg-glow-h">
                <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="rgba(196, 154, 110, 0.6)"/>
              </filter>
              <mask id="mask-h-1">
                <path d="M 133 150 C 250 150, 200 250, 317 250" fill="none" stroke="#ffffff" strokeWidth="12" pathLength="1" className="anim-mask-1" />
              </mask>
              <mask id="mask-h-2">
                <path d="M 383 250 C 500 250, 450 150, 567 150" fill="none" stroke="#ffffff" strokeWidth="12" pathLength="1" className="anim-mask-2" />
              </mask>
            </defs>
            <g fill="rgba(43, 29, 20, 0.9)" stroke="var(--c-brand-gold)" strokeWidth="4" filter="url(#svg-glow-h)">
              <circle cx="100" cy="150" r="33" pathLength="1" className="anim-circle-1" />
              <path d="M 133 150 C 250 150, 200 250, 317 250" fill="none" strokeDasharray="10 8" mask="url(#mask-h-1)" />
              <circle cx="350" cy="250" r="33" pathLength="1" className="anim-circle-2" />
              <path d="M 383 250 C 500 250, 450 150, 567 150" fill="none" strokeDasharray="10 8" mask="url(#mask-h-2)" />
              <circle cx="600" cy="150" r="33" pathLength="1" className="anim-circle-3" />
            </g>
          </svg>

          {/* Garis Penghubung Vertikal (Mobile) */}
          <svg className="journey-path-svg path-vertical" viewBox="0 0 400 700" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="svg-glow-v">
                <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="rgba(196, 154, 110, 0.6)"/>
              </filter>
              <mask id="mask-v-1">
                <path d="M 150 133 C 150 250, 250 200, 250 317" fill="none" stroke="#ffffff" strokeWidth="12" pathLength="1" className="anim-mask-1" />
              </mask>
              <mask id="mask-v-2">
                <path d="M 250 383 C 250 500, 150 450, 150 567" fill="none" stroke="#ffffff" strokeWidth="12" pathLength="1" className="anim-mask-2" />
              </mask>
            </defs>
            <g fill="rgba(43, 29, 20, 0.9)" stroke="var(--c-brand-gold)" strokeWidth="4" filter="url(#svg-glow-v)">
              <circle cx="150" cy="100" r="33" pathLength="1" transform="rotate(90 150 100)" className="anim-circle-1" />
              <path d="M 150 133 C 150 250, 250 200, 250 317" fill="none" strokeDasharray="10 8" mask="url(#mask-v-1)" />
              <circle cx="250" cy="350" r="33" pathLength="1" transform="rotate(90 250 350)" className="anim-circle-2" />
              <path d="M 250 383 C 250 500, 150 450, 150 567" fill="none" strokeDasharray="10 8" mask="url(#mask-v-2)" />
              <circle cx="150" cy="600" r="33" pathLength="1" transform="rotate(90 150 600)" className="anim-circle-3" />
            </g>
          </svg>

          {/* Layer Interaktif Level */}
          <div className="journey-nodes-layer">
            {MODES.map((mode) => (
              <div key={mode.id} className={`journey-node-wrapper level-${mode.level} pop-in`}>
                <div className="journey-node-label">
                  <span className="level-number">Level {mode.level}</span>
                  <span className="level-title">{mode.title}</span>
                </div>
                <button
                  className="journey-node"
                  onClick={() => startQuiz(mode.id)}
                >
                  <div className="node-glow"></div>
                  <span className="node-icon-number">{mode.level}</span>
                </button>
                <div className={`journey-tooltip tooltip-${mode.level}`}>
                  <p>{mode.description}</p>
                  <span className="mode-badge">10 soal &middot; {mode.time}</span>
                </div>
              </div>
            ))}
            
            {/* Node Rahasia / Coming Soon */}
            <div className="journey-node-wrapper level-locked pop-in">
              <div className="journey-node-label">
                <span className="level-number">Misteri</span>
                <span className="level-title">Segera Hadir</span>
              </div>
              <button className="journey-node locked" disabled>
                <span className="node-icon-number">🔒</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
