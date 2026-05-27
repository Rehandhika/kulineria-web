'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import './SearchProvider.css';
import {
  $searchQuery,
  $regionFilters,
  $tasteFilters,
  $searchResults,
  $isSearching,
  $hasActiveSearch,
  $activeFilterCount,
  performSearch,
  syncFromUrl,
  syncToUrl,
} from '@/lib/stores/search';
import FilterPanel from './FilterPanel';
import ResultsGrid from './ResultsGrid';
import DiscoveryView from './DiscoveryView';
import NoResultsView from './NoResultsView';
import type { FoodItem } from '@/types/food';

function LoadingSkeleton() {
  return (
    <div className="results-grid">
      <div className="results-grid-inner">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="result-card duo-card skeleton-card">
            <div className="skeleton-img" />
            <div className="skeleton-content">
              <div className="skeleton-line skeleton-line-1" />
              <div className="skeleton-line skeleton-line-2" />
              <div className="skeleton-line skeleton-line-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface Props {
  initialFoods?: string;
}

export default function SearchProvider({ initialFoods }: Props) {
  const query          = useStore($searchQuery);
  const regionFilters  = useStore($regionFilters);
  const tasteFilters   = useStore($tasteFilters);
  const results        = useStore($searchResults);
  const isSearching    = useStore($isSearching);
  const hasActiveSearch = useStore($hasActiveSearch);
  const activeFilterCount = useStore($activeFilterCount);

  const [hydrated, setHydrated]         = useState(false);
  const [contentKey, setContentKey]     = useState(0);
  const [filterOpen, setFilterOpen]     = useState(false);

  useEffect(() => {
    syncFromUrl();
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const timer = setTimeout(() => {
      performSearch();
      syncToUrl();
    }, 120);
    return () => clearTimeout(timer);
  }, [query, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    performSearch();
    syncToUrl();
  }, [regionFilters, tasteFilters, hydrated]);

  useEffect(() => {
    if (!isSearching) {
      setContentKey((k) => k + 1);
    }
  }, [isSearching, results, hasActiveSearch]);

  let parsedInitial: FoodItem[] = [];
  try {
    if (initialFoods) parsedInitial = JSON.parse(initialFoods);
  } catch {}

  return (
    <div className="search-page">

      {/* Main content — full width, no sidebar */}
      <div className="search-main" id="search-main">
        {isSearching && <LoadingSkeleton />}

        {!isSearching && hasActiveSearch && results.length === 0 && (
          <div key={contentKey} className="search-content">
            <NoResultsView />
          </div>
        )}

        {!isSearching && !hasActiveSearch && (
          <div key={contentKey} className="search-content">
            <DiscoveryView initialFoods={parsedInitial} />
          </div>
        )}

        {!isSearching && hasActiveSearch && results.length > 0 && (
          <div key={contentKey} className="search-content">
            <ResultsGrid results={results} query={query} />
          </div>
        )}
      </div>

      {/* Floating FILTER button */}
      <div className="filter-fab-wrap">
        <button
          className={`filter-fab${activeFilterCount > 0 ? ' filter-fab--active' : ''}`}
          onClick={() => setFilterOpen(true)}
          aria-label={`Buka filter${activeFilterCount > 0 ? `, ${activeFilterCount} aktif` : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          <span>FILTER</span>
          {activeFilterCount > 0 && (
            <span className="filter-fab-badge" aria-hidden="true">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* Filter modal */}
      <FilterPanel isOpen={filterOpen} onClose={() => setFilterOpen(false)} />
    </div>
  );
}
