'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { FoodItemFull } from '@/types/food';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  food: FoodItemFull;
  regionName: string;
}

export default function HeroCinematic({ food, regionName }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    setIsFavorited(getFavorites().includes(food.id));
  }, [food.id]);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Entrance animation timeline
    const tl = gsap.timeline({ onComplete: () => setRevealed(true) });

    tl.fromTo('.hero-image', 
      { clipPath: 'inset(100% 0 0 0)', scale: 1.15 }, 
      { clipPath: 'inset(0% 0 0 0)', scale: 1.02, duration: 1.4, ease: 'power4.out' }, 
      0
    )
      .fromTo('.hero-overlay', { opacity: 0 }, { opacity: 1, duration: 1.0, ease: 'power2.out' }, 0)
      .fromTo('.hero-breadcrumb > *', 
        { y: -12, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: 'power3.out' }, 
        0.4
      )
      .fromTo('.hero-content-inner > *', 
        { opacity: 0, y: 30, filter: 'blur(8px)' }, 
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.1, ease: 'power4.out' }, 
        0.5
      )
      .fromTo('.hero-actions > *', 
        { scale: 0.8, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(1.8)' }, 
        '-=0.4'
      );

    // 2. Parallax zoom scrollTrigger
    const parallax = gsap.fromTo('.hero-img',
      { yPercent: -5, scale: 1.02 },
      {
        yPercent: 12,
        scale: 1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      }
    );

    return () => {
      tl.kill();
      parallax.scrollTrigger?.kill();
      parallax.kill();
    };
  }, [food.id]);

  const handleFavorite = useCallback(() => {
    const favs = getFavorites();
    if (favs.includes(food.id)) {
      saveFavorites(favs.filter(id => id !== food.id));
      setIsFavorited(false);
    } else {
      saveFavorites([...favs, food.id]);
      setIsFavorited(true);
    }
  }, [food.id]);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: food.name, text: `Lihat ${food.name} di Kulineria!`, url }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(url); } catch {}
    }
  }, [food.name]);

  const regionColor = `var(--c-${food.region})`;
  const heroImgSrc = food.imageUrl || food.hero?.image;

  return (
    <section ref={containerRef} className="hero" aria-label={`Hero ${food.name}`}>
      <div className="hero-image" style={{ backgroundColor: food.hero?.dominantColor || 'var(--c-surface-2)' }}>
        {heroImgSrc && (
          <>
            {!imgLoaded && <div className="hero-img-skeleton" />}
            <img
              src={heroImgSrc} alt={food.hero?.alt || food.name}
              className="hero-img" loading="eager"
              onLoad={() => setImgLoaded(true)}
              style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.4s ease' }}
            />
          </>
        )}
        <div className="hero-overlay" />
      </div>

      <div className="hero-content">
        <nav className="hero-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Beranda</a>
          <span className="hero-breadcrumb-sep">›</span>
          <a href={`/jelajahi?region=${food.region}`}>{regionName}</a>
          <span className="hero-breadcrumb-sep">›</span>
          <span className="hero-breadcrumb-current">{food.name}</span>
        </nav>

        <div className="hero-content-inner">
          <span className="hero-badge" style={{ backgroundColor: regionColor }}>
            {regionName}
          </span>
          <h1 className="hero-title">{food.name}</h1>
          <p className="hero-subtitle">{food.description}</p>

          <div className="hero-actions">
            <button onClick={handleFavorite} className="btn-icon" aria-label={isFavorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
            </button>
            <button onClick={handleShare} className="btn-icon" aria-label="Bagikan">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
            </button>
          </div>
        </div>

      </div>

      {!revealed && <div className="hero-skeleton" />}

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </section>
  );
}

function getFavorites(): string[] {
  try { return JSON.parse(localStorage.getItem('kulineria-favorites') || '[]'); } catch { return []; }
}
function saveFavorites(ids: string[]) {
  try { localStorage.setItem('kulineria-favorites', JSON.stringify(ids)); } catch {} }
