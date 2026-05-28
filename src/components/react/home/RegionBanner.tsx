'use client';

import { useEffect, useRef } from 'react';
import './RegionBanner.css';
import { useStore } from '@nanostores/react';
import { $selectedRegion, clearSelectedRegion } from '@/lib/stores/selectedRegion';
import { getRegions, getAllFoods } from '@/lib/data/loaders';

const REGION_HEX: Record<string, string> = {
  sumatera: '#A0522D',
  jawa: '#D2691E',
  kalimantan: '#8B6914',
  sulawesi: '#B8860B',
  'bali-ntt': '#CD853F',
  'maluku-papua': '#8B4513',
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
    <div ref={bannerRef} className="region-banner" style={{ borderColor: `${color}25` }}>
      <div className="region-banner-glow" style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}15 0%, transparent 70%)` }} />
      <div className="region-banner-accent" style={{ background: color }} />

      <button className="region-banner-close" onClick={clearSelectedRegion} aria-label="Tutup">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>

      <div className="region-banner-body">
        <span className="region-banner-overline">Jelajahi</span>

        <h2 className="region-banner-title" style={{"--region-color": color} as React.CSSProperties}>
          {region.name}
        </h2>
      </div>

      <div className="region-banner-footer">
        <div className="region-banner-stat">
          <span className="region-banner-stat-val" style={{ color }}>{count}</span>
          <span className="region-banner-stat-label">Hidangan</span>
        </div>

        <a href={`/jelajahi?region=${selectedId}`} className="region-banner-btn" style={{ background: color }}>
          Lihat Semua
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
      </div>
    </div>
  );
}
