import MiniSearch from 'minisearch';
import type { FoodItem } from '@/types/food';
import { getAllFoods } from './loaders';

export interface SearchDocument {
  id: string;
  name: string;
  region: string;
  description: string;
  taste: string;
  type: string;
  tags: string;
  imageUrl: string;
}

export function buildSearchIndex(foods: FoodItem[]): MiniSearch<SearchDocument> {
  const miniSearch = new MiniSearch<SearchDocument>({
    fields: ['name', 'region', 'description', 'taste', 'type', 'tags'],
    storeFields: ['id', 'name', 'region', 'taste', 'type', 'imageUrl'],
    searchOptions: {
      boost: { name: 3, region: 2, taste: 1.5 },
      fuzzy: 0.2,
      prefix: true,
    },
  });

  const documents: SearchDocument[] = foods.map(f => ({
    id: f.id,
    name: f.name,
    region: f.region,
    description: f.description,
    taste: f.taste.join(' '),
    type: f.type,
    tags: (f as any).tags?.join(' ') ?? '',
    imageUrl: f.imageUrl,
  }));

  miniSearch.addAll(documents);
  return miniSearch;
}

export function getSearchDocuments(): SearchDocument[] {
  const foods = getAllFoods();
  return foods.map(f => ({
    id: f.id,
    name: f.name,
    region: f.region,
    description: f.description,
    taste: f.taste.join(' '),
    type: f.type,
    tags: (f as any).tags?.join(' ') ?? '',
    imageUrl: f.imageUrl,
  }));
}

let cachedIndex: MiniSearch<SearchDocument> | null = null;

export function getSearchIndex(): MiniSearch<SearchDocument> {
  if (cachedIndex === null) {
    const foods = getAllFoods();
    cachedIndex = buildSearchIndex(foods);
  }
  return cachedIndex;
}