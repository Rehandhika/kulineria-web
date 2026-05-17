'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const REGIONS = [
  { id: 'sumatera', name: 'Sumatera', lat: 0.5, lng: 101.5, foods: 85, color: '#E07A5F' },
  { id: 'jawa', name: 'Jawa', lat: -7.5, lng: 110.5, foods: 85, color: '#3D405B' },
  { id: 'kalimantan', name: 'Kalimantan', lat: -0.5, lng: 114.5, foods: 85, color: '#81B29A' },
  { id: 'sulawesi', name: 'Sulawesi', lat: -2.5, lng: 121.5, foods: 85, color: '#F2CC8F' },
  { id: 'bali-ntt', name: 'Bali & NTT', lat: -8.5, lng: 116.5, foods: 85, color: '#E07A5F' },
  { id: 'maluku-papua', name: 'Maluku & Papua', lat: -3.5, lng: 130.5, foods: 85, color: '#3D405B' },
];

export default function MapMoment() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeRegion, setActiveRegion] = useState<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const markers = containerRef.current!.querySelectorAll('.map-marker');

      gsap.set(markers, { scale: 0, opacity: 0 });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 60%',
        once: true,
        onEnter: () => {
          gsap.to(markers, {
            scale: 1, opacity: 1,
            duration: 0.5,
            stagger: 0.15,
            ease: 'back.out(1.7)',
          });
        },
      });

      // Safety fallback
      setTimeout(() => {
        markers.forEach(marker => {
          if (window.getComputedStyle(marker).opacity === '0') {
            gsap.to(marker, { scale: 1, opacity: 1, duration: 0.3 });
          }
        });
      }, 4000);
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="map-moment">
      <div className="map-container">
        <svg viewBox="0 0 800 400" className="map-svg">
          <defs>
            <linearGradient id="mapBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--c-surface-2)" />
              <stop offset="100%" stopColor="var(--c-surface-1)" />
            </linearGradient>
          </defs>
          <rect width="800" height="400" fill="url(#mapBg)" rx="16" />

          {REGIONS.map((region, i) => {
            const x = ((region.lng - 95) / 45) * 700 + 50;
            const y = ((region.lat + 10) / 20) * 300 + 50;
            const isActive = activeRegion === i;

            return (
              <g
                key={region.id}
                className="map-marker"
                onMouseEnter={() => setActiveRegion(i)}
                onMouseLeave={() => setActiveRegion(null)}
              >
                <circle cx={x} cy={y} r={isActive ? 12 : 8} fill={region.color} opacity={isActive ? 1 : 0.7} />
                <circle cx={x} cy={y} r={isActive ? 20 : 14} fill={region.color} opacity={isActive ? 0.3 : 0.15} />
                <text x={x} y={y + 28} textAnchor="middle" fill="var(--c-text-1)" fontSize="12" fontWeight="600">{region.name}</text>
                <text x={x} y={y + 42} textAnchor="middle" fill="var(--c-text-3)" fontSize="10">{region.foods} dishes</text>
              </g>
            );
          })}

          <path
            d="M 120 120 Q 250 100 350 150 Q 450 200 500 180 Q 550 160 600 140 Q 650 120 700 100"
            fill="none"
            stroke="var(--c-accent)"
            strokeWidth="2"
            strokeDasharray="8 4"
            opacity="0.4"
          />
        </svg>
      </div>

      <div className="map-legend">
        <h3>6 Regions, 510+ Dishes</h3>
        <p>Every region has its own unique culinary identity, shaped by geography, history, and culture.</p>
      </div>
    </div>
  );
}