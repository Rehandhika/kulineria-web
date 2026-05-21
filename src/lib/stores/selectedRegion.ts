import { atom } from 'nanostores';
import type { RegionId } from '@/types/food';

export const $selectedRegion = atom<RegionId | null>(null);

export function setSelectedRegion(id: RegionId | null) {
  $selectedRegion.set(id);
}

export function clearSelectedRegion() {
  $selectedRegion.set(null);
}
