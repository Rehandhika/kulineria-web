'use client';

import { useEffect, useRef, useState } from 'react';
import { getSearchDocuments } from '@/lib/data/search-index';
import LazyImage from '../shared/LazyImage';

// Unused - commented out to resolve TypeScript error ts(6133)
// const REGION_COLORS: Record<string, string> = {
//   sumatera: 'var(--c-sumatera)',
//   jawa: 'var(--c-jawa)',
//   kalimantan: 'var(--c-kalimantan)',
//   sulawesi: 'var(--c-sulawesi)',
//   'bali-ntt': 'var(--c-bali-ntt)',
//   'maluku-papua': 'var(--c-maluku-papua)',
// };

export function getTasteIcon(id: string, size = 11) {
  switch (id.toLowerCase().trim()) {
    case 'manis':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
        </svg>
      );
    case 'pedas':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
          <path d="M17.66 9.53a8.1 8.1 0 0 0-3.32-4.14 1 1 0 0 0-1.25.12 1 1 0 0 0-.17.3c-.63 1.76-.11 3.54.55 4.98a3 3 0 0 1-2.47 4.13c-.08 0-.16.01-.24.01a3 3 0 0 1-2.93-3.41 1 1 0 0 0-.25-.8 1 1 0 0 0-.91-.25 7 7 0 1 0 12.01-1.23 1 1 0 0 0-.98.29Z"/>
        </svg>
      );
    case 'gurih':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
          <path d="M2 12h20a1 1 0 0 1 1 1v2a6 6 0 0 1-6 6H7a6 6 0 0 1-6-6v-2a1 1 0 0 1 1-1zm10-10a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm-4 2a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0V5a1 1 0 0 1 1-1z"/>
        </svg>
      );
    case 'asam':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
          <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C7.86 4 4.5 7.36 4.5 11.5S7.86 19 12 19c3.4 0 6.29-2.26 7.22-5.38a1 1 0 0 0-.66-1.23 1 1 0 0 0-1.21.65c-.63 2.11-2.58 3.96-5.35 3.96-2.76 0-5-2.24-5-5s2.24-5 5-5c2.44 0 4.47 1.8 4.9 4.14a1 1 0 0 0 1.2.78 1 1 0 0 0 .76-1.18z"/>
        </svg>
      );
    case 'asin':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
          <path d="M19 8h-2V5c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v3H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 5h6v3H9V5zm8 15H7v-2h10v2zm0-4H7v-6h10v6z"/>
        </svg>
      );
    default:
      return null;
  }
}

function formatTasteName(taste: string) {
  return taste.charAt(0).toUpperCase() + taste.slice(1).toLowerCase();
}

interface FoodItem {
  id: string;
  name: string;
  region: string;
  taste: string[];
  imageUrl: string;
}

interface Props {
  initialFoods?: FoodItem[];
}

function shuffleArr<T>(arr: T[]): T[] {
  const s = [...arr];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
}

export default function DiscoveryView({ initialFoods }: Props) {
  const [featuredFoods, setFeaturedFoods] = useState<FoodItem[] | undefined>(
    initialFoods && initialFoods.length > 0 ? initialFoods : undefined
  );
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !featuredFoods) return;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>('.result-card'));
    if (!cards.length) return;
    import('gsap').then(({ default: gsap }) => {
      gsap.killTweensOf(cards);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
        return;
      }
      gsap.fromTo(cards,
        { opacity: 0, y: 32, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.07, ease: 'power3.out', clearProps: 'transform' }
      );
    });
  }, [featuredFoods]);

  function handleShuffle() {
    try {
      const docs = getSearchDocuments();
      if (!docs || docs.length === 0) {
        if (featuredFoods && featuredFoods.length > 0) {
          const picked = shuffleArr(featuredFoods);
          setFeaturedFoods(picked);
        }
        return;
      }
      const picked = shuffleArr(docs).slice(0, 12).map((d) => ({
        id: d.id,
        name: d.name,
        region: d.region,
        taste: d.taste.split(' ').filter(Boolean),
        imageUrl: d.imageUrl,
      }));
      setFeaturedFoods(picked);
    } catch (e) {
      console.error('[DiscoveryView] shuffle error:', e);
    }
  }

  return (
    <div className="discovery-view">
      {featuredFoods && featuredFoods.length > 0 && (
        <section className="discovery-section discovery-featured" style={{ position: 'relative' }}>
          <div className="discovery-motif" aria-hidden="true">
            <img src="/img/motif/png ornamen nusantara.png" alt="" />
          </div>
          <div className="discovery-featured-header">
            <div>
              <p style={{ fontFamily: 'var(--ff-body)', fontSize: 'var(--fs-sm)', color: 'var(--c-text-3)', fontWeight: 600, marginBottom: 4 }}>
                Menampilkan {featuredFoods.length} hidangan
              </p>
            </div>
            <button onClick={handleShuffle} className="shuffle-btn" aria-label="Acak hidangan">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 3 21 3 21 8"/>
                <line x1="4" x2="21" y1="20" y2="3"/>
                <polyline points="21 16 21 21 16 21"/>
                <line x1="15" x2="21" y1="15" y2="21"/>
                <line x1="4" x2="9" y1="4" y2="9"/>
              </svg>
              Acak
            </button>
          </div>
          <div className="results-grid-inner" ref={gridRef}>
            {featuredFoods.map((food) => (
              <a
                key={food.id}
                href={`/hidangan/${food.id}`}
                className="result-card duo-card flex flex-col overflow-hidden"
                onClick={() => sessionStorage.setItem('kulineria-return', '/jelajahi')}
              >
                <LazyImage src={food.imageUrl} alt={food.name} className="result-card-image" width={400} height={225} />
                <div className="result-card-content">
                  <h3>{food.name}</h3>
                  <span className="result-card-region">{food.region}</span>
                  <div className="result-card-tags">
                    {food.taste.map((t) => (
                      <span key={t} className="duo-badge" style={{ fontSize: '0.65rem', padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {getTasteIcon(t, 11)}
                        {formatTasteName(t)}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
