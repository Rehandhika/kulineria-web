'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import type { RegionId } from '@/types/food';
import { getRegions } from '@/lib/data/loaders';
import { $selectedRegion, setSelectedRegion } from '@/lib/stores/selectedRegion';

const REGION_HEX: Record<string, string> = {
  sumatera:       '#B5462E',
  jawa:           '#B07D1A',
  kalimantan:     '#2E7D6B',
  sulawesi:       '#6A3FA0',
  'bali-ntt':     '#1F7A8C',
  'maluku-papua': '#C0392B',
};

const regions = getRegions();

interface RegionLayout {
  wPct: string;
  lPct: string;
  tPct: string;
  intrinsic: { w: number; h: number };
}

interface RegionAsset {
  id: RegionId;
  src: string;
  zIndex: number;
  layout: RegionLayout;
}

const REGION_ASSETS: RegionAsset[] = [
  { id: 'sumatera',     src: '/img/map/Sumatera.png',              zIndex: 7, layout: { wPct: '34%',  lPct: '-2%',  tPct: '11%',  intrinsic: { w: 294, h: 196 } } },
  { id: 'jawa',         src: '/img/map/Jawa.png',                  zIndex: 5, layout: { wPct: '36%',  lPct: '17%',  tPct: '47%',  intrinsic: { w: 407, h: 271 } } },
  { id: 'kalimantan',   src: '/img/map/Kalimantan.png',            zIndex: 6, layout: { wPct: '48%',  lPct: '12%',  tPct: '13%',  intrinsic: { w: 504, h: 336 } } },
  { id: 'sulawesi',     src: '/img/map/Sulawesi.png',              zIndex: 3, layout: { wPct: '30%',  lPct: '43%',  tPct: '16%',  intrinsic: { w: 300, h: 200 } } },
  { id: 'bali-ntt',     src: '/img/map/bali-ntt.png',              zIndex: 4, layout: { wPct: '36%',  lPct: '47%',  tPct: '50%',  intrinsic: { w: 381, h: 240 } } },
  { id: 'maluku-papua', src: '/img/map/Maluku%20Papua.png',        zIndex: 2, layout: { wPct: '32%',  lPct: '68%',  tPct: '19%',  intrinsic: { w: 349, h: 361 } } },
];

const REGION_SORTED = [...REGION_ASSETS].sort((a, b) => b.zIndex - a.zIndex);

function loadImageData(src: string): Promise<ImageData | null> {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext('2d');
      if (!ctx) { resolve(null); return; }
      ctx.drawImage(img, 0, 0);
      resolve(ctx.getImageData(0, 0, img.width, img.height));
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export default function InteractiveMap() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const selected = useStore($selectedRegion);

  const containerRef = useRef<HTMLDivElement>(null);
  const pixelData = useRef<Record<string, ImageData>>({});

  useEffect(() => {
    REGION_ASSETS.forEach(async r => {
      const d = await loadImageData(r.src);
      if (d) pixelData.current[r.src] = d;
    });
  }, []);

  const hitTest = useCallback((clientX: number, clientY: number): string | null => {
    const el = containerRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const rx = clientX - rect.left;
    const ry = clientY - rect.top;

    for (const r of REGION_SORTED) {
      const l = parseFloat(r.layout.lPct);
      const w = parseFloat(r.layout.wPct);
      const t = parseFloat(r.layout.tPct);
      const iw = r.layout.intrinsic.w;
      const ih = r.layout.intrinsic.h;

      const bw = (w / 100) * rect.width;
      const bh = bw * (ih / iw);
      const bx = (l / 100) * rect.width;
      const by = (t / 100) * rect.height;

      if (rx < bx || rx > bx + bw || ry < by || ry > by + bh) continue;

      const data = pixelData.current[r.src];
      if (!data) return r.id;

      const px = Math.floor(((rx - bx) / bw) * data.width);
      const py = Math.floor(((ry - by) / bh) * data.height);
      if (px < 0 || px >= data.width || py < 0 || py >= data.height) continue;

      if (data.data[(py * data.width + px) * 4 + 3] > 10) return r.id;
    }
    return null;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const rx = e.clientX - rect.left;
    const ry = e.clientY - rect.top;
    setTooltipPos({ x: rx, y: ry - 12 });

    const id = hitTest(e.clientX, e.clientY);
    if (id !== hovered) setHovered(id);
  }, [hovered, hitTest]);

  const handleMouseLeave = useCallback(() => {
    setHovered(null);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const id = hitTest(e.clientX, e.clientY);
    if (!id) return;
    setSelectedRegion(selected === id ? null : id as RegionId);
  }, [hitTest, selected]);

  const handleTouch = useCallback((e: React.TouchEvent) => {

    e.preventDefault();
    const touch = e.changedTouches[0];
    if (!touch) return;
    const id = hitTest(touch.clientX, touch.clientY);
    if (!id) return;
    setSelectedRegion(selected === id ? null : id as RegionId);
  }, [hitTest, selected]);

  const handleKeyDown = useCallback((id: string) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedRegion(selected === id ? null : id as RegionId);
    }
  }, [selected]);

  return (
    <div
      className="interactive-map"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onTouchEnd={handleTouch}
    >
      <div className="map-container relative w-full overflow-hidden rounded-2xl border shadow-[var(--sh-card)]">
        <div className="map-ocean-bg absolute inset-0 z-0 pointer-events-none" />

        {}
        <img src="/img/motif/png awan.png" className="map-motif map-motif-tl motif-float-1" aria-hidden="true" alt="" width={160} height={100} />
        <img src="/img/motif/png awan.png" className="map-motif map-motif-tr motif-float-3" aria-hidden="true" alt="" width={160} height={100} />

        {}
        <img src="/img/motif/png ornamen nusantara.png" className="map-motif map-motif-bl-ornament motif-float-2" aria-hidden="true" alt="" width={220} height={220} />
        <img src="/img/motif/png ornamen nusantara.png" className="map-motif map-motif-br-ornament motif-float-1" aria-hidden="true" alt="" width={220} height={220} />

        {}
        <img src="/img/motif/png awan.png" className="map-motif map-motif-inner-1 motif-float-3" aria-hidden="true" alt="" width={110} height={69} />
        <img src="/img/motif/png awan.png" className="map-motif map-motif-inner-2 motif-float-2" aria-hidden="true" alt="" width={120} height={75} />

        <div className="map-content-wrapper">
          {REGION_ASSETS.map(region => {
            const isActive = selected === region.id;
            const isHovered = hovered === region.id;
            const dimmed = selected && !isActive;
            const color = REGION_HEX[region.id];

            return (
              <div
                key={region.id}
                id={`region-wrap-${region.id}`}
                className={`map-region-path ${isActive ? 'is-active-pulse' : ''} ${isHovered ? 'is-hovered' : ''}`}
                tabIndex={0}
                role="button"
                aria-label={regions.find(r => r.id === region.id)?.name || region.id}
                onKeyDown={handleKeyDown(region.id)}
                style={{
                  zIndex: region.zIndex,
                  width: region.layout.wPct,
                  left: region.layout.lPct,
                  top: region.layout.tPct,
                  opacity: dimmed ? 0.3 : 1,
                  '--region-pulse-color': `${color}99`,
                } as React.CSSProperties}
              >
                <img
                  src={region.src}
                  alt=""
                  className="map-region-img"
                  width={region.layout.intrinsic.w}
                  height={region.layout.intrinsic.h}
                  draggable={false}
                  loading="eager"
                />
              </div>
            );
          })}
        </div>

        {hovered && (
          <div className="map-tooltip" style={{ left: tooltipPos.x, top: tooltipPos.y }}>
            {regions.find(r => r.id === hovered)?.name}
          </div>
        )}
      </div>
    </div>
  );
}
