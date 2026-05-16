'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  headline: string;
  body: string;
  pullQuote?: string;
  image?: string;
}

export default function StorySection({ headline, body, pullQuote, image }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Parallax on image
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    // Text fade-in
    gsap.fromTo('.story-text', { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'expo.out',
      scrollTrigger: { trigger: '.story-content', start: 'top 80%' },
    });

    gsap.fromTo('.story-quote', { opacity: 0, x: -20 }, {
      opacity: 1, x: 0, duration: 0.8, ease: 'expo.out',
      scrollTrigger: { trigger: '.story-quote', start: 'top 85%' },
    });
  }, []);

  return (
    <section ref={containerRef} className="story-section" aria-label="The story behind this dish">
      <div className="story-grid">
        {image && (
          <div className="story-image-wrapper">
            <div ref={imageRef} className="story-image">
              <img src={image} alt={headline} loading="lazy" />
            </div>
          </div>
        )}

        <div className="story-content">
          <h2 className="story-headline">{headline}</h2>
          <div className="story-text">
            {body.split('\n').map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {pullQuote && (
            <blockquote className="story-quote">
              <span className="quote-mark">"</span>
              {pullQuote}
              <span className="quote-mark">"</span>
            </blockquote>
          )}
        </div>
      </div>
    </section>
  );
}