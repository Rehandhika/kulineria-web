import { useState, useEffect } from 'react';

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
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const items = [
    { label: 'Kalori', value: nutrition.calories, unit: 'kkal', color: 'var(--c-brand-terracotta)' },
    { label: 'Protein', value: nutrition.protein, unit: 'g', color: 'var(--c-brand-mocha)' },
    { label: 'Lemak', value: nutrition.fat, unit: 'g', color: 'var(--c-brand-caramel)' },
  ];

  const maxVal = Math.max(...items.map(i => i.value));

  return (
    <div className="nutrition-bars" role="list" aria-label="Informasi gizi">
      {nutrition.servingSize && (
        <p className="nutrition-serving">Porsi: {nutrition.servingSize}</p>
      )}
      <div className="nutrition-bars-grid">
        {items.map((item, i) => (
          <div key={i} className="nutrition-item" role="listitem">
            <div className="nutrition-header">
              <span className="nutrition-label">{item.label}</span>
              <span className="nutrition-value">{item.value} {item.unit}</span>
            </div>
            <div className="nutrition-bar-track">
              <div
                className="nutrition-bar-fill"
                style={{ 
                  width: animate ? `${(item.value / maxVal) * 100}%` : '0%', 
                  backgroundColor: item.color 
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
