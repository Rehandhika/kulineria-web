'use client';

import { useEffect, useRef } from 'react';
import './RegionBanner.css';
import { useStore } from '@nanostores/react';
import { $selectedRegion, clearSelectedRegion } from '@/lib/stores/selectedRegion';
import { getRegions, getAllFoods } from '@/lib/data/loaders';

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
  const count  = selectedId ? getFoodCount(selectedId) : 0;

  useEffect(() => {
    if (!bannerRef.current || !region) return;

    const isNew = prevIdRef.current !== selectedId;
    prevIdRef.current = selectedId;

    if (!isNew) return;

    import('gsap').then(({ default: gsap }) => {
      const el = bannerRef.current;
      if (!el) return;
      gsap.fromTo(el,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      );
    });
  }, [selectedId]);

  if (!region || !selectedId) return null;

  return (
    <div ref={bannerRef} className="rb">
      {}
      <span className="rb-name">{region.name}</span>

      {}
      <span className="rb-sep" aria-hidden="true" />

      {}
      <span className="rb-count">
        {count} hidangan
      </span>

      {}
      <div className="rb-right">
        <button
          className="rb-close"
          onClick={clearSelectedRegion}
          aria-label={`Tutup pilihan ${region.name}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        <a
          href={`/jelajahi?region=${selectedId}`}
          className="rb-cta"
        >
          Jelajahi
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
      </div>
    </div>
  );
}
