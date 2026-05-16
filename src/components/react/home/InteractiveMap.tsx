'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import type { RegionId } from '@/types/food';
import { getRegions, getAllFoods } from '@/lib/data/loaders';

const REGION_HEX: Record<string, string> = {
  sumatera: '#F97316',
  jawa: '#16A34A',
  kalimantan: '#CA8A04',
  sulawesi: '#0891B2',
  'bali-ntt': '#DB2777',
  'maluku-papua': '#7C3AED',
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
  const [hovered, setHovered] = useState<RegionId | null>(null);
  const [selected, setSelected] = useState<RegionId | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasesRef = useRef<Record<string, HTMLCanvasElement>>({});
  const svgRef = useRef<SVGSVGElement>(null);

  // Pre-load images to hidden canvases for pixel-perfect hit detection
  useEffect(() => {
    setMounted(true);

    REGION_ASSETS.forEach(r => {
      const img = new window.Image();
      img.src = r.src;
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1536;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(img, 0, 0, 1536, 1024);
          canvasesRef.current[r.id] = canvas;
        }
      };
    });
  }, []);

  // GSAP entrance animation
  useEffect(() => {
    if (!svgRef.current) return;
    const paths = svgRef.current.querySelectorAll('.map-region-path');
    gsap.from(paths, {
      opacity: 0,
      scale: 0.95,
      stagger: 0.1,
      duration: 0.8,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: svgRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    setTooltipPos({
      x: e.clientX - containerRect.left,
      y: e.clientY - containerRect.top - 12,
    });

    let foundHover: RegionId | null = null;

    // Check hit detection based on z-index (highest first)
    const sortedRegions = [...REGION_ASSETS].sort((a, b) => b.zIndex - a.zIndex);

    for (const r of sortedRegions) {
      const imgElement = document.getElementById(`region-wrap-${r.id}`);
      if (!imgElement) continue;

      const rect = imgElement.getBoundingClientRect();

      // Check if mouse is within this image's bounding box
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        // Map relative mouse position to original 1536x1024 canvas coordinates
        const scaleX = 1536 / rect.width;
        const scaleY = 1024 / rect.height;
        const canvasX = Math.round((e.clientX - rect.left) * scaleX);
        const canvasY = Math.round((e.clientY - rect.top) * scaleY);

        const canvas = canvasesRef.current[r.id];
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            try {
              const pixel = ctx.getImageData(canvasX, canvasY, 1, 1).data;
              // If alpha channel > 10, it's not transparent!
              if (pixel[3] > 10) {
                foundHover = r.id;
                break;
              }
            } catch {
              // Ignore cross-origin canvas errors
            }
          }
        }
      }
    }

    setHovered(foundHover);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(null);
  }, []);

  const handleRegionClick = useCallback((id: RegionId) => {
    setSelected(prev => (prev === id ? null : id));
  }, []);

  const handleMapClick = useCallback(() => {
    if (hovered) {
      handleRegionClick(hovered);
    } else {
      setSelected(null);
    }
  }, [hovered, handleRegionClick]);

  const selectedRegion = selected ? regions.find(r => r.id === selected) : null;
  const selectedCount = selected ? getFoodCount(selected) : 0;

  return (
    <div className="interactive-map" ref={containerRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onClick={handleMapClick}>
      <div className="map-container">
        {/* Ocean background */}
        <div className="map-ocean-bg" />

        {/* Region Images with hit detection */}
        {REGION_ASSETS.map(region => {
          const isActive = selected === region.id;
          const isHovered = hovered === region.id;
          const dimmed = selected && !isActive;
          const color = REGION_HEX[region.id];

          return (
            <div
              key={region.id}
              id={`region-wrap-${region.id}`}
              className="map-region-path"
              style={{
                zIndex: region.zIndex,
                width: region.layout.width,
                left: region.layout.left,
                top: region.layout.top,
                opacity: dimmed ? 0.3 : 1,
                filter: isActive || isHovered
                  ? `drop-shadow(0 0 12px ${color}80) brightness(1.15)`
                  : 'none',
                transform: isActive || isHovered ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <img src={region.src} alt={regions.find(r => r.id === region.id)?.name || region.id} className="map-region-img" />
            </div>
          );
        })}

        {/* Floating tooltip */}
        {hovered && mounted && (
          <div className="map-tooltip" style={{ left: tooltipPos.x, top: tooltipPos.y }}>
            <span className="map-tooltip-dot" style={{ background: REGION_HEX[hovered] }} />
            {regions.find(r => r.id === hovered)?.name}
            <span className="map-tooltip-count">{getFoodCount(hovered)} hidangan</span>
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="map-info-panel">
        <div className="map-region-buttons">
          {regions.map(region => {
            const isActive = selected === region.id;
            const count = getFoodCount(region.id);
            return (
              <button
                key={region.id}
                onClick={() => handleRegionClick(region.id)}
                className={`map-region-btn ${isActive ? 'active' : ''}`}
                style={{ '--region-color': REGION_HEX[region.id] } as React.CSSProperties}
              >
                <span className="map-region-btn-dot" />
                <span className="map-region-btn-name">{region.name}</span>
                <span className="map-region-btn-count">{count}</span>
              </button>
            );
          })}
        </div>

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
                <span className="map-detail-stat-val">5</span>
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