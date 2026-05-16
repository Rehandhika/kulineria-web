'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Ingredient {
  name: string;
  qty?: string;
  image?: string;
  essential: boolean;
}

interface Props {
  ingredients: Ingredient[];
}

export default function IngredientsGrid({ ingredients }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo('.ingredient-card', { opacity: 0, scale: 0.85, y: 20 }, {
      opacity: 1, scale: 1, y: 0, stagger: 0.04, duration: 0.8, ease: 'expo.out',
      scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
    });
  }, []);

  return (
    <section ref={containerRef} className="ingredients-section" aria-label="Ingredients">
      <h2 className="section-title">Ingredients</h2>
      <div className="ingredients-grid">
        {ingredients.map((ing, i) => (
          <div key={i} className="ingredient-card">
            {ing.image && (
              <div className="ingredient-icon">
                <img src={ing.image} alt={ing.name} loading="lazy" />
              </div>
            )}
            <h3 className="ingredient-name">{ing.name}</h3>
            {ing.qty && <span className="ingredient-qty">{ing.qty}</span>}
            {ing.essential && <span className="ingredient-badge">Essential</span>}
          </div>
        ))}
      </div>
    </section>
  );
}