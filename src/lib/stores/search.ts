import { atom, computed } from 'nanostores';
import type { RegionId, Taste, FoodType, FoodItem } from '@/types/food';
import { getSearchIndex as getSearchIndexFromData, getSearchDocuments } from '@/lib/data/search-index';

export const $searchQuery = atom<string>('');
export const $regionFilters = atom<Set<RegionId>>(new Set());
export const $tasteFilters = atom<Set<Taste>>(new Set());
export const $typeFilter = atom<FoodType | null>(null);
export const $searchResults = atom<FoodItem[]>([]);
export const $isSearching = atom<boolean>(false);
export const $recentSearches = atom<string[]>([]);

export { getSearchIndexFromData as getSearchIndex };

export const $activeFilterCount = computed(
  [$regionFilters, $tasteFilters, $typeFilter],
  (regions, tastes, type) => regions.size + tastes.size + (type ? 1 : 0)
);

export const $hasActiveSearch = computed(
  [$searchQuery, $activeFilterCount],
  (query, filters) => query.length > 0 || filters > 0
);

export function performSearch() {
  const query = $searchQuery.get();
  const regions = $regionFilters.get();
  const tastes = $tasteFilters.get();
  const type = $typeFilter.get();

  $isSearching.set(true);

  function matchesFilters(doc: { region: string; taste: string; type: string }): boolean {
    if (regions.size > 0 && !regions.has(doc.region as RegionId)) return false;
    if (tastes.size > 0) {
      const docTastes = doc.taste.split(' ');
      for (const t of tastes) {
        if (!docTastes.includes(t)) return false;
      }
    }
    if (type && doc.type !== type) return false;
    return true;
  }

  let results;
  if (query.length > 0) {
    const index = getSearchIndexFromData();
    results = index.search(query, { filter: matchesFilters });
  } else {
    results = getSearchDocuments().filter(matchesFilters);
  }

  const foods = results.map(r => ({
    id: r.id,
    name: r.name,
    region: r.region as RegionId,
    description: '',
    taste: (r.taste as string).split(' ') as Taste[],
    type: r.type as FoodType,
    imageUrl: r.imageUrl,
  }));

  $searchResults.set(foods);
  $isSearching.set(false);

  if (query.length > 0) {
    addRecentSearch(query);
  }
}

export function addRecentSearch(query: string) {
  const recent = $recentSearches.get();
  const updated = [query, ...recent.filter(q => q !== query)].slice(0, 8);
  $recentSearches.set(updated);

  try {
    localStorage.setItem('kulineria-recent', JSON.stringify(updated));
  } catch {}
}

export function loadRecentSearches() {
  try {
    const stored = localStorage.getItem('kulineria-recent');
    if (stored) {
      $recentSearches.set(JSON.parse(stored));
    }
  } catch {}
}

export function clearRecentSearches() {
  $recentSearches.set([]);
  try {
    localStorage.removeItem('kulineria-recent');
  } catch {}
}

export function clearFilters() {
  $regionFilters.set(new Set());
  $tasteFilters.set(new Set());
  $typeFilter.set(null);
}

export function syncFromUrl() {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  const region = params.get('region');
  const taste = params.get('taste');
  const type = params.get('type');

  if (q) $searchQuery.set(q);
  if (region) $regionFilters.set(new Set([region as RegionId]));
  if (taste) $tasteFilters.set(new Set(taste.split(',').filter(Boolean) as Taste[]));
  if (type) $typeFilter.set(type as FoodType);
}

export function syncToUrl() {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams();
  const q = $searchQuery.get();
  const regions = $regionFilters.get();
  const tastes = $tasteFilters.get();
  const type = $typeFilter.get();

  if (q) params.set('q', q);
  if (regions.size > 0) params.set('region', Array.from(regions).join(','));
  if (tastes.size > 0) params.set('taste', Array.from(tastes).join(','));
  if (type) params.set('type', type);

  const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
  window.history.replaceState({}, '', newUrl);
}