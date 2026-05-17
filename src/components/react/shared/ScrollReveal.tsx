'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeUp' | 'fadeDown' | 'scaleIn' | 'slideLeft' | 'slideRight';
  delay?: number;
  duration?: number;
}

export default function ScrollReveal({
  children,
  className = '',
  animation = 'fadeUp',
  delay = 0,
  duration = 0.8,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Ensure content is visible
      gsap.set(ref.current, { opacity: 1, y: 0, x: 0, scale: 1 });
      return;
    }

    const animations: Record<string, { y?: number; x?: number; scale?: number; opacity: number }> = {
      fadeUp: { y: 40, opacity: 0 },
      fadeDown: { y: -30, opacity: 0 },
      scaleIn: { scale: 0.92, opacity: 0 },
      slideLeft: { x: 40, opacity: 0 },
      slideRight: { x: -40, opacity: 0 },
    };

    const from = animations[animation];
    const el = ref.current;

    // Set initial hidden state
    gsap.set(el, from);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(el, {
            opacity: 1, y: 0, x: 0, scale: 1,
            duration,
            delay,
            ease: 'expo.out',
          });
        },
      });
    });

    // Safety fallback: show content after 5s if still hidden
    const fallbackTimer = setTimeout(() => {
      if (el && window.getComputedStyle(el).opacity === '0') {
        gsap.to(el, { opacity: 1, y: 0, x: 0, scale: 1, duration: 0.4 });
      }
    }, 5000);

    return () => {
      ctx.revert();
      clearTimeout(fallbackTimer);
    };
  }, [animation, delay, duration]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}