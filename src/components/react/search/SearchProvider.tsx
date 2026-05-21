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
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import ResultsGrid from './ResultsGrid';
import DiscoveryView from './DiscoveryView';
import NoResultsView from './NoResultsView';
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

  const showInitial = !hydrated && !hasActiveSearch && parsedInitial.length > 0;

  return (
    <div className="search-page">
      <SearchBar />
      <div className="search-layout">
        <FilterPanel />
        <div className="search-main">
          {showInitial && (
            <div className="search-initial">
              <div className="results-header">
                <span className="results-count">Jelajahi Nusantara</span>
              </div>
              <div className="results-grid-inner">
                {parsedInitial.map((food) => (
                  <a key={food.id} href={`/food/${food.id}`} className="result-card">
                    <div className="result-card-image">
                      <img src={food.imageUrl} alt={food.name} loading="lazy" />
                    </div>
                    <div className="result-card-content">
                      <h3>{food.name}</h3>
                      <span className="result-card-region">{food.region}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
          {hydrated && isSearching && <div className="search-loading">Mencari...</div>}
          {hydrated && !hasActiveSearch && <DiscoveryView recentSearches={recentSearches} />}
          {hydrated && hasActiveSearch && !isSearching && results.length === 0 && <NoResultsView />}
          {hydrated && hasActiveSearch && !isSearching && results.length > 0 && (
            <ResultsGrid results={results} query={query} />
          )}
        </div>
      </div>
    </div>
  );
}