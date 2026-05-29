'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { $selectedRegion } from '@/lib/stores/selectedRegion';
import { getAllFoods, getRegions } from '@/lib/data/loaders';
import './FeaturedFoodsGrid.css';

const ITEMS_PER_PAGE = 8;

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | 'ellipsis')[] = [1];
  if (current > 3) pages.push('ellipsis');
  const start = Math.max(2, current - 1);
  const end   = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push('ellipsis');
  pages.push(total);
  return pages;
}

const foodImages: Record<string, string> = {
  'rendang-001':    'https://images.unsplash.com/photo-1563379091339-03b21ab4e23f?w=400&q=80',
  'nasi-goreng-003':'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80',
  'gado-gado-004':  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
};

const allFoods = getAllFoods();
const regions  = getRegions();

// Tipe animasi yang berbeda untuk setiap trigger
type AnimTrigger = 'initial' | 'region' | 'page-next' | 'page-prev';

export default function FeaturedFoodsGrid() {
  const selectedId = useStore($selectedRegion);
  const gridRef    = useRef<HTMLDivElement>(null);

  const [page,     setPage]     = useState(1);
  const [animKey,  setAnimKey]  = useState(1);   // 1 = trigger animasi initial saat mount
  const [trigger,  setTrigger]  = useState<AnimTrigger>('initial');

  const prevIdRef   = useRef<string | null>(null);
  const prevPageRef = useRef(1);
  const isAnimating = useRef(false);

  const filtered   = selectedId ? allFoods.filter(f => f.region === selectedId) : allFoods;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIdx   = (page - 1) * ITEMS_PER_PAGE;
  const paginated  = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // ── Animasi masuk cards ──────────────────────────────────────────
  const animateIn = useCallback((t: AnimTrigger) => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>('.result-card'));
    if (!cards.length) return;

    import('gsap').then(({ default: gsap }) => {
      gsap.killTweensOf(cards);

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      if (t === 'initial') {
        // Pertama kali muncul — stagger dari bawah, lambat
        gsap.fromTo(cards,
          { opacity: 0, y: 32, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1,
            duration: 0.7, stagger: 0.07, ease: 'power3.out',
            clearProps: 'transform' }
        );

      } else if (t === 'region') {
        // Region baru — masuk dari bawah lebih jauh, stagger lebih cepat
        gsap.fromTo(cards,
          { opacity: 0, y: 48, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1,
            duration: 0.65, stagger: 0.055, ease: 'power3.out',
            clearProps: 'transform' }
        );

      } else if (t === 'page-next') {
        // Halaman berikutnya — slide masuk dari kanan
        gsap.fromTo(cards,
          { opacity: 0, x: 40, scale: 0.97 },
          { opacity: 1, x: 0, scale: 1,
            duration: 0.55, stagger: 0.05, ease: 'power3.out',
            clearProps: 'transform' }
        );

      } else if (t === 'page-prev') {
        // Halaman sebelumnya — slide masuk dari kiri
        gsap.fromTo(cards,
          { opacity: 0, x: -40, scale: 0.97 },
          { opacity: 1, x: 0, scale: 1,
            duration: 0.55, stagger: 0.05, ease: 'power3.out',
            clearProps: 'transform' }
        );
      }
    });
  }, []);

  // ── Animasi keluar cards, lalu jalankan callback ─────────────────
  const animateOut = useCallback((
    t: AnimTrigger,
    cb: () => void
  ) => {
    const grid = gridRef.current;
    if (!grid) { cb(); return; }
    const cards = Array.from(grid.querySelectorAll<HTMLElement>('.result-card'));
    if (!cards.length) { cb(); return; }

    import('gsap').then(({ default: gsap }) => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) { cb(); return; }

      gsap.killTweensOf(cards);

      if (t === 'region') {
        // Exit ke atas + fade
        gsap.to(cards, {
          opacity: 0, y: -24, scale: 0.97,
          duration: 0.3, stagger: 0.03, ease: 'power2.in',
          onComplete: cb,
        });
      } else if (t === 'page-next') {
        // Exit ke kiri
        gsap.to(cards, {
          opacity: 0, x: -32,
          duration: 0.25, stagger: 0.025, ease: 'power2.in',
          onComplete: cb,
        });
      } else if (t === 'page-prev') {
        // Exit ke kanan
        gsap.to(cards, {
          opacity: 0, x: 32,
          duration: 0.25, stagger: 0.025, ease: 'power2.in',
          onComplete: cb,
        });
      } else {
        cb();
      }
    });
  }, []);

  // ── Region berubah ───────────────────────────────────────────────
  useEffect(() => {
    if (prevIdRef.current === selectedId) return;
    const isInitial = prevIdRef.current === null;
    prevIdRef.current = selectedId;

    if (isInitial) {
      // Load awal — animateIn sudah ditangani oleh effect animKey=1
      return;
    }

    if (isAnimating.current) return;
    isAnimating.current = true;

    animateOut('region', () => {
      setPage(1);
      prevPageRef.current = 1;
      setTrigger('region');
      setAnimKey(k => k + 1);
      isAnimating.current = false;
    });
  }, [selectedId, animateOut]);

  // ── Animasi masuk setelah animKey berubah ────────────────────────
  useEffect(() => {
    // Tunggu satu frame agar React render cards baru dulu
    const raf = requestAnimationFrame(() => {
      animateIn(trigger);
    });
    return () => cancelAnimationFrame(raf);
  }, [animKey, trigger, animateIn]);

  // ── Ganti halaman ────────────────────────────────────────────────
  const goToPage = useCallback((p: number) => {
    if (p < 1 || p > totalPages || isAnimating.current) return;
    isAnimating.current = true;

    const dir: AnimTrigger = p > page ? 'page-next' : 'page-prev';

    animateOut(dir, () => {
      prevPageRef.current = p;
      setPage(p);
      setTrigger(dir);
      setAnimKey(k => k + 1);
      isAnimating.current = false;

      // Scroll ke atas grid setelah state update
      requestAnimationFrame(() => {
        const target = document.getElementById('featured');
        if (!target) return;
        const w = window as any;
        if (w.lenis?.scrollTo) {
          w.lenis.scrollTo(target, { offset: -88, duration: 1.0 });
        } else {
          const top = target.getBoundingClientRect().top + window.scrollY - 88;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }, [page, totalPages, animateOut]);

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <section className="featured" id="featured">
      <div className="container">
        <div className="results-grid-inner" ref={gridRef} key={animKey}>
          {paginated.map((food) => {
            const foodRegion = regions.find(r => r.id === food.region);
            const imgUrl = food.imageUrl || foodImages[food.id]
              || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80';
            return (
              <a
                href={`/hidangan/${food.id}`}
                className="result-card duo-card flex flex-col overflow-hidden"
                key={food.id}
              >
                <div className="result-card-image">
                  <img
                    src={imgUrl}
                    alt={food.name}
                    loading="lazy"
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      if (!img.dataset.fallback) {
                        img.dataset.fallback = '1';
                        img.src = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=70';
                      }
                    }}
                  />
                </div>
                <div className="result-card-content">
                  <h3>{food.name}</h3>
                  <span className="result-card-region">{foodRegion?.name || food.region}</span>
                  <div className="result-card-tags">
                    {food.taste.slice(0, 3).map(t => (
                      <span key={t} className="result-card-tag">{t}</span>
                    ))}
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="pagination-bar">
            <button
              className="pagination-nav"
              disabled={page === 1}
              onClick={() => goToPage(page - 1)}
              aria-label="Halaman sebelumnya"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>

            {pageNumbers.map((p, i) =>
              p === 'ellipsis' ? (
                <span className="pagination-ellipsis" key={`e-${i}`}>⋯</span>
              ) : (
                <button
                  key={p}
                  className={`pagination-btn${p === page ? ' active' : ''}`}
                  onClick={() => goToPage(p as number)}
                  aria-label={`Halaman ${p}`}
                  aria-current={p === page ? 'page' : undefined}
                >
                  {p}
                </button>
              )
            )}

            <button
              className="pagination-nav"
              disabled={page === totalPages}
              onClick={() => goToPage(page + 1)}
              aria-label="Halaman berikutnya"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>

            <span className="pagination-status">Halaman {page} dari {totalPages}</span>
          </div>
        )}
      </div>
    </section>
  );
}
