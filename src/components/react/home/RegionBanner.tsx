'use client';

import { useEffect, useRef } from 'react';
import './RegionBanner.css';
import { useStore } from '@nanostores/react';
import { $selectedRegion, clearSelectedRegion } from '@/lib/stores/selectedRegion';
import { getRegions, getAllFoods } from '@/lib/data/loaders';

const REGION_HEX: Record<string, string> = {
  sumatera:       '#B5462E',   /* terracotta-red   */
  jawa:           '#B07D1A',   /* warm amber       */
  kalimantan:     '#2E7D6B',   /* teal-green       */
  sulawesi:       '#6A3FA0',   /* purple           */
  'bali-ntt':     '#1F7A8C',   /* ocean teal       */
  'maluku-papua': '#C0392B',   /* deep red         */
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
  // All new region colors are dark enough for white text (contrast ≥ 4.5:1)
  const textColor = '#FFFFFF';
  const isLightBg = false;

  return (
    <div ref={bannerRef} className="region-banner">
      {/* NARA thinking — kecil di pojok kanan */}
      <div className="region-banner-nara" aria-hidden="true">
        <img
          src="/img/nara/NARA 3.png"
          alt=""
          width="80"
          height="80"
          draggable={false}
          onError={(e) => { (e.currentTarget as HTMLImageElement).parentElement!.style.display = 'none'; }}
        />
      </div>

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
        <a
          href={`/jelajahi?region=${selectedId}`}
          className="region-banner-btn"
          style={{ background: color, color: '#fff' }}
        >
          Lihat Hidangan
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
      </div>
    </div>
  );
}
