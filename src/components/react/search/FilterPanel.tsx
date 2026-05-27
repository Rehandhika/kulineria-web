'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { $regionFilters, $tasteFilters, clearFilters } from '@/lib/stores/search';
import type { RegionId, Taste } from '@/types/food';

const REGIONS: { id: RegionId; label: string; color: string }[] = [
  { id: 'sumatera',     label: 'Sumatera',       color: 'var(--c-sumatera)' },
  { id: 'jawa',         label: 'Jawa',            color: 'var(--c-jawa)' },
  { id: 'kalimantan',   label: 'Kalimantan',      color: 'var(--c-kalimantan)' },
  { id: 'sulawesi',     label: 'Sulawesi',        color: 'var(--c-sulawesi)' },
  { id: 'bali-ntt',     label: 'Bali & NTT',      color: 'var(--c-bali-ntt)' },
  { id: 'maluku-papua', label: 'Maluku & Papua',  color: 'var(--c-maluku-papua)' },
];

const TASTES: { id: Taste; label: string }[] = [
  { id: 'manis', label: 'Manis' },
  { id: 'pedas', label: 'Pedas' },
  { id: 'gurih', label: 'Gurih' },
  { id: 'asam',  label: 'Asam'  },
  { id: 'asin',  label: 'Asin'  },
];

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterPanel({ isOpen, onClose }: FilterPanelProps) {
  const regions = useStore($regionFilters);
  const tastes  = useStore($tasteFilters);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) panelRef.current?.querySelector<HTMLElement>('button')?.focus();
  }, [isOpen]);

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

  const activeCount = regions.size + tastes.size;

  return (
    <>
      <div
        className={`fp-backdrop${isOpen ? ' fp-backdrop--open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Filter hidangan"
        className={`fp-panel${isOpen ? ' fp-panel--open' : ''}`}
      >
        {/* Header */}
        <div className="fp-header">
          <span className="fp-title">Filter</span>
          {activeCount > 0 && (
            <button className="fp-clear-btn" onClick={clearFilters}>
              Hapus ({activeCount})
            </button>
          )}
        </div>

        {/* Body: 2 kolom */}
        <div className="fp-body">

          {/* Wilayah */}
          <div className="fp-section fp-section--region">
            <p className="fp-section-label">Wilayah</p>
            <div className="fp-grid">
              {REGIONS.map(r => {
                const active = regions.has(r.id);
                return (
                  <button
                    key={r.id}
                    className={`fp-chip${active ? ' fp-chip--active' : ''}`}
                    style={active ? { '--fp-chip-color': r.color } as React.CSSProperties : undefined}
                    onClick={() => toggleRegion(r.id)}
                    aria-pressed={active}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rasa */}
          <div className="fp-section">
            <p className="fp-section-label">Rasa</p>
            <div className="fp-grid">
              {TASTES.map(t => {
                const active = tastes.has(t.id);
                return (
                  <button
                    key={t.id}
                    className={`fp-chip${active ? ' fp-chip--active fp-chip--taste' : ''}`}
                    onClick={() => toggleTaste(t.id)}
                    aria-pressed={active}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Close */}
        <div className="fp-footer">
          <button className="fp-close-btn" onClick={onClose} aria-label="Tutup filter">
            ✕
          </button>
        </div>
      </div>
    </>
  );
}
