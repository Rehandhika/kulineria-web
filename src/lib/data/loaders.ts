import type { FoodItem, FoodItemFull, RegionId } from '@/types/food';
import { generateFoodPlaceholder } from '@/lib/utils/placeholders';

import sumateraFoods from '@/data/foods/sumatera.json';
import jawaFoods from '@/data/foods/jawa.json';
import kalimantanFoods from '@/data/foods/kalimantan.json';
import sulawesiFoods from '@/data/foods/sulawesi.json';
import baliNttFoods from '@/data/foods/bali-ntt.json';
import malukuPapuaFoods from '@/data/foods/maluku-papua.json';
import regionsData from '@/data/regions.json';

const REGION_COLORS: Record<RegionId, string> = {
  sumatera: '#A0522D',
  jawa: '#8B6914',
  kalimantan: '#8B5E3C',
  sulawesi: '#B8860B',
  'bali-ntt': '#CD853F',
  'maluku-papua': '#6B3A2A',
};

const TASTE_NAMES: Record<string, string> = {
  manis: 'Sweet',
  pedas: 'Spicy',
  gurih: 'Savory',
  asam: 'Sour',
  asin: 'Salty',
};

function resolveImageUrl(food: { name: string; region: string }): string {
  return generateFoodPlaceholder(food.name, food.region as RegionId);
}

function buildFullFood(base: FoodItem): FoodItemFull {
  const color = REGION_COLORS[base.region];
  const tastes = base.taste;
  const tasteScore: FoodItemFull['tasteScore'] = {
    manis: tastes.includes('manis') ? 4 + Math.random() : 0,
    pedas: tastes.includes('pedas') ? 3 + Math.random() * 2 : 0,
    gurih: tastes.includes('gurih') ? 3 + Math.random() * 2 : 0,
    asam: tastes.includes('asam') ? 3 + Math.random() * 2 : 0,
    asin: tastes.includes('asin') ? 3 + Math.random() * 2 : 0,
  };

  return {
    ...base,
    hero: {
      image: base.imageUrl,
      alt: base.name,
      dominantColor: color,
    },
    story: {
      headline: `The Story of ${base.name}`,
      body: `${base.name} is a beloved Indonesian dish originating from the ${base.region} region. ${base.description} This dish has been passed down through generations, with each family adding their own unique twist to the recipe. The rich blend of spices and traditional cooking methods make it a true representation of Indonesia's diverse culinary heritage.`,
      pullQuote: `"${base.name} captures the essence of ${base.region} cuisine — rich, aromatic, and unforgettable."`,
    },
    ingredients: [
      { name: 'Coconut Milk', qty: '400 ml', image: '', essential: true },
      { name: 'Spice Paste', qty: '3 tbsp', image: '', essential: true },
      { name: 'Fresh Herbs', qty: 'to taste', image: '', essential: true },
      { name: 'Seasoning', qty: 'to taste', image: '', essential: false },
      { name: 'Cooking Oil', qty: '2 tbsp', image: '', essential: false },
    ],
    recipe: {
      servings: 4,
      prepTime: 20,
      cookTime: 45,
      difficulty: 'medium',
      steps: [
        { order: 1, title: 'Prepare Ingredients', text: `Gather all ingredients for ${base.name}. Ensure all spices are fresh and properly measured.`, duration: 10 },
        { order: 2, title: 'Cook Spice Paste', text: 'Heat oil in a pan and fry the spice paste until fragrant, stirring constantly to prevent burning.', duration: 8 },
        { order: 3, title: 'Add Main Ingredients', text: 'Add the main ingredients and stir well to coat with the spice mixture.', duration: 5 },
        { order: 4, title: 'Simmer', text: 'Pour in coconut milk and bring to a gentle simmer. Cook until the flavors meld together and the sauce thickens.', duration: 20, tip: 'Stir occasionally to prevent the coconut milk from curdling.' },
        { order: 5, title: 'Season and Serve', text: 'Adjust seasoning to taste. Serve hot with steamed rice or as preferred.', duration: 2 },
      ],
    },
    tasteScore,
    nutrition: {
      calories: 320,
      protein: 18,
      carbs: 28,
      fat: 14,
      fiber: 4,
      servingSize: '1 portion',
    },
    locations: (() => {
      const cityNames: Record<string, string[]> = {
        sumatera: ['Padang', 'Medan', 'Palembang', 'Aceh'],
        jawa: ['Yogyakarta', 'Surabaya', 'Bandung', 'Semarang'],
        kalimantan: ['Banjarmasin', 'Pontianak', 'Balikpapan'],
        sulawesi: ['Makassar', 'Manado', 'Kendari'],
        'bali-ntt': ['Denpasar', 'Mataram', 'Kupang'],
        'maluku-papua': ['Ambon', 'Jayapura', 'Ternate'],
      };
      const cities = cityNames[base.region] || ['Jakarta'];
      return cities.slice(0, 2).map((city, i) => ({
        name: `Warung ${base.name.split(' ')[0]}`,
        city,
        lat: -6.2 + i * 1.5,
        lng: 106.8 + i * 1.2,
        description: `Authentic ${base.name} served in a cozy traditional setting.`,
        priceRange: 'Rp 25.000 - Rp 50.000',
      }));
    })(),
    related: [],
    funFacts: [
      `${base.name} is a staple dish from the ${base.region} region.`,
      `The name "${base.name}" reflects its cultural significance in Indonesian cuisine.`,
    ],
    tags: ['indonesian', base.region, ...tastes.map(t => TASTE_NAMES[t] || t).filter(Boolean)],
  };
}

export function loadAllFoods(): FoodItem[] {
  const all = [
    ...sumateraFoods.foods,
    ...jawaFoods.foods,
    ...kalimantanFoods.foods,
    ...sulawesiFoods.foods,
    ...baliNttFoods.foods,
    ...malukuPapuaFoods.foods,
  ] as unknown as FoodItem[];
  return all.map(f => ({ ...f, imageUrl: resolveImageUrl(f) }));
}

export function loadFoodsByRegion(region: RegionId): FoodItem[] {
  const regionDataMap: Record<RegionId, unknown[]> = {
    sumatera: sumateraFoods.foods,
    jawa: jawaFoods.foods,
    kalimantan: kalimantanFoods.foods,
    sulawesi: sulawesiFoods.foods,
    'bali-ntt': baliNttFoods.foods,
    'maluku-papua': malukuPapuaFoods.foods,
  };
  return ((regionDataMap[region] || []) as FoodItem[]).map(f => ({ ...f, imageUrl: resolveImageUrl(f) }));
}

export function getRegions() {
  return regionsData.regions;
}

let cachedAllFoods: FoodItem[] | null = null;

export function getAllFoods(): FoodItem[] {
  if (cachedAllFoods === null) {
    cachedAllFoods = loadAllFoods();
  }
  return cachedAllFoods;
}

export function getFoodById(id: string): FoodItem | undefined {
  return getAllFoods().find(f => f.id === id);
}

export function getFoodByIdFull(id: string): FoodItemFull | undefined {
  const base = getFoodById(id);
  if (!base) return undefined;

  // Try to load rich content from content/foods/ JSON
  try {
    const contentModules = import.meta.glob<{ default: Record<string, unknown> }>('/src/content/foods/*.json', { eager: true });
    for (const [, mod] of Object.entries(contentModules)) {
      const data = mod.default || mod;
      if (data && (data as { id?: string }).id === id) {
        // Merge content collection data with base
        const content = data as Record<string, unknown>;
        return {
          ...base,
          hero: content.hero as FoodItemFull['hero'],
          story: content.story as FoodItemFull['story'],
          ingredients: content.ingredients as FoodItemFull['ingredients'],
          recipe: content.recipe as FoodItemFull['recipe'],
          tasteScore: content.tasteScore as FoodItemFull['tasteScore'],
          nutrition: content.nutrition as FoodItemFull['nutrition'],
          locations: content.locations as FoodItemFull['locations'],
          related: content.related as FoodItemFull['related'],
          funFacts: content.funFacts as FoodItemFull['funFacts'],
          tags: content.tags as FoodItemFull['tags'],
        };
      }
    }
  } catch {
    // Fallback to generated data
  }

  return buildFullFood(base);
}
