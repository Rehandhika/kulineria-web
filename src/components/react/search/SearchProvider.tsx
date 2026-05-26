'use client';

import { useEffect, useState, useRef } from 'react';
import { useStore } from '@nanostores/react';
import './SearchProvider.css';
import {
  $searchQuery,
  $regionFilters,
  $tasteFilters,
  $searchResults,
  $isSearching,
  $hasActiveSearch,
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
        {Array.from({ length: 6 }).map((_, i) => (
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
  const query = useStore($searchQuery);
  const regionFilters = useStore($regionFilters);
  const tasteFilters = useStore($tasteFilters);
  const results = useStore($searchResults);
  const isSearching = useStore($isSearching);
  const hasActiveSearch = useStore($hasActiveSearch);
  const [hydrated, setHydrated] = useState(false);
  const [contentKey, setContentKey] = useState(0);
  const prevKey = useRef(0);

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
      <div className="search-layout">
        <FilterPanel />
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
      </div>
    </div>
  );
}
