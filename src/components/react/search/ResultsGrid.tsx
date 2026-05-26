'use client';

import { useState } from 'react';

interface FoodItem {
  id: string;
  name: string;
  region: string;
  taste: string[];
  type: string;
  imageUrl: string;
}

const REGION_COLORS: Record<string, string> = {
  sumatera: 'var(--c-sumatera)',
  jawa: 'var(--c-jawa)',
  kalimantan: 'var(--c-kalimantan)',
  sulawesi: 'var(--c-sulawesi)',
  'bali-ntt': 'var(--c-bali-ntt)',
  'maluku-papua': 'var(--c-maluku-papua)',
};

export default function ResultsGrid({ results, query }: { results: FoodItem[]; query: string }) {
  const [displayCount, setDisplayCount] = useState(12);

  const visibleResults = results.slice(0, displayCount);
  const hasMore = displayCount < results.length;

  return (
    <div className="results-grid">
      <div className="results-header">
        <span className="results-count">{results.length} hasil</span>
        {query && <span className="results-query">untuk "{query}"</span>}
      </div>

      <div className="results-grid-inner">
        {visibleResults.map((food) => (
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
                <span className="duo-badge duo-badge-accent" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>{food.type}</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setDisplayCount((prev) => prev + 12)}
            className="duo-btn duo-btn-secondary"
          >
            Muat lagi ({results.length - displayCount} tersisa)
          </button>
        </div>
      )}
    </div>
  );
}
