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
    
    const anims: gsap.core.Tween[] = [];

    if (image) {
      const imgAnim = gsap.fromTo('.story-image-wrapper',
        { clipPath: 'inset(0 100% 0 0)', scale: 1.05 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '.story-grid',
            start: 'top 85%',
            once: true
          }
        }
      );
      anims.push(imgAnim);
    }

    const contentAnim = gsap.fromTo('.story-content > *',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.story-grid',
          start: 'top 80%',
          once: true
        }
      }
    );
    anims.push(contentAnim);

    return () => {
      anims.forEach(anim => {
        anim.scrollTrigger?.kill();
        anim.kill();
      });
    };
  }, [image]);

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
