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
  'maluku-papua': '/img/map/Maluku%20Papua.png',
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

export function getTasteIcon(id: string, size = 14) {
  switch (id.toLowerCase().trim()) {
    case 'manis':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
        </svg>
      );
    case 'pedas':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
          <path d="M17.66 9.53a8.1 8.1 0 0 0-3.32-4.14 1 1 0 0 0-1.25.12 1 1 0 0 0-.17.3c-.63 1.76-.11 3.54.55 4.98a3 3 0 0 1-2.47 4.13c-.08 0-.16.01-.24.01a3 3 0 0 1-2.93-3.41 1 1 0 0 0-.25-.8 1 1 0 0 0-.91-.25 7 7 0 1 0 12.01-1.23 1 1 0 0 0-.98.29Z"/>
        </svg>
      );
    case 'gurih':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
          <path d="M2 12h20a1 1 0 0 1 1 1v2a6 6 0 0 1-6 6H7a6 6 0 0 1-6-6v-2a1 1 0 0 1 1-1zm10-10a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm-4 2a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0V5a1 1 0 0 1 1-1zm8 0a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0V5a1 1 0 0 1 1-1z"/>
        </svg>
      );
    case 'asam':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
          <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C7.86 4 4.5 7.36 4.5 11.5S7.86 19 12 19c3.4 0 6.29-2.26 7.22-5.38a1 1 0 0 0-.66-1.23 1 1 0 0 0-1.21.65c-.63 2.11-2.58 3.96-5.35 3.96-2.76 0-5-2.24-5-5s2.24-5 5-5c2.44 0 4.47 1.8 4.9 4.14a1 1 0 0 0 1.2.78 1 1 0 0 0 .76-1.18z"/>
        </svg>
      );
    case 'asin':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
          <path d="M19 8h-2V5c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v3H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 5h6v3H9V5zm8 15H7v-2h10v2zm0-4H7v-6h10v6z"/>
        </svg>
      );
    default:
      return null;
  }
}

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
                    <span
                      className="fp-chip-icon"
                      style={{ '--map-icon-url': `url('${r.mapIcon}')` } as React.CSSProperties}
                      aria-hidden="true"
                    />
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
                    <span className="fp-chip-symbol">{getTasteIcon(t.id)}</span>
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
