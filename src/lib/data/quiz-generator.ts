import { getAllFoods } from './loaders';
import type { Question, QuizMode } from '@/types/quiz';

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickWrong<T>(correct: T, all: T[], count: number): T[] {
  return shuffle(all.filter(item => item !== correct)).slice(0, count);
}

const REGION_OPTIONS = [
  { id: 'sumatera', label: 'Sumatera', color: '#FF8C42' },
  { id: 'jawa', label: 'Jawa', color: '#06A77D' },
  { id: 'kalimantan', label: 'Kalimantan', color: '#E9C46A' },
  { id: 'sulawesi', label: 'Sulawesi', color: '#4ECDC4' },
  { id: 'bali-ntt', label: 'Bali & NTT', color: '#FF6B6B' },
  { id: 'maluku-papua', label: 'Maluku & Papua', color: '#84A98C' },
] as const;

const REGION_IDS = REGION_OPTIONS.map(r => r.id);

export function generateTebakMakananQuestions(count: number = 10): Question[] {
  const foods = shuffle(getAllFoods()).slice(0, Math.min(count, getAllFoods().length));

  return foods.map((food, index) => {
    const wrongNames = pickWrong(food.name, getAllFoods().map(f => f.name), 3);
    const wrongFoods = wrongNames.map(name => getAllFoods().find(f => f.name === name)!).filter(Boolean);
    const options = shuffle([
      { id: food.id, label: food.name, sublabel: food.region },
      ...wrongFoods.map((wf, i) => ({
        id: `wrong-${index}-${i}`, label: wf.name, sublabel: wf.region,
      })),
    ]);

    return {
      id: `tebak-makanan-${index}-${food.id}`,
      mode: 'tebak-makanan' as QuizMode,
      prompt: 'Makanan apakah ini?',
      media: food.imageUrl,
      options,
      correctAnswer: food.id,
      timeLimit: 15,
    };
  });
}

export function generateTebakAsalQuestions(count: number = 10): Question[] {
  const foods = shuffle(getAllFoods()).slice(0, Math.min(count, getAllFoods().length));

  return foods.map((food, index) => {
    const wrongRegions = pickWrong(food.region, REGION_IDS, 3);
    const options = shuffle([
      { id: food.region, label: REGION_OPTIONS.find(r => r.id === food.region)!.label },
      ...wrongRegions.map(rid => ({
        id: rid, label: REGION_OPTIONS.find(r => r.id === rid)!.label,
      })),
    ]);

    return {
      id: `tebak-asal-${index}-${food.id}`,
      mode: 'tebak-asal' as QuizMode,
      prompt: 'Dari daerah mana masakan ini berasal?',
      media: food.name,
      description: food.description,
      options,
      correctAnswer: food.region,
      timeLimit: 12,
    };
  });
}

export function generateQuestions(mode: QuizMode, count: number = 10): Question[] {
  switch (mode) {
    case 'tebak-makanan': return generateTebakMakananQuestions(count);
    case 'tebak-asal': return generateTebakAsalQuestions(count);
  }
}

export function calculateScore(
  isCorrect: boolean,
  timeRemaining: number,
  streak: number
): number {
  if (!isCorrect) return 0;
  const base = 100;
  const speedBonus = Math.floor(timeRemaining * 5);
  const streakBonus =
    streak >= 7 ? 200 :
    streak >= 5 ? 100 :
    streak >= 3 ? 50 : 0;
  return base + speedBonus + streakBonus;
}
