'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { $regionFilters, $tasteFilters, clearFilters } from '@/lib/stores/search';
import type { RegionId, Taste } from '@/types/food';

const MAP_ICONS: Record<string, string> = {
  sumatera: '/img/map/Sumatera.png',
  jawa: '/img/map/Jawa.png',
  kalimantan: '/img/map/Kalimantan.png',
  sulawesi: '/img/map/Sulawesi.png',
  'bali-ntt': '/img/map/bali-ntt.png',
  'maluku-papua': '/img/map/Maluku Papua.png',
};

const REGIONS: { id: RegionId; label: string; color: string; mapIcon: string }[] = [
  { id: 'sumatera',     label: 'Sumatera',       color: 'var(--c-sumatera)',     mapIcon: MAP_ICONS.sumatera },
  { id: 'jawa',         label: 'Jawa',            color: 'var(--c-jawa)',          mapIcon: MAP_ICONS.jawa },
  { id: 'kalimantan',   label: 'Kalimantan',      color: 'var(--c-kalimantan)',   mapIcon: MAP_ICONS.kalimantan },
  { id: 'sulawesi',     label: 'Sulawesi',        color: 'var(--c-sulawesi)',     mapIcon: MAP_ICONS.sulawesi },
  { id: 'bali-ntt',     label: 'Bali & NTT',      color: 'var(--c-bali-ntt)',     mapIcon: MAP_ICONS['bali-ntt'] },
  { id: 'maluku-papua', label: 'Maluku & Papua',  color: 'var(--c-maluku-papua)', mapIcon: MAP_ICONS['maluku-papua'] },
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

  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Record the element that had focus before opening
    triggerRef.current = document.activeElement as HTMLElement;

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key !== 'Tab' || !panelRef.current) return;

      const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(focusableSelector)
      );

      if (focusables.length === 0) return;

      const firstElement = focusables[0];
      const lastElement = focusables[focusables.length - 1];
      const activeElement = document.activeElement as HTMLElement;

      if (e.shiftKey) {
        // Shift + Tab: wrap from first element to last element
        if (activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: wrap from last element to first element
        if (activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeydown);

    // Initial focus on the first focusable button (Hapus/Clear button if active, or Close button)
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const firstFocusable = panelRef.current?.querySelector<HTMLElement>(focusableSelector);
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 50);
    }

    return () => {
      window.removeEventListener('keydown', handleKeydown);
      // Return focus to the trigger element when closed
      if (triggerRef.current) {
        triggerRef.current.focus();
        triggerRef.current = null;
      }
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
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
                    className={`fp-chip fp-chip--region${active ? ' fp-chip--active' : ''}`}
                    style={{ '--fp-chip-color': r.color } as React.CSSProperties}
                    onClick={() => toggleRegion(r.id)}
                    aria-pressed={active}
                  >
                    <img src={r.mapIcon} alt="" width="18" height="18" className="fp-chip-icon"
                      style={{ objectFit: 'contain', flexShrink: 0, filter: active ? 'none' : 'grayscale(1) opacity(0.5)' }} />
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
