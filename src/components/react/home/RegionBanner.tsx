'use client';

import { useEffect, useRef } from 'react';
import './RegionBanner.css';
import { useStore } from '@nanostores/react';
import { $selectedRegion, clearSelectedRegion } from '@/lib/stores/selectedRegion';
import { type RegionId } from '@/types/food';
import { getRegions, getAllFoods } from '@/lib/data/loaders';

const REGION_HEX: Record<string, string> = {
  sumatera: '#A0522D',
  jawa: '#D2691E',
  kalimantan: '#8B6914',
  sulawesi: '#B8860B',
  'bali-ntt': '#CD853F',
  'maluku-papua': '#8B4513',
};

const REGION_EMOJI: Record<string, string> = {
  sumatera: '🌶️',
  jawa: '🍚',
  kalimantan: '🌴',
  sulawesi: '🐟',
  'bali-ntt': '🌺',
  'maluku-papua': '🐚',
};

const regions = getRegions();
const allFoods = getAllFoods();

function getFoodCount(regionId: string) {
  return allFoods.filter(f => f.region === regionId).length;
}

export default function RegionBanner() {
  const selectedId = useStore($selectedRegion);
  const bannerRef = useRef<HTMLDivElement>(null);
  const prevIdRef = useRef<string | null>(null);

  const region = selectedId ? regions.find(r => r.id === selectedId) : null;
  const count = selectedId ? getFoodCount(selectedId) : 0;

  useEffect(() => {
    if (!bannerRef.current) return;

    const isNewRegion = prevIdRef.current !== selectedId;
    prevIdRef.current = selectedId;

    if (!region) return;

    import('gsap').then(({ default: gsap }) => {
      if (isNewRegion) {
        gsap.fromTo(
          bannerRef.current,
          { opacity: 0, y: 30, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }
        );
      } else {
        gsap.to(bannerRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.3 });
      }
    });
  }, [selectedId]);

  if (!region || !selectedId) return null;

  const color = REGION_HEX[selectedId];

  return (
    <div ref={bannerRef} className="region-banner" style={{ borderColor: `${color}40` }}>
      <div className="region-banner-bg" style={{ background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)` }} />
      <div className="region-banner-inner">
        <div className="region-banner-icon" style={{ background: `${color}20`, borderColor: color }}>
          <span>{REGION_EMOJI[selectedId] || '🍽️'}</span>
        </div>
        <div className="region-banner-info">
          <span className="region-banner-overline">Wilayah Terpilih</span>
          <h2 className="region-banner-title">{region.name}</h2>
          <p className="region-banner-desc">{region.naraDialog}</p>
        </div>
        <div className="region-banner-meta">
          <div className="region-banner-stat">
            <span className="region-banner-stat-val">{count}</span>
            <span className="region-banner-stat-label">Hidangan</span>
          </div>
          <div className="region-banner-actions">
            <a href={`/search?region=${selectedId}`} className="region-banner-btn" style={{ background: color }}>
              Lihat Semua
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
            <button onClick={clearSelectedRegion} className="region-banner-reset">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
