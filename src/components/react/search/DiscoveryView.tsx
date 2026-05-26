'use client';

import { useState } from 'react';
import { $searchQuery } from '@/lib/stores/search';
import { getSearchDocuments } from '@/lib/data/search-index';

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
  recentSearches: string[];
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

export default function DiscoveryView({ recentSearches, initialFoods }: Props) {
  const [featuredFoods, setFeaturedFoods] = useState<FoodItem[] | undefined>(
    initialFoods && initialFoods.length > 0 ? initialFoods : undefined
  );

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
      const picked = shuffleArr(docs).slice(0, 9).map((d) => ({
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
      {recentSearches.length > 0 && (
        <section className="discovery-section discovery-recent">
          <div className="discovery-header">
            <span className="duo-badge duo-badge-warm">Terakhir Dicari</span>
          </div>
          <div className="discovery-chips">
            {recentSearches.map((s) => (
              <button
                key={s}
                className="discovery-item duo-badge"
                onClick={() => $searchQuery.set(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </section>
      )}

      {featuredFoods && featuredFoods.length > 0 && (
        <section className="discovery-section discovery-featured">
          <div className="discovery-featured-header">
            <div className="discovery-featured-title-group">
              <h2 className="discovery-featured-title">Jelajahi Nusantara</h2>
              <p className="discovery-featured-subtitle">Temukan hidangan dari berbagai daerah</p>
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
          <div className="results-grid-inner">
            {featuredFoods.map((food) => (
              <a
                key={food.id}
                href={`/food/${food.id}`}
                className="result-card duo-card flex flex-col overflow-hidden"
                style={{ borderTop: `4px solid ${REGION_COLORS[food.region] || 'var(--c-accent)'}` }}
                onClick={() => sessionStorage.setItem('kulineria-return', '/search')}
              >
                <div className="result-card-image">
                  <img src={food.imageUrl} alt={food.name} loading="lazy" />
                </div>
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
