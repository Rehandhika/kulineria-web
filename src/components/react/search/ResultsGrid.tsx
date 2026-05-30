'use client';

import { useEffect, useRef, useState } from 'react';
import LazyImage from '../shared/LazyImage';

const ITEMS_PER_PAGE = 12;

interface FoodItem {
  id: string;
  name: string;
  region: string;
  taste: string[];
  imageUrl: string;
}

const REGION_COLORS: Record<string, string> = {
  sumatera: 'var(--c-sumatera)',
  jawa: 'var(--c-jawa)',
  kalimantan: 'var(--c-kalimantan)',
  sulawesi: 'var(--c-sulawesi)',
  'bali-ntt': 'var(--c-bali-ntt)',
  'maluku-papua': 'var(--c-maluku-papua)',
};

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | 'ellipsis')[] = [1];
  if (current > 3) pages.push('ellipsis');
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push('ellipsis');
  pages.push(total);
  return pages;
}

export default function ResultsGrid({ results, query }: { results: FoodItem[]; query: string }) {
  const [page, setPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const startIdx = (page - 1) * ITEMS_PER_PAGE;
  const paginated = results.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  const pageNumbers = getPageNumbers(page, totalPages);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>('.result-card'));
    if (!cards.length) return;
    import('gsap').then(({ default: gsap }) => {
      gsap.killTweensOf(cards);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
        return;
      }
      gsap.fromTo(cards,
        { opacity: 0, y: 32, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.07, ease: 'power3.out', clearProps: 'transform' }
      );
    });
  }, [paginated]);

  function goToPage(p: number) {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    document.getElementById('search-main')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="results-grid">
      <div className="results-header">
        <span className="results-count">{results.length} hasil</span>
        {query && <span className="results-query">untuk "{query}"</span>}
      </div>

      <div className="results-grid-inner" ref={gridRef}>
        {paginated.map((food) => (
          <a
            key={food.id}
            href={`/hidangan/${food.id}`}
            className="result-card duo-card flex flex-col overflow-hidden"
            onClick={() => sessionStorage.setItem('kulineria-return', '/jelajahi')}
          >
                <LazyImage src={food.imageUrl} alt={food.name} className="result-card-image" />
            <div className="result-card-content">
              <h3>{food.name}</h3>
              <span className="result-card-region">{food.region}</span>
              <div className="result-card-tags">
                {food.taste.map((t) => (
                  <span key={t} className="duo-badge" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>{t}</span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="search-pagination">
          <button
            className="page-nav"
            disabled={page === 1}
            onClick={() => goToPage(page - 1)}
            aria-label="Halaman sebelumnya"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>

          {pageNumbers.map((p, i) =>
            p === 'ellipsis' ? (
              <span className="page-ellipsis" key={`e-${i}`}>⋯</span>
            ) : (
              <button
                key={p}
                className={`page-btn${p === page ? ' active' : ''}`}
                onClick={() => goToPage(p)}
                aria-label={`Halaman ${p}`}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </button>
            )
          )}

          <button
            className="page-nav"
            disabled={page === totalPages}
            onClick={() => goToPage(page + 1)}
            aria-label="Halaman berikutnya"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}
