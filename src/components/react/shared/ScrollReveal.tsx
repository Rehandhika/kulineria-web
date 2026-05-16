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
  threshold?: number;
}

export default function ScrollReveal({
  children,
  className = '',
  animation = 'fadeUp',
  delay = 0,
  duration = 0.8,
  threshold = 0.1,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const animations = {
      fadeUp: { y: 40, opacity: 0 },
      fadeDown: { y: -30, opacity: 0 },
      scaleIn: { scale: 0.92, opacity: 0 },
      slideLeft: { x: 40, opacity: 0 },
      slideRight: { x: -40, opacity: 0 },
    };

    const from = animations[animation];

    const ctx = gsap.context(() => {
      gsap.from(ref.current!, {
        ...from,
        y: from.y ?? 0,
        x: from.x ?? 0,
        opacity: from.opacity ?? 0,
        scale: from.scale ?? 1,
        duration,
        delay,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });

    return () => ctx.revert();
  }, [animation, delay, duration]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}