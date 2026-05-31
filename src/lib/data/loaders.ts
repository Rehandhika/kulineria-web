import type { FoodItem, FoodItemFull, RegionId, Taste } from '@/types/food';
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

const TASTE_LABELS_ID: Record<Taste, string> = {
  manis: 'Manis',
  pedas: 'Pedas',
  gurih: 'Gurih',
  asam: 'Asam',
  asin: 'Asin',
};

export function tasteLevel(score: number): string {
  if (score <= 0) return '';
  if (score <= 33) return 'Ringan';
  if (score <= 66) return 'Sedang';
  return 'Kuat';
}

export function isRealContent(fullFood: FoodItemFull): boolean {
  return !fullFood.story?.body?.includes('beloved Indonesian dish');
}

export function getTasteChips(tasteScore: FoodItemFull['tasteScore']): { taste: Taste; label: string; level: string }[] {
  if (!tasteScore) return [];
  return (Object.entries(tasteScore) as [Taste, number][])
    .filter(([, score]) => score > 0)
    .map(([taste, score]) => ({
      taste,
      label: TASTE_LABELS_ID[taste],
      level: tasteLevel(score),
    }));
}

const FOOD_IMAGE_MAP: Record<string, string> = {
  'rendang-001':          '/img/foods/rendang.png',
  'pempek-002':           '/img/foods/pempek.png',
  'mie-aceh-003':         '/img/foods/mie-aceh.png',
  'sate-padang-004':      '/img/foods/sate-padang.png',
  'nasi-padang-005':      '/img/foods/nasi-padang.png',
  'bika-ambon-006':       '/img/foods/bika-ambon.png',
  'ayam-pop-007':         '/img/foods/ayam-pop.png',
  'dendeng-balado-008':   '/img/foods/dendeng-balado.png',
  'gulai-ikan-009':       '/img/foods/gulai-ikan.png',
  'soto-medan-010':       '/img/foods/soto-medan.png',
  'gudeg-001':            '/img/foods/gudeg.png',
  'rawon-002':            '/img/foods/rawon.png',
  'nasi-goreng-003':      '/img/foods/nasi-goreng.png',
  'gado-gado-004':        '/img/foods/gado-gado.png',
  'pecel-005':            '/img/foods/pecel.png',
  'soto-betawi-006':      '/img/foods/soto-betawi.png',
  'nasi-uduk-007':        '/img/foods/nasi-uduk.png',
  'nasi-kuning-008':      '/img/foods/nasi-kuning.png',
  'nasi-liwet-009':       '/img/foods/nasi-liwet.png',
  'tongseng-010':         '/img/foods/tongseng.png',
  'soto-banjar-001':      '/img/foods/soto-banjar.png',
  'ketupat-kandangan-002':'/img/foods/ketupat-kandangan.png',
  'ayam-cincane-003':     '/img/foods/ayam-cincane.png',
  'nasi-kuning-banjar-004':'/img/foods/nasi-kuning-banjar.png',
  'sate-banjar-005':      '/img/foods/sate-banjar.png',
  'bingka-barandam-006':  '/img/foods/bingka-barandam.png',
  'gangan-asam-007':      '/img/foods/gangan-asam.png',
  'gangan-habang-008':    '/img/foods/gangan-habang.png',
  'mandai-009':           '/img/foods/mandai.png',
  'iwak-pakasam-010':     '/img/foods/iwak-pakasam.png',
  'coto-makassar-001':    '/img/foods/coto-makassar.png',
  'konro-002':            '/img/foods/konro.png',
  'pallubasa-003':        '/img/foods/pallubasa.png',
  'kapurung-004':         '/img/foods/kapurung.png',
  'pisang-ijo-005':       '/img/foods/pisang-ijo.png',
  'es-pisang-ijo-006':    '/img/foods/es-pisang-ijo.png',
  'sop-saudara-007':      '/img/foods/sop-saudara.png',
  'cakalang-fufu-008':    '/img/foods/cakalang-fufu.png',
  'tinutuan-009':         '/img/foods/tinutuan.png',
  'ikan-woku-010':        '/img/foods/ikan-woku.png',
  'bebek-betutu-001':     '/img/foods/bebek-betutu.png',
  'sate-lilit-002':       '/img/foods/sate-lilit.png',
  'babi-guling-003':      '/img/foods/babi-guling.png',
  'lawar-004':            '/img/foods/lawar.png',
  'ayam-betutu-005':      '/img/foods/ayam-betutu.png',
  'nasi-campur-006':      '/img/foods/nasi-campur.png',
  'sate-babi-007':        '/img/foods/sate-babi.png',
  'nasi-jinggo-008':      '/img/foods/nasi-jinggo.png',
  'plecing-kangkung-009': '/img/foods/plecing-kangkung.png',
  'ayam-taliwang-010':    '/img/foods/ayam-taliwang.png',
  'papeda-001':           '/img/foods/papeda.png',
  'ikan-kuah-kuning-002': '/img/foods/ikan-kuah-kuning.png',
  'sambal-colocolo-003':  '/img/foods/sambal-colocolo.png',
  'sagu-lempeng-004':     '/img/foods/sagu-lempeng.png',
  'gohu-ikan-005':        '/img/foods/gohu-ikan.png',
  'nasi-lapola-006':      '/img/foods/nasi-lapola.png',
  'kohu-kohu-007':        '/img/foods/kohu-kohu.png',
  'kue-bagea-008':        '/img/foods/kue-bagea.png',
  'ikan-asar-009':        '/img/foods/ikan-asar.png',
  'bubur-ne-010':         '/img/foods/bubur-ne.png',
};

function resolveImageUrl(food: { id: string; name: string; region: string }): string {
  if (FOOD_IMAGE_MAP[food.id]) return FOOD_IMAGE_MAP[food.id];
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
      headline: `Kisah Pusaka ${base.name}`,
      body: `Matahari Nusantara menorehkan kehangatan abadi pada sepiring ${base.name}, sebuah warisan rasa legendaris dari tanah ${base.region}. Lahir dari perpaduan rempah pusaka dan kesabaran para leluhur, hidangan ini menyajikan keharmonisan bumbu yang dimasak secara perlahan demi mengunci kelezatan sejati. Setiap suapan ${base.name} menceritakan tentang kehangatan keluarga di meja makan, dedikasi dalam menjaga resep leluhur, serta keragaman budaya Indonesia yang kaya akan harmoni rasa, menjadikannya sebentuk penghargaan agung bagi lidah dan jiwa yang merindukan cita rasa otentik bumi pertiwi.`,
      pullQuote: `"${base.name} adalah puisi rasa dari tanah ${base.region}, menghangatkan jiwa di setiap suapan."`,
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

function cleanAndLimitStory(body: string): string {
  if (!body) return '';

  // 1. Bersihkan em-dash (— atau --) secara alami
  let clean = body
    .replace(/\s*—\s*/g, ', ')
    .replace(/\s*--\s*/g, ', ');

  // 2. Kumpulkan semua kalimat
  const sentences = clean.match(/[^.!?]+[.!?]+/g) || [clean];
  let result = '';
  let wordCount = 0;

  for (const sentence of sentences) {
    const wordsInSentence = sentence.trim().split(/\s+/).length;
    if (wordCount + wordsInSentence <= 90) {
      result += (result ? ' ' : '') + sentence.trim();
      wordCount += wordsInSentence;
    } else {
      break;
    }
  }

  // 3. Jika hasil potong kalimat utuh berada di bawah 80 kata, lakukan penyeimbangan puitis cerdas!
  if (wordCount < 80) {
    const remainingSentences = sentences.filter(s => !result.includes(s.trim()));
    if (remainingSentences.length > 0) {
      const nextSentence = remainingSentences[0].trim();
      const nextWords = nextSentence.split(/\s+/);
      
      const targetAdditionalWords = 84 - wordCount;
      
      if (nextWords.length >= targetAdditionalWords) {
        const sliceCount = Math.max(3, targetAdditionalWords - 8);
        const slicedWords = nextWords.slice(0, sliceCount).join(' ');
        const slicedWordsClean = slicedWords.replace(/[,.!?]+$/, '');
        
        const endings = [
          `, melahirkan harmoni rasa pusaka yang senantiasa diwariskan dari generasi ke generasi.`,
          `, menghadirkan kehangatan sejati pusaka kuliner yang abadi di hati pecinta rasa Nusantara.`,
          `, sebuah persembahan agung bagi kekayaan cita rasa otentik warisan bumi pertiwi.`,
          `, menciptakan simfoni kelezatan tradisional yang menghangatkan setiap kebersamaan di meja makan.`,
          `, menjadi bagian erat dari identitas kuliner luhur yang terus dijaga kelestariannya.`
        ];
        
        let bestEnding = endings[0];
        let minDiff = 999;
        
        for (const end of endings) {
          const endWordCount = end.trim().split(/\s+/).length;
          const totalEstimate = wordCount + sliceCount + endWordCount;
          const diff = Math.abs(85 - totalEstimate);
          if (diff < minDiff && totalEstimate >= 80 && totalEstimate <= 90) {
            minDiff = diff;
            bestEnding = end;
          }
        }
        
        result += ` ${slicedWordsClean}${bestEnding}`;
      } else {
        result += ` ${nextSentence}`;
      }
    } else {
      const endings = [
        ` Hidangan tradisional ini senantiasa menyajikan kehangatan rasa pusaka yang diwariskan tulus lintas generasi.`,
        ` Sajian pusaka ini menghadirkan kelembutan rasa sejati yang abadi menghiasi khazanah kuliner bumi pertiwi.`,
        ` Kelezatan luhur ini menjadi sebentuk penghormatan agung bagi kekayaan budaya warisan tanah leluhur.`
      ];
      
      let bestEnding = endings[0];
      let minDiff = 999;
      for (const end of endings) {
        const endWordCount = end.trim().split(/\s+/).length;
        const totalEstimate = wordCount + endWordCount;
        const diff = Math.abs(85 - totalEstimate);
        if (diff < minDiff && totalEstimate >= 80 && totalEstimate <= 90) {
          minDiff = diff;
          bestEnding = end;
        }
      }
      result += bestEnding;
    }
  }

  // Jaminan akhir bawah
  wordCount = result.split(/\s+/).length;
  if (wordCount < 80) {
    const padEnding = ` Kehadiran sajian ini senantiasa menghadirkan simfoni cita rasa luhur warisan leluhur yang abadi di hati pecinta rasa Nusantara.`;
    const words = padEnding.trim().split(/\s+/);
    const needed = 85 - wordCount;
    if (needed > 0) {
      result += ' ' + words.slice(0, needed).join(' ') + '.';
    }
  }

  // Jaminan akhir atas
  const finalWords = result.split(/\s+/);
  if (finalWords.length > 90) {
    result = finalWords.slice(0, 86).join(' ').trim();
    if (!result.endsWith('.')) {
      result += '.';
    }
  }

  return result;
}

function cleanPullQuote(quote?: string): string | undefined {
  if (!quote) return undefined;
  return quote.replace(/\s*—\s*/g, ', ').replace(/\s*--\s*/g, ', ');
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
        const merged = {
          ...base,
          hero: content.hero as FoodItemFull['hero'],
          ingredients: content.ingredients as FoodItemFull['ingredients'],
          recipe: content.recipe as FoodItemFull['recipe'],
          tasteScore: content.tasteScore as FoodItemFull['tasteScore'],
          nutrition: content.nutrition as FoodItemFull['nutrition'],
          locations: content.locations as FoodItemFull['locations'],
          related: content.related as FoodItemFull['related'],
          funFacts: content.funFacts as FoodItemFull['funFacts'],
          tags: content.tags as FoodItemFull['tags'],
        } as FoodItemFull;

        if (content.story) {
          const storyData = content.story as NonNullable<FoodItemFull['story']>;
          merged.story = {
            headline: storyData.headline || '',
            image: storyData.image,
            body: cleanAndLimitStory(storyData.body),
            pullQuote: cleanPullQuote(storyData.pullQuote)
          };
        }

        if (FOOD_IMAGE_MAP[base.id]) {
          merged.hero = { ...(merged.hero || {} as FoodItemFull['hero']), image: FOOD_IMAGE_MAP[base.id] } as FoodItemFull['hero'];
        }
        return merged;
      }
    }
  } catch {
    // Fallback to generated data
  }

  const fallback = buildFullFood(base);
  if (fallback.story) {
    fallback.story.body = cleanAndLimitStory(fallback.story.body);
    fallback.story.pullQuote = cleanPullQuote(fallback.story.pullQuote);
  }
  return fallback;
}
