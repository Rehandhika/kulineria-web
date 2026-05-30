'use client';

import { useEffect, useRef } from 'react';
import { useQuizStore } from '@/lib/stores/quiz';
import type { QuizMode } from '@/types/quiz';
import gsap from 'gsap';
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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Entrance animations for bg scale
      gsap.fromTo('.quiz-menu-hero-bg',
        { scale: 1.08, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out' }
      );

      // Entrance animations for motif
      gsap.fromTo('.quiz-menu-hero-motif img',
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out' }
      );

      // Entrance animations for Mascot Nara
      gsap.fromTo('.quiz-menu-nara-img',
        { opacity: 0, scale: 0.82, y: -15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.5)', delay: 0.1 }
      );

      // Entrance animations for Title and Subtitle
      gsap.fromTo('.quiz-menu-hero-title',
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.25 }
      );
      gsap.fromTo('.quiz-menu-hero-sub',
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out', delay: 0.35 }
      );

      // Entrance animations for nodes (stay in place and fade)
      gsap.fromTo('.journey-node-wrapper',
        { opacity: 0 },
        { opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power2.out', delay: 0.5 }
      );
      
      // Floating animations for motifs
      gsap.to('.motif-float', {
        y: -15,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: {
          each: 1,
          from: "random"
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="quiz-menu-container" ref={containerRef}>
      {/* ── HERO SECTION (Dark Gradient + Wave Divider) ── */}
      <section className="quiz-menu-hero">
        <div className="quiz-menu-hero-bg-wrapper" aria-hidden="true">
          <div className="quiz-menu-hero-bg"></div>
        </div>
        
        {/* Motif Ornamen Nusantara background overlay */}
        <div className="quiz-menu-hero-motif" aria-hidden="true">
          <img src="/img/motif/png ornamen nusantara.png" alt="" />
        </div>

        {/* Floating clouds within Hero */}
        <img src="/img/motif/png awan.png" className="quiz-motif motif-hero-left motif-float" aria-hidden="true" alt="" />
        <img src="/img/motif/png awan.png" className="quiz-motif motif-hero-right motif-float" aria-hidden="true" alt="" />

        {/* Seamless visual bottom organic wave divider filled with page background color */}
        <div className="hero-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,0 C240,60 480,0 720,40 C960,80 1200,10 1440,40 L1440,120 L0,120 Z"
              fill="var(--c-bg)" opacity="0.18"/>
            <path d="M0,20 C180,70 360,10 540,40 C720,70 900,10 1080,40 C1260,70 1380,30 1440,20 L1440,120 L0,120 Z"
              fill="var(--c-bg)" opacity="0.35"/>
            <path d="M0,40 C200,90 400,20 600,60 C800,100 1000,20 1200,60 C1320,80 1380,70 1440,60 L1440,120 L0,120 Z"
              fill="var(--c-bg)"/>
          </svg>
        </div>

        <div className="quiz-menu-hero-inner">
          <div className="quiz-menu-hero-body">
            {/* Mascot Nara Welcoming */}
            <div className="quiz-menu-nara" aria-hidden="true">
              <img
                src="/img/nara/NARA 3.png"
                alt="Nara menyambut"
                className="quiz-menu-nara-img"
                width="187"
                height="187"
                draggable={false}
                onError={(e) => { e.currentTarget.style.display='none'; }}
              />
            </div>

            <div className="quiz-menu-hero-content">
              <h1 className="quiz-menu-hero-title">
                Peta <span>Penjelajahan</span>
              </h1>
              <p className="quiz-menu-hero-sub">
                Uji seberapa jauh kamu mengenal kuliner Nusantara lewat kuis seru di setiap level.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAP SECTION (Parchment Background below wave) ── */}
      <section className="quiz-menu-map-section">
        {/* Floating batik/cloud motifs on parchment bg */}
        <img src="/img/motif/png batik mega mendung.png" className="quiz-motif motif-map-outside-left motif-float" aria-hidden="true" alt="" />
        <img src="/img/motif/png awan.png" className="quiz-motif motif-map-outside-right motif-float" aria-hidden="true" alt="" />

        <div className="quiz-journey-container">
          <div className="quiz-journey-map">
            <div className="journey-svg-wrapper">
              
              {/* Garis Penghubung Horizontal (Desktop/Tablet) */}
              <svg className="journey-path-svg path-horizontal" viewBox="0 0 700 400" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <filter id="svg-glow-h">
                    <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="rgba(179, 105, 53, 0.3)"/>
                  </filter>
                  <mask id="mask-h-1">
                    <path d="M 133 150 C 250 150, 200 250, 317 250" fill="none" stroke="#ffffff" strokeWidth="12" pathLength="1" className="anim-mask-h-1" />
                  </mask>
                  <mask id="mask-h-2">
                    <path d="M 383 250 C 500 250, 450 150, 567 150" fill="none" stroke="#ffffff" strokeWidth="12" pathLength="1" className="anim-mask-h-2" />
                  </mask>
                </defs>
                <g fill="rgba(43, 25, 14, 0.45)" stroke="rgba(194, 133, 88, 0.6)" strokeWidth="3" filter="url(#svg-glow-h)">
                  <circle cx="100" cy="150" r="33" pathLength="1" className="anim-circle-h-1" />
                  <path d="M 133 150 C 250 150, 200 250, 317 250" fill="none" strokeDasharray="10 8" mask="url(#mask-h-1)" />
                  <circle cx="350" cy="250" r="33" pathLength="1" className="anim-circle-h-2" />
                  <path d="M 383 250 C 500 250, 450 150, 567 150" fill="none" strokeDasharray="10 8" mask="url(#mask-h-2)" />
                  <circle cx="600" cy="150" r="33" pathLength="1" className="anim-circle-h-3" />
                </g>
              </svg>

              {/* Garis Penghubung Vertikal (Mobile) */}
              <svg className="journey-path-svg path-vertical" viewBox="0 0 400 700" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <filter id="svg-glow-v">
                    <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="rgba(179, 105, 53, 0.3)"/>
                  </filter>
                  <mask id="mask-v-1">
                    <path d="M 150 133 C 150 250, 250 200, 250 317" fill="none" stroke="#ffffff" strokeWidth="12" pathLength="1" className="anim-mask-v-1" />
                  </mask>
                  <mask id="mask-v-2">
                    <path d="M 250 383 C 250 500, 150 450, 150 567" fill="none" stroke="#ffffff" strokeWidth="12" pathLength="1" className="anim-mask-v-2" />
                  </mask>
                </defs>
                <g fill="rgba(43, 25, 14, 0.45)" stroke="rgba(194, 133, 88, 0.6)" strokeWidth="3" filter="url(#svg-glow-v)">
                  <circle cx="150" cy="100" r="33" pathLength="1" transform="rotate(90 150 100)" className="anim-circle-v-1" />
                  <path d="M 150 133 C 150 250, 250 200, 250 317" fill="none" strokeDasharray="10 8" mask="url(#mask-v-1)" />
                  <circle cx="250" cy="350" r="33" pathLength="1" transform="rotate(90 250 350)" className="anim-circle-v-2" />
                  <path d="M 250 383 C 250 500, 150 450, 150 567" fill="none" strokeDasharray="10 8" mask="url(#mask-v-2)" />
                  <circle cx="150" cy="600" r="33" pathLength="1" transform="rotate(90 150 600)" className="anim-circle-v-3" />
                </g>
              </svg>

              {/* Layer Interaktif Level */}
              <div className="journey-nodes-layer">
                {MODES.map((mode) => (
                  <div key={mode.id} className={`journey-node-wrapper level-${mode.level}`}>
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
                <div className="journey-node-wrapper level-locked">
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
      </section>
    </div>
  );
}
