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
    gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'expo.out',
      scrollTrigger: { trigger: containerRef.current, start: 'top 85%', once: true },
    });
  }, []);

  if (foods.length === 0) return null;

  return (
    <section ref={containerRef} className="related-section" aria-label="Jelajahi kuliner lainnya">
      <h2 className="section-title">Jelajahi Kuliner Lainnya</h2>
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
