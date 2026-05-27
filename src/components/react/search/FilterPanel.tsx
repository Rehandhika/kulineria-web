'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { $regionFilters, $tasteFilters, clearFilters } from '@/lib/stores/search';
import type { RegionId, Taste } from '@/types/food';

const REGIONS: { id: RegionId; label: string; color: string }[] = [
  { id: 'sumatera',     label: 'Sumatera',        color: 'var(--c-sumatera)' },
  { id: 'jawa',         label: 'Jawa',             color: 'var(--c-jawa)' },
  { id: 'kalimantan',   label: 'Kalimantan',       color: 'var(--c-kalimantan)' },
  { id: 'sulawesi',     label: 'Sulawesi',         color: 'var(--c-sulawesi)' },
  { id: 'bali-ntt',     label: 'Bali & NTT',       color: 'var(--c-bali-ntt)' },
  { id: 'maluku-papua', label: 'Maluku & Papua',   color: 'var(--c-maluku-papua)' },
];

const TASTES: { id: Taste; label: string; emoji: string }[] = [
  { id: 'manis', label: 'Manis', emoji: '🍯' },
  { id: 'pedas', label: 'Pedas', emoji: '🌶️' },
  { id: 'gurih', label: 'Gurih', emoji: '🧆' },
  { id: 'asam',  label: 'Asam',  emoji: '🍋' },
  { id: 'asin',  label: 'Asin',  emoji: '🧂' },
];

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterPanel({ isOpen, onClose }: FilterPanelProps) {
  const regions = useStore($regionFilters);
  const tastes  = useStore($tasteFilters);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (isOpen && panelRef.current) {
      const firstBtn = panelRef.current.querySelector<HTMLElement>('button');
      firstBtn?.focus();
    }
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
      {/* Backdrop */}
      <div
        ref={overlayRef}
        className={`fp-backdrop${isOpen ? ' fp-backdrop--open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Filter hidangan"
        className={`fp-panel${isOpen ? ' fp-panel--open' : ''}`}
      >
        {/* Two-column grid */}
        <div className="fp-columns">

          {/* Left: Wilayah */}
          <div className="fp-col">
            <p className="fp-col-label">
              <span className="fp-col-label-muted">Filter</span> per Wilayah
            </p>
            <div className="fp-list">
              {REGIONS.map(r => {
                const active = regions.has(r.id);
                return (
                  <button
                    key={r.id}
                    className={`fp-item fp-item--region${active ? ' fp-item--active' : ''}`}
                    style={active ? { '--fp-item-color': r.color } as React.CSSProperties : undefined}
                    onClick={() => toggleRegion(r.id)}
                    aria-pressed={active}
                  >
                    <span
                      className="fp-item-dot"
                      style={{ background: r.color }}
                      aria-hidden="true"
                    />
                    <span className="fp-item-label">{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Rasa */}
          <div className="fp-col">
            <p className="fp-col-label">
              <span className="fp-col-label-muted">Filter</span> per Rasa
            </p>
            <div className="fp-list">
              {TASTES.map(t => {
                const active = tastes.has(t.id);
                return (
                  <button
                    key={t.id}
                    className={`fp-item${active ? ' fp-item--active fp-item--taste-active' : ''}`}
                    onClick={() => toggleTaste(t.id)}
                    aria-pressed={active}
                  >
                    <span className="fp-item-emoji" aria-hidden="true">{t.emoji}</span>
                    <span className="fp-item-label">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer: clear + close */}
        <div className="fp-footer">
          {activeCount > 0 && (
            <button
              className="fp-clear-btn"
              onClick={clearFilters}
            >
              Hapus filter ({activeCount})
            </button>
          )}
          <button
            className="fp-close-btn"
            onClick={onClose}
            aria-label="Tutup filter"
          >
            ✕
          </button>
        </div>
      </div>
    </>
  );
}
