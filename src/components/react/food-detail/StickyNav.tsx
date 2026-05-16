'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface Props {
  foodName: string;
  regionColor: string;
}

export default function StickyNav({ foodName, regionColor }: Props) {
  const navRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(navRef.current, { y: -100, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.4, ease: 'expo.out', paused: true,
      });
    }
  }, []);

  useEffect(() => {
    if (navRef.current) {
      const ctx = gsap.context(() => {
        if (visible) {
          gsap.to(navRef.current!, { y: 0, opacity: 1, duration: 0.4, ease: 'expo.out' });
        } else {
          gsap.to(navRef.current!, { y: -100, opacity: 0, duration: 0.3, ease: 'expo.in' });
        }
      });
      return () => ctx.revert();
    }
  }, [visible]);

  return (
    <nav ref={navRef} className="sticky-nav" role="navigation" aria-label="Food navigation" style={{ '--region-color': regionColor } as any}>
      <div className="sticky-nav-inner">
        <a href="/" className="sticky-nav-back" aria-label="Back to home">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </a>
        <span className="sticky-nav-name">{foodName}</span>
        <div className="sticky-nav-actions">
          <button className="sticky-nav-btn" aria-label="Add to favorites">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </button>
          <button className="sticky-nav-btn" aria-label="Share this dish">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
          </button>
        </div>
      </div>
    </nav>
  );
}