'use client';

import { useState, useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { $regionFilters, $tasteFilters, $typeFilter, clearFilters } from '@/lib/stores/search';
import type { RegionId, Taste, FoodType } from '@/types/food';

const REGIONS: { id: RegionId; label: string }[] = [
  { id: 'sumatera', label: 'Sumatera' },
  { id: 'jawa', label: 'Jawa' },
  { id: 'kalimantan', label: 'Kalimantan' },
  { id: 'sulawesi', label: 'Sulawesi' },
  { id: 'bali-ntt', label: 'Bali & NTT' },
  { id: 'maluku-papua', label: 'Maluku & Papua' },
];

const TASTES: { id: Taste; label: string }[] = [
  { id: 'manis', label: 'Manis' },
  { id: 'pedas', label: 'Pedas' },
  { id: 'gurih', label: 'Gurih' },
  { id: 'asam', label: 'Asam' },
  { id: 'asin', label: 'Asin' },
];

const TYPES: { id: FoodType; label: string }[] = [
  { id: 'berkuah', label: 'Berkuah' },
  { id: 'digoreng', label: 'Digoreng' },
  { id: 'dibakar', label: 'Dibakar' },
  { id: 'mentah', label: 'Mentah' },
  { id: 'minuman', label: 'Minuman' },
];

function ToggleChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`duo-badge ${active ? 'duo-badge-accent' : ''}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

export default function FilterPanel() {
  const regions = useStore($regionFilters);
  const tastes = useStore($tasteFilters);
  const type = useStore($typeFilter);
  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
      if (!e.matches) setCollapsed(false);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const activeCount = regions.size + tastes.size + (type ? 1 : 0);

  function toggleRegion(id: RegionId) {
    const next = new Set(regions);
    next.has(id) ? next.delete(id) : next.add(id);
    $regionFilters.set(next);
  }

  function toggleTaste(id: Taste) {
    const next = new Set(tastes);
    next.has(id) ? next.delete(id) : next.add(id);
    $tasteFilters.set(next);
  }

  function setType(id: FoodType | null) {
    $typeFilter.set(type === id ? null : id);
  }

  return (
    <aside className="filter-panel duo-card" style={{ padding: 'var(--sp-4)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--sp-3)',
          paddingBottom: 'var(--sp-3)',
          borderBottom: '1px solid var(--c-border)',
        }}
      >
        {isMobile ? (
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-expanded={!collapsed}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--sp-2)',
              fontSize: 'var(--fs-base)',
              fontWeight: 700,
              color: 'var(--c-text-1)',
              fontFamily: 'var(--ff-display)',
            }}
          >
            Filter{activeCount > 0 ? ` (${activeCount})` : ''}
            <span
              style={{
                display: 'inline-block',
                transition: 'transform 0.3s ease',
                transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)',
                fontSize: '0.7rem',
              }}
            >
              ▼
            </span>
          </button>
        ) : (
          <h3 style={{ fontSize: 'var(--fs-lg)', fontWeight: 700, color: 'var(--c-text-1)', fontFamily: 'var(--ff-display)' }}>
            Filter
          </h3>
        )}
        <button
          onClick={clearFilters}
          className="duo-btn-sm duo-btn-outline"
          style={{ fontSize: 'var(--fs-xs)', padding: '4px 12px', minHeight: 0 }}
        >
          Hapus
        </button>
      </div>

      <div ref={sectionsRef} className={`filter-sections ${collapsed && isMobile ? 'collapsed' : ''}`}>
        <section style={{ marginBottom: 'var(--sp-4)' }}>
          <h4 className="filter-section-label">Wilayah</h4>
          <div className="filter-chips">
            {REGIONS.map(r => (
              <ToggleChip
                key={r.id}
                label={r.label}
                active={regions.has(r.id)}
                onClick={() => toggleRegion(r.id)}
              />
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 'var(--sp-4)' }}>
          <h4 className="filter-section-label">Rasa</h4>
          <div className="filter-chips">
            {TASTES.map(t => (
              <ToggleChip key={t.id} label={t.label} active={tastes.has(t.id)} onClick={() => toggleTaste(t.id)} />
            ))}
          </div>
        </section>

        <section>
          <h4 className="filter-section-label">Jenis</h4>
          <div className="filter-chips">
            {TYPES.map(t => (
              <ToggleChip key={t.id} label={t.label} active={type === t.id} onClick={() => setType(t.id)} />
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}
