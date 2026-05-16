import type { FoodItem, FoodItemFull, RegionId } from '@/types/food';

import sumateraFoods from '@/data/foods/sumatera.json';
import jawaFoods from '@/data/foods/jawa.json';
import kalimantanFoods from '@/data/foods/kalimantan.json';
import sulawesiFoods from '@/data/foods/sulawesi.json';
import baliNttFoods from '@/data/foods/bali-ntt.json';
import malukuPapuaFoods from '@/data/foods/maluku-papua.json';
import regionsData from '@/data/regions.json';

export function loadAllFoods(): FoodItem[] {
  return [
    ...sumateraFoods.foods,
    ...jawaFoods.foods,
    ...kalimantanFoods.foods,
    ...sulawesiFoods.foods,
    ...baliNttFoods.foods,
    ...malukuPapuaFoods.foods,
  ];
}

export function loadFoodsByRegion(region: RegionId): FoodItem[] {
  const regionDataMap: Record<RegionId, FoodItem[]> = {
    sumatera: sumateraFoods.foods,
    jawa: jawaFoods.foods,
    kalimantan: kalimantanFoods.foods,
    sulawesi: sulawesiFoods.foods,
    'bali-ntt': baliNttFoods.foods,
    'maluku-papua': malukuPapuaFoods.foods,
  };
  return regionDataMap[region] || [];
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
  // Extended data loaded from sample files
  return base as FoodItemFull;
}
