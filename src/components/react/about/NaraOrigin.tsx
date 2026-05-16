'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function NaraOrigin() {
  const containerRef = useRef<HTMLDivElement>(null);
  const naraRef = useRef<SVGSVGElement>(null);
  const [expression, setExpression] = useState<'idle' | 'excited' | 'thinking'>('idle');

  useEffect(() => {
    if (!naraRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(naraRef.current!, {
        scale: 0,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });

      gsap.to(naraRef.current, {
        y: -10,
        duration: 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    });

    return () => ctx.revert();
  }, []);

  const expressions = {
    idle: { mouth: 'M 35 42 Q 50 48 65 42', eyes: 'M 30 30 Q 35 25 40 30 M 60 30 Q 65 25 70 30' },
    excited: { mouth: 'M 30 40 Q 50 58 70 40', eyes: 'M 28 28 L 32 32 M 38 28 L 34 32 M 62 28 L 66 32 M 68 28 L 64 32' },
    thinking: { mouth: 'M 40 44 Q 50 42 60 44', eyes: 'M 30 30 A 5 5 0 1 1 40 30 A 5 5 0 1 1 30 30 M 60 30 A 5 5 0 1 1 70 30 A 5 5 0 1 1 60 30' },
  };

  const current = expressions[expression];

  return (
    <div ref={containerRef} className="nara-origin">
      <div className="nara-container">
        <svg
          ref={naraRef}
          viewBox="0 0 100 100"
          className="nara-svg"
          onMouseEnter={() => setExpression('excited')}
          onMouseLeave={() => setExpression('idle')}
        >
          <circle cx="50" cy="50" r="45" fill="var(--c-accent)" opacity="0.1" />
          <circle cx="50" cy="50" r="35" fill="var(--c-accent)" opacity="0.2" />
          <circle cx="50" cy="50" r="25" fill="var(--c-surface-1)" stroke="var(--c-accent)" strokeWidth="2" />
          <path d={current.eyes} fill="none" stroke="var(--c-text-1)" strokeWidth="2" strokeLinecap="round" />
          <path d={current.mouth} fill="none" stroke="var(--c-text-1)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="30" cy="40" r="3" fill="var(--c-accent)" opacity="0.3" />
          <circle cx="70" cy="40" r="3" fill="var(--c-accent)" opacity="0.3" />
        </svg>
      </div>

      <div className="nara-speech">
        <p>Hai! Aku Nara, pemandu kuliner digitalmu. Aku lahir dari kecintaan terhadap warisan kuliner Nusantara. Misi saya? Membantu kamu menjelajahi 510+ hidangan dari 6 region Indonesia!</p>
      </div>
    </div>
  );
}