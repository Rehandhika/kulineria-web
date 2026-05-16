'use client';

import { useEffect, useRef } from 'react';
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

export default function SearchProvider() {
  const query = useStore($searchQuery);
  const results = useStore($searchResults);
  const isSearching = useStore($isSearching);
  const recentSearches = useStore($recentSearches);
  const hasActiveSearch = useStore($hasActiveSearch);

  useEffect(() => {
    loadRecentSearches();
    syncFromUrl();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch();
      syncToUrl();
    }, 120);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    performSearch();
    syncToUrl();
  }, [$regionFilters.get(), $tasteFilters.get(), $typeFilter.get()]);

  return (
    <div className="search-page">
      <SearchBar />
      <div className="search-layout">
        <FilterPanel />
        <div className="search-main">
          {isSearching && <div className="search-loading">Searching...</div>}
          {!hasActiveSearch && <DiscoveryView recentSearches={recentSearches} />}
          {hasActiveSearch && !isSearching && results.length === 0 && <NoResultsView />}
          {hasActiveSearch && !isSearching && results.length > 0 && (
            <ResultsGrid results={results} query={query} />
          )}
        </div>
      </div>
    </div>
  );
}