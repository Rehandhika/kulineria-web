'use client';

interface Props {
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    servingSize: string;
  };
}

export default function NutritionBars({ nutrition }: Props) {
  const items = [
    { label: 'Kalori', value: nutrition.calories, unit: 'kkal', color: 'var(--c-accent)' },
    { label: 'Protein', value: nutrition.protein, unit: 'g', color: 'var(--c-success)' },
    { label: 'Lemak', value: nutrition.fat, unit: 'g', color: 'var(--c-warning)' },
  ];

  const maxVal = Math.max(...items.map(i => i.value));

  return (
    <div className="nutrition-bars" role="list" aria-label="Informasi gizi">
      {nutrition.servingSize && (
        <p className="nutrition-serving">{nutrition.servingSize}</p>
      )}
      {items.map((item, i) => (
        <div key={i} className="nutrition-item" role="listitem">
          <div className="nutrition-header">
            <span className="nutrition-label">{item.label}</span>
            <span className="nutrition-value">{item.value}{item.unit}</span>
          </div>
          <div className="nutrition-bar-track">
            <div
              className="nutrition-bar-fill"
              style={{ width: `${(item.value / maxVal) * 100}%`, backgroundColor: item.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
