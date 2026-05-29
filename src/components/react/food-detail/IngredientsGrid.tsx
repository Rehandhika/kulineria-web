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
          <span className="ingredient-bullet" />
          <span className="ingredient-name">{ing.name}</span>
          {ing.qty && <span className="ingredient-qty">{ing.qty}</span>}
        </div>
      ))}
    </div>
  );
}
