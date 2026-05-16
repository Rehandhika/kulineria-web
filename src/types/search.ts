import type { RegionId, Taste, FoodType, FoodItem } from './food';

export interface SearchState {
  query: string;
  regionFilters: Set<RegionId>;
  tasteFilters: Set<Taste>;
  typeFilter: FoodType | null;
  results: FoodItem[];
  isSearching: boolean;
  recentSearches: string[];
}

export interface SearchActions {
  setQuery: (query: string) => void;
  toggleRegionFilter: (region: RegionId) => void;
  toggleTasteFilter: (taste: Taste) => void;
  setTypeFilter: (type: FoodType | null) => void;
  setResults: (results: FoodItem[]) => void;
  setSearching: (isSearching: boolean) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  clearFilters: () => void;
}
