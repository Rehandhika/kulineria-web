'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import { $selectedRegion, clearSelectedRegion } from '@/lib/stores/selectedRegion';
import { getAllFoods, getRegions } from '@/lib/data/loaders';
import './FeaturedFoodsGrid.css';

const ITEMS_PER_PAGE = 8;

const TASTE_EMOJI: Record<string, string> = { manis: '🍬', pedas: '🌶️', gurih: '🧂', asam: '🍋', asin: '🧀' };

function getRegionEmoji(id: string): string {
  const map: Record<string, string> = { sumatera: '🌶️', jawa: '🍚', kalimantan: '🌴', sulawesi: '🐟', 'bali-ntt': '🌺', 'maluku-papua': '🐚' };
  return map[id] || '🍽️';
}

function getRegionStyle(id: string): string {
  return `var(--c-${id})`;
}

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

const foodImages: Record<string, string> = {
  'rendang-001': 'https://images.unsplash.com/photo-1563379091339-03b21ab4e23f?w=400&q=80',
  'nasi-goreng-003': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80',
  'gado-gado-004': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
};

const allFoods = getAllFoods();
const regions = getRegions();

export default function FeaturedFoodsGrid() {
  const selectedId = useStore($selectedRegion);
  const gridRef = useRef<HTMLDivElement>(null);
  const [prevId, setPrevId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const prevPageRef = useRef(page);

  const region = selectedId ? regions.find(r => r.id === selectedId) : null;

  const filtered = selectedId
    ? allFoods.filter(f => f.region === selectedId)
    : allFoods;

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIdx = (page - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const title = region ? `Hidangan ${region.name}` : 'Hidangan Pilihan';
  const subtitle = region
    ? `${region.name} — halaman ${page} dari ${totalPages}`
    : `${filtered.length} hidangan dari seluruh Nusantara — halaman ${page} dari ${totalPages}`;

  useEffect(() => {
    if (prevId !== selectedId) {
      setPage(1);
      setPrevId(selectedId);
    }
  }, [selectedId]);

  useEffect(() => {
    if (!gridRef.current || paginated.length === 0) return;

    const pageChanged = prevPageRef.current !== page;
    prevPageRef.current = page;

    import('gsap').then(({ default: gsap }) => {
      const cards = gridRef.current?.querySelectorAll('.food-card');
      if (!cards || cards.length === 0) return;

      if (pageChanged) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.05, ease: 'back.out(1.6)' }
        );
      } else {
        gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
      }
    });
  }, [page, paginated.length]);

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    window.lenis?.scrollTo('#featured', { offset: -80, duration: 0.6 });
  };

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <section className="featured" id="featured">
      <div className="container">
        <div className="featured-header">
          <span className="duo-badge duo-badge-accent">🍽️ Koleksi</span>
          <h2 className="featured-title">{title}</h2>
          <p className="featured-subtitle">{subtitle}</p>
          {selectedId && (
            <button onClick={clearSelectedRegion} className="featured-reset-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              Tampilkan Semua
            </button>
          )}
        </div>
        <div className="food-grid" ref={gridRef}>
          {paginated.map((food) => {
            const foodRegion = regions.find(r => r.id === food.region);
            const imgUrl = food.imageUrl || foodImages[food.id] || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80';
            return (
              <a href={`/food/${food.id}`} className="food-card" key={food.id}>
                <div className="food-card-img">
                  <img src={imgUrl} alt={food.name} loading="lazy" />
                  <div className="food-card-img-overlay"></div>
                  <span className="food-card-badge" style={{ backgroundColor: getRegionStyle(food.region) }}>
                    {getRegionEmoji(food.region)} {foodRegion?.name || food.region}
                  </span>
                </div>
                <div className="food-card-info">
                  <h3 className="food-card-name">{food.name}</h3>
                  <p className="food-card-desc">{food.description.slice(0, 65)}...</p>
                  <div className="food-card-tags">
                    {food.taste.slice(0, 3).map(t => (
                      <span className="food-card-tag" data-taste={t} key={t}>
                        {TASTE_EMOJI[t] || ''} {t}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="food-card-arrow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </span>
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
                  onClick={() => goToPage(p)}
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
          </div>
        )}
      </div>
    </section>
  );
}
