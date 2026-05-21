'use client';

import { useState, useCallback, useRef } from 'react';
import type { RegionId } from '@/types/food';
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

interface RegionAsset {
  id: RegionId;
  src: string;
  zIndex: number;
  layout: { width: string; left: string; top: string };
}

const REGION_ASSETS: RegionAsset[] = [
  { id: 'sumatera', src: '/img/map/SUMATERA.png', zIndex: 6, layout: { width: '41.2%', left: '-1.2%', top: '10.1%' } },
  { id: 'jawa', src: '/img/map/JAWA.png', zIndex: 5, layout: { width: '34.2%', left: '21.6%', top: '48.4%' } },
  { id: 'kalimantan', src: '/img/map/KALIMANTAN.png', zIndex: 4, layout: { width: '48.3%', left: '19.8%', top: '11.1%' } },
  { id: 'sulawesi', src: '/img/map/SULAWESI.png', zIndex: 3, layout: { width: '43.4%', left: '40.4%', top: '17.8%' } },
  { id: 'bali-ntt', src: '/img/map/BALI NTB.png', zIndex: 2, layout: { width: '27.6%', left: '43.4%', top: '57.1%' } },
  { id: 'maluku-papua', src: '/img/map/PAPUA MALUKU.png', zIndex: 1, layout: { width: '47.3%', left: '53.6%', top: '18.5%' } },
];

export default function InteractiveMap() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 12,
    });
  }, []);

  const handleRegionEnter = useCallback((id: string) => {
    setHovered(id);
  }, []);

  const handleRegionLeave = useCallback(() => {
    setHovered(null);
  }, []);

  const handleRegionClick = useCallback((id: string) => {
    setSelected(prev => (prev === id ? null : id));
  }, []);

  const selectedRegion = selected ? regions.find(r => r.id === selected) : null;
  const selectedCount = selected ? getFoodCount(selected) : 0;

  return (
    <div className="interactive-map" ref={containerRef} onMouseMove={handleMouseMove}>
      <div className="map-container relative w-full aspect-[16/10] md:aspect-[2/1] overflow-hidden rounded-2xl bg-[var(--c-surface)] border-[3px] border-[var(--duo-stroke-color)] shadow-[0_5px_0_var(--c-duo-shadow)]">
        <div className="map-ocean-bg absolute inset-0 z-0" />

        {REGION_ASSETS.map(region => {
          const isActive = selected === region.id;
          const isHovered = hovered === region.id;
          const dimmed = selected && !isActive;
          const color = REGION_HEX[region.id];

          return (
            <button
              key={region.id}
              id={`region-wrap-${region.id}`}
              className="map-region-path absolute"
              type="button"
              aria-label={regions.find(r => r.id === region.id)?.name || region.id}
              style={{
                zIndex: region.zIndex,
                width: region.layout.width,
                left: region.layout.left,
                top: region.layout.top,
                opacity: dimmed ? 0.3 : 1,
                filter: isActive || isHovered
                  ? `drop-shadow(0 0 16px ${color}99) brightness(1.2) saturate(1.1)`
                  : 'none',
                transform: isActive || isHovered ? 'scale(1.03)' : 'scale(1)',
                cursor: 'pointer',
                padding: 0,
                border: 'none',
                background: 'none',
                outline: 'none',
              }}
              onClick={() => handleRegionClick(region.id)}
              onMouseEnter={() => handleRegionEnter(region.id)}
              onMouseLeave={handleRegionLeave}
            >
              <img
                src={region.src}
                alt=""
                className="map-region-img"
                draggable={false}
                style={{ pointerEvents: 'none', width: '100%', height: 'auto' }}
              />
            </button>
          );
        })}

        {hovered && (
          <div className="map-tooltip" style={{ left: tooltipPos.x, top: tooltipPos.y, pointerEvents: 'none' }}>
            <span className="map-tooltip-dot" style={{ background: REGION_HEX[hovered] }} />
            {regions.find(r => r.id === hovered)?.name}
            <span className="map-tooltip-count">{getFoodCount(hovered)} hidangan</span>
          </div>
        )}
      </div>

      <div className="map-info-panel">
        {selectedRegion ? (
          <div className="map-detail-card">
            <div className="map-detail-header">
              <div className="map-detail-icon" style={{ background: `${REGION_HEX[selectedRegion.id]}20`, borderColor: REGION_HEX[selectedRegion.id] }} />
              <div>
                <p className="label-overline">Wilayah Terpilih</p>
                <h3 className="map-detail-title">{selectedRegion.name}</h3>
              </div>
            </div>
            <p className="map-detail-desc">{selectedRegion.naraDialog}</p>
            <div className="map-detail-stats">
              <div className="map-detail-stat">
                <span className="map-detail-stat-val">{selectedCount}</span>
                <span className="map-detail-stat-label">Hidangan</span>
              </div>
              <div className="map-detail-stat">
                <span className="map-detail-stat-val">{new Set(allFoods.filter(f => f.region === selectedRegion.id).flatMap(f => f.taste)).size}</span>
                <span className="map-detail-stat-label">Rasa</span>
              </div>
            </div>
            <a href={`/search?region=${selectedRegion.id}`} className="map-explore-btn" style={{ background: REGION_HEX[selectedRegion.id] }}>
              Lihat Semua Hidangan →
            </a>
          </div>
        ) : (
          <div className="map-empty-card">
            <div className="map-empty-icon">🗺️</div>
            <p>Klik pulau atau pilih wilayah untuk melihat kuliner khas daerah</p>
          </div>
        )}
      </div>
    </div>
  );
}
