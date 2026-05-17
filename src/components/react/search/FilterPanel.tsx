'use client';

import { useState, useEffect } from 'react';
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

function ToggleChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      className={`filter-chip ${active ? 'active' : ''}`}
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

  const showSections = !isMobile || !collapsed;

  return (
    <aside className="filter-panel">
      <div className="filter-header">
        {isMobile ? (
          <button
            className="filter-toggle"
            onClick={() => setCollapsed(!collapsed)}
            aria-expanded={!collapsed}
          >
            Filter{activeCount > 0 ? ` (${activeCount})` : ''}
            <span className={`filter-toggle-icon ${!collapsed ? 'open' : ''}`}>▼</span>
          </button>
        ) : (
          <h3>Filter</h3>
        )}
        <button onClick={clearFilters} className="filter-clear">Hapus semua</button>
      </div>

      {showSections && (
        <div className="filter-sections">
          <section className="filter-section">
            <h4>Wilayah</h4>
            <div className="filter-chips">
              {REGIONS.map(r => (
                <ToggleChip key={r.id} label={r.label} active={regions.has(r.id)} onClick={() => toggleRegion(r.id)} />
              ))}
            </div>
          </section>

          <section className="filter-section">
            <h4>Rasa</h4>
            <div className="filter-chips">
              {TASTES.map(t => (
                <ToggleChip key={t.id} label={t.label} active={tastes.has(t.id)} onClick={() => toggleTaste(t.id)} />
              ))}
            </div>
          </section>

          <section className="filter-section">
            <h4>Jenis</h4>
            <div className="filter-chips">
              {TYPES.map(t => (
                <ToggleChip key={t.id} label={t.label} active={type === t.id} onClick={() => setType(t.id)} />
              ))}
            </div>
          </section>
        </div>
      )}
    </aside>
  );
}
