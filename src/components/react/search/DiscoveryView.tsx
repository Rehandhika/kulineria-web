'use client';

import { useEffect, useRef, useState } from 'react';
import { getSearchDocuments } from '@/lib/data/search-index';
import LazyImage from '../shared/LazyImage';

const REGION_COLORS: Record<string, string> = {
  sumatera: 'var(--c-sumatera)',
  jawa: 'var(--c-jawa)',
  kalimantan: 'var(--c-kalimantan)',
  sulawesi: 'var(--c-sulawesi)',
  'bali-ntt': 'var(--c-bali-ntt)',
  'maluku-papua': 'var(--c-maluku-papua)',
};

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
                <LazyImage src={food.imageUrl} alt={food.name} className="result-card-image" />
                <div className="result-card-content">
                  <h3>{food.name}</h3>
                  <span className="result-card-region">{food.region}</span>
                  <div className="result-card-tags">
                    {food.taste.map((t) => (
                      <span key={t} className="duo-badge" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>{t}</span>
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
