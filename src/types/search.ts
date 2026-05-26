import type { RegionId, Taste, FoodItem } from './food';

export interface SearchState {
  query: string;
  regionFilters: Set<RegionId>;
  tasteFilters: Set<Taste>;
  results: FoodItem[];
  isSearching: boolean;
  recentSearches: string[];
}

export interface SearchActions {
  setQuery: (query: string) => void;
  toggleRegionFilter: (region: RegionId) => void;
  toggleTasteFilter: (taste: Taste) => void;
  setResults: (results: FoodItem[]) => void;
  setSearching: (isSearching: boolean) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  clearFilters: () => void;
}
