import type { FoodItem } from '@/types/food';
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

function generateWrongOptions(correctFood: FoodItem, count: number, field: 'name'): string[] {
  const allFoods = getAllFoods();
  const wrongFoods = allFoods.filter(f => f.id !== correctFood.id);
  const shuffled = shuffle(wrongFoods);
  return shuffled.slice(0, count).map(f => f[field]);
}

export function generateQuestions(mode: QuizMode, count: number = 10): Question[] {
  const foods = shuffle(getAllFoods());
  const selected = foods.slice(0, Math.min(count, foods.length));

  return selected.map((food, index) => {
    const wrongNames = generateWrongOptions(food, 3, 'name');
    const options = shuffle([
      { id: food.id, label: food.name, image: food.imageUrl, sublabel: food.region },
      ...wrongNames.map((name, i) => {
        const wrongFood = getAllFoods().find(f => f.name === name)!;
        return { id: `wrong-${i}`, label: name, image: wrongFood.imageUrl, sublabel: wrongFood.region };
      }),
    ]);

    return {
      id: `quiz-${mode}-${index}-${food.id}`,
      mode,
      prompt: 'Makanan apakah ini?',
      media: food.imageUrl,
      options,
      correctAnswer: food.id,
      timeLimit: 15,
    };
  });
}

export function calculateScore(
  isCorrect: boolean,
  timeRemaining: number,
  timeLimit: number,
  streak: number
): number {
  if (!isCorrect) return 0;
  const base = 100;
  const timeBonus = Math.floor((timeRemaining / timeLimit) * 50);
  const streakBonus = streak * 10;
  const multiplier = streak >= 7 ? 5 : streak >= 5 ? 3 : streak >= 3 ? 2 : 1;
  return (base + timeBonus + streakBonus) * multiplier;
}