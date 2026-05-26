'use client';

import { $searchQuery } from '@/lib/stores/search';

const TRENDING = ['rendang', 'soto', 'gudeg', 'pempek', 'coto makassar'];

const REGIONS = [
  { name: 'Sumatera', id: 'sumatera' },
  { name: 'Jawa', id: 'jawa' },
  { name: 'Kalimantan', id: 'kalimantan' },
  { name: 'Sulawesi', id: 'sulawesi' },
  { name: 'Bali & NTT', id: 'bali-ntt' },
  { name: 'Maluku & Papua', id: 'maluku-papua' },
];

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
  type: string;
  imageUrl: string;
}

interface Props {
  recentSearches: string[];
  initialFoods?: FoodItem[];
}

export default function DiscoveryView({ recentSearches, initialFoods }: Props) {
  return (
    <div className="discovery-view">
      {recentSearches.length > 0 && (
        <section className="discovery-section discovery-recent" style={{ marginBottom: 'var(--sp-10)' }}>
          <div className="duo-section-header" style={{ marginBottom: 'var(--sp-6)' }}>
            <div className="duo-section-overline">
              <span className="duo-badge duo-badge-warm">Terakhir Dicari</span>
            </div>
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

      <section className="discovery-section discovery-trending" style={{ marginBottom: 'var(--sp-10)' }}>
        <div className="duo-section-header" style={{ marginBottom: 'var(--sp-6)' }}>
          <div className="duo-section-overline">
            <span className="duo-badge duo-badge-accent">Populer</span>
          </div>
        </div>
        <div className="discovery-chips">
          {TRENDING.map((t) => (
            <button
              key={t}
              className="discovery-item duo-badge"
              onClick={() => $searchQuery.set(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      <section className="discovery-section discovery-regions-section" style={{ marginBottom: 'var(--sp-10)' }}>
        <div className="duo-section-header" style={{ marginBottom: 'var(--sp-6)' }}>
          <div className="duo-section-overline">
            <span className="duo-badge duo-badge-gold">Wilayah</span>
          </div>
        </div>
        <div className="discovery-regions-grid">
          {REGIONS.map((r) => (
            <a
              key={r.id}
              href={`/search?region=${r.id}`}
              className="discovery-card duo-card"
              style={{
                background: `color-mix(in srgb, ${REGION_COLORS[r.id]} 15%, var(--c-surface))`,
                borderTop: `4px solid ${REGION_COLORS[r.id]}`,
              }}
            >
              {r.name}
            </a>
          ))}
        </div>
      </section>

      {initialFoods && initialFoods.length > 0 && (
        <section className="discovery-section discovery-featured" style={{ marginBottom: 'var(--sp-10)' }}>
          <div className="duo-section-header" style={{ marginBottom: 'var(--sp-6)' }}>
            <div className="duo-section-overline">
              <span className="duo-badge">Jelajahi</span>
            </div>
            <h2 className="duo-section-title">Jelajahi Nusantara</h2>
            <p className="duo-section-subtitle">Mulai dari hidangan populer ini</p>
          </div>
          <div className="results-grid-inner">
            {initialFoods.map((food) => (
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
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
