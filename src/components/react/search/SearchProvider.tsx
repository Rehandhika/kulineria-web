'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import './SearchProvider.css';
import {
  $searchQuery,
  $regionFilters,
  $tasteFilters,
  $typeFilter,
  $searchResults,
  $isSearching,
  $recentSearches,
  $hasActiveSearch,
  performSearch,
  loadRecentSearches,
  syncFromUrl,
  syncToUrl,
} from '@/lib/stores/search';
import FilterPanel from './FilterPanel';
import ResultsGrid from './ResultsGrid';
import DiscoveryView from './DiscoveryView';
import NoResultsView from './NoResultsView';
import LoadingSpinner from '../shared/LoadingSpinner';
import type { FoodItem } from '@/types/food';

interface Props {
  initialFoods?: string;
}

export default function SearchProvider({ initialFoods }: Props) {
  const query = useStore($searchQuery);
  const regionFilters = useStore($regionFilters);
  const tasteFilters = useStore($tasteFilters);
  const typeFilter = useStore($typeFilter);
  const results = useStore($searchResults);
  const isSearching = useStore($isSearching);
  const recentSearches = useStore($recentSearches);
  const hasActiveSearch = useStore($hasActiveSearch);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    loadRecentSearches();
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
  }, [regionFilters, tasteFilters, typeFilter, hydrated]);

  let parsedInitial: FoodItem[] = [];
  try {
    if (initialFoods) parsedInitial = JSON.parse(initialFoods);
  } catch {}

  return (
    <div className="search-page">
      <div className="search-layout">
        <FilterPanel />
        <div className="search-main">
          {isSearching && (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" label="Mencari..." />
            </div>
          )}

          {hasActiveSearch && !isSearching && results.length === 0 && <NoResultsView />}

          {!hasActiveSearch && (
            <DiscoveryView recentSearches={recentSearches} initialFoods={parsedInitial} />
          )}

          {hasActiveSearch && !isSearching && results.length > 0 && (
            <ResultsGrid results={results} query={query} />
          )}
        </div>
      </div>
    </div>
  );
}
