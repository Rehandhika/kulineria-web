'use client';

interface Ingredient {
  name: string;
  qty?: string;
  image?: string;
  essential: boolean;
}

interface Props {
  ingredients: Ingredient[];
}

export default function IngredientsGrid({ ingredients }: Props) {
  return (
    <div className="ingredients-list" role="list" aria-label="Bahan-bahan">
      {ingredients.map((ing, i) => (
        <div key={i} className="ingredient-row" role="listitem">
          <svg className="ingredient-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M17 8C8 10 5.9 16.1 5 21C6.9 20.1 13 18 15 9C15.6 6.2 16.5 4.5 18 3C16.5 4.5 16.2 6.2 17 8Z" />
          </svg>
          <span className="ingredient-name">{ing.name}</span>
          {ing.qty && <span className="ingredient-qty">{ing.qty}</span>}
        </div>
      ))}
    </div>
  );
}
