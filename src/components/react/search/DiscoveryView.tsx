'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { $searchQuery } from '@/lib/stores/search';

interface DiscoveryViewProps {
  recentSearches: string[];
}

const TRENDING = ['rendang', 'soto', 'gudeg', 'pempek', 'coto makassar'];

export default function DiscoveryView({ recentSearches }: DiscoveryViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.from(containerRef.current.querySelectorAll('.discovery-item'), {
      opacity: 0,
      y: 20,
      stagger: 0.08,
      duration: 0.5,
      ease: 'power2.out',
    });
  }, []);

  return (
    <div ref={containerRef} className="discovery-view">
      <div className="discovery-hero">
        <h2>Temukan Kuliner Indonesia</h2>
        <p>Cari hidangan, jelajahi wilayah, atau mulai dari pencarian populer</p>
      </div>

      {recentSearches.length > 0 && (
        <section className="discovery-section">
          <h3>Pencarian Terakhir</h3>
          <div className="discovery-chips">
            {recentSearches.map(s => (
              <button
                key={s}
                className="discovery-item"
                onClick={() => $searchQuery.set(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="discovery-section">
        <h3>Pencarian Populer</h3>
        <div className="discovery-chips">
          {TRENDING.map(t => (
            <button
              key={t}
              className="discovery-item"
              onClick={() => $searchQuery.set(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      <section className="discovery-section">
        <h3>Jelajahi per Wilayah</h3>
        <div className="discovery-regions">
          {['Sumatera', 'Jawa', 'Kalimantan', 'Sulawesi', 'Bali & NTT', 'Maluku & Papua'].map(r => (
            <div key={r} className="discovery-region-item">
              {r}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}