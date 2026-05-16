'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import type { FoodItemFull } from '@/types/food';

interface Props {
  food: FoodItemFull;
  onFavorite?: () => void;
  onShare?: () => void;
}

export default function HeroCinematic({ food, onFavorite, onShare }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const tl = gsap.timeline({
      onComplete: () => setRevealed(true),
    });

    // Hero image clipPath reveal
    tl.fromTo(
      '.hero-image',
      { clipPath: 'inset(100% 0 0 0)' },
      { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'expo.out' }
    );

    // Title animation - manual char split (free alternative to SplitText)
    if (titleRef.current && !prefersReducedMotion) {
      const chars = titleRef.current.querySelectorAll('.char');
      tl.fromTo(
        chars,
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.02, duration: 1, ease: 'expo.out' },
        '-=0.6'
      );
    } else if (titleRef.current) {
      tl.fromTo(titleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6');
    }

    // Subtitle fade
    tl.fromTo('.hero-subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');

    // Badge scale
    tl.fromTo('.hero-badge', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }, '-=0.8');

    // Actions fade
    tl.fromTo('.hero-actions', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.3');

    return () => { tl.kill(); };
  }, []);

  // Split title into chars for animation
  const titleChars = food.name.split('').map((char, i) => (
    <span key={i} className="char" style={{ display: 'inline-block' }}>
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));

  const regionColor = `var(--c-${food.region})`;

  return (
    <section ref={containerRef} className="hero" aria-label={`${food.name} hero`}>
      <div className="hero-image" style={{ backgroundColor: food.hero?.dominantColor || 'var(--c-surface-2)' }}>
        {food.hero?.image && (
          <img src={food.hero.image} alt={food.hero.alt || food.name} className="hero-img" loading="eager" />
        )}
        <div className="hero-overlay" />
      </div>

      <div className="hero-content">
        <span className="hero-badge" style={{ backgroundColor: regionColor }}>
          {food.region.replace('-', ' & ')}
        </span>

        <h1 ref={titleRef} className="hero-title">
          {titleChars}
        </h1>

        <p className="hero-subtitle">{food.description}</p>

        <div className="hero-actions">
          {onFavorite && (
            <button onClick={onFavorite} className="btn-icon" aria-label="Add to favorites">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </button>
          )}
          {onShare && (
            <button onClick={onShare} className="btn-icon" aria-label="Share this dish">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
            </button>
          )}
        </div>
      </div>

      {!revealed && <div className="hero-skeleton" />}
    </section>
  );
}