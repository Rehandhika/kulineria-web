'use client';

import { useEffect, useRef } from 'react';
import './RegionBanner.css';
import { useStore } from '@nanostores/react';
import { $selectedRegion, clearSelectedRegion } from '@/lib/stores/selectedRegion';
import { getRegions, getAllFoods } from '@/lib/data/loaders';

const REGION_HEX: Record<string, string> = {
  sumatera: '#B36935',
  jawa: '#E7C49A',
  kalimantan: '#D9995B',
  sulawesi: '#6A412A',
  'bali-ntt': '#B36935',
  'maluku-papua': '#E7C49A',
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
      const banner = bannerRef.current;
      if (!banner) return;

      if (isNewRegion) {
        gsap.fromTo(banner,
          { opacity: 0, y: 30, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }
        );

        const accent = banner.querySelector('.region-banner-accent');
        const close = banner.querySelector('.region-banner-close');
        const overline = banner.querySelector('.region-banner-overline');
        const title = banner.querySelector('.region-banner-title');
        const footer = banner.querySelector('.region-banner-footer');

        const tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out', duration: 0.35 } });
        if (accent) tl.fromTo(accent, { width: 0 }, { width: 3 }, 0);
        if (overline) tl.fromTo(overline, { opacity: 0, y: 8 }, { opacity: 1, y: 0 }, 0.05);
        if (title) tl.fromTo(title, { opacity: 0, y: 12 }, { opacity: 1, y: 0 }, 0.12);
        if (footer) tl.fromTo(footer, { opacity: 0, y: 12 }, { opacity: 1, y: 0 }, 0.2);
        if (close) tl.fromTo(close, { opacity: 0, rotation: -90 }, { opacity: 1, rotation: 0 }, 0.25);
      } else {
        gsap.set(banner, { opacity: 1, y: 0, scale: 1 });
      }
    });
  }, [selectedId]);

  if (!region || !selectedId) return null;

  const color = REGION_HEX[selectedId];
  const textColor = (color === '#E7C49A' || color === '#D9995B') ? '#6A412A' : '#FFF8F1';
  const isLightBg = color === '#E7C49A' || color === '#D9995B';

  return (
    <div ref={bannerRef} className="region-banner border border-[rgba(106,65,42,0.16)] shadow-[var(--sh-card)]">
      <div className="region-banner-motif" aria-hidden="true">
        <img src="/img/motif/png bunga.png" alt="" />
      </div>
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
          <span className="region-banner-stat-val">{count}</span>
          <span className="region-banner-stat-label">Hidangan</span>
        </div>

        <a 
          href={`/jelajahi?region=${selectedId}`} 
          className={`region-banner-btn ${isLightBg ? 'is-light' : ''}`} 
          style={{ background: color, color: textColor }}
        >
          Lihat Semua
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
      </div>
    </div>
  );
}
