'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import type { Taste, FoodType } from '@/types/food';

interface Props {
  region: string;
  regionColor: string;
  type: FoodType;
  tastes: Taste[];
  difficulty?: string;
  prepTime?: number;
  cookTime?: number;
}

const typeLabels: Record<FoodType, string> = {
  berkuah: 'Berkuah',
  digoreng: 'Digoreng',
  dibakar: 'Dibakar',
  mentah: 'Mentah',
  minuman: 'Minuman',
};

const tasteIcons: Record<Taste, string> = {
  manis: '🍯',
  pedas: '🌶️',
  gurih: '🧂',
  asam: '🍋',
  asin: '🧄',
};

export default function QuickFacts({ region, regionColor, type, tastes, difficulty, prepTime, cookTime }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo('.fact-chip', { opacity: 0, y: 20, scale: 0.9 }, {
      opacity: 1, y: 0, scale: 1, stagger: 0.05, duration: 0.7, ease: 'expo.out',
    });
  }, []);

  return (
    <div ref={containerRef} className="quick-facts" role="list" aria-label="Quick facts about this dish">
      <div className="fact-chip" style={{ borderColor: regionColor }} role="listitem">
        <span className="fact-dot" style={{ backgroundColor: regionColor }} />
        <span className="fact-label">Region</span>
        <span className="fact-value">{region}</span>
      </div>

      <div className="fact-chip" role="listitem">
        <span className="fact-icon">🍽️</span>
        <span className="fact-label">Type</span>
        <span className="fact-value">{typeLabels[type]}</span>
      </div>

      {tastes.map((t) => (
        <div key={t} className="fact-chip fact-taste" role="listitem">
          <span className="fact-icon">{tasteIcons[t]}</span>
          <span className="fact-value">{t}</span>
        </div>
      ))}

      {difficulty && (
        <div className="fact-chip" role="listitem">
          <span className="fact-icon">📊</span>
          <span className="fact-label">Difficulty</span>
          <span className="fact-value">{difficulty}</span>
        </div>
      )}

      {(prepTime || cookTime) && (
        <div className="fact-chip" role="listitem">
          <span className="fact-icon">⏱️</span>
          <span className="fact-label">Time</span>
          <span className="fact-value">
            {prepTime && `${prepTime}m prep`}
            {prepTime && cookTime && ' • '}
            {cookTime && `${cookTime}m cook`}
          </span>
        </div>
      )}
    </div>
  );
}