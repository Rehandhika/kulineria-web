'use client';

import { useState, useEffect, useCallback } from 'react';
import type { FoodItemFull } from '@/types/food';

interface Props {
  food: FoodItemFull;
  regionName: string;
}

export default function HeroCinematic({ food, regionName }: Props) {
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    setIsFavorited(getFavorites().includes(food.id));
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

  return (
    <section className="hero" aria-label={`Hero ${food.name}`}>
      <div className="hero-image" style={{ backgroundColor: food.hero?.dominantColor || 'var(--c-surface-2)' }}>
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
    </section>
  );
}

function getFavorites(): string[] {
  try { return JSON.parse(localStorage.getItem('kulineria-favorites') || '[]'); } catch { return []; }
}
function saveFavorites(ids: string[]) {
  try { localStorage.setItem('kulineria-favorites', JSON.stringify(ids)); } catch {}
}
