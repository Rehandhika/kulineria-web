'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    servingSize: string;
  };
}

export default function NutritionBars({ nutrition }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo('.nutrition-bar-fill', { width: '0%' }, {
      width: (i) => {
        const values = [nutrition.calories, nutrition.protein, nutrition.carbs, nutrition.fat, nutrition.fiber || 0];
        const max = Math.max(...values);
        return `${(values[i] / max) * 100}%`;
      },
      stagger: 0.1,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
    });
  }, []);

  const items = [
    { label: 'Calories', value: nutrition.calories, unit: 'kcal', color: 'var(--c-accent)' },
    { label: 'Protein', value: nutrition.protein, unit: 'g', color: 'var(--c-success)' },
    { label: 'Carbs', value: nutrition.carbs, unit: 'g', color: 'var(--c-info)' },
    { label: 'Fat', value: nutrition.fat, unit: 'g', color: 'var(--c-warning)' },
  ];

  if (nutrition.fiber) {
    items.push({ label: 'Fiber', value: nutrition.fiber, unit: 'g', color: 'var(--c-sumatera)' });
  }

  return (
    <div ref={containerRef} className="nutrition-bars" role="list" aria-label="Nutrition information">
      <p className="nutrition-serving">{nutrition.servingSize}</p>
      {items.map((item, i) => (
        <div key={i} className="nutrition-item" role="listitem">
          <div className="nutrition-header">
            <span className="nutrition-label">{item.label}</span>
            <span className="nutrition-value">{item.value}{item.unit}</span>
          </div>
          <div className="nutrition-bar-track">
            <div className="nutrition-bar-fill" style={{ backgroundColor: item.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}