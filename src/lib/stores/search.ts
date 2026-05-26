import { atom, computed } from 'nanostores';
import type { RegionId, Taste, FoodItem } from '@/types/food';
import { getSearchIndex as getSearchIndexFromData, getSearchDocuments } from '@/lib/data/search-index';

export const $searchQuery = atom<string>('');
export const $regionFilters = atom<Set<RegionId>>(new Set());
export const $tasteFilters = atom<Set<Taste>>(new Set());
export const $searchResults = atom<FoodItem[]>([]);
export const $isSearching = atom<boolean>(false);
export const $recentSearches = atom<string[]>([]);

export { getSearchIndexFromData as getSearchIndex };

export const $activeFilterCount = computed(
  [$regionFilters, $tasteFilters],
  (regions, tastes) => regions.size + tastes.size
);

export const $hasActiveSearch = computed(
  [$searchQuery, $activeFilterCount],
  (query, filters) => query.length > 0 || filters > 0
);

export function performSearch() {
  const query = $searchQuery.get();
  const regions = $regionFilters.get();
  const tastes = $tasteFilters.get();

  $isSearching.set(true);

  function matchesFilters(doc: { region: string; taste: string }): boolean {
    if (regions.size > 0 && !regions.has(doc.region as RegionId)) return false;
    if (tastes.size > 0) {
      const docTastes = doc.taste.split(' ');
      for (const t of tastes) {
        if (!docTastes.includes(t)) return false;
      }
    }
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
}

export function syncFromUrl() {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  const region = params.get('region');
  const taste = params.get('taste');

  if (q) $searchQuery.set(q);
  if (region) $regionFilters.set(new Set([region as RegionId]));
  if (taste) $tasteFilters.set(new Set(taste.split(',').filter(Boolean) as Taste[]));
}

export function syncToUrl() {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams();
  const q = $searchQuery.get();
  const regions = $regionFilters.get();
  const tastes = $tasteFilters.get();

  if (q) params.set('q', q);
  if (regions.size > 0) params.set('region', Array.from(regions).join(','));
  if (tastes.size > 0) params.set('taste', Array.from(tastes).join(','));

  const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
  window.history.replaceState({}, '', newUrl);
}