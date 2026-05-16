export type RegionId =
  | 'sumatera'
  | 'jawa'
  | 'kalimantan'
  | 'sulawesi'
  | 'bali-ntt'
  | 'maluku-papua';

export interface Region {
  id: RegionId;
  name: string;
  color: string;
  naraExpression: NaraExpression;
  naraDialog: string;
}

export type Taste = 'manis' | 'pedas' | 'gurih' | 'asam' | 'asin';

export type FoodType = 'berkuah' | 'digoreng' | 'dibakar' | 'mentah' | 'minuman';

export interface FoodItem {
  id: string;
  name: string;
  region: RegionId;
  description: string;
  taste: Taste[];
  type: FoodType;
  imageUrl: string;
}

export interface FoodItemFull extends FoodItem {
  hero?: {
    image: string;
    alt: string;
    credit?: string;
    dominantColor: string;
  };
  story?: {
    headline: string;
    body: string;
    pullQuote?: string;
    image?: string;
  };
  ingredients?: Array<{
    name: string;
    qty?: string;
    image: string;
    essential: boolean;
  }>;
  recipe?: {
    servings: number;
    prepTime: number;
    cookTime: number;
    difficulty: 'easy' | 'medium' | 'hard';
    steps: Array<{
      order: number;
      title: string;
      text: string;
      image?: string;
      duration?: number;
      tip?: string;
    }>;
  };
  tasteScore?: {
    manis: number;
    pedas: number;
    gurih: number;
    asam: number;
    asin: number;
  };
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    servingSize: string;
  };
  locations?: Array<{
    name: string;
    city: string;
    lat: number;
    lng: number;
    description: string;
    priceRange?: string;
  }>;
  related?: string[];
  funFacts?: string[];
  tags?: string[];
}

export type NaraExpression = 'idle' | 'excited' | 'thinking' | 'sad';

export interface MapFeature {
  type: 'Feature';
  id: RegionId;
  properties: {
    name: string;
  };
  geometry: GeoJSON.Geometry;
}

export interface MapData {
  type: 'Topology';
  objects: {
    regions: {
      type: 'GeometryCollection';
      geometries: Array<{
        type: 'Polygon' | 'MultiPolygon';
        id: RegionId;
        properties: { name: string };
        arcs: number[] | number[][];
      }>;
    };
  };
  arcs: number[][][];
  transform?: {
    scale: [number, number];
    translate: [number, number];
  };
}
