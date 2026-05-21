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

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo('.story-text', { opacity: 0, y: 20 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'expo.out',
      scrollTrigger: { trigger: '.story-content', start: 'top 80%' },
    });
  }, []);

  return (
    <section ref={containerRef} className="story-section" aria-label="Cerita di balik hidangan ini">
      <div className="story-grid">
        {image && (
          <div className="story-image-wrapper">
            <img src={image} alt={headline} loading="lazy" className="story-img" />
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
            <blockquote className="story-quote">"{pullQuote}"</blockquote>
          )}
        </div>
      </div>
    </section>
  );
}
