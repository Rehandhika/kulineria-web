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

  const AKG = {
    protein: 60,
    fat: 65,
    carbs: 300,
  };

  const macros = [
    {
      label: 'Protein',
      value: nutrition.protein,
      unit: 'g',
      target: AKG.protein,
      color: 'var(--c-brand-mocha)',
      gradient: 'linear-gradient(90deg, var(--macro-protein) 0%, var(--c-brand-mocha) 100%)',
      desc: 'Membangun & memperbaiki jaringan tubuh'
    },
    {
      label: 'Karbohidrat',
      value: nutrition.carbs,
      unit: 'g',
      target: AKG.carbs,
      color: 'var(--c-accent)',
      gradient: 'linear-gradient(90deg, var(--macro-karbo) 0%, var(--c-accent) 100%)',
      desc: 'Sumber energi utama aktivitas harian'
    },
    {
      label: 'Lemak',
      value: nutrition.fat,
      unit: 'g',
      target: AKG.fat,
      color: 'var(--c-brand-caramel)',
      gradient: 'linear-gradient(90deg, var(--macro-lemak) 0%, var(--c-brand-caramel) 100%)',
      desc: 'Pelindung organ & penyerapan vitamin'
    },
  ];

  return (
    <div className="nutrition-bars" role="list" aria-label="Informasi gizi">
      {nutrition.servingSize && (
        <p className="nutrition-serving">Porsi: {nutrition.servingSize}</p>
      )}
      <div className="nutrition-bars-grid">
        {}
        <div className="nutrition-item nutrition-item--highlight" role="listitem">
          <div className="nutrition-header">
            <span className="nutrition-label nutrition-label--highlight">Energi Utama</span>
            <span className="nutrition-value nutrition-value--highlight">
              {nutrition.calories} <span className="nutrition-value-unit">kkal</span>
            </span>
          </div>
          <p className="nutrition-desc nutrition-desc--highlight">
            Memenuhi sekitar {Math.round((nutrition.calories / 2150) * 100)}% dari rata-rata kebutuhan energi harian (2150 kkal).
          </p>
        </div>

        {}
        {macros.map((item, i) => {
          const pct = Math.min(100, Math.round((item.value / item.target) * 100));
          return (
            <div key={i} className="nutrition-item" role="listitem">
              <div className="nutrition-header">
                <div className="nutrition-header-row">
                  <span className="nutrition-label">{item.label}</span>
                  <span className="nutrition-akg-tag">
                    {pct}% AKG
                  </span>
                </div>
                <span className="nutrition-value">{item.value} {item.unit}</span>
              </div>
              <div className="nutrition-bar-track">
                <div
                  className="nutrition-bar-fill"
                  style={{
                    width: animate ? `${pct}%` : '0%',
                    backgroundImage: item.gradient
                  }}
                  title={`${pct}% AKG`}
                />
              </div>
              <p className="nutrition-desc">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
