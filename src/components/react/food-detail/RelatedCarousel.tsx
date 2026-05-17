'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RelatedFood {
  id: string;
  name: string;
  region: string;
  imageUrl: string;
}

interface Props {
  foods: RelatedFood[];
  currentId: string;
}

export default function RelatedCarousel({ foods }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cards = containerRef.current.querySelectorAll('.related-card');
    gsap.set(cards, { opacity: 0, x: 40 });

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1, x: 0, stagger: 0.08, duration: 0.8, ease: 'expo.out',
        });
      },
    });

    // Safety fallback
    const fallback = setTimeout(() => {
      cards.forEach(card => {
        if (window.getComputedStyle(card).opacity === '0') {
          gsap.to(card, { opacity: 1, x: 0, duration: 0.3 });
        }
      });
    }, 4000);

    return () => clearTimeout(fallback);
  }, []);

  if (foods.length === 0) return null;

  return (
    <section ref={containerRef} className="related-section" aria-label="Related dishes">
      <h2 className="section-title">You Might Also Like</h2>
      <div className="related-carousel">
        {foods.map((food) => (
          <a key={food.id} href={`/food/${food.id}`} className="related-card">
            <div className="related-image" style={{ backgroundColor: 'var(--c-surface-2)' }}>
              <img src={food.imageUrl} alt={food.name} loading="lazy" />
            </div>
            <div className="related-info">
              <h3 className="related-name">{food.name}</h3>
              <span className="related-region">{food.region}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}